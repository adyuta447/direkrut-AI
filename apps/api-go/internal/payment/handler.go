// Package payment menangani integrasi payment gateway Xendit: pembuatan
// invoice buat upgrade subscription, dan webhook konfirmasi pembayaran.
package payment

import (
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/adyuta447/direkrut-ai/api-go/internal/httpx"
)

// Router mendaftarkan seluruh endpoint payment di bawah /v1/payments.
func Router() chi.Router {
	r := chi.NewRouter()
	r.Post("/invoices", handleCreateInvoice)
	r.Post("/webhooks/xendit", handleXenditWebhook)
	return r
}

func handleCreateInvoice(w http.ResponseWriter, r *http.Request) {
	// TODO: panggil Xendit Invoice API, simpan invoice pending ke
	// Postgres, kembalikan invoice_url buat redirect user.
	httpx.WriteJSON(w, http.StatusNotImplemented, nil)
}

func handleXenditWebhook(w http.ResponseWriter, r *http.Request) {
	// TODO: verifikasi X-Callback-Token header, update status invoice,
	// dan trigger upgrade tier di internal/subscription kalau PAID.
	httpx.WriteJSON(w, http.StatusOK, map[string]string{"status": "received"})
}
