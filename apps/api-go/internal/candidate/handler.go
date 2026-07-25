// Package candidate menangani profil kandidat: baca & update biodata,
// tentang saya, pengalaman kerja, pendidikan, tautan sosial, dan skill.
package candidate

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"

	appdb "github.com/adyuta447/direkrut-ai/api-go/internal/db"
	"github.com/adyuta447/direkrut-ai/api-go/internal/httpx"
	appmw "github.com/adyuta447/direkrut-ai/api-go/internal/middleware"
	"github.com/adyuta447/direkrut-ai/api-go/internal/storage"
)

var validate = validator.New()

type Handler struct {
	db          *gorm.DB
	storage     *storage.Storage
	requireAuth func(http.Handler) http.Handler
}

func NewHandler(gdb *gorm.DB, s *storage.Storage, requireAuth func(http.Handler) http.Handler) *Handler {
	return &Handler{db: gdb, storage: s, requireAuth: requireAuth}
}

func (h *Handler) Router() chi.Router {
	r := chi.NewRouter()
	r.Group(func(pr chi.Router) {
		pr.Use(h.requireAuth)
		pr.With(appmw.RequireRole("candidate")).Get("/me", h.handleGetMe)
		pr.With(appmw.RequireRole("candidate")).Put("/me", h.handleUpdateMe)
		pr.With(appmw.RequireRole("candidate")).Post("/me/cv-upload-url", h.handleCVUploadURL)
		pr.With(appmw.RequireRole("candidate")).Get("/me/cv-download-url", h.handleCVDownloadURL)
		pr.With(appmw.RequireRole("candidate")).Patch("/me/cv", h.handleSaveCV)
		pr.With(appmw.RequireRole("candidate")).Post("/me/confirm-interview", h.handleConfirmInterview)
	})
	return r
}

func (h *Handler) handleConfirmInterview(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok || claims.CandidateID == "" {
		httpx.WriteError(w, http.StatusForbidden, "forbidden", "unauthorized")
		return
	}

	// Find the most recent application in "interview" state
	var appRow appdb.Application
	err := h.db.WithContext(r.Context()).
		Where("candidate_id = ? AND status = ?", claims.CandidateID, "interview").
		Order("created_at desc").
		First(&appRow).Error
	if err != nil {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "Tidak ada undangan wawancara aktif.")
		return
	}

	// Change status to interview_confirmed
	txErr := h.db.WithContext(r.Context()).Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&appRow).Update("status", "interview_confirmed").Error; err != nil {
			return err
		}
		
		fromStatus := "interview"
		note := "Kandidat telah mengonfirmasi kehadiran wawancara."
		history := appdb.ApplicationStatusHistory{
			ApplicationID: appRow.ID,
			FromStatus:    &fromStatus,
			ToStatus:      "interview_confirmed",
			ChangedBy:     &claims.UserID,
			Note:          &note,
		}
		return tx.Create(&history).Error
	})
	if txErr != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "Gagal konfirmasi kehadiran")
		return
	}

	httpx.WriteJSON(w, http.StatusOK, map[string]string{"message": "Kehadiran dikonfirmasi"})
}

type experienceItem struct {
	ID          string `json:"id"`
	Role        string `json:"role"`
	Company     string `json:"company"`
	StartDate   string `json:"startDate"`
	EndDate     string `json:"endDate"`
	Description string `json:"description"`
}

type educationItem struct {
	ID        string `json:"id"`
	School    string `json:"school"`
	Degree    string `json:"degree"`
	StartYear string `json:"startYear"`
	EndYear   string `json:"endYear"`
}

type linkItem struct {
	ID       string `json:"id"`
	Platform string `json:"platform"`
	URL      string `json:"url"`
}

type profileResponse struct {
	Name       string           `json:"name"`
	Phone      string           `json:"phone,omitempty"`
	Location   string           `json:"location,omitempty"`
	Age        *int             `json:"age,omitempty"`
	Gender     string           `json:"gender,omitempty"`
	About      string           `json:"about,omitempty"`
	PhotoURL   string           `json:"photoUrl,omitempty"`
	CoverURL   string           `json:"coverUrl,omitempty"`
	CvFileURL  string           `json:"cvFileUrl,omitempty"`
	Experience []experienceItem `json:"experience"`
	Education  []educationItem  `json:"education"`
	Links      []linkItem       `json:"links"`
	Skills     []string         `json:"skills"`
}

