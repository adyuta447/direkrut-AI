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
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"

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
		pr.With(appmw.RequireRole("hrd")).Delete("/{applicationID}", h.handleDeleteApplication)

		// AI screening (HRD): parse CV kandidat + hitung match score vs
		// deskripsi lowongan.
		pr.With(appmw.RequireRole("hrd")).Get("/sent-decisions", h.handleSentDecisions)
		pr.With(appmw.RequireRole("hrd")).Post("/{applicationID}/screen", h.handleScreen)
		pr.With(appmw.RequireRole("hrd")).Get("/{applicationID}/screening", h.handleGetScreening)
		pr.With(appmw.RequireRole("hrd")).Get("/{applicationID}/cross-role", h.handleCrossRole)
		pr.With(appmw.RequireRole("hrd"), decisionRateLimit).Post("/{applicationID}/cross-role/offer", h.handleCrossRoleOffer)

		// Pre-screening (kandidat): 3 pertanyaan singkat sebelum wawancara AI
		// yang lebih mahal -- nyaring pelamar asal apply (lihat gate di
		// handleInterviewQuestions).
		pr.With(appmw.RequireRole("candidate")).Post("/{applicationID}/prescreen/questions", h.handlePreScreenQuestions)
		pr.With(appmw.RequireRole("candidate")).Post("/{applicationID}/prescreen/submit", h.handlePreScreenSubmit)
		pr.Get("/{applicationID}/prescreen", h.handleGetPreScreen)

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

// candidateProfileSummary: potongan profil kandidat asli (diisi kandidat di
// halaman profilnya) yang ditampilin di tabel/detail dashboard HRD --
// pengganti data sintetis dari hash nama yang dulu dipakai FE.
type candidateProfileSummary struct {
	Location   string           `json:"location,omitempty"`
	Gender     string           `json:"gender,omitempty"`
	Age        *int             `json:"age,omitempty"`
	Headline   string           `json:"headline,omitempty"`
	Phone      string           `json:"phone,omitempty"`
	Email      string           `json:"email,omitempty"`
	Experience []map[string]any `json:"experience,omitempty"`
	Education  []map[string]any `json:"education,omitempty"`
}

type applicationResponse struct {
	ID                   string                   `json:"id"`
	JobID                string                   `json:"jobId"`
	JobTitle             string                   `json:"jobTitle,omitempty"`
	CompanyName          string                   `json:"companyName,omitempty"`
	CandidateID          string                   `json:"candidateId"`
	CandidateName        string                   `json:"candidateName,omitempty"`
	Status               string                   `json:"status"`
	AppliedAt            time.Time                `json:"appliedAt"`
	UpdatedAt            time.Time                `json:"updatedAt"`
	InterviewScheduledAt *time.Time               `json:"interviewScheduledAt,omitempty"`
	RecommendationScore  *float64                 `json:"recommendationScore,omitempty"`
	CandidateProfile     *candidateProfileSummary `json:"candidateProfile,omitempty"`
	// Hasil WAWANCARA AI -- beda sumber dari RecommendationScore (yang dari
	// screening CV). Tanpa dua field ini, dashboard HRD gak pernah nunjukin
	// bahwa kandidat udah selesai wawancara.
	InterviewScore  *float64 `json:"interviewScore,omitempty"`
	InterviewStatus string   `json:"interviewStatus,omitempty"`
}

func toApplicationResponse(a appdb.Application) applicationResponse {
	resp := applicationResponse{
		ID: a.ID, JobID: a.JobID, CandidateID: a.CandidateID,
		Status: a.Status, AppliedAt: a.AppliedAt, UpdatedAt: a.UpdatedAt,
		InterviewScheduledAt: a.InterviewScheduledAt,
	}
	if a.Job != nil {
		resp.JobTitle = a.Job.Title
		if a.Job.Company != nil {
			resp.CompanyName = a.Job.Company.Name
		}
	}
	if a.Candidate != nil {
		resp.CandidateName = a.Candidate.FullName
		profile := candidateProfileSummary{
			Location: derefStr(a.Candidate.Location), Gender: derefStr(a.Candidate.Gender),
			Age: a.Candidate.Age, Headline: derefStr(a.Candidate.Headline), Phone: derefStr(a.Candidate.Phone),
		}
		if a.Candidate.User != nil {
			profile.Email = a.Candidate.User.Email
		}
		// Experience/Education disimpan sbg JSONB bebas -- diterusin apa
		// adanya (unmarshal best-effort, kalau korup ya kosong aja).
		_ = json.Unmarshal(a.Candidate.Experience, &profile.Experience)
		_ = json.Unmarshal(a.Candidate.Education, &profile.Education)
		resp.CandidateProfile = &profile
	}
	if a.ScoringResult != nil {
		score := a.ScoringResult.OverallScore
		resp.RecommendationScore = &score
	}
	for _, as := range a.Assessments {
		if as.TrackType == "ai_interview" {
			resp.InterviewStatus = as.Status
			resp.InterviewScore = as.Score
			break
		}
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

	// Cek status juga, bukan cuma eksistensi -- client kandidat bisa nyimpen
	// data lowongan yang udah basi (list publik cuma di-fetch sekali per
	// sesi, lihat DashboardContext di FE), jadi tombol "Lamar" masih bisa
	// kepencet buat lowongan yang baru aja dinonaktifin/ditutup HRD. Baris
	// ini jadi penjaga terakhir di server biar gak ada lamaran nyangkut ke
	// lowongan yang udah gak dibuka, apapun state di browser kandidat.
	var jobRow appdb.Job
	if err := h.db.WithContext(ctx).First(&jobRow, "id = ?", req.JobID).Error; err != nil {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "lowongan gak ditemukan")
		return
	}
	if jobRow.Status != "published" {
		httpx.WriteError(w, http.StatusConflict, "job_not_open", "lowongan ini udah gak dibuka lagi, gak bisa dilamar")
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
		go func() {
			ctxBg := context.Background()
			if _, err := h.runScreening(ctxBg, &appRow, false); err != nil {
				log.Printf("[application] background auto-screening gagal buat lamaran %s: %v", appRow.ID, err)
			} else {
				// Update status otomatis menjadi "screened" jika masih "submitted"
				h.db.WithContext(ctxBg).Model(&appdb.Application{}).
					Where("id = ? AND status = ?", appRow.ID, "submitted").
					Update("status", "screened")
				
				fromStatus := "submitted"
				history := appdb.ApplicationStatusHistory{
					ApplicationID: appRow.ID, FromStatus: &fromStatus, ToStatus: "screened",
					Note: nilIfEmpty("Auto-screening AI selesai"),
				}
				h.db.WithContext(ctxBg).Create(&history)
			}
		}()
	}

	// Kabarin HRD pemilik lowongan ada pelamar baru.
	if appRow.Job != nil {
		candidateName := "Seorang kandidat"
		if appRow.Candidate != nil && appRow.Candidate.FullName != "" {
			candidateName = appRow.Candidate.FullName
		}
		h.notifyJobOwner(ctx, appRow.Job.CreatedBy, "new_application",
			"Pelamar baru masuk",
			fmt.Sprintf("%s baru aja melamar posisi %s.", candidateName, appRow.Job.Title))
	}

	httpx.WriteJSON(w, http.StatusCreated, toApplicationResponse(appRow))
}

