// Package auth menangani autentikasi berbasis JWT dan role-based access
// control (RBAC) buat dua peran: kandidat dan HRD.
package auth

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/adyuta447/direkrut-ai/api-go/internal/httpx"
)

// Router mendaftarkan seluruh endpoint auth di bawah /v1/auth.
func Router() chi.Router {
	r := chi.NewRouter()
	r.Post("/register", handleRegister)
	r.Post("/login", handleLogin)
	r.Post("/refresh", handleRefreshToken)
	return r
}

type registerRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"` // "applicant" | "hrd"
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type authResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

func handleRegister(w http.ResponseWriter, r *http.Request) {
	var req registerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}
	// TODO: hash password (bcrypt/argon2), simpan user ke Postgres,
	// terbitkan access + refresh token via internal JWT service.
	httpx.WriteJSON(w, http.StatusNotImplemented, authResponse{})
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}
	// TODO: verifikasi kredensial, terbitkan JWT dengan klaim role
	// buat middleware RBAC di layanan lain.
	httpx.WriteJSON(w, http.StatusNotImplemented, authResponse{})
}

func handleRefreshToken(w http.ResponseWriter, r *http.Request) {
	// TODO: validasi refresh token, terbitkan access token baru.
	httpx.WriteJSON(w, http.StatusNotImplemented, authResponse{})
}
