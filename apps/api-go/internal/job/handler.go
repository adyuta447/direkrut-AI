// Package job menangani manajemen lowongan: CRUD posting lowongan oleh
// HRD, dan listing/pencarian lowongan buat kandidat di portal publik.
package job

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"

	appcache "github.com/adyuta447/direkrut-ai/api-go/internal/cache"
	appdb "github.com/adyuta447/direkrut-ai/api-go/internal/db"
	"github.com/adyuta447/direkrut-ai/api-go/internal/httpx"
	appmw "github.com/adyuta447/direkrut-ai/api-go/internal/middleware"
	"github.com/adyuta447/direkrut-ai/api-go/internal/storage"
)

var validate = validator.New()

type Handler struct {
	db          *gorm.DB
	cache       *appcache.Cache
	storage     *storage.Storage
	requireAuth func(http.Handler) http.Handler
}

func NewHandler(gdb *gorm.DB, c *appcache.Cache, s *storage.Storage, requireAuth func(http.Handler) http.Handler) *Handler {
	return &Handler{db: gdb, cache: c, storage: s, requireAuth: requireAuth}
}

func (h *Handler) Router() chi.Router {
	r := chi.NewRouter()
	r.Get("/", h.handleListJobs)
	r.Get("/{jobID}", h.handleGetJob)

	r.Group(func(pr chi.Router) {
		pr.Use(h.requireAuth)
		pr.With(appmw.RequireRole("hrd")).Get("/mine", h.handleListMyJobs)
		pr.With(appmw.RequireRole("hrd")).Post("/", h.handleCreateJob)
		pr.With(appmw.RequireRole("hrd")).Put("/{jobID}", h.handleUpdateJob)
		pr.With(appmw.RequireRole("hrd")).Delete("/{jobID}", h.handleDeleteJob)
		pr.With(appmw.RequireRole("candidate")).Post("/{jobID}/cv-upload-url", h.handleCVUploadURL)
		// Konfigurasi bobot AI scoring per-lowongan
		pr.With(appmw.RequireRole("hrd")).Get("/{jobID}/scoring-weights", h.handleGetJobScoringWeights)
		pr.With(appmw.RequireRole("hrd")).Put("/{jobID}/scoring-weights", h.handlePutJobScoringWeights)
	})

	return r
}

type jobResponse struct {
	ID              string     `json:"id"`
	CompanyID       string     `json:"companyId"`
	CompanyName     string     `json:"companyName,omitempty"`
	CompanyIndustry string     `json:"companyIndustry,omitempty"`
	Title           string     `json:"title"`
	Department      string     `json:"department"`
	Description     string     `json:"description"`
	Requirements    string     `json:"requirements,omitempty"`
	Location        string     `json:"location,omitempty"`
	EmploymentType  string     `json:"employmentType"`
	SalaryMin       *int64     `json:"salaryMin,omitempty"`
	SalaryMax       *int64     `json:"salaryMax,omitempty"`
	Status          string     `json:"status"`
	PublishedAt     *time.Time `json:"publishedAt,omitempty"`
	CreatedAt       time.Time  `json:"createdAt"`
	// Field terstruktur untuk AI Evidence-Based Scoring
	RequiredSkills       []string `json:"requiredSkills,omitempty"`
	PreferredSkills      []string `json:"preferredSkills,omitempty"`
	KeyResponsibilities  string   `json:"keyResponsibilities,omitempty"`
	MinExperienceYears   int      `json:"minExperienceYears"`
	EducationRequirement string   `json:"educationRequirement,omitempty"`
	CandidateType        string   `json:"candidateType"`
	ApplicantCount       int64    `json:"applicantCount"`
}