// --- Riwayat keputusan/email HRD ke kandidat (buat halaman Kotak Masuk HRD) ---

type sentDecisionResponse struct {
	ID            string    `json:"id"`
	ApplicationID string    `json:"applicationId"`
	CandidateName string    `json:"candidateName"`
	JobTitle      string    `json:"jobTitle"`
	ToStatus      string    `json:"toStatus"`
	Note          string    `json:"note,omitempty"`
	CreatedAt     time.Time `json:"createdAt"`
}

type sentDecisionListResponse struct {
	Items []sentDecisionResponse `json:"items"`
}

// handleSentDecisions: daftar keputusan (undang wawancara / tolak / dst) yang
// udah dikirim HRD ke kandidat -- data ASLI dari application_status_history
// buat lowongan milik company HRD ini. Ganti data dummy di halaman Kotak
// Masuk HRD. Cuma keputusan yang menghasilkan email/pemberitahuan ke kandidat
// (interview/rejected/under-review), bukan baris "submitted" awal.
func (h *Handler) handleSentDecisions(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok {
		httpx.WriteError(w, http.StatusUnauthorized, "unauthorized", "missing auth context")
		return
	}
	if claims.CompanyID == "" {
		httpx.WriteError(w, http.StatusForbidden, "forbidden", "akun HRD ini belum terhubung ke perusahaan")
		return
	}
	ctx := r.Context()

	type row struct {
		ID            string
		ApplicationID string
		ToStatus      string
		Note          *string
		CreatedAt     time.Time
		FullName      string
		Title         string
	}
	var rows []row
	err := h.db.WithContext(ctx).
		Table("application_status_history AS ash").
		Select("ash.id, ash.application_id, ash.to_status, ash.note, ash.created_at, c.full_name, j.title").
		Joins("JOIN applications a ON a.id = ash.application_id").
		Joins("JOIN jobs j ON j.id = a.job_id").
		Joins("JOIN candidates c ON c.id = a.candidate_id").
		Where("j.company_id = ? AND ash.to_status IN ?", claims.CompanyID,
			[]string{"interview", "interview_completed", "accepted", "rejected", "under-review"}).
		Order("ash.created_at DESC").
		Limit(100).
		Scan(&rows).Error
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal ambil riwayat keputusan")
		return
	}

	resp := sentDecisionListResponse{Items: make([]sentDecisionResponse, 0, len(rows))}
	for _, r := range rows {
		item := sentDecisionResponse{
			ID: r.ID, ApplicationID: r.ApplicationID, CandidateName: r.FullName,
			JobTitle: r.Title, ToStatus: r.ToStatus, CreatedAt: r.CreatedAt,
		}
		if r.Note != nil {
			item.Note = *r.Note
		}
		resp.Items = append(resp.Items, item)
	}
	httpx.WriteJSON(w, http.StatusOK, resp)
}