func toProfileResponse(c appdb.Candidate, skills []string) profileResponse {
	return profileResponse{
		Name: c.FullName, Phone: derefStr(c.Phone), Location: derefStr(c.Location),
		Age: c.Age, Gender: derefStr(c.Gender), About: derefStr(c.About),
		PhotoURL:   derefStr(c.PhotoURL),
		CoverURL:   derefStr(c.CoverURL),
		CvFileURL:  derefStr(c.CvFileURL),
		Experience: unmarshalOrEmpty[experienceItem](c.Experience),
		Education:  unmarshalOrEmpty[educationItem](c.Education),
		Links:      unmarshalOrEmpty[linkItem](c.Links),
		Skills:     skills,
	}
}

func unmarshalOrEmpty[T any](raw json.RawMessage) []T {
	items := []T{}
	if len(raw) > 0 {
		_ = json.Unmarshal(raw, &items)
	}
	if items == nil {
		items = []T{}
	}
	return items
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

func (h *Handler) loadSkillNames(ctx context.Context, candidateID string) ([]string, error) {
	names := []string{}
	err := h.db.WithContext(ctx).
		Table("candidate_skills").
		Select("skills.name").
		Joins("JOIN skills ON skills.id = candidate_skills.skill_id").
		Where("candidate_skills.candidate_id = ?", candidateID).
		Order("skills.name").
		Scan(&names).Error
	return names, err
}

func (h *Handler) handleGetMe(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok || claims.CandidateID == "" {
		httpx.WriteError(w, http.StatusForbidden, "forbidden", "akun kandidat ini belum lengkap")
		return
	}
	ctx := r.Context()

	var c appdb.Candidate
	if err := h.db.WithContext(ctx).First(&c, "id = ?", claims.CandidateID).Error; err != nil {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "profil kandidat gak ditemukan")
		return
	}
	skills, err := h.loadSkillNames(ctx, c.ID)
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal ambil skill")
		return
	}
	httpx.WriteJSON(w, http.StatusOK, toProfileResponse(c, skills))
}

type updateProfileRequest struct {
	Name       string           `json:"name" validate:"required,min=2,max=120"`
	Phone      string           `json:"phone"`
	Location   string           `json:"location"`
	Age        *int             `json:"age"`
	Gender     string           `json:"gender"`
	About      string           `json:"about"`
	PhotoURL   string           `json:"photoUrl"`
	CoverURL   string           `json:"coverUrl"`
	Experience []experienceItem `json:"experience"`
	Education  []educationItem  `json:"education"`
	Links      []linkItem       `json:"links"`
	Skills     []string         `json:"skills"`
}

// handleUpdateMe: full-replace semantics (sama kayak PUT /v1/jobs/{id}) --
// kirim seluruh profil tiap kali simpan, bukan PATCH per-field. Skills
// disinkron ke tabel candidate_skills/skills yang emang udah ada (biar
// nanti bisa dicari lintas kandidat), bukan ikut disimpan sbg JSON.
func (h *Handler) handleUpdateMe(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok || claims.CandidateID == "" {
		httpx.WriteError(w, http.StatusForbidden, "forbidden", "akun kandidat ini belum lengkap")
		return
	}

	var req updateProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}
	if err := validate.Struct(req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "validation_failed", httpx.ValidationMessage(err))
		return
	}
	if req.Experience == nil {
		req.Experience = []experienceItem{}
	}
	if req.Education == nil {
		req.Education = []educationItem{}
	}
	if req.Links == nil {
		req.Links = []linkItem{}
	}

	experienceJSON, _ := json.Marshal(req.Experience)
	educationJSON, _ := json.Marshal(req.Education)
	linksJSON, _ := json.Marshal(req.Links)

	ctx := r.Context()
	txErr := h.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		candidateUpdate := appdb.Candidate{
			FullName: req.Name, Phone: nilIfEmpty(req.Phone), Location: nilIfEmpty(req.Location),
			Age: req.Age, Gender: nilIfEmpty(req.Gender), About: nilIfEmpty(req.About),
			PhotoURL: nilIfEmpty(req.PhotoURL), CoverURL: nilIfEmpty(req.CoverURL),
			Experience: experienceJSON, Education: educationJSON, Links: linksJSON,
		}
		if err := tx.Model(&appdb.Candidate{}).Where("id = ?", claims.CandidateID).
			Select("full_name", "phone", "location", "age", "gender", "about", "photo_url", "cover_url", "experience", "education", "links").
			Updates(&candidateUpdate).Error; err != nil {
			return err
		}

		if err := tx.Where("candidate_id = ?", claims.CandidateID).Delete(&appdb.CandidateSkill{}).Error; err != nil {
			return err
		}
		for _, name := range req.Skills {
			name = strings.TrimSpace(name)
			if name == "" {
				continue
			}
			var skill appdb.Skill
			if err := tx.Where("name = ?", name).FirstOrCreate(&skill, appdb.Skill{Name: name}).Error; err != nil {
				return err
			}
			link := appdb.CandidateSkill{CandidateID: claims.CandidateID, SkillID: skill.ID, Proficiency: "intermediate"}
			if err := tx.Create(&link).Error; err != nil {
				return err
			}
		}
		return nil
	})
	if txErr != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal simpan profil")
		return
	}

	var c appdb.Candidate
	if err := h.db.WithContext(ctx).First(&c, "id = ?", claims.CandidateID).Error; err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal ambil profil terbaru")
		return
	}
	skills, _ := h.loadSkillNames(ctx, c.ID)
	httpx.WriteJSON(w, http.StatusOK, toProfileResponse(c, skills))
}

