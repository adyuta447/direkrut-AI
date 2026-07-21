// Package application menangani lamaran kandidat ke lowongan: submit oleh
// kandidat, listing/detail buat kandidat (punya sendiri) & HRD (lowongan
// yang dia buat), dan update status oleh HRD.
package application

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"

	"github.com/adyuta447/direkrut-ai/api-go/internal/aiengine"
	appcache "github.com/adyuta447/direkrut-ai/api-go/internal/cache"
	appdb "github.com/adyuta447/direkrut-ai/api-go/internal/db"
	"github.com/adyuta447/direkrut-ai/api-go/internal/httpx"
	"github.com/adyuta447/direkrut-ai/api-go/internal/mailer"
	appmw "github.com/adyuta447/direkrut-ai/api-go/internal/middleware"
	"github.com/adyuta447/direkrut-ai/api-go/internal/notification"
	"github.com/adyuta447/direkrut-ai/api-go/internal/storage"
)

var validate = validator.New()

type Handler struct {
	db          *gorm.DB
	redisCache  *appcache.Cache
	requireAuth func(http.Handler) http.Handler
	mailer      *mailer.Mailer
	aiClient    *aiengine.Client
	storage     *storage.Storage
}

// ponytail: no cache-aside buat data lamaran itu sendiri -- data privat
// per-user, bukan listing publik bertrafik tinggi kayak jobs. redisCache di
// sini cuma dipakai buat rate-limit endpoint yang ngirim email (lihat
// Router()).
func NewHandler(gdb *gorm.DB, redisCache *appcache.Cache, m *mailer.Mailer, aiClient *aiengine.Client, storageClient *storage.Storage, requireAuth func(http.Handler) http.Handler) *Handler {
	return &Handler{db: gdb, redisCache: redisCache, requireAuth: requireAuth, mailer: m, aiClient: aiClient, storage: storageClient}
}

func (h *Handler) Router() chi.Router {
	// Endpoint status-update sekarang bisa ngirim email beneran (lihat
	// handleUpdateStatus) -- rate-limit per IP biar akun HRD yang
	// kekompromi (atau iseng) gak bisa dipakai buat nge-flood/nge-spam
	// lewat akun pengirim transaksional kita.
	decisionRateLimit := appmw.RateLimit(h.redisCache, "ratelimit:decision", 30, time.Minute)

	r := chi.NewRouter()
	r.Group(func(pr chi.Router) {
		pr.Use(h.requireAuth)
		pr.With(appmw.RequireRole("candidate")).Post("/", h.handleSubmitApplication)
		pr.Get("/", h.handleListApplications)
		pr.Get("/{applicationID}", h.handleGetApplication)
		pr.With(appmw.RequireRole("hrd"), decisionRateLimit).Patch("/{applicationID}/status", h.handleUpdateStatus)

		// AI screening (HRD): parse CV kandidat + hitung match score vs
		// deskripsi lowongan.
		pr.With(appmw.RequireRole("hrd")).Post("/{applicationID}/screen", h.handleScreen)
		pr.With(appmw.RequireRole("hrd")).Get("/{applicationID}/screening", h.handleGetScreening)

		// AI interview (kandidat): pertanyaan digenerate AI, jawaban direkam
		// suara + kamera wajib nyala buat proctoring, jawaban ditranskrip &
		// dinilai di akhir sesi.
		pr.With(appmw.RequireRole("candidate")).Post("/{applicationID}/interview/questions", h.handleInterviewQuestions)
		pr.With(appmw.RequireRole("candidate")).Post("/{applicationID}/interview/audio-upload-url", h.handleInterviewAudioUploadURL)
		pr.With(appmw.RequireRole("candidate")).Post("/{applicationID}/interview/proctor-check", h.handleInterviewProctorCheck)
		pr.With(appmw.RequireRole("candidate")).Post("/{applicationID}/interview/transcribe", h.handleInterviewTranscribe)
		pr.With(appmw.RequireRole("candidate")).Post("/{applicationID}/interview/finalize", h.handleInterviewFinalize)
		pr.Get("/{applicationID}/interview", h.handleGetInterview)
		pr.With(appmw.RequireRole("hrd")).Get("/{applicationID}/interview/audio/{questionIndex}", h.handleInterviewAudioURL)
	})
	return r
}

func (h *Handler) ensureAIConfigured(w http.ResponseWriter) bool {
	if !h.aiClient.IsConfigured() {
		httpx.WriteError(w, http.StatusServiceUnavailable, "ai_not_configured",
			"AI engine belum dikonfigurasi (AI_ENGINE_BASE_URL dan INTERNAL_API_KEY harus diset)")
		return false
	}
	return true
}