func (h *Handler) handleListApplications(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok {
		httpx.WriteError(w, http.StatusUnauthorized, "unauthorized", "missing auth context")
		return
	}
	ctx := r.Context()
	query := h.db.WithContext(ctx).Model(&appdb.Application{}).Preload("Job.Company").Preload("Candidate.User").Preload("ScoringResult").
		Preload("Assessments", "track_type = ?", "ai_interview")

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
	if err := h.db.WithContext(r.Context()).Preload("Job.Company").Preload("Candidate.User").Preload("ScoringResult").
		Preload("Assessments", "track_type = ?", "ai_interview").First(&appRow, "id = ?", appID).Error; err != nil {
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
	Status string `json:"status" validate:"required,oneof=submitted under-review interview interview_completed accepted rejected"`
	Note   string `json:"note"`
	// Cuma dipakai (dan ditulis) pas Status == "interview" -- HRD ngundang +
	// milih jadwal dalam satu aksi yang sama. Opsional: HRD boleh pindahin
	// status ke "interview" dulu, isi jadwalnya belakangan lewat request lain.
	InterviewScheduledAt *time.Time `json:"interviewScheduledAt"`
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

	// Lamaran yang udah diterima itu keputusan final -- gak ada jalan buka
	// lagi kayak "rejected" (gak ada trigger alami buat "batal diterima").
	if appRow.Status == "accepted" {
		httpx.WriteError(w, http.StatusConflict, "already_decided",
			"lamaran ini udah diterima -- gak bisa diubah lagi")
		return
	}

	// Lamaran yang udah ditolak dikunci -- HRD gak bisa kirim keputusan
	// (email) lagi ke kandidat yang sama biar gak boros traffic/biaya kirim.
	// Satu-satunya jalan buka lagi: kandidat ngulang wawancara AI (assessment
	// ai_interview-nya diselesaikan ULANG setelah waktu penolakan terakhir).
	if appRow.Status == "rejected" {
		var lastRejection appdb.ApplicationStatusHistory
		rejErr := h.db.WithContext(ctx).
			Where("application_id = ? AND to_status = ?", appRow.ID, "rejected").
			Order("created_at DESC").First(&lastRejection).Error

		var assessment appdb.Assessment
		asmErr := h.db.WithContext(ctx).
			Where("application_id = ? AND track_type = ?", appRow.ID, "ai_interview").
			First(&assessment).Error

		retookInterview := rejErr == nil && asmErr == nil &&
			assessment.CompletedAt != nil && assessment.CompletedAt.After(lastRejection.CreatedAt)

		if !retookInterview {
			httpx.WriteError(w, http.StatusConflict, "already_rejected",
				"lamaran ini udah ditolak -- gak bisa kirim keputusan lagi kecuali kandidat ngulang wawancara AI")
			return
		}
	}

	fromStatus := appRow.Status
	txErr := h.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		updates := map[string]any{"status": req.Status}
		if req.InterviewScheduledAt != nil {
			updates["interview_scheduled_at"] = req.InterviewScheduledAt
		}
		if err := tx.Model(&appdb.Application{}).Where("id = ?", appRow.ID).Updates(updates).Error; err != nil {
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
	if req.InterviewScheduledAt != nil {
		appRow.InterviewScheduledAt = req.InterviewScheduledAt
	}
	// Notifikasi + email kandidat -- keduanya best-effort, gagal ngirim gak
	// boleh gagalin update status-nya sendiri (udah kepake duluan).
	if appRow.Candidate != nil && appRow.Job != nil {
		companyName := ""
		if appRow.Job.Company != nil {
			companyName = appRow.Job.Company.Name
		}
		title := "Status lamaran diperbarui"
		body := fmt.Sprintf("Lamaranmu untuk %s di %s sekarang: %s", appRow.Job.Title, companyName, statusLabel(req.Status))
		if req.InterviewScheduledAt != nil {
			body += fmt.Sprintf("\n\nJadwal wawancara: %s", req.InterviewScheduledAt.Format("02/01/2006 15:04"))
		}
		// Kalau HRD nulis pesan sendiri (subjek+isi email di dialog keputusan),
		// itu pesan ASLI yang harus kandidat liat di Kotak Masuk in-app-nya --
		// sebelumnya cuma baris generik di atas yang kekirim, jadi detail &
		// rekomendasi yang HRD tulis serasa "gak pernah nyampe" walau emailnya
		// sendiri sebenarnya kekirim.
		if req.EmailBody != "" {
			body = req.EmailBody
		}
		_ = notification.Create(ctx, h.db, appRow.Candidate.UserID, "application_status", title, body)

		if req.EmailSubject != "" && req.EmailBody != "" && appRow.Candidate.User != nil {
			_ = notification.Create(ctx, h.db, appRow.Candidate.UserID, "application_email", req.EmailSubject, req.EmailBody)
			
			go func(to, subject, emailBody string) {
				if err := h.mailer.Send(context.Background(), to, subject, emailBody); err != nil {
					log.Printf("[application] gagal kirim email keputusan HRD ke %s: %v", to, err)
				}
			}(appRow.Candidate.User.Email, req.EmailSubject, req.EmailBody)
		} else if req.Status == "rejected" && appRow.Candidate.User != nil && h.aiClient.IsConfigured() {
			// Poin nilai tambah produk: kandidat yang ditolak SELALU dapet
			// email feedback pengembangan (digenerate AI dari CV + hasil
			// wawancaranya), kecuali HRD udah nulis email sendiri di atas.
			// Best-effort di background -- gagal generate/kirim gak boleh
			// gagalin update status.
			go h.sendRejectionFeedback(*appRow)
		}
	}
	httpx.WriteJSON(w, http.StatusOK, toApplicationResponse(*appRow))
}

// sendRejectionFeedback: generate email feedback pengembangan lewat
// ai-engine (berbasis CV + ringkasan wawancara yang tersimpan) dan kirim ke
// kandidat + notifikasi in-app. Dipanggil sebagai goroutine dari
// handleUpdateStatus pas kandidat ditolak tanpa email manual dari HRD --
// context.Background() karena request aslinya udah selesai duluan.
func (h *Handler) sendRejectionFeedback(appRow appdb.Application) {
	ctx := context.Background()
	if appRow.Job == nil || appRow.Candidate == nil || appRow.Candidate.User == nil {
		return
	}

	jobDescription := appRow.Job.Description
	if appRow.Job.Requirements != nil && *appRow.Job.Requirements != "" {
		jobDescription += "\n\n" + *appRow.Job.Requirements
	}
	req := aiengine.GenerateFeedbackRequest{JobTitle: appRow.Job.Title, JobDescription: jobDescription}

	var parseResult appdb.CVParseResult
	if err := h.db.WithContext(ctx).Where("application_id = ?", appRow.ID).First(&parseResult).Error; err == nil {
		var parsed aiengine.ParseCVResponse
		if json.Unmarshal([]byte(parseResult.ParsedJSON), &parsed) == nil && parsed.Summary != "" {
			req.CVSummary = &parsed.Summary
		}
	}

	// Ringkasan wawancara = gabungan feedback AI per jawaban (diisi pas
	// transcribe) -- kalau kandidat belum sempet wawancara, ya tanpa itu.
	var assessment appdb.Assessment
	if err := h.db.WithContext(ctx).Preload("Items").
		Where("application_id = ? AND track_type = ?", appRow.ID, "ai_interview").First(&assessment).Error; err == nil {
		var notes []string
		for _, item := range assessment.Items {
			if item.AIFeedback != nil && *item.AIFeedback != "" {
				notes = append(notes, *item.AIFeedback)
			}
		}
		if len(notes) > 0 {
			joined := strings.Join(notes, "\n")
			req.InterviewSummary = &joined
		}
	}

	resp, err := h.aiClient.GenerateFeedback(ctx, req)
	if err != nil {
		log.Printf("[application] gagal generate feedback penolakan buat lamaran %s: %v", appRow.ID, err)
		return
	}

	companyName := ""
	if appRow.Job.Company != nil {
		companyName = appRow.Job.Company.Name
	}
	subject := fmt.Sprintf("Feedback lamaranmu untuk %s di %s", appRow.Job.Title, companyName)
	
	_ = notification.Create(ctx, h.db, appRow.Candidate.UserID, "application_email", subject, resp.Feedback)

	if err := h.mailer.Send(ctx, appRow.Candidate.User.Email, subject, resp.Feedback); err != nil {
		log.Printf("[application] gagal kirim email feedback penolakan ke %s: %v", appRow.Candidate.User.Email, err)
		// Tetep lanjut bikin notifikasi in-app di bawah -- itu jalur yang gak
		// tergantung SMTP, jadi kandidat tetep keliatan feedback-nya walau
		// pengiriman email gagal.
	}
	// Isi notifikasi = feedback ASLI (bukan cuma "cek email"), biar kandidat
	// yang gak buka/gak nerima emailnya tetep bisa liat feedback-nya di
	// Kotak Masuk in-app.
	_ = notification.Create(ctx, h.db, appRow.Candidate.UserID, "application_feedback",
		"Feedback pengembangan dari lamaranmu", resp.Feedback)
}

// handleDeleteApplication: HRD hapus permanen data lamaran yang udah final
// (ditolak, atau lolos wawancara) -- bukan buat lamaran yang masih jalan
// (submitted/under-review/interview belum diputus), biar HRD gak kepencet
// hapus kandidat yang masih diproses. Beda dari handleDeleteJob (yang blokir
// hapus kalau ada anak baris), application_status_history SELALU punya
// minimal 1 baris sejak lamaran dibuat (lihat handleSubmitApplication) --
// jadi di sini kita cascade-delete anak2nya sendiri dalam transaksi,
// bukan nolak hapusnya, soalnya kalau nolak gak akan pernah bisa kehapus.
func (h *Handler) handleDeleteApplication(w http.ResponseWriter, r *http.Request) {
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}
	if appRow.Status != "rejected" && appRow.Status != "accepted" {
		httpx.WriteError(w, http.StatusConflict, "must_be_decided",
			"lamaran ini harus diterima atau ditolak dulu sebelum bisa dihapus")
		return
	}

	ctx := r.Context()
	txErr := h.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("assessment_id IN (SELECT id FROM assessments WHERE application_id = ?)", appRow.ID).
			Delete(&appdb.AssessmentItem{}).Error; err != nil {
			return err
		}
		if err := tx.Where("application_id = ?", appRow.ID).Delete(&appdb.Assessment{}).Error; err != nil {
			return err
		}
		if err := tx.Where("application_id = ?", appRow.ID).Delete(&appdb.CVParseResult{}).Error; err != nil {
			return err
		}
		if err := tx.Where("application_id = ?", appRow.ID).Delete(&appdb.ScoringResult{}).Error; err != nil {
			return err
		}
		if err := tx.Where("application_id = ?", appRow.ID).Delete(&appdb.ApplicationStatusHistory{}).Error; err != nil {
			return err
		}
		return tx.Delete(&appdb.Application{}, "id = ?", appRow.ID).Error
	})
	if txErr != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal hapus lamaran")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// --- AI screening (CV parse + job-match score) ---

