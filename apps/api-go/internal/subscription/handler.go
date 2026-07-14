// Package subscription menangani alur subscription empat tier (Free, Pro,
// Pro Plus, Max) buat akun HRD — termasuk kuota upload lowongan, kuota
// penyimpanan CV, dan fitur mana yang aktif per tier. Rincian tier ada
// di packages/contracts/openapi.yaml dan halaman /pricing di apps/web.
package subscription

import (
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/adyuta447/direkrut-ai/api-go/internal/httpx"
)

type Tier string

const (
	TierFree     Tier = "free"
	TierPro      Tier = "pro"
	TierProPlus  Tier = "pro_plus"
	TierMax      Tier = "max"
)

// Router mendaftarkan seluruh endpoint subscription di bawah
// /v1/subscriptions.
func Router() chi.Router {
	r := chi.NewRouter()
	r.Get("/me", handleGetCurrentSubscription)
	r.Post("/upgrade", handleUpgradeSubscription)
	r.Post("/cancel", handleCancelSubscription)
	return r
}

func handleGetCurrentSubscription(w http.ResponseWriter, r *http.Request) {
	// TODO: ambil tier aktif + sisa kuota (upload lowongan, storage CV)
	// buat akun HRD yang lagi login.
	httpx.WriteJSON(w, http.StatusOK, map[string]any{"tier": TierFree})
}

func handleUpgradeSubscription(w http.ResponseWriter, r *http.Request) {
	// TODO: buat invoice lewat internal/payment (Xendit), lalu upgrade
	// tier setelah pembayaran dikonfirmasi via webhook.
	httpx.WriteJSON(w, http.StatusNotImplemented, nil)
}

func handleCancelSubscription(w http.ResponseWriter, r *http.Request) {
	httpx.WriteJSON(w, http.StatusNotImplemented, nil)
}