func toJobResponse(j appdb.Job) jobResponse {
	resp := jobResponse{
		ID: j.ID, CompanyID: j.CompanyID, Title: j.Title, Department: j.Department, Description: j.Description,
		Requirements: derefStr(j.Requirements), Location: derefStr(j.Location),
		EmploymentType: j.EmploymentType, SalaryMin: j.SalaryMin, SalaryMax: j.SalaryMax,
		Status: j.Status, PublishedAt: j.PublishedAt, CreatedAt: j.CreatedAt,
		CandidateType: j.CandidateType,
	}
	if j.MinExperienceYears != nil {
		resp.MinExperienceYears = *j.MinExperienceYears
	}
	if j.KeyResponsibilities != nil {
		resp.KeyResponsibilities = *j.KeyResponsibilities
	}
	if j.EducationRequirement != nil {
		resp.EducationRequirement = *j.EducationRequirement
	}
	if j.RequiredSkills != nil && *j.RequiredSkills != "" {
		_ = json.Unmarshal([]byte(*j.RequiredSkills), &resp.RequiredSkills)
	}
	if j.PreferredSkills != nil && *j.PreferredSkills != "" {
		_ = json.Unmarshal([]byte(*j.PreferredSkills), &resp.PreferredSkills)
	}
	if j.Company != nil {
		resp.CompanyName = j.Company.Name
		resp.CompanyIndustry = derefStr(j.Company.Industry)
	}
	return resp
}

func derefStr(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}

func nilIfEmpty(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

func normalizeDepartment(s string) string {
	if department := strings.TrimSpace(s); department != "" {
		return department
	}
	return "Umum"
}

// skillsJSON serialize slice skill ke JSON array string -- SELALU balikin
// "[]" (bukan NULL) kalau kosong, biar konsisten sama DEFAULT kolomnya dan
// gak numpuk NULL yang bikin ai-engine nolak request (dia butuh list, bukan
// null) begitu nilai ini di-unmarshal ulang buat dikirim ke MatchCandidate.
func skillsJSON(skills []string) *string {
	if skills == nil {
		skills = []string{}
	}
	b, _ := json.Marshal(skills)
	s := string(b)
	return &s
}

type jobListResponse struct {
	Items      []jobResponse `json:"items"`
	NextCursor string        `json:"nextCursor,omitempty"`
}

func (h *Handler) handleListJobs(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	limit := 20
	if l := r.URL.Query().Get("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 && parsed <= 100 {
			limit = parsed
		}
	}
	cursorParam := r.URL.Query().Get("cursor")
	location := r.URL.Query().Get("location")
	employmentType := r.URL.Query().Get("type")

	version, _ := h.cache.GetVersion(ctx, "jobs:list:version")
	cacheKey := fmt.Sprintf("jobs:list:v%d:loc=%s:type=%s:cursor=%s:limit=%d",
		version, location, employmentType, cursorParam, limit)

	if cached, found, err := appcache.GetJSON[jobListResponse](ctx, h.cache, cacheKey); err == nil && found {
		w.Header().Set("Cache-Control", "public, max-age=60")
		httpx.WriteJSON(w, http.StatusOK, cached)
		return
	}

	query := h.db.WithContext(ctx).Model(&appdb.Job{}).Preload("Company").Where("status = ?", "published")
	if location != "" {
		query = query.Where("location = ?", location)
	}
	if employmentType != "" {
		query = query.Where("employment_type = ?", employmentType)
	}
	if cursorParam != "" {
		if publishedAt, id, err := decodeCursor(cursorParam); err == nil {
			query = query.Where("(published_at, id) < (?, ?)", publishedAt, id)
		}
	}

	var jobs []appdb.Job
	if err := query.Order("published_at DESC, id DESC").Limit(limit + 1).Find(&jobs).Error; err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal ambil daftar lowongan")
		return
	}

	var nextCursor string
	if len(jobs) > limit {
		last := jobs[limit-1]
		if last.PublishedAt != nil {
			nextCursor = encodeCursor(*last.PublishedAt, last.ID)
		}
		jobs = jobs[:limit]
	}

	resp := jobListResponse{Items: make([]jobResponse, 0, len(jobs)), NextCursor: nextCursor}
	for _, j := range jobs {
		resp.Items = append(resp.Items, toJobResponse(j))
	}

	_ = appcache.SetJSON(ctx, h.cache, cacheKey, resp, 60*time.Second)
	w.Header().Set("Cache-Control", "public, max-age=60")
	httpx.WriteJSON(w, http.StatusOK, resp)
}