type screeningResponse struct {
	CVSummary             string                             `json:"cvSummary"`
	Skills                []string                           `json:"skills"`
	WorkExperienceYears   *float64                           `json:"workExperienceYears"`
	OverallScore          float64                            `json:"overallScore"`
	FinalWeightedScore    *float64                           `json:"finalWeightedScore,omitempty"`
	Category              *string                            `json:"category,omitempty"`
	CandidateTrack        *string                            `json:"candidateTrack,omitempty"`
	Reasoning             *string                            `json:"reasoning,omitempty"`
	Quotes                []string                           `json:"quotes,omitempty"`
	ComponentScores       map[string]aiengine.ComponentScore `json:"componentScores,omitempty"`
	WeightsUsed           *aiengine.WeightConfig             `json:"weightsUsed,omitempty"`
	EligibilityStatus     *string                            `json:"eligibilityStatus,omitempty"`
	MatchScore            *float64                           `json:"matchScore,omitempty"`
	RecommendationStatus  *string                            `json:"recommendationStatus,omitempty"`
	EvidenceCoverage      *string                            `json:"evidenceCoverage,omitempty"`
	KeyGaps               []string                           `json:"keyGaps,omitempty"`
	SimilarityScore       float64                            `json:"similarityScore,omitempty"`
	MatchedEvidence       []string                           `json:"matchedEvidence,omitempty"`
}

