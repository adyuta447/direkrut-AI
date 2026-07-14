// Package job menangani manajemen lowongan: CRUD posting lowongan oleh
// HRD, dan listing/pencarian lowongan buat kandidat di portal publik.
package job

import (
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/adyuta447/direkrut-ai/api-go/internal/httpx"
)

// Router mendaftarkan seluruh endpoint lowongan di bawah /v1/jobs.
func Router() chi.Router {
	r := chi.NewRouter()
	r.Get("/", handleListJobs)
	r.Post("/", handleCreateJob)
	r.Get("/{jobID}", handleGetJob)
	r.Put("/{jobID}", handleUpdateJob)
	r.Delete("/{jobID}", handleDeleteJob)
	return r
}

func handleListJobs(w http.ResponseWriter, r *http.Request) {
	// TODO: query Postgres dengan filter (industri, lokasi, tipe, gaji)
	// yang dikirim dari JobSearchHeader di apps/web.
	httpx.WriteJSON(w, http.StatusOK, []any{})
}

func handleCreateJob(w http.ResponseWriter, r *http.Request) {
	// TODO: validasi kuota tier subscription HRD sebelum insert lowongan
	// baru (lihat internal/subscription).
	httpx.WriteJSON(w, http.StatusNotImplemented, nil)
}

func handleGetJob(w http.ResponseWriter, r *http.Request) {
	jobID := chi.URLParam(r, "jobID")
	_ = jobID
	// TODO: ambil satu lowongan by ID.
	httpx.WriteJSON(w, http.StatusNotFound, nil)
}

func handleUpdateJob(w http.ResponseWriter, r *http.Request) {
	httpx.WriteJSON(w, http.StatusNotImplemented, nil)
}

func handleDeleteJob(w http.ResponseWriter, r *http.Request) {
	httpx.WriteJSON(w, http.StatusNotImplemented, nil)
}