type applicationResponse struct {
	ID                  string    `json:"id"`
	JobID               string    `json:"jobId"`
	JobTitle            string    `json:"jobTitle,omitempty"`
	CompanyName         string    `json:"companyName,omitempty"`
	CandidateID         string    `json:"candidateId"`
	CandidateName       string    `json:"candidateName,omitempty"`
	Status              string    `json:"status"`
	AppliedAt           time.Time `json:"appliedAt"`
	UpdatedAt           time.Time `json:"updatedAt"`
	RecommendationScore *float64  `json:"recommendationScore,omitempty"`
}

func toApplicationResponse(a appdb.Application) applicationResponse {
	resp := applicationResponse{
		ID: a.ID, JobID: a.JobID, CandidateID: a.CandidateID,
		Status: a.Status, AppliedAt: a.AppliedAt, UpdatedAt: a.UpdatedAt,
	}
	if a.Job != nil {
		resp.JobTitle = a.Job.Title
		if a.Job.Company != nil {
			resp.CompanyName = a.Job.Company.Name
		}
	}
	if a.Candidate != nil {
		resp.CandidateName = a.Candidate.FullName
	}
	if a.ScoringResult != nil {
		score := a.ScoringResult.OverallScore
		resp.RecommendationScore = &score
	}
	return resp
}

type applicationListResponse struct {
	Items []applicationResponse `json:"items"`
}

type submitApplicationRequest struct {
	JobID string `json:"jobId" validate:"required"`
}

func (h *Handler) handleSubmitApplication(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok || claims.CandidateID == "" {
		httpx.WriteError(w, http.StatusForbidden, "forbidden", "akun kandidat ini belum lengkap")
		return
	}

	var req submitApplicationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}
	if err := validate.Struct(req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "validation_failed", httpx.ValidationMessage(err))
		return
	}

	ctx := r.Context()

	if err := h.db.WithContext(ctx).First(&appdb.Job{}, "id = ?", req.JobID).Error; err != nil {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "lowongan gak ditemukan")
		return
	}

	var existing appdb.Application
	err := h.db.WithContext(ctx).
		Where("job_id = ? AND candidate_id = ?", req.JobID, claims.CandidateID).
		First(&existing).Error
	if err == nil {
		httpx.WriteError(w, http.StatusConflict, "already_applied", "kamu udah pernah lamar lowongan ini")
		return
	}

	appRow := appdb.Application{JobID: req.JobID, CandidateID: claims.CandidateID, Status: "submitted", AppliedAt: time.Now()}
	txErr := h.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&appRow).Error; err != nil {
			return err
		}
		history := appdb.ApplicationStatusHistory{
			ApplicationID: appRow.ID, ToStatus: "submitted", ChangedBy: &claims.UserID,
		}
		return tx.Create(&history).Error
	})
	if txErr != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal submit lamaran")
		return
	}

	if err := h.db.WithContext(ctx).Preload("Job.Company").Preload("Candidate").First(&appRow, "id = ?", appRow.ID).Error; err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal ambil lamaran yang baru dibuat")
		return
	}

	// Screening AI jalan otomatis di background begitu lamaran masuk -- gak
	// nunggu HRD klik tombol dulu (lihat diagram alur: Terima Lamaran ->
	// Simpan ke Database -> Kirim ke AI Engine). Best-effort: appRow di sini
	// udah punya Job+Candidate preloaded, jadi goroutine-nya gak perlu query
	// ulang. request context BUKAN dipakai (bakal ke-cancel begitu response
	// ini keburu dikirim), pakai context.Background() yang independen.
	if appRow.Candidate != nil && appRow.Candidate.CvFileURL != nil && *appRow.Candidate.CvFileURL != "" && h.aiClient.IsConfigured() {
		go func(app appdb.Application) {
			if _, err := h.runScreening(context.Background(), &app); err != nil {
				log.Printf("[application] auto-screening gagal buat lamaran %s: %v", app.ID, err)
			}
		}(appRow)
	}

	httpx.WriteJSON(w, http.StatusCreated, toApplicationResponse(appRow))
}

