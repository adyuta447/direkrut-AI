// Package company menangani profil perusahaan milik HRD yang login --
// khususnya dokumen legalitas (Akta Pendirian, NIB, NPWP, Surat Kuasa) yang
// dikumpulin pas registrasi buat nyaring perusahaan bodong.
package company

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
		pr.With(appmw.RequireRole("hrd")).Post("/me/documents/upload-url", h.handleDocumentUploadURL)
		pr.With(appmw.RequireRole("hrd")).Patch("/me/documents", h.handleSaveDocuments)
	})
	return r
}

// docSlugs whitelist-nya sekaligus jadi validasi -- objectKey gak pernah
// dibangun langsung dari input user, cuma dari slug yang udah dipetain di
// sini (defense-in-depth, sama kayak allowedDocTypes gak pernah lolos
// sembarang string ke object storage key).
var docSlugs = map[string]string{
	"aktaPendirian": "akta-pendirian",
	"nib":           "nib",
	"npwp":          "npwp",
	"suratKuasa":    "surat-kuasa",
}

type uploadURLRequest struct {
	DocType string `json:"docType" validate:"required,oneof=aktaPendirian nib npwp suratKuasa"`
	Ext     string `json:"ext" validate:"required,oneof=pdf jpg jpeg png"`
}

func (h *Handler) handleDocumentUploadURL(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok || claims.CompanyID == "" {
		httpx.WriteError(w, http.StatusForbidden, "forbidden", "akun HRD ini belum terhubung ke perusahaan")
		return
	}

	var req uploadURLRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}
	if err := validate.Struct(req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "validation_failed", httpx.ValidationMessage(err))
		return
	}

	objectKey := fmt.Sprintf("company-docs/%s/%s-%d.%s", claims.CompanyID, docSlugs[req.DocType], time.Now().UnixNano(), req.Ext)
	uploadURL, err := h.storage.PresignPutCV(r.Context(), objectKey, 10*time.Minute)
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal buat upload URL")
		return
	}

	httpx.WriteJSON(w, http.StatusOK, map[string]string{"uploadUrl": uploadURL, "objectKey": objectKey})
}

type saveDocumentsRequest struct {
	AktaPendirianKey string `json:"aktaPendirianKey" validate:"omitempty,max=500"`
	NIBKey           string `json:"nibKey" validate:"omitempty,max=500"`
	NPWPKey          string `json:"npwpKey" validate:"omitempty,max=500"`
	SuratKuasaKey    string `json:"suratKuasaKey" validate:"omitempty,max=500"`
}

func (h *Handler) handleSaveDocuments(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok || claims.CompanyID == "" {
		httpx.WriteError(w, http.StatusForbidden, "forbidden", "akun HRD ini belum terhubung ke perusahaan")
		return
	}

	var req saveDocumentsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}
	if err := validate.Struct(req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "validation_failed", httpx.ValidationMessage(err))
		return
	}

	updates := map[string]any{}
	if req.AktaPendirianKey != "" {
		updates["akta_pendirian_url"] = req.AktaPendirianKey
	}
	if req.NIBKey != "" {
		updates["nib_url"] = req.NIBKey
	}
	if req.NPWPKey != "" {
		updates["npwp_url"] = req.NPWPKey
	}
	if req.SuratKuasaKey != "" {
		updates["surat_kuasa_url"] = req.SuratKuasaKey
	}
	if len(updates) == 0 {
		httpx.WriteJSON(w, http.StatusOK, map[string]string{"status": "ok"})
		return
	}

	if err := h.db.WithContext(r.Context()).Model(&appdb.Company{}).
		Where("id = ?", claims.CompanyID).Updates(updates).Error; err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal simpan dokumen perusahaan")
		return
	}
	httpx.WriteJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}
