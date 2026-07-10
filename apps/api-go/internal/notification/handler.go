// Package notification menangani pengiriman notifikasi real-time
// (status lamaran berubah, jadwal interview, dsb) lewat Redis pub/sub
// dan, ke depannya, WebSocket/SSE ke apps/web.
package notification

import (
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/adyuta447/direkrut-ai/api-go/internal/httpx"
)

// Router mendaftarkan seluruh endpoint notifikasi di bawah
// /v1/notifications.
func Router() chi.Router {
	r := chi.NewRouter()
	r.Get("/", handleListNotifications)
	r.Post("/{notificationID}/read", handleMarkAsRead)
	return r
}

func handleListNotifications(w http.ResponseWriter, r *http.Request) {
	// TODO: ambil notifikasi user dari Postgres, urut terbaru dulu.
	httpx.WriteJSON(w, http.StatusOK, []any{})
}

func handleMarkAsRead(w http.ResponseWriter, r *http.Request) {
	notificationID := chi.URLParam(r, "notificationID")
	_ = notificationID
	httpx.WriteJSON(w, http.StatusNotImplemented, nil)
}