func (h *Handler) handleListApplications(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok {
		httpx.WriteError(w, http.StatusUnauthorized, "unauthorized", "missing auth context")
		return
	}
	ctx := r.Context()
	query := h.db.WithContext(ctx).Model(&appdb.Application{}).Preload("Job.Company").Preload("Candidate").Preload("ScoringResult")

	switch claims.Role {
	case "candidate":
		if claims.CandidateID == "" {
			httpx.WriteError(w, http.StatusForbidden, "forbidden", "akun kandidat ini belum lengkap")
			return
		}
		query = query.Where("candidate_id = ?", claims.CandidateID)
	case "hrd":
		if claims.CompanyID == "" {
			httpx.WriteError(w, http.StatusForbidden, "forbidden", "akun HRD ini belum terhubung ke perusahaan")
			return
		}
		jobID := r.URL.Query().Get("jobId")
		if jobID != "" {
			// Diminta buat satu lowongan spesifik -- pastiin lowongan itu
			// beneran punya dia, jangan cuma company-nya sama.
			var jobRow appdb.Job
			if err := h.db.WithContext(ctx).First(&jobRow, "id = ?", jobID).Error; err != nil {
				httpx.WriteError(w, http.StatusNotFound, "not_found", "lowongan gak ditemukan")
				return
			}
			if jobRow.CreatedBy != claims.HrdUserID {
				httpx.WriteError(w, http.StatusForbidden, "forbidden", "bukan lowongan milikmu")
				return
			}
			query = query.Where("job_id = ?", jobID)
		} else {
			query = query.Select("applications.*").
				Joins("JOIN jobs ON jobs.id = applications.job_id").
				Where("jobs.company_id = ?", claims.CompanyID)
		}
	default:
		httpx.WriteError(w, http.StatusForbidden, "forbidden", "role gak dikenali")
		return
	}

	var rows []appdb.Application
	if err := query.Order("applied_at DESC").Find(&rows).Error; err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal ambil daftar lamaran")
		return
	}

	resp := applicationListResponse{Items: make([]applicationResponse, 0, len(rows))}
	for _, a := range rows {
		resp.Items = append(resp.Items, toApplicationResponse(a))
	}
	httpx.WriteJSON(w, http.StatusOK, resp)
}

func (h *Handler) loadVisibleApplication(w http.ResponseWriter, r *http.Request) (*appdb.Application, bool) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok {
		httpx.WriteError(w, http.StatusUnauthorized, "unauthorized", "missing auth context")
		return nil, false
	}
	appID := chi.URLParam(r, "applicationID")

	var appRow appdb.Application
	if err := h.db.WithContext(r.Context()).Preload("Job.Company").Preload("Candidate.User").Preload("ScoringResult").First(&appRow, "id = ?", appID).Error; err != nil {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "lamaran gak ditemukan")
		return nil, false
	}

	switch claims.Role {
	case "candidate":
		if appRow.CandidateID != claims.CandidateID {
			httpx.WriteError(w, http.StatusForbidden, "forbidden", "bukan lamaranmu")
			return nil, false
		}
	case "hrd":
		if appRow.Job == nil || appRow.Job.CreatedBy != claims.HrdUserID {
			httpx.WriteError(w, http.StatusForbidden, "forbidden", "bukan lowongan milikmu")
			return nil, false
		}
	default:
		httpx.WriteError(w, http.StatusForbidden, "forbidden", "role gak dikenali")
		return nil, false
	}
	return &appRow, true
}

func (h *Handler) handleGetApplication(w http.ResponseWriter, r *http.Request) {
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}
	httpx.WriteJSON(w, http.StatusOK, toApplicationResponse(*appRow))
}

type updateStatusRequest struct {
	Status string `json:"status" validate:"required,oneof=submitted under-review interview rejected"`
	Note   string `json:"note"`
	// EmailSubject/EmailBody opsional -- kalau diisi (HRD ngirim lewat
	// EmailPreviewPanel di dashboard), dipakai apa adanya buat email ke
	// kandidat. Dibatesin panjangnya biar gak disalahgunain buat flood
	// lewat akun pengirim transaksional kita.
	EmailSubject string `json:"emailSubject" validate:"omitempty,max=200"`
	EmailBody    string `json:"emailBody" validate:"omitempty,max=10000"`
}