func (h *Handler) applicantCountsByJob(ctx context.Context, jobIDs []string) (map[string]int64, error) {
	counts := make(map[string]int64, len(jobIDs))
	if len(jobIDs) == 0 {
		return counts, nil
	}
	var rows []struct {
		JobID string
		Count int64
	}
	if err := h.db.WithContext(ctx).Model(&appdb.Application{}).
		Select("job_id, COUNT(*) as count").
		Where("job_id IN ?", jobIDs).
		Group("job_id").
		Scan(&rows).Error; err != nil {
		return nil, err
	}
	for _, row := range rows {
		counts[row.JobID] = row.Count
	}
	return counts, nil
}

func (h *Handler) handleListMyJobs(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok || claims.CompanyID == "" {
		httpx.WriteError(w, http.StatusForbidden, "forbidden", "akun HRD ini belum terhubung ke perusahaan")
		return
	}
	ctx := r.Context()

	var jobs []appdb.Job
	if err := h.db.WithContext(ctx).Preload("Company").
		Where("company_id = ?", claims.CompanyID).
		Order("created_at DESC").Find(&jobs).Error; err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal ambil daftar lowongan")
		return
	}

	jobIDs := make([]string, 0, len(jobs))
	for _, j := range jobs {
		jobIDs = append(jobIDs, j.ID)
	}
	counts, err := h.applicantCountsByJob(ctx, jobIDs)
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal ambil jumlah pelamar")
		return
	}

	resp := jobListResponse{Items: make([]jobResponse, 0, len(jobs))}
	for _, j := range jobs {
		item := toJobResponse(j)
		item.ApplicantCount = counts[j.ID]
		resp.Items = append(resp.Items, item)
	}
	httpx.WriteJSON(w, http.StatusOK, resp)
}

func encodeCursor(t time.Time, id string) string {
	raw := t.Format(time.RFC3339Nano) + "_" + id
	return base64.RawURLEncoding.EncodeToString([]byte(raw))
}

func decodeCursor(s string) (time.Time, string, error) {
	raw, err := base64.RawURLEncoding.DecodeString(s)
	if err != nil {
		return time.Time{}, "", err
	}
	parts := strings.SplitN(string(raw), "_", 2)
	if len(parts) != 2 {
		return time.Time{}, "", errors.New("job: malformed cursor")
	}
	t, err := time.Parse(time.RFC3339Nano, parts[0])
	if err != nil {
		return time.Time{}, "", err
	}
	return t, parts[1], nil
}

func (h *Handler) handleGetJob(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	jobID := chi.URLParam(r, "jobID")
	cacheKey := "jobs:detail:" + jobID

	if cached, found, err := appcache.GetJSON[jobResponse](ctx, h.cache, cacheKey); err == nil && found {
		w.Header().Set("Cache-Control", "public, max-age=300")
		httpx.WriteJSON(w, http.StatusOK, cached)
		return
	}

	var jobRow appdb.Job
	if err := h.db.WithContext(ctx).Preload("Company").First(&jobRow, "id = ?", jobID).Error; err != nil {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "lowongan gak ditemukan")
		return
	}

	resp := toJobResponse(jobRow)
	_ = appcache.SetJSON(ctx, h.cache, cacheKey, resp, 5*time.Minute)
	w.Header().Set("Cache-Control", "public, max-age=300")
	httpx.WriteJSON(w, http.StatusOK, resp)
}