// unmarshalMatchedEvidence: baca bullet-bullet bukti kecocokan yang
// tersimpen di scoring_results.matched_evidence -- nil/gagal parse cukup
// balikin slice kosong (evidence emang best-effort, jangan gagalin
// keseluruhan respons screening cuma gara-gara ini).
func unmarshalMatchedEvidence(raw json.RawMessage) []string {
	if len(raw) == 0 {
		return nil
	}
	var evidence []string
	if err := json.Unmarshal(raw, &evidence); err != nil {
		return nil
	}
	return evidence
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

	force := r.URL.Query().Get("force") == "true"
	var existingScore appdb.ScoringResult
	if !force && h.db.WithContext(ctx).Where("application_id = ?", appRow.ID).First(&existingScore).Error == nil {
		resp := screeningResponse{
			OverallScore:         existingScore.OverallScore,
			MatchedEvidence:      unmarshalMatchedEvidence(existingScore.MatchedEvidence),
			Category:             existingScore.Category,
			CandidateTrack:       existingScore.CandidateTrack,
			Reasoning:            existingScore.Reasoning,
			EligibilityStatus:    existingScore.EligibilityStatus,
			RecommendationStatus: existingScore.RecommendationStatus,
			EvidenceCoverage:     existingScore.EvidenceCoverage,
		}
		if existingScore.MatchScore != nil {
			resp.MatchScore = existingScore.MatchScore
		}
		if existingScore.QuotesJSON != nil {
			var q []string
			if json.Unmarshal([]byte(*existingScore.QuotesJSON), &q) == nil {
				resp.Quotes = q
			}
		}
		if existingScore.ComponentScores != nil {
			var cs map[string]aiengine.ComponentScore
			if json.Unmarshal([]byte(*existingScore.ComponentScores), &cs) == nil {
				resp.ComponentScores = cs
			}
		}
		if existingScore.WeightsUsed != nil {
			var w aiengine.WeightConfig
			if json.Unmarshal([]byte(*existingScore.WeightsUsed), &w) == nil {
				resp.WeightsUsed = &w
			}
		}
		if existingScore.KeyGapsJSON != nil {
			var kg []string
			if json.Unmarshal([]byte(*existingScore.KeyGapsJSON), &kg) == nil {
				resp.KeyGaps = kg
			}
		}
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

	resp, err := h.runScreening(ctx, appRow, force)
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
func (h *Handler) runScreening(ctx context.Context, appRow *appdb.Application, force bool) (*screeningResponse, error) {
	// Resume dari state setengah jadi: kalau run sebelumnya sempet nyimpen
	// hasil parse CV tapi keburu gagal di step match/skor, reuse hasil parse
	// yang udah ada (kecuali di-force dari dashboard HRD).
	var parsed *aiengine.ParseCVResponse
	var existingParse appdb.CVParseResult
	if !force && h.db.WithContext(ctx).Where("application_id = ?", appRow.ID).First(&existingParse).Error == nil {
		var cached aiengine.ParseCVResponse
		if json.Unmarshal([]byte(existingParse.ParsedJSON), &cached) == nil {
			parsed = &cached
		}
	}
	if parsed == nil {
		fresh, err := h.aiClient.ParseCV(ctx, aiengine.ParseCVRequest{
			CVObjectKey: *appRow.Candidate.CvFileURL, ApplicationID: appRow.ID,
		})
		if err != nil {
			return nil, fmt.Errorf("gagal parse CV: %w", err)
		}
		parsed = fresh
		parsedJSON, _ := json.Marshal(parsed)
		cvResult := appdb.CVParseResult{
			ApplicationID: appRow.ID, ParsedJSON: string(parsedJSON),
			ExtractedYearsExperience: parsed.WorkExperienceYears, ParsedAt: time.Now(),
		}
		// Upsert: auto-screen (goroutine) & tombol manual HRD bisa balapan.
		if err := h.db.WithContext(ctx).Clauses(clause.OnConflict{
			Columns:   []clause.Column{{Name: "application_id"}},
			DoUpdates: clause.AssignmentColumns([]string{"parsed_json", "extracted_years_experience", "parsed_at"}),
		}).Create(&cvResult).Error; err != nil {
			return nil, fmt.Errorf("gagal simpan hasil parse CV: %w", err)
		}
	}

	// Bangun job description (legacy field, tetap dikirim sebagai konteks)
	jobDescription := appRow.Job.Description
	if appRow.Job.Requirements != nil && *appRow.Job.Requirements != "" {
		jobDescription += "\n\n" + *appRow.Job.Requirements
	}

	// Parse required/preferred skills dari JSON
	var requiredSkills, preferredSkills []string
	if appRow.Job.RequiredSkills != nil && *appRow.Job.RequiredSkills != "" {
		_ = json.Unmarshal([]byte(*appRow.Job.RequiredSkills), &requiredSkills)
	}
	if appRow.Job.PreferredSkills != nil && *appRow.Job.PreferredSkills != "" {
		_ = json.Unmarshal([]byte(*appRow.Job.PreferredSkills), &preferredSkills)
	}

	keyResponsibilities := ""
	if appRow.Job.KeyResponsibilities != nil {
		keyResponsibilities = *appRow.Job.KeyResponsibilities
	}
	educationReq := ""
	if appRow.Job.EducationRequirement != nil {
		educationReq = *appRow.Job.EducationRequirement
	}
	minExp := 0
	if appRow.Job.MinExperienceYears != nil {
		minExp = *appRow.Job.MinExperienceYears
	}

	// Cari konfigurasi bobot: job-level dulu, lalu company-level, lalu default
	var customWeights *aiengine.WeightConfig
	var jobWeightCfg appdb.JobScoringWeightConfig
	if h.db.WithContext(ctx).Where("job_id = ? AND is_custom = true", appRow.JobID).First(&jobWeightCfg).Error == nil {
		customWeights = &aiengine.WeightConfig{
			SkillMatch:       jobWeightCfg.WeightSkillMatch,
			Experience:       jobWeightCfg.WeightExperience,
			Education:        jobWeightCfg.WeightEducation,
			Responsibilities: jobWeightCfg.WeightResponsibilities,
			Additional:       jobWeightCfg.WeightAdditional,
		}
	} else if appRow.Job != nil {
		var compWeightCfg appdb.ScoringWeightConfig
		if h.db.WithContext(ctx).Where("company_id = ? AND is_custom = true", appRow.Job.CompanyID).First(&compWeightCfg).Error == nil {
			customWeights = &aiengine.WeightConfig{
				SkillMatch:       compWeightCfg.WeightSkillMatch,
				Experience:       compWeightCfg.WeightExperience,
				Education:        compWeightCfg.WeightEducation,
				Responsibilities: compWeightCfg.WeightResponsibilities,
				Additional:       compWeightCfg.WeightAdditional,
			}
		}
	}

	match, err := h.aiClient.MatchCandidate(ctx, aiengine.MatchRequest{
		ApplicationID:        appRow.ID,
		JobID:                appRow.JobID,
		CVSummary:            parsed.Summary,
		JobDescription:       jobDescription,
		WorkExperienceYears:  parsed.WorkExperienceYears,
		RequiredSkills:       requiredSkills,
		PreferredSkills:      preferredSkills,
		KeyResponsibilities:  keyResponsibilities,
		MinExperienceYears:   minExp,
		EducationRequirement: educationReq,
		CandidateType:        appRow.Job.CandidateType,
		Weights:              customWeights,
	})
	if err != nil {
		return nil, fmt.Errorf("gagal hitung skor kecocokan: %w", err)
	}

	// Gunakan MatchScore sebagai overall score
	overallScore := match.MatchScore
	if overallScore == 0 {
		overallScore = match.SimilarityScore * 100
	}
	modelUsed := "groq+gemini-evidence-v2"

	// Serialize quotes - dihapus pada MVP karena evidence ada di assessments
	var quotesJSON *string

	// Serialize component scores
	var componentScoresJSON *string
	if len(match.ComponentScores) > 0 {
		cs, _ := json.Marshal(match.ComponentScores)
		csStr := string(cs)
		componentScoresJSON = &csStr
	}

	// Serialize weights used
	var weightsUsedJSON *string
	wj, _ := json.Marshal(match.WeightsUsed)
	wjStr := string(wj)
	weightsUsedJSON = &wjStr

	var keyGapsJSON *string
	if len(match.KeyGaps) > 0 {
		kg, _ := json.Marshal(match.KeyGaps)
		kgStr := string(kg)
		keyGapsJSON = &kgStr
	}

	// Placeholder for MatchedEvidence to satisfy prod schema
	evidenceJSON := []byte("[]")

	scoreResult := appdb.ScoringResult{
		ApplicationID:        appRow.ID,
		OverallScore:         overallScore,
		SkillMatchScore:      &overallScore,
		Category:             nil, // removed in MVP
		CandidateTrack:       &match.CandidateTrack,
		Reasoning:            &match.ReasoningSummary, // Use MVP reasoning_summary
		QuotesJSON:           quotesJSON,
		ModelUsed:            &modelUsed,
		ScoredAt:             time.Now(),
		ComponentScores:      componentScoresJSON,
		WeightsUsed:          weightsUsedJSON,
		EligibilityStatus:    &match.EligibilityStatus,
		MatchScore:           &match.MatchScore,
		RecommendationStatus: &match.RecommendationStatus,
		EvidenceCoverage:     &match.EvidenceCoverage,
		KeyGapsJSON:          keyGapsJSON,
		MatchedEvidence:      evidenceJSON,
	}
	if err := h.db.WithContext(ctx).Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "application_id"}},
		DoUpdates: clause.AssignmentColumns([]string{
			"overall_score", "skill_match_score", "category", "candidate_track",
			"reasoning", "quotes_json", "model_used", "scored_at",
			"component_scores", "weights_used", "eligibility_status",
			"match_score", "recommendation_status", "evidence_coverage", "key_gaps_json",
			"matched_evidence",
		}),
	}).Create(&scoreResult).Error; err != nil {
		return nil, fmt.Errorf("gagal simpan hasil skor: %w", err)
	}

	weightsPtr := &match.WeightsUsed
	return &screeningResponse{
		CVSummary:          parsed.Summary,
		Skills:             parsed.Skills,
		WorkExperienceYears: parsed.WorkExperienceYears,
		OverallScore:       overallScore,
		FinalWeightedScore: &overallScore,
		Category:           nil, // removed in MVP
		CandidateTrack:     &match.CandidateTrack,
		Reasoning:          &match.ReasoningSummary,
		Quotes:             nil, // removed in MVP
		ComponentScores:    match.ComponentScores,
		WeightsUsed:        weightsPtr,
		EligibilityStatus:    &match.EligibilityStatus,
		MatchScore:           &match.MatchScore,
		RecommendationStatus: &match.RecommendationStatus,
		EvidenceCoverage:     &match.EvidenceCoverage,
		KeyGaps:              match.KeyGaps,
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
	resp := screeningResponse{
		OverallScore:         scoreResult.OverallScore,
		MatchedEvidence:      unmarshalMatchedEvidence(scoreResult.MatchedEvidence),
		Category:             scoreResult.Category,
		CandidateTrack:       scoreResult.CandidateTrack,
		Reasoning:            scoreResult.Reasoning,
		EligibilityStatus:    scoreResult.EligibilityStatus,
		MatchScore:           scoreResult.MatchScore,
		RecommendationStatus: scoreResult.RecommendationStatus,
		EvidenceCoverage:     scoreResult.EvidenceCoverage,
	}
	if scoreResult.QuotesJSON != nil {
		var q []string
		if json.Unmarshal([]byte(*scoreResult.QuotesJSON), &q) == nil {
			resp.Quotes = q
		}
	}
	if scoreResult.KeyGapsJSON != nil {
		var kg []string
		if json.Unmarshal([]byte(*scoreResult.KeyGapsJSON), &kg) == nil {
			resp.KeyGaps = kg
		}
	}
	// Muat component scores jika ada
	if scoreResult.ComponentScores != nil {
		var cs map[string]aiengine.ComponentScore
		if json.Unmarshal([]byte(*scoreResult.ComponentScores), &cs) == nil {
			resp.ComponentScores = cs
		}
	}
	// Muat weights used jika ada
	if scoreResult.WeightsUsed != nil {
		var wu aiengine.WeightConfig
		if json.Unmarshal([]byte(*scoreResult.WeightsUsed), &wu) == nil {
			resp.WeightsUsed = &wu
		}
	}
	// FinalWeightedScore == OverallScore pada engine baru
	fws := scoreResult.OverallScore
	resp.FinalWeightedScore = &fws
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

// --- Cross-role recommendation (lowongan lain yang cocok buat CV kandidat ini) ---

type crossRoleMatch struct {
	JobID           string   `json:"jobId"`
	JobTitle        string   `json:"jobTitle"`
	Score           float64  `json:"score"`
	MatchedEvidence []string `json:"matchedEvidence"`
}

type crossRoleResponse struct {
	Matches []crossRoleMatch `json:"matches"`
}

// crossRoleOtherJobsLimit: dibatesin biar satu klik HRD gak micu match call
// (embed CV + embed lowongan + evidence LLM call) ke puluhan lowongan
// sekaligus -- di-cap ke lowongan aktif TERBARU di company yang sama.
const crossRoleOtherJobsLimit = 5
const crossRoleScoreThreshold = 50.0

// handleCrossRole: cari lowongan LAIN (company sama, masih aktif, bukan
// yang udah dia lamar) yang cocok sama CV kandidat ini. Reuse ringkasan CV
// yang udah kesimpen dari screening (handleScreen) -- kandidat ini WAJIB
// udah discreen dulu, biar gak parse CV dua kali. Dipicu manual lewat
// tombol di FE (bukan auto buat semua kandidat), dan hasilnya gak
// dipersist -- HRD klik ulang kalau mau refresh, biaya AI-nya cuma jalan
// pas tombolnya beneran diklik. Tiap lowongan lain dicek PARALEL (goroutine)
// biar latency-nya gak numpuk linear per lowongan.
func (h *Handler) handleCrossRole(w http.ResponseWriter, r *http.Request) {
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}
	ctx := r.Context()

	var parseResult appdb.CVParseResult
	if err := h.db.WithContext(ctx).Where("application_id = ?", appRow.ID).First(&parseResult).Error; err != nil {
		httpx.WriteError(w, http.StatusUnprocessableEntity, "screening_required", "screening CV kandidat ini dulu sebelum cari rekomendasi lintas posisi")
		return
	}
	var parsedCV aiengine.ParseCVResponse
	if err := json.Unmarshal([]byte(parseResult.ParsedJSON), &parsedCV); err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal baca hasil screening CV")
		return
	}
	if !h.ensureAIConfigured(w) {
		return
	}

	var otherJobs []appdb.Job
	if err := h.db.WithContext(ctx).
		Where("company_id = ? AND status = ? AND id != ?", appRow.Job.CompanyID, "published", appRow.JobID).
		Order("created_at DESC").Limit(crossRoleOtherJobsLimit).Find(&otherJobs).Error; err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal ambil daftar lowongan lain")
		return
	}

	results := make([]crossRoleMatch, len(otherJobs))
	found := make([]bool, len(otherJobs))
	var wg sync.WaitGroup
	for i, job := range otherJobs {
		wg.Add(1)
		go func(i int, job appdb.Job) {
			defer wg.Done()
			jobDescription := job.Description
			if job.Requirements != nil && *job.Requirements != "" {
				jobDescription += "\n\n" + *job.Requirements
			}
			match, err := h.aiClient.MatchCandidate(ctx, aiengine.MatchRequest{
				ApplicationID: appRow.ID, JobID: job.ID,
				CVSummary: parsedCV.Summary, JobDescription: jobDescription,
			})
			if err != nil {
				log.Printf("[application] cross-role match gagal buat lamaran %s vs lowongan %s: %v", appRow.ID, job.ID, err)
				return
			}
			evidence := []string{}
			if match.ReasoningSummary != "" {
				evidence = []string{match.ReasoningSummary}
			}
			results[i] = crossRoleMatch{
				JobID: job.ID, JobTitle: job.Title,
				Score: match.SimilarityScore * 100, MatchedEvidence: evidence,
			}
			found[i] = true
		}(i, job)
	}
	wg.Wait()

	matches := make([]crossRoleMatch, 0, len(otherJobs))
	for i, ok := range found {
		// Syarat bukti kecocokan non-kosong itu penting: embedding cenderung
		// ngasih similarity tinggi ke semua teks (tes live: CV software
		// engineer vs lowongan content writer masih dapet 60), tapi buat
		// pasangan yang beneran gak nyambung, LLM evidence-nya balik kosong.
		if ok && results[i].Score >= crossRoleScoreThreshold && len(results[i].MatchedEvidence) > 0 {
			matches = append(matches, results[i])
		}
	}
	sort.Slice(matches, func(i, j int) bool { return matches[i].Score > matches[j].Score })

	httpx.WriteJSON(w, http.StatusOK, crossRoleResponse{Matches: matches})
}

