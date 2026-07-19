// Package application menangani lamaran kandidat ke lowongan: submit oleh
// kandidat, listing/detail buat kandidat (punya sendiri) & HRD (lowongan
// yang dia buat), dan update status oleh HRD.
package application

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"

	appdb "github.com/adyuta447/direkrut-ai/api-go/internal/db"
	"github.com/adyuta447/direkrut-ai/api-go/internal/httpx"
	appmw "github.com/adyuta447/direkrut-ai/api-go/internal/middleware"
	"github.com/adyuta447/direkrut-ai/api-go/internal/notification"
)

var validate = validator.New()

type Handler struct {
	db          *gorm.DB
	requireAuth func(http.Handler) http.Handler
}

// ponytail: no cache-aside di domain ini -- data privat per-user, bukan
// listing publik bertrafik tinggi kayak jobs. Tambahin cache-aside kalau
// profiling nunjukin perlu.
func NewHandler(gdb *gorm.DB, requireAuth func(http.Handler) http.Handler) *Handler {
	return &Handler{db: gdb, requireAuth: requireAuth}
}

func (h *Handler) Router() chi.Router {
	r := chi.NewRouter()
	r.Group(func(pr chi.Router) {
		pr.Use(h.requireAuth)
		pr.With(appmw.RequireRole("candidate")).Post("/", h.handleSubmitApplication)
		pr.Get("/", h.handleListApplications)
		pr.Get("/{applicationID}", h.handleGetApplication)
		pr.With(appmw.RequireRole("hrd")).Patch("/{applicationID}/status", h.handleUpdateStatus)
		pr.With(appmw.RequireRole("candidate")).Post("/{applicationID}/complete-interview", h.handleCompleteInterview)
	})
	return r
}

type applicationResponse struct {
	ID            string    `json:"id"`
	JobID         string    `json:"jobId"`
	JobTitle      string    `json:"jobTitle,omitempty"`
	CompanyName   string    `json:"companyName,omitempty"`
	CandidateID   string    `json:"candidateId"`
	CandidateName string    `json:"candidateName,omitempty"`
	Status        string    `json:"status"`
	AppliedAt     time.Time `json:"appliedAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
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
	httpx.WriteJSON(w, http.StatusCreated, toApplicationResponse(appRow))
}

func (h *Handler) handleListApplications(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok {
		httpx.WriteError(w, http.StatusUnauthorized, "unauthorized", "missing auth context")
		return
	}
	ctx := r.Context()
	query := h.db.WithContext(ctx).Model(&appdb.Application{}).Preload("Job.Company").Preload("Candidate")

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
	if err := h.db.WithContext(r.Context()).Preload("Job.Company").Preload("Candidate").First(&appRow, "id = ?", appID).Error; err != nil {
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
	// Notifikasi kandidat -- gagal nulis notifikasi gak boleh gagalin update
	// status-nya sendiri (udah kepake), jadi errornya cuma di-log via
	// httpx nanti kalau ada logger; di sini sengaja diabaikan (best-effort).
	if appRow.Candidate != nil && appRow.Job != nil {
		companyName := ""
		if appRow.Job.Company != nil {
			companyName = appRow.Job.Company.Name
		}
		title := "Status lamaran diperbarui"
		body := fmt.Sprintf("Lamaranmu untuk %s di %s sekarang: %s", appRow.Job.Title, companyName, statusLabel(req.Status))
		_ = notification.Create(ctx, h.db, appRow.Candidate.UserID, "application_status", title, body)
	}
	httpx.WriteJSON(w, http.StatusOK, toApplicationResponse(*appRow))
}

// handleCompleteInterview dipanggil kandidat sendiri begitu sesi wawancara AI
// (simulasi client-side di /interview/[jobId]) kelar -- ini satu-satunya titik
// di mana penyelesaian wawancara nyampe ke backend, jadi dashboard HRD (yang
// baca ulang /v1/applications) akhirnya lihat lamaran pindah dari "submitted"
// ke "under-review". Idempotent: dipanggil lagi pas status udah lewat
// "submitted" cuma balikin state sekarang, gak error.
func (h *Handler) handleCompleteInterview(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok {
		httpx.WriteError(w, http.StatusUnauthorized, "unauthorized", "missing auth context")
		return
	}
	appRow, ok := h.loadVisibleApplication(w, r)
	if !ok {
		return
	}

	if appRow.Status != "submitted" {
		httpx.WriteJSON(w, http.StatusOK, toApplicationResponse(*appRow))
		return
	}

	ctx := r.Context()
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
	httpx.WriteJSON(w, http.StatusOK, toApplicationResponse(*appRow))
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