type jobWriteRequest struct {
	Title                string   `json:"title" validate:"required,min=3,max=200"`
	Department           string   `json:"department" validate:"omitempty,max=120"`
	Description          string   `json:"description" validate:"required,min=10"`
	Requirements         string   `json:"requirements"`
	Location             string   `json:"location"`
	EmploymentType       string   `json:"employmentType" validate:"required"`
	SalaryMin            *int64   `json:"salaryMin"`
	SalaryMax            *int64   `json:"salaryMax"`
	Status               string   `json:"status" validate:"required,oneof=draft published closed"`
	// Field terstruktur AI Evidence-Based Scoring
	RequiredSkills       []string `json:"requiredSkills"`
	PreferredSkills      []string `json:"preferredSkills"`
	KeyResponsibilities  string   `json:"keyResponsibilities"`
	MinExperienceYears   int      `json:"minExperienceYears"`
	EducationRequirement string   `json:"educationRequirement"`
	CandidateType        string   `json:"candidateType" validate:"omitempty,oneof=any fresh_graduate professional"`
}

func (h *Handler) invalidateListCache(ctx context.Context) {
	_, _ = h.cache.Incr(ctx, "jobs:list:version")
}

func (h *Handler) handleCreateJob(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok || claims.HrdUserID == "" || claims.CompanyID == "" {
		httpx.WriteError(w, http.StatusForbidden, "forbidden", "akun HRD ini belum terhubung ke perusahaan")
		return
	}

	var req jobWriteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}
	if err := validate.Struct(req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "validation_failed", httpx.ValidationMessage(err))
		return
	}

	ctx := r.Context()

	// Serialize skills arrays ke JSON -- selalu "[]" kalau kosong, jangan NULL
	// (lihat skillsJSON).
	requiredSkillsJSON := skillsJSON(req.RequiredSkills)
	preferredSkillsJSON := skillsJSON(req.PreferredSkills)
	candidateType := req.CandidateType
	if candidateType == "" {
		candidateType = "any"
	}
	minExp := req.MinExperienceYears

	jobRow := appdb.Job{
		CompanyID: claims.CompanyID, CreatedBy: claims.HrdUserID,
		Title: req.Title, Department: normalizeDepartment(req.Department), Description: req.Description,
		Requirements: nilIfEmpty(req.Requirements), Location: nilIfEmpty(req.Location),
		EmploymentType: req.EmploymentType, SalaryMin: req.SalaryMin, SalaryMax: req.SalaryMax,
		Status: req.Status,
		// Structured fields
		RequiredSkills:       requiredSkillsJSON,
		PreferredSkills:      preferredSkillsJSON,
		KeyResponsibilities:  nilIfEmpty(req.KeyResponsibilities),
		MinExperienceYears:   &minExp,
		EducationRequirement: nilIfEmpty(req.EducationRequirement),
		CandidateType:        candidateType,
	}
	if req.Status == "published" {
		now := time.Now()
		jobRow.PublishedAt = &now
	}

	if err := h.db.WithContext(ctx).Create(&jobRow).Error; err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal buat lowongan")
		return
	}

	h.invalidateListCache(ctx)
	httpx.WriteJSON(w, http.StatusCreated, toJobResponse(jobRow))
}

func (h *Handler) loadOwnedJob(w http.ResponseWriter, r *http.Request) (*appdb.Job, bool) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok {
		httpx.WriteError(w, http.StatusUnauthorized, "unauthorized", "missing auth context")
		return nil, false
	}
	jobID := chi.URLParam(r, "jobID")
	var jobRow appdb.Job
	if err := h.db.WithContext(r.Context()).Preload("Company").First(&jobRow, "id = ?", jobID).Error; err != nil {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "lowongan gak ditemukan")
		return nil, false
	}
	if jobRow.CreatedBy != claims.HrdUserID {
		httpx.WriteError(w, http.StatusForbidden, "forbidden", "bukan lowongan milikmu")
		return nil, false
	}
	return &jobRow, true
}