func (h *Handler) handleUpdateStatus(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok {
		httpx.WriteError(w, http.StatusUnauthorized, "unauthorized", "missing auth context")
		return
	}
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}

	var req updateStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}
	if err := validate.Struct(req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "validation_failed", httpx.ValidationMessage(err))
		return
	}

	ctx := r.Context()
	fromStatus := appRow.Status
	txErr := h.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&appdb.Application{}).Where("id = ?", appRow.ID).
			Update("status", req.Status).Error; err != nil {
			return err
		}
		history := appdb.ApplicationStatusHistory{
			ApplicationID: appRow.ID, FromStatus: &fromStatus, ToStatus: req.Status,
			ChangedBy: &claims.UserID, Note: nilIfEmpty(req.Note),
		}
		return tx.Create(&history).Error
	})
	if txErr != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal update status lamaran")
		return
	}

	appRow.Status = req.Status
	// Notifikasi + email kandidat -- keduanya best-effort, gagal ngirim gak
	// boleh gagalin update status-nya sendiri (udah kepake duluan).
	if appRow.Candidate != nil && appRow.Job != nil {
		companyName := ""
		if appRow.Job.Company != nil {
			companyName = appRow.Job.Company.Name
		}
		title := "Status lamaran diperbarui"
		body := fmt.Sprintf("Lamaranmu untuk %s di %s sekarang: %s", appRow.Job.Title, companyName, statusLabel(req.Status))
		_ = notification.Create(ctx, h.db, appRow.Candidate.UserID, "application_status", title, body)

		// Recipient SELALU dari data server-side (email kandidat pemilik
		// lamaran ini, udah lolos ownership check di loadVisibleApplication)
		// -- jangan pernah dari request body, biar akun pengirim ini gak
		// bisa disalahgunain kirim ke sembarang alamat.
		if req.EmailSubject != "" && req.EmailBody != "" && appRow.Candidate.User != nil {
			go func(to, subject, emailBody string) {
				if err := h.mailer.Send(context.Background(), to, subject, emailBody); err != nil {
					log.Printf("[application] gagal kirim email keputusan HRD ke %s: %v", to, err)
				}
			}(appRow.Candidate.User.Email, req.EmailSubject, req.EmailBody)
		}
	}
	httpx.WriteJSON(w, http.StatusOK, toApplicationResponse(*appRow))
}

// --- AI screening (CV parse + job-match score) ---

type screeningResponse struct {
	CVSummary           string   `json:"cvSummary"`
	Skills              []string `json:"skills"`
	WorkExperienceYears *float64 `json:"workExperienceYears"`
	OverallScore        float64  `json:"overallScore"`
	// SimilarityScore/MatchedEvidence cuma keisi pas response ini datang
	// langsung dari POST /screen yang baru ngitung -- gak dipersist (gak ada
	// kolom buat evidence bullets di scoring_results), jadi GET /screening
	// abis reload halaman nampilin skor angka aja tanpa bullet penjelasnya.
	SimilarityScore float64  `json:"similarityScore,omitempty"`
	MatchedEvidence []string `json:"matchedEvidence,omitempty"`
}

// handleScreen idempotent: kalau lamaran ini udah pernah discreen, balikin
// hasil yang tersimpan daripada manggil AI ulang (buang-buang quota provider
// buat hasil yang gak berubah -- CV & deskripsi lowongan yang sama bakal
// balikin skor yang sama).
func (h *Handler) handleScreen(w http.ResponseWriter, r *http.Request) {
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}
	ctx := r.Context()

	var existingScore appdb.ScoringResult
	if err := h.db.WithContext(ctx).Where("application_id = ?", appRow.ID).First(&existingScore).Error; err == nil {
		resp := screeningResponse{OverallScore: existingScore.OverallScore}
		var existingParse appdb.CVParseResult
		if err := h.db.WithContext(ctx).Where("application_id = ?", appRow.ID).First(&existingParse).Error; err == nil {
			var parsed aiengine.ParseCVResponse
			if json.Unmarshal([]byte(existingParse.ParsedJSON), &parsed) == nil {
				resp.CVSummary = parsed.Summary
				resp.Skills = parsed.Skills
				resp.WorkExperienceYears = parsed.WorkExperienceYears
			}
		}
		httpx.WriteJSON(w, http.StatusOK, resp)
		return
	}

	if appRow.Candidate == nil || appRow.Candidate.CvFileURL == nil || *appRow.Candidate.CvFileURL == "" {
		httpx.WriteError(w, http.StatusUnprocessableEntity, "no_cv", "kandidat belum upload CV di profilnya")
		return
	}
	if !h.ensureAIConfigured(w) {
		return
	}

	resp, err := h.runScreening(ctx, appRow)
	if err != nil {
		httpx.WriteError(w, http.StatusBadGateway, "ai_error", err.Error())
		return
	}
	httpx.WriteJSON(w, http.StatusOK, *resp)
}