type crossRoleOfferRequest struct {
	JobID string `json:"jobId" validate:"required"`
}

// handleCrossRoleOffer: HRD menawarkan posisi LAIN ke kandidat. Sengaja TIDAK
// memindahkan kandidat / bikin lamaran otomatis (saran review: cross-role itu
// rekomendasi, bukan pemindahan tanpa validasi). Yang terjadi cuma kirim
// notifikasi + email ajakan; kandidat yang MEMUTUSKAN mau apply atau nggak,
// dan kalau apply dia lewat alur lamar normal (pre-screening + wawancara AI
// buat role baru itu) -- jadi selalu ada validasi ulang buat role baru,
// trust HRD kejaga.
func (h *Handler) handleCrossRoleOffer(w http.ResponseWriter, r *http.Request) {
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}
	ctx := r.Context()

	var req crossRoleOfferRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}
	if err := validate.Struct(req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "validation_failed", httpx.ValidationMessage(err))
		return
	}
	if req.JobID == appRow.JobID {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "posisi yang ditawarkan sama dengan yang udah dilamar")
		return
	}

	var targetJob appdb.Job
	if err := h.db.WithContext(ctx).Preload("Company").First(&targetJob, "id = ?", req.JobID).Error; err != nil {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "lowongan yang ditawarkan gak ketemu")
		return
	}
	if appRow.Job == nil || targetJob.CompanyID != appRow.Job.CompanyID {
		httpx.WriteError(w, http.StatusForbidden, "forbidden", "cuma bisa nawarin lowongan di perusahaanmu sendiri")
		return
	}
	if targetJob.Status != "published" {
		httpx.WriteError(w, http.StatusConflict, "job_not_open", "lowongan yang ditawarkan udah gak dibuka")
		return
	}

	var existing appdb.Application
	if err := h.db.WithContext(ctx).
		Where("job_id = ? AND candidate_id = ?", req.JobID, appRow.CandidateID).First(&existing).Error; err == nil {
		httpx.WriteError(w, http.StatusConflict, "already_applied", "kandidat udah pernah melamar posisi ini")
		return
	}

	if appRow.Candidate == nil || appRow.Candidate.User == nil {
		httpx.WriteError(w, http.StatusUnprocessableEntity, "no_candidate", "data kandidat gak lengkap")
		return
	}

	companyName := ""
	if targetJob.Company != nil {
		companyName = targetJob.Company.Name
	}
	title := "Kamu ditawari posisi lain!"
	body := fmt.Sprintf("Tim HRD %s ngeliat profilmu cocok buat posisi %s. Tertarik? Buka lowongannya dan lamar kalau mau -- kamu tetap lewat proses seleksi buat posisi itu.", companyName, targetJob.Title)
	if err := notification.Create(ctx, h.db, appRow.Candidate.UserID, "cross_role_offer", title, body); err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal kirim tawaran")
		return
	}

	// Email best-effort -- gagal kirim gak gagalin tawarannya (notif in-app
	// udah masuk).
	if h.mailer != nil {
		emailBody := fmt.Sprintf(
			"Halo %s,\n\nBerdasarkan profil dan hasil seleksimu, tim HRD %s melihat potensimu untuk posisi %s. "+
				"Kalau tertarik, kamu bisa buka lowongan tersebut dan melamar -- prosesnya tetap melalui seleksi untuk posisi itu, "+
				"jadi kecocokanmu divalidasi ulang secara adil.\n\nKeputusan sepenuhnya ada di kamu. Semangat!",
			appRow.Candidate.FullName, companyName, targetJob.Title)
		go func(to, subject, emailContent string) {
			if err := h.mailer.Send(context.Background(), to, subject, emailContent); err != nil {
				log.Printf("[application] gagal kirim email tawaran cross-role ke %s: %v", to, err)
			}
		}(appRow.Candidate.User.Email, "Peluang posisi baru di "+companyName, emailBody)
	}

	httpx.WriteJSON(w, http.StatusOK, map[string]string{"status": "offered"})
}