func (h *Handler) handleUpdateJob(w http.ResponseWriter, r *http.Request) {
	jobRow, ok := h.loadOwnedJob(w, r)
	if !ok {
		return
	}

	var req jobWriteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}
	if err := validate.Struct(req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "validation_failed", httpx.ValidationMessage(err))
		return
	}

	ctx := r.Context()

	// Serialize skills arrays ke JSON -- selalu "[]" kalau kosong, jangan NULL
	// (lihat skillsJSON).
	requiredSkillsJSON := skillsJSON(req.RequiredSkills)
	preferredSkillsJSON := skillsJSON(req.PreferredSkills)
	candidateType := req.CandidateType
	if candidateType == "" {
		candidateType = "any"
	}
	minExp := req.MinExperienceYears

	jobRow.Title = req.Title
	jobRow.Department = normalizeDepartment(req.Department)
	jobRow.Description = req.Description
	jobRow.Requirements = nilIfEmpty(req.Requirements)
	jobRow.Location = nilIfEmpty(req.Location)
	jobRow.EmploymentType = req.EmploymentType
	jobRow.SalaryMin = req.SalaryMin
	jobRow.SalaryMax = req.SalaryMax
	jobRow.RequiredSkills = requiredSkillsJSON
	jobRow.PreferredSkills = preferredSkillsJSON
	jobRow.KeyResponsibilities = nilIfEmpty(req.KeyResponsibilities)
	jobRow.MinExperienceYears = &minExp
	jobRow.EducationRequirement = nilIfEmpty(req.EducationRequirement)
	jobRow.CandidateType = candidateType
	if jobRow.Status != "published" && req.Status == "published" {
		now := time.Now()
		jobRow.PublishedAt = &now
	}
	jobRow.Status = req.Status

	if err := h.db.WithContext(ctx).Save(jobRow).Error; err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal update lowongan")
		return
	}

	h.invalidateListCache(ctx)
	_ = h.cache.Del(ctx, "jobs:detail:"+jobRow.ID)
	httpx.WriteJSON(w, http.StatusOK, toJobResponse(*jobRow))
}

func (h *Handler) handleDeleteJob(w http.ResponseWriter, r *http.Request) {
	jobRow, ok := h.loadOwnedJob(w, r)
	if !ok {
		return
	}

	ctx := r.Context()

	// Lowongan harus dinonaktifin dulu sebelum bisa dihapus -- cegah HRD gak
	// sengaja hapus lowongan yang masih aktif dilamar orang.
	if jobRow.Status != "closed" {
		httpx.WriteError(w, http.StatusConflict, "must_be_closed",
			"nonaktifin dulu lowongan ini sebelum dihapus")
		return
	}

	// Kalau udah pernah kedatangan lamaran, jangan hard-delete -- job_id di
	// tabel applications bakal jadi dangling reference dan riwayat lamaran
	// kandidat rusak. Cukup dibiarkan closed (arsip), gak perlu row baru
	// atau status baru buat "archived".
	var appCount int64
	if err := h.db.WithContext(ctx).Model(&appdb.Application{}).
		Where("job_id = ?", jobRow.ID).Count(&appCount).Error; err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal cek lamaran lowongan ini")
		return
	}
	if appCount > 0 {
		httpx.WriteError(w, http.StatusConflict, "has_applications",
			"lowongan ini udah pernah dilamar -- gak bisa dihapus permanen biar riwayat kandidat gak rusak, cukup dinonaktifkan aja")
		return
	}

	if err := h.db.WithContext(ctx).Delete(jobRow).Error; err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal hapus lowongan")
		return
	}

	h.invalidateListCache(ctx)
	_ = h.cache.Del(ctx, "jobs:detail:"+jobRow.ID)
	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) handleCVUploadURL(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok {
		httpx.WriteError(w, http.StatusUnauthorized, "unauthorized", "missing auth context")
		return
	}
	ctx := r.Context()
	jobID := chi.URLParam(r, "jobID")

	var jobRow appdb.Job
	if err := h.db.WithContext(ctx).First(&jobRow, "id = ?", jobID).Error; err != nil {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "lowongan gak ditemukan")
		return
	}

	objectKey := fmt.Sprintf("cv/%s/%s-%d.pdf", claims.UserID, jobID, time.Now().UnixNano())
	uploadURL, err := h.storage.PresignPutCV(ctx, objectKey, 10*time.Minute)
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal buat upload URL")
		return
	}

	httpx.WriteJSON(w, http.StatusOK, map[string]string{"uploadUrl": uploadURL, "objectKey": objectKey})
}