// runScreening parse CV kandidat + hitung match score vs deskripsi lowongan,
// lalu persist ke cv_parse_results & scoring_results. Dipanggil dari
// handleScreen (manual, HRD klik tombol) DAN otomatis di goroutine
// background begitu lamaran disubmit (lihat handleSubmitApplication) --
// keduanya lewat jalur yang sama biar logic scoring gak kepisah dua tempat.
func (h *Handler) runScreening(ctx context.Context, appRow *appdb.Application) (*screeningResponse, error) {
	parsed, err := h.aiClient.ParseCV(ctx, aiengine.ParseCVRequest{
		CVObjectKey: *appRow.Candidate.CvFileURL, ApplicationID: appRow.ID,
	})
	if err != nil {
		return nil, fmt.Errorf("gagal parse CV: %w", err)
	}
	parsedJSON, _ := json.Marshal(parsed)
	cvResult := appdb.CVParseResult{
		ApplicationID: appRow.ID, ParsedJSON: string(parsedJSON),
		ExtractedYearsExperience: parsed.WorkExperienceYears, ParsedAt: time.Now(),
	}
	if err := h.db.WithContext(ctx).Create(&cvResult).Error; err != nil {
		return nil, fmt.Errorf("gagal simpan hasil parse CV: %w", err)
	}

	jobDescription := appRow.Job.Description
	if appRow.Job.Requirements != nil && *appRow.Job.Requirements != "" {
		jobDescription += "\n\n" + *appRow.Job.Requirements
	}
	match, err := h.aiClient.MatchCandidate(ctx, aiengine.MatchRequest{
		ApplicationID: appRow.ID, JobID: appRow.JobID,
		CVSummary: parsed.Summary, JobDescription: jobDescription,
	})
	if err != nil {
		return nil, fmt.Errorf("gagal hitung skor kecocokan: %w", err)
	}
	overallScore := match.SimilarityScore * 100
	modelUsed := "groq+gemini"
	scoreResult := appdb.ScoringResult{
		ApplicationID: appRow.ID, OverallScore: overallScore, SkillMatchScore: &overallScore,
		ModelUsed: &modelUsed, ScoredAt: time.Now(),
	}
	if err := h.db.WithContext(ctx).Create(&scoreResult).Error; err != nil {
		return nil, fmt.Errorf("gagal simpan hasil skor: %w", err)
	}

	return &screeningResponse{
		CVSummary: parsed.Summary, Skills: parsed.Skills, WorkExperienceYears: parsed.WorkExperienceYears,
		OverallScore: overallScore, SimilarityScore: match.SimilarityScore, MatchedEvidence: match.MatchedEvidence,
	}, nil
}

func (h *Handler) handleGetScreening(w http.ResponseWriter, r *http.Request) {
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}
	ctx := r.Context()

	var scoreResult appdb.ScoringResult
	if err := h.db.WithContext(ctx).Where("application_id = ?", appRow.ID).First(&scoreResult).Error; err != nil {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "lamaran ini belum discreen")
		return
	}
	resp := screeningResponse{OverallScore: scoreResult.OverallScore}
	var parseResult appdb.CVParseResult
	if err := h.db.WithContext(ctx).Where("application_id = ?", appRow.ID).First(&parseResult).Error; err == nil {
		var parsed aiengine.ParseCVResponse
		if json.Unmarshal([]byte(parseResult.ParsedJSON), &parsed) == nil {
			resp.CVSummary = parsed.Summary
			resp.Skills = parsed.Skills
			resp.WorkExperienceYears = parsed.WorkExperienceYears
		}
	}
	httpx.WriteJSON(w, http.StatusOK, resp)
}

// --- AI interview (pertanyaan digenerate AI, jawaban suara + proctoring kamera) ---

type proctoringFlag struct {
	At     time.Time `json:"at"`
	Reason string    `json:"reason"`
}