// --- AI interview (pertanyaan digenerate AI, jawaban suara + proctoring kamera) ---

type proctoringFlag struct {
	At     time.Time `json:"at"`
	Reason string    `json:"reason"`
}

// getOrCreateAssessment: satu Assessment per lamaran per track_type --
// reused buat "ai_interview" (dipanggil pertama kali dari proctor-check ATAU
// transcribe, mana yang duluan kejadian) dan "pre_screening" (dipanggil dari
// handlePreScreenSubmit).
func (h *Handler) getOrCreateAssessment(ctx context.Context, applicationID, trackType string) (*appdb.Assessment, error) {
	var a appdb.Assessment
	err := h.db.WithContext(ctx).Where("application_id = ? AND track_type = ?", applicationID, trackType).First(&a).Error
	if err == nil {
		return &a, nil
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	now := time.Now()
	a = appdb.Assessment{
		ApplicationID: applicationID, TrackType: trackType, Status: "in_progress",
		StartedAt: &now, ProctoringFlags: json.RawMessage("[]"),
	}
	if err := h.db.WithContext(ctx).Create(&a).Error; err != nil {
		return nil, err
	}
	return &a, nil
}

func (h *Handler) appendProctoringFlag(ctx context.Context, applicationID string, reason *string) error {
	a, err := h.getOrCreateAssessment(ctx, applicationID, "ai_interview")
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

// preScreenPassThreshold: diubah ke 0.0 agar kandidat tidak pernah diblokir
// dari wawancara AI (evaluasi final dilakukan setelah wawancara selesai).
const preScreenPassThreshold = 0.0

func (h *Handler) preScreenPassed(ctx context.Context, applicationID string) bool {
	var a appdb.Assessment
	err := h.db.WithContext(ctx).Where("application_id = ? AND track_type = ?", applicationID, "pre_screening").First(&a).Error
	if err != nil {
		return false
	}
	return a.Status == "completed" && a.Score != nil && *a.Score >= preScreenPassThreshold
}

type preScreenQuestionsResponse struct {
	Questions []string `json:"questions"`
}

func (h *Handler) handlePreScreenQuestions(w http.ResponseWriter, r *http.Request) {
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}
	if !h.ensureAIConfigured(w) {
		return
	}
	ctx := r.Context()

	cvSummary := ""
	var cvParse appdb.CVParseResult
	if err := h.db.WithContext(ctx).Where("application_id = ?", appRow.ID).First(&cvParse).Error; err == nil {
		var parsed aiengine.ParseCVResponse
		if json.Unmarshal([]byte(cvParse.ParsedJSON), &parsed) == nil {
			cvSummary = parsed.Summary
		}
	}

	resp, err := h.aiClient.GeneratePreScreenQuestions(ctx, aiengine.GeneratePreScreenQuestionsRequest{
		JobTitle:       appRow.Job.Title,
		JobDescription: appRow.Job.Description,
		CVSummary:      cvSummary,
	})
	if err != nil {
		httpx.WriteError(w, http.StatusBadGateway, "ai_error", "gagal generate pertanyaan screening awal")
		return
	}
	httpx.WriteJSON(w, http.StatusOK, preScreenQuestionsResponse{Questions: resp.Questions})
}

type preScreenSubmitRequest struct {
	Responses []aiengine.ValidationAnswer `json:"responses" validate:"required,min=1"`
}

type preScreenResultResponse struct {
	Passed bool    `json:"passed"`
	Score  float64 `json:"score"`
}

func (h *Handler) handlePreScreenSubmit(w http.ResponseWriter, r *http.Request) {
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}
	var req preScreenSubmitRequest
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

	assessment, err := h.getOrCreateAssessment(ctx, appRow.ID, "pre_screening")
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal simpan screening awal")
		return
	}
	for i, resp := range req.Responses {
		item := appdb.AssessmentItem{
			AssessmentID: assessment.ID, QuestionText: resp.Question,
			CandidateAnswer: &resp.Answer, OrderIndex: i,
		}
		if err := h.db.WithContext(ctx).Create(&item).Error; err != nil {
			httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal simpan jawaban screening awal")
			return
		}
	}

	scoreResp, err := h.aiClient.ScoreValidation(ctx, aiengine.ScoreValidationRequest{
		ApplicationID: appRow.ID, Responses: req.Responses, Competencies: []string{"Kualifikasi Dasar", "Relevansi Pengalaman"},
	})
	if err != nil {
		httpx.WriteError(w, http.StatusBadGateway, "ai_error", "gagal nilai screening awal")
		return
	}

	now := time.Now()
	score := scoreResp.RecommendationScore
	if err := h.db.WithContext(ctx).Model(&appdb.Assessment{}).Where("id = ?", assessment.ID).Updates(map[string]any{
		"score": score, "status": "completed", "completed_at": now,
	}).Error; err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal simpan hasil screening awal")
		return
	}

	httpx.WriteJSON(w, http.StatusOK, preScreenResultResponse{Passed: score >= preScreenPassThreshold, Score: score})
}