type cvUploadURLRequest struct {
	Ext string `json:"ext" validate:"required,oneof=pdf jpg jpeg png"`
}

// handleCVUploadURL: presigned PUT buat CV kandidat, mirip persis pola
// company.handleDocumentUploadURL -- objectKey per-candidate (bukan
// per-lamaran), karena CV ini reusable lintas lamaran; AI screening
// (internal/application handleScreen) baca dari Candidate.CvFileURL yang
// diisi handleSaveCV di bawah.
func (h *Handler) handleCVUploadURL(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok || claims.CandidateID == "" {
		httpx.WriteError(w, http.StatusForbidden, "forbidden", "akun kandidat ini belum lengkap")
		return
	}

	var req cvUploadURLRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}
	if err := validate.Struct(req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "validation_failed", httpx.ValidationMessage(err))
		return
	}

	objectKey := fmt.Sprintf("cv/%s/%d.%s", claims.CandidateID, time.Now().UnixNano(), req.Ext)
	uploadURL, err := h.storage.PresignPutCV(r.Context(), objectKey, 10*time.Minute)
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal buat upload URL")
		return
	}
	httpx.WriteJSON(w, http.StatusOK, map[string]string{
		"uploadUrl": uploadURL,
		"objectKey": objectKey,
	})
}

func (h *Handler) handleCVDownloadURL(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok || claims.CandidateID == "" {
		httpx.WriteError(w, http.StatusForbidden, "forbidden", "akun kandidat ini belum lengkap")
		return
	}

	var c appdb.Candidate
	if err := h.db.WithContext(r.Context()).Select("cv_file_url").First(&c, "id = ?", claims.CandidateID).Error; err != nil {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "profil kandidat gak ditemukan")
		return
	}

	if c.CvFileURL == nil || *c.CvFileURL == "" {
		httpx.WriteError(w, http.StatusNotFound, "no_cv", "Kandidat belum mengunggah CV")
		return
	}

	downloadURL, err := h.storage.PresignGetObject(r.Context(), *c.CvFileURL, 1*time.Hour)
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal buat download URL")
		return
	}

	httpx.WriteJSON(w, http.StatusOK, map[string]string{
		"downloadUrl": downloadURL,
	})
}

type saveCVRequest struct {
	ObjectKey string `json:"objectKey" validate:"required,max=500"`
}

func (h *Handler) handleSaveCV(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok || claims.CandidateID == "" {
		httpx.WriteError(w, http.StatusForbidden, "forbidden", "akun kandidat ini belum lengkap")
		return
	}

	var req saveCVRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}
	if err := validate.Struct(req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "validation_failed", httpx.ValidationMessage(err))
		return
	}

	if err := h.db.WithContext(r.Context()).Model(&appdb.Candidate{}).
		Where("id = ?", claims.CandidateID).Update("cv_file_url", req.ObjectKey).Error; err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal simpan CV")
		return
	}
	httpx.WriteJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}