// getOrCreateAssessment: satu Assessment per lamaran per track_type. Dipanggil
// pertama kali dari proctor-check ATAU transcribe, mana yang duluan kejadian
// pas sesi interview jalan.
func (h *Handler) getOrCreateAssessment(ctx context.Context, applicationID string) (*appdb.Assessment, error) {
	var a appdb.Assessment
	err := h.db.WithContext(ctx).Where("application_id = ? AND track_type = ?", applicationID, "ai_interview").First(&a).Error
	if err == nil {
		return &a, nil
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	now := time.Now()
	a = appdb.Assessment{
		ApplicationID: applicationID, TrackType: "ai_interview", Status: "in_progress",
		StartedAt: &now, ProctoringFlags: json.RawMessage("[]"),
	}
	if err := h.db.WithContext(ctx).Create(&a).Error; err != nil {
		return nil, err
	}
	return &a, nil
}

func (h *Handler) appendProctoringFlag(ctx context.Context, applicationID string, reason *string) error {
	a, err := h.getOrCreateAssessment(ctx, applicationID)
	if err != nil {
		return err
	}
	var flags []proctoringFlag
	_ = json.Unmarshal(a.ProctoringFlags, &flags)
	r := ""
	if reason != nil {
		r = *reason
	}
	flags = append(flags, proctoringFlag{At: time.Now(), Reason: r})
	updated, err := json.Marshal(flags)
	if err != nil {
		return err
	}
	return h.db.WithContext(ctx).Model(&appdb.Assessment{}).Where("id = ?", a.ID).Update("proctoring_flags", updated).Error
}

type interviewQuestionsResponse struct {
	Questions []string `json:"questions"`
}

func (h *Handler) handleInterviewQuestions(w http.ResponseWriter, r *http.Request) {
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}
	if !h.ensureAIConfigured(w) {
		return
	}
	ctx := r.Context()

	var cvSummary *string
	var parseResult appdb.CVParseResult
	if err := h.db.WithContext(ctx).Where("application_id = ?", appRow.ID).First(&parseResult).Error; err == nil {
		var parsed aiengine.ParseCVResponse
		if json.Unmarshal([]byte(parseResult.ParsedJSON), &parsed) == nil && parsed.Summary != "" {
			cvSummary = &parsed.Summary
		}
	}

	resp, err := h.aiClient.GenerateQuestions(ctx, aiengine.GenerateQuestionsRequest{
		JobDescription: appRow.Job.Description, CVSummary: cvSummary,
	})
	if err != nil {
		httpx.WriteError(w, http.StatusBadGateway, "ai_error", "gagal generate pertanyaan interview")
		return
	}
	httpx.WriteJSON(w, http.StatusOK, interviewQuestionsResponse{Questions: resp.Questions})
}

type audioUploadURLRequest struct {
	QuestionIndex int `json:"questionIndex" validate:"gte=0"`
}

type audioUploadURLResponse struct {
	UploadURL string `json:"uploadUrl"`
	ObjectKey string `json:"objectKey"`
}

func (h *Handler) handleInterviewAudioUploadURL(w http.ResponseWriter, r *http.Request) {
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}
	var req audioUploadURLRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}
	if err := validate.Struct(req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "validation_failed", httpx.ValidationMessage(err))
		return
	}

	objectKey := fmt.Sprintf("interview-audio/%s/%d-%d.webm", appRow.ID, req.QuestionIndex, time.Now().UnixNano())
	uploadURL, err := h.storage.PresignPutCV(r.Context(), objectKey, 10*time.Minute)
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal buat upload URL")
		return
	}
	httpx.WriteJSON(w, http.StatusOK, audioUploadURLResponse{UploadURL: uploadURL, ObjectKey: objectKey})
}

type proctorCheckRequest struct {
	ImageBase64 string `json:"imageBase64" validate:"required"`
}

type proctorCheckResponse struct {
	Flagged bool    `json:"flagged"`
	Reason  *string `json:"reason"`
}

func (h *Handler) handleInterviewProctorCheck(w http.ResponseWriter, r *http.Request) {
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}
	var req proctorCheckRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}
	if err := validate.Struct(req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "validation_failed", httpx.ValidationMessage(err))
		return
	}
	if !h.ensureAIConfigured(w) {
		return
	}
	ctx := r.Context()

	result, err := h.aiClient.ProctorCheck(ctx, aiengine.ProctorCheckRequest{
		ApplicationID: appRow.ID, ImageBase64: req.ImageBase64,
	})
	if err != nil {
		// Best-effort -- satu frame gagal dicek gak boleh gagalin sesi interview-nya.
		log.Printf("[application] proctor-check gagal buat lamaran %s: %v", appRow.ID, err)
		httpx.WriteJSON(w, http.StatusOK, proctorCheckResponse{Flagged: false})
		return
	}
	if result.Flagged {
		if err := h.appendProctoringFlag(ctx, appRow.ID, result.Reason); err != nil {
			log.Printf("[application] gagal simpan proctoring flag: %v", err)
		}
	}
	httpx.WriteJSON(w, http.StatusOK, proctorCheckResponse{Flagged: result.Flagged, Reason: result.Reason})
}

type transcribeRequest struct {
	ObjectKey     string `json:"objectKey" validate:"required"`
	QuestionIndex int    `json:"questionIndex" validate:"gte=0"`
	QuestionText  string `json:"questionText" validate:"required"`
}

type transcribeResponse struct {
	Transcript      string `json:"transcript"`
	AnalysisSummary string `json:"analysisSummary"`
}

