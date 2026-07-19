// Package notification menangani notifikasi in-app: listing punya user yang
// login, tandai udah dibaca, dan helper Create buat paket lain (application)
// nulis notifikasi baru pas ada kejadian relevan (status lamaran berubah).
package notification

import (
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"

	appdb "github.com/adyuta447/direkrut-ai/api-go/internal/db"
	"github.com/adyuta447/direkrut-ai/api-go/internal/httpx"
	appmw "github.com/adyuta447/direkrut-ai/api-go/internal/middleware"
)

type Handler struct {
	db          *gorm.DB
	requireAuth func(http.Handler) http.Handler
}

func NewHandler(gdb *gorm.DB, requireAuth func(http.Handler) http.Handler) *Handler {
	return &Handler{db: gdb, requireAuth: requireAuth}
}

func (h *Handler) Router() chi.Router {
	r := chi.NewRouter()
	r.Group(func(pr chi.Router) {
		pr.Use(h.requireAuth)
		pr.Get("/", h.handleList)
		pr.Post("/{notificationID}/read", h.handleMarkAsRead)
	})
	return r
}

type notificationResponse struct {
	ID        string `json:"id"`
	Type      string `json:"type"`
	Title     string `json:"title"`
	Body      string `json:"body,omitempty"`
	IsRead    bool   `json:"isRead"`
	CreatedAt string `json:"createdAt"`
}

func toResponse(n appdb.Notification) notificationResponse {
	body := ""
	if n.Body != nil {
		body = *n.Body
	}
	return notificationResponse{
		ID: n.ID, Type: n.Type, Title: n.Title, Body: body,
		IsRead: n.IsRead, CreatedAt: n.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}

func (h *Handler) handleList(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok {
		httpx.WriteError(w, http.StatusUnauthorized, "unauthorized", "missing auth context")
		return
	}
	var rows []appdb.Notification
	if err := h.db.WithContext(r.Context()).
		Where("user_id = ?", claims.UserID).
		Order("created_at DESC").
		Limit(50).
		Find(&rows).Error; err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal ambil notifikasi")
		return
	}
	items := make([]notificationResponse, 0, len(rows))
	for _, n := range rows {
		items = append(items, toResponse(n))
	}
	httpx.WriteJSON(w, http.StatusOK, map[string]any{"items": items})
}

func (h *Handler) handleMarkAsRead(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok {
		httpx.WriteError(w, http.StatusUnauthorized, "unauthorized", "missing auth context")
		return
	}
	notificationID := chi.URLParam(r, "notificationID")

	res := h.db.WithContext(r.Context()).Model(&appdb.Notification{}).
		Where("id = ? AND user_id = ?", notificationID, claims.UserID).
		Update("is_read", true)
	if res.Error != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal tandai notifikasi")
		return
	}
	if res.RowsAffected == 0 {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "notifikasi gak ditemukan")
		return
	}
	httpx.WriteJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

// Create dipanggil paket lain (mis. application, pas status lamaran
// berubah) buat nulis notifikasi baru tanpa perlu instance Handler.
func Create(ctx context.Context, db *gorm.DB, userID, notifType, title, body string) error {
	n := appdb.Notification{UserID: userID, Type: notifType, Title: title}
	if body != "" {
		n.Body = &body
	}
	return db.WithContext(ctx).Create(&n).Error
}