type preScreenItemResponse struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
}

type preScreenGetResponse struct {
	Status string                  `json:"status"`
	Score  *float64                `json:"score"`
	Items  []preScreenItemResponse `json:"items"`
}

func (h *Handler) handleGetPreScreen(w http.ResponseWriter, r *http.Request) {
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}
	ctx := r.Context()

	var assessment appdb.Assessment
	if err := h.db.WithContext(ctx).Where("application_id = ? AND track_type = ?", appRow.ID, "pre_screening").First(&assessment).Error; err != nil {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "belum ada screening awal")
		return
	}
	var items []appdb.AssessmentItem
	h.db.WithContext(ctx).Where("assessment_id = ?", assessment.ID).Order("order_index ASC").Find(&items)

	itemResp := make([]preScreenItemResponse, 0, len(items))
	for _, it := range items {
		answer := ""
		if it.CandidateAnswer != nil {
			answer = *it.CandidateAnswer
		}
		itemResp = append(itemResp, preScreenItemResponse{Question: it.QuestionText, Answer: answer})
	}
	httpx.WriteJSON(w, http.StatusOK, preScreenGetResponse{Status: assessment.Status, Score: assessment.Score, Items: itemResp})
}

type interviewQuestionsResponse struct {
	Questions []string `json:"questions"`
}

func (h *Handler) handleInterviewQuestions(w http.ResponseWriter, r *http.Request) {
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}
	ctx := r.Context()
	if !h.preScreenPassed(ctx, appRow.ID) {
		httpx.WriteError(w, http.StatusForbidden, "prescreen_required", "selesaikan screening awal dulu sebelum mulai wawancara AI")
		return
	}
	if !h.ensureAIConfigured(w) {
		return
	}

	var cvSummary *string
	var parseResult appdb.CVParseResult
	if err := h.db.WithContext(ctx).Where("application_id = ?", appRow.ID).First(&parseResult).Error; err == nil {
		var parsed aiengine.ParseCVResponse
		if json.Unmarshal([]byte(parseResult.ParsedJSON), &parsed) == nil && parsed.Summary != "" {
			cvSummary = &parsed.Summary
		}
	}

	// Sertakan judul + requirements (bukan cuma description) biar AI punya
	// konteks cukup dan gak ngarang pertanyaan di luar bidang posisi.
	jobDescription := appRow.Job.Description
	if appRow.Job.Requirements != nil && *appRow.Job.Requirements != "" {
		jobDescription += "\n\nKualifikasi: " + *appRow.Job.Requirements
	}
	resp, err := h.aiClient.GenerateQuestions(ctx, aiengine.GenerateQuestionsRequest{
		JobTitle: appRow.Job.Title, JobDescription: jobDescription, CVSummary: cvSummary,
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

	assessment, err := h.getOrCreateAssessment(ctx, appRow.ID, "ai_interview")
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
		
		var competencies []string
		if appRow.Job != nil {
			if appRow.Job.RequiredSkills != nil {
				var reqSkills []string
				if err := json.Unmarshal([]byte(*appRow.Job.RequiredSkills), &reqSkills); err == nil {
					competencies = append(competencies, reqSkills...)
				}
			}
			if appRow.Job.PreferredSkills != nil {
				var prefSkills []string
				if err := json.Unmarshal([]byte(*appRow.Job.PreferredSkills), &prefSkills); err == nil {
					competencies = append(competencies, prefSkills...)
				}
			}
		}

		scoreResp, err := h.aiClient.ScoreValidation(ctx, aiengine.ScoreValidationRequest{
			ApplicationID: appRow.ID, 
			Responses: responses,
			Competencies: competencies,
		})
		if err != nil {
			log.Printf("[application] gagal score-validation buat lamaran %s: %v", appRow.ID, err)
		} else {
			now := time.Now()
			score := scoreResp.RecommendationScore
			
			compScoresJSON, _ := json.Marshal(scoreResp.CompetencyScores)
			
			h.db.WithContext(ctx).Model(&assessment).Updates(map[string]any{
				"score": score, 
				"status": "completed", 
				"completed_at": now,
				"competency_scores": string(compScoresJSON),
				"evidence_confidence": scoreResp.EvidenceConfidence,
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
	// Kabarin HRD pemilik lowongan bahwa ada kandidat yang baru rampung
	// wawancara AI -- biar muncul di lonceng notifikasi & bisa segera ditinjau.
	if appRow.Job != nil {
		candidateName := "Seorang kandidat"
		if appRow.Candidate != nil && appRow.Candidate.FullName != "" {
			candidateName = appRow.Candidate.FullName
		}
		h.notifyJobOwner(ctx, appRow.Job.CreatedBy, "interview_completed",
			"Kandidat selesai wawancara AI",
			fmt.Sprintf("%s baru aja menyelesaikan wawancara AI untuk posisi %s. Yuk tinjau hasilnya.", candidateName, appRow.Job.Title))
	}

	resp.Application = toApplicationResponse(*appRow)
	httpx.WriteJSON(w, http.StatusOK, resp)
}

// notifyJobOwner bikin notifikasi in-app buat HRD pemilik lowongan.
// Job.CreatedBy itu hrd_users.id, sedangkan notifikasi dikunci ke users.id --
// jadi perlu resolve dulu. Best-effort: gagal resolve/create gak ngerusak
// alur utama.
func (h *Handler) notifyJobOwner(ctx context.Context, hrdUserID, notifType, title, body string) {
	if hrdUserID == "" {
		return
	}
	var hrd appdb.HrdUser
	if err := h.db.WithContext(ctx).First(&hrd, "id = ?", hrdUserID).Error; err != nil {
		log.Printf("[application] gagal resolve pemilik lowongan %s buat notifikasi: %v", hrdUserID, err)
		return
	}
	if err := notification.Create(ctx, h.db, hrd.UserID, notifType, title, body); err != nil {
		log.Printf("[application] gagal bikin notifikasi HRD %s: %v", hrd.UserID, err)
	}
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
	CompetencyScores    map[string]float64      `json:"competencyScores,omitempty"`
	EvidenceConfidence  *string                 `json:"evidenceConfidence,omitempty"`
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
	
	var competencyScores map[string]float64
	_ = json.Unmarshal(assessment.CompetencyScores, &competencyScores)

	httpx.WriteJSON(w, http.StatusOK, interviewResultResponse{
		Status:              assessment.Status, 
		RecommendationScore: assessment.Score, 
		CompetencyScores:    competencyScores,
		EvidenceConfidence:  assessment.EvidenceConfidence,
		Items:               itemResp, 
		ProctoringFlags:     flags,
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
		return "Sedang Wawancara Teknis"
	case "interview_completed":
		return "Sudah Wawancara Teknis"
	case "accepted":
		return "Diterima"
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

func derefStr(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}