func (h *Handler) handleInterviewTranscribe(w http.ResponseWriter, r *http.Request) {
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}
	var req transcribeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}
	if err := validate.Struct(req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "validation_failed", httpx.ValidationMessage(err))
		return
	}
	if !h.ensureAIConfigured(w) {
		return
	}
	ctx := r.Context()

	result, err := h.aiClient.TranscribeInterview(ctx, aiengine.TranscribeInterviewRequest{
		ApplicationID: appRow.ID, AudioObjectKey: req.ObjectKey,
	})
	if err != nil {
		httpx.WriteError(w, http.StatusBadGateway, "ai_error", "gagal transkrip jawaban")
		return
	}

	assessment, err := h.getOrCreateAssessment(ctx, appRow.ID)
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal simpan transkrip")
		return
	}
	answer := result.Transcript
	objectKey := req.ObjectKey
	// analysis_summary dari ai-engine ("Analisis Jawaban NLP" di diagram
	// alur) dicatat di sini juga -- sebelumnya cuma dibalikin ke frontend
	// buat konfirmasi sesaat, gak pernah kesimpen, jadi transkrip di HRD
	// dashboard/candidate gak pernah nampilin analisis per-jawabannya.
	analysisSummary := result.AnalysisSummary

	// Upsert by (assessment_id, order_index) -- jawab ulang pertanyaan yang
	// sama nimpa rekaman lama, bukan numpuk duplikat.
	var existing appdb.AssessmentItem
	err = h.db.WithContext(ctx).Where("assessment_id = ? AND order_index = ?", assessment.ID, req.QuestionIndex).First(&existing).Error
	switch {
	case err == nil:
		h.db.WithContext(ctx).Model(&existing).Updates(map[string]any{
			"candidate_answer": answer, "question_text": req.QuestionText, "audio_object_key": objectKey, "ai_feedback": analysisSummary,
		})
	case errors.Is(err, gorm.ErrRecordNotFound):
		item := appdb.AssessmentItem{
			AssessmentID: assessment.ID, QuestionText: req.QuestionText,
			CandidateAnswer: &answer, OrderIndex: req.QuestionIndex, AudioObjectKey: &objectKey, AIFeedback: &analysisSummary,
		}
		h.db.WithContext(ctx).Create(&item)
	default:
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal simpan transkrip")
		return
	}

	httpx.WriteJSON(w, http.StatusOK, transcribeResponse{Transcript: result.Transcript, AnalysisSummary: result.AnalysisSummary})
}

type finalizeInterviewResponse struct {
	Application         applicationResponse `json:"application"`
	RecommendationScore *float64            `json:"recommendationScore"`
	AuthenticityScore   map[string]float64  `json:"authenticityScore,omitempty"`
}

// handleInterviewFinalize dipanggil kandidat sendiri begitu semua pertanyaan
// interview udah dijawab. Nilai jawaban lewat ScoreValidation, simpan skor
// rekomendasi (recommendation_score) sebagai Assessment.Score, lalu -- kayak
// handleCompleteInterview versi lama -- pindahin status lamaran "submitted"
// ke "under-review". Idempotent buat status-flip-nya (dipanggil lagi abis
// status lewat "submitted" gak error, cuma gak flip ulang); scoring-nya
// sendiri dihitung ulang tiap kali dipanggil (nilai final, gak ada draft).
func (h *Handler) handleInterviewFinalize(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok {
		httpx.WriteError(w, http.StatusUnauthorized, "unauthorized", "missing auth context")
		return
	}
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}
	ctx := r.Context()

	var assessment appdb.Assessment
	if err := h.db.WithContext(ctx).Where("application_id = ? AND track_type = ?", appRow.ID, "ai_interview").First(&assessment).Error; err != nil {
		httpx.WriteError(w, http.StatusUnprocessableEntity, "no_interview", "belum ada sesi interview yang direkam")
		return
	}
	var items []appdb.AssessmentItem
	h.db.WithContext(ctx).Where("assessment_id = ?", assessment.ID).Order("order_index ASC").Find(&items)
	if len(items) == 0 {
		httpx.WriteError(w, http.StatusUnprocessableEntity, "no_answers", "belum ada jawaban yang direkam")
		return
	}

	resp := finalizeInterviewResponse{}
	if h.aiClient.IsConfigured() {
		responses := make([]aiengine.ValidationAnswer, 0, len(items))
		for _, it := range items {
			answer := ""
			if it.CandidateAnswer != nil {
				answer = *it.CandidateAnswer
			}
			responses = append(responses, aiengine.ValidationAnswer{Question: it.QuestionText, Answer: answer})
		}
		scoreResp, err := h.aiClient.ScoreValidation(ctx, aiengine.ScoreValidationRequest{ApplicationID: appRow.ID, Responses: responses})
		if err != nil {
			log.Printf("[application] gagal score-validation buat lamaran %s: %v", appRow.ID, err)
		} else {
			now := time.Now()
			score := scoreResp.RecommendationScore
			h.db.WithContext(ctx).Model(&assessment).Updates(map[string]any{
				"score": score, "status": "completed", "completed_at": now,
			})
			resp.RecommendationScore = &score
			resp.AuthenticityScore = scoreResp.AuthenticityScore
		}
	}

	if appRow.Status == "submitted" {
		fromStatus := appRow.Status
		txErr := h.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
			if err := tx.Model(&appdb.Application{}).Where("id = ?", appRow.ID).
				Update("status", "under-review").Error; err != nil {
				return err
			}
			history := appdb.ApplicationStatusHistory{
				ApplicationID: appRow.ID, FromStatus: &fromStatus, ToStatus: "under-review",
				ChangedBy: &claims.UserID, Note: nilIfEmpty("Kandidat menyelesaikan wawancara AI"),
			}
			return tx.Create(&history).Error
		})
		if txErr != nil {
			httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal update status lamaran")
			return
		}
		appRow.Status = "under-review"
	}

	if appRow.Candidate != nil {
		_ = notification.Create(ctx, h.db, appRow.Candidate.UserID, "interview_completed",
			"Wawancara AI selesai", "Wawancara AI kamu udah selesai dinilai. Cek hasilnya di halaman lamaran.")
	}

	resp.Application = toApplicationResponse(*appRow)
	httpx.WriteJSON(w, http.StatusOK, resp)
}