// --- Per-job scoring weight configuration ---

type jobScoringWeightsResp struct {
	WeightSkillMatch       float64 `json:"weightSkillMatch"`
	WeightExperience       float64 `json:"weightExperience"`
	WeightEducation        float64 `json:"weightEducation"`
	WeightResponsibilities float64 `json:"weightResponsibilities"`
	WeightAdditional       float64 `json:"weightAdditional"`
	IsCustom               bool    `json:"isCustom"`
}

type jobScoringWeightsReq struct {
	WeightSkillMatch       float64 `json:"weightSkillMatch" validate:"required,min=0,max=100"`
	WeightExperience       float64 `json:"weightExperience" validate:"required,min=0,max=100"`
	WeightEducation        float64 `json:"weightEducation" validate:"required,min=0,max=100"`
	WeightResponsibilities float64 `json:"weightResponsibilities" validate:"required,min=0,max=100"`
	WeightAdditional       float64 `json:"weightAdditional" validate:"required,min=0,max=100"`
}

func (h *Handler) handleGetJobScoringWeights(w http.ResponseWriter, r *http.Request) {
	jobRow, ok := h.loadOwnedJob(w, r)
	if !ok {
		return
	}

	var cfg appdb.JobScoringWeightConfig
	if err := h.db.WithContext(r.Context()).Where("job_id = ?", jobRow.ID).First(&cfg).Error; err != nil {
		// Belum ada konfigurasi khusus untuk job ini — kembalikan default
		httpx.WriteJSON(w, http.StatusOK, jobScoringWeightsResp{
			WeightSkillMatch: 35, WeightExperience: 25, WeightEducation: 10,
			WeightResponsibilities: 20, WeightAdditional: 10, IsCustom: false,
		})
		return
	}
	httpx.WriteJSON(w, http.StatusOK, jobScoringWeightsResp{
		WeightSkillMatch:       cfg.WeightSkillMatch,
		WeightExperience:       cfg.WeightExperience,
		WeightEducation:        cfg.WeightEducation,
		WeightResponsibilities: cfg.WeightResponsibilities,
		WeightAdditional:       cfg.WeightAdditional,
		IsCustom:               cfg.IsCustom,
	})
}

func (h *Handler) handlePutJobScoringWeights(w http.ResponseWriter, r *http.Request) {
	jobRow, ok := h.loadOwnedJob(w, r)
	if !ok {
		return
	}

	var req jobScoringWeightsReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body tidak valid")
		return
	}
	if err := validate.Struct(req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "validation_failed", httpx.ValidationMessage(err))
		return
	}

	total := req.WeightSkillMatch + req.WeightExperience + req.WeightEducation + req.WeightResponsibilities + req.WeightAdditional
	if total < 99.0 || total > 101.0 {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_weights", "total bobot harus = 100%")
		return
	}

	cfg := appdb.JobScoringWeightConfig{
		JobID:                  jobRow.ID,
		WeightSkillMatch:       req.WeightSkillMatch,
		WeightExperience:       req.WeightExperience,
		WeightEducation:        req.WeightEducation,
		WeightResponsibilities: req.WeightResponsibilities,
		WeightAdditional:       req.WeightAdditional,
		IsCustom:               true,
		UpdatedAt:              time.Now(),
	}

	ctx := r.Context()
	var existing appdb.JobScoringWeightConfig
	if h.db.WithContext(ctx).Where("job_id = ?", jobRow.ID).First(&existing).Error == nil {
		// Update existing
		h.db.WithContext(ctx).Model(&existing).Updates(map[string]any{
			"weight_skill_match": req.WeightSkillMatch, "weight_experience": req.WeightExperience,
			"weight_education": req.WeightEducation, "weight_responsibilities": req.WeightResponsibilities,
			"weight_additional": req.WeightAdditional, "is_custom": true, "updated_at": time.Now(),
		})
	} else {
		h.db.WithContext(ctx).Create(&cfg)
	}

	httpx.WriteJSON(w, http.StatusOK, map[string]any{"status": "ok", "isCustom": true})
}