type interviewItemResponse struct {
	QuestionIndex int    `json:"questionIndex"`
	Question      string `json:"question"`
	Answer        string `json:"answer"`
	AIFeedback    string `json:"aiFeedback,omitempty"`
}

type interviewResultResponse struct {
	Status              string                  `json:"status"`
	RecommendationScore *float64                `json:"recommendationScore"`
	Items               []interviewItemResponse `json:"items"`
	ProctoringFlags     []proctoringFlag        `json:"proctoringFlags"`
}

func (h *Handler) handleGetInterview(w http.ResponseWriter, r *http.Request) {
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}
	ctx := r.Context()

	var assessment appdb.Assessment
	if err := h.db.WithContext(ctx).Where("application_id = ? AND track_type = ?", appRow.ID, "ai_interview").First(&assessment).Error; err != nil {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "belum ada sesi interview")
		return
	}
	var items []appdb.AssessmentItem
	h.db.WithContext(ctx).Where("assessment_id = ?", assessment.ID).Order("order_index ASC").Find(&items)

	itemResp := make([]interviewItemResponse, 0, len(items))
	for _, it := range items {
		answer := ""
		if it.CandidateAnswer != nil {
			answer = *it.CandidateAnswer
		}
		feedback := ""
		if it.AIFeedback != nil {
			feedback = *it.AIFeedback
		}
		itemResp = append(itemResp, interviewItemResponse{QuestionIndex: it.OrderIndex, Question: it.QuestionText, Answer: answer, AIFeedback: feedback})
	}
	var flags []proctoringFlag
	_ = json.Unmarshal(assessment.ProctoringFlags, &flags)

	httpx.WriteJSON(w, http.StatusOK, interviewResultResponse{
		Status: assessment.Status, RecommendationScore: assessment.Score, Items: itemResp, ProctoringFlags: flags,
	})
}

type interviewAudioURLResponse struct {
	URL string `json:"url"`
}

func (h *Handler) handleInterviewAudioURL(w http.ResponseWriter, r *http.Request) {
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}
	questionIndex := chi.URLParam(r, "questionIndex")
	ctx := r.Context()

	var assessment appdb.Assessment
	if err := h.db.WithContext(ctx).Where("application_id = ? AND track_type = ?", appRow.ID, "ai_interview").First(&assessment).Error; err != nil {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "belum ada sesi interview")
		return
	}
	var item appdb.AssessmentItem
	if err := h.db.WithContext(ctx).Where("assessment_id = ? AND order_index = ?", assessment.ID, questionIndex).First(&item).Error; err != nil {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "jawaban gak ditemukan")
		return
	}
	if item.AudioObjectKey == nil || *item.AudioObjectKey == "" {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "gak ada rekaman audio buat jawaban ini")
		return
	}
	url, err := h.storage.PresignGetObject(ctx, *item.AudioObjectKey, 10*time.Minute)
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal buat URL playback")
		return
	}
	httpx.WriteJSON(w, http.StatusOK, interviewAudioURLResponse{URL: url})
}

func statusLabel(status string) string {
	switch status {
	case "under-review":
		return "Administrasi"
	case "interview":
		return "Wawancara"
	case "rejected":
		return "Ditolak"
	default:
		return status
	}
}

func nilIfEmpty(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}
