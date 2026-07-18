// Package auth menangani autentikasi berbasis JWT dan role-based access
// control (RBAC) buat dua peran: kandidat dan HRD.
package auth

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	appdb "github.com/adyuta447/direkrut-ai/api-go/internal/db"
	"github.com/adyuta447/direkrut-ai/api-go/internal/httpx"
	"github.com/adyuta447/direkrut-ai/api-go/internal/jwtutil"
)

var validate = validator.New()

type Handler struct {
	db          *gorm.DB
	issuer      *jwtutil.Issuer
	rateLimiter func(http.Handler) http.Handler
}

func NewHandler(gdb *gorm.DB, issuer *jwtutil.Issuer, rateLimiter func(http.Handler) http.Handler) *Handler {
	return &Handler{db: gdb, issuer: issuer, rateLimiter: rateLimiter}
}

// Router mendaftarkan seluruh endpoint auth di bawah /v1/auth. register &
// login di-rate-limit ketat -- dua endpoint ini paling rawan
// brute-force/credential-stuffing.
func (h *Handler) Router() chi.Router {
	r := chi.NewRouter()
	r.With(h.rateLimiter).Post("/register", h.handleRegister)
	r.With(h.rateLimiter).Post("/login", h.handleLogin)
	r.Post("/refresh", h.handleRefreshToken)
	return r
}

type registerRequest struct {
	Name        string `json:"name" validate:"required,min=2,max=120"`
	Email       string `json:"email" validate:"required,email"`
	Password    string `json:"password" validate:"required,min=8,max=72"`
	Role        string `json:"role" validate:"required,oneof=candidate hrd"`
	CompanyName string `json:"companyName" validate:"required_if=Role hrd,omitempty,min=2,max=160"`
}

type loginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type refreshRequest struct {
	RefreshToken string `json:"refreshToken" validate:"required"`
}

type authResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

func decodeAndValidate(r *http.Request, dst any) error {
	if err := json.NewDecoder(r.Body).Decode(dst); err != nil {
		return errors.New("request body gak valid")
	}
	return validate.Struct(dst)
}

func (h *Handler) handleRegister(w http.ResponseWriter, r *http.Request) {
	var req registerRequest
	if err := decodeAndValidate(r, &req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal proses password")
		return
	}

	ctx := r.Context()
	var (
		userID    string
		companyID string
		hrdUserID string
	)

	txErr := h.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		user := appdb.User{Email: req.Email, PasswordHash: string(hash), Role: req.Role, Status: "active"}
		if err := tx.Create(&user).Error; err != nil {
			return err
		}
		userID = user.ID

		if req.Role == "hrd" {
			company := appdb.Company{Name: req.CompanyName}
			if err := tx.Create(&company).Error; err != nil {
				return err
			}
			hrdUser := appdb.HrdUser{UserID: user.ID, CompanyID: company.ID}
			if err := tx.Create(&hrdUser).Error; err != nil {
				return err
			}
			companyID = company.ID
			hrdUserID = hrdUser.ID
		}
		return nil
	})
	if txErr != nil {
		if errors.Is(txErr, gorm.ErrDuplicatedKey) {
			httpx.WriteError(w, http.StatusConflict, "email_taken", "email ini udah kepake")
			return
		}
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal daftar akun")
		return
	}

	h.issueTokenPair(w, r, userID, req.Role, companyID, hrdUserID, http.StatusCreated)
}

func (h *Handler) handleLogin(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := decodeAndValidate(r, &req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	ctx := r.Context()
	var user appdb.User
	if err := h.db.WithContext(ctx).Where("email = ?", req.Email).First(&user).Error; err != nil {
		httpx.WriteError(w, http.StatusUnauthorized, "invalid_credentials", "email atau password salah")
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		httpx.WriteError(w, http.StatusUnauthorized, "invalid_credentials", "email atau password salah")
		return
	}

	companyID, hrdUserID := h.lookupHrdContext(ctx, user)
	h.issueTokenPair(w, r, user.ID, user.Role, companyID, hrdUserID, http.StatusOK)
}

func (h *Handler) handleRefreshToken(w http.ResponseWriter, r *http.Request) {
	var req refreshRequest
	if err := decodeAndValidate(r, &req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", err.Error())
		return
	}

	ctx := r.Context()
	hash := jwtutil.HashRefreshToken(req.RefreshToken)

	var stored appdb.RefreshToken
	if err := h.db.WithContext(ctx).Where("token_hash = ?", hash).First(&stored).Error; err != nil {
		httpx.WriteError(w, http.StatusUnauthorized, "invalid_refresh_token", "refresh token gak valid")
		return
	}
	if stored.RevokedAt != nil || time.Now().After(stored.ExpiresAt) {
		httpx.WriteError(w, http.StatusUnauthorized, "invalid_refresh_token", "refresh token udah gak berlaku")
		return
	}

	var user appdb.User
	if err := h.db.WithContext(ctx).First(&user, "id = ?", stored.UserID).Error; err != nil {
		httpx.WriteError(w, http.StatusUnauthorized, "invalid_refresh_token", "user gak ditemukan")
		return
	}

	newRaw, newHash, err := jwtutil.NewRefreshToken()
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal terbitkan refresh token")
		return
	}

	txErr := h.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		now := time.Now()
		if err := tx.Model(&appdb.RefreshToken{}).Where("id = ?", stored.ID).Update("revoked_at", now).Error; err != nil {
			return err
		}
		return tx.Create(&appdb.RefreshToken{UserID: user.ID, TokenHash: newHash, ExpiresAt: now.Add(jwtutil.RefreshTokenTTL)}).Error
	})
	if txErr != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal rotate refresh token")
		return
	}

	companyID, hrdUserID := h.lookupHrdContext(ctx, user)
	newAccess, err := h.issuer.IssueAccessToken(user.ID, user.Role, companyID, hrdUserID)
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal terbitkan access token")
		return
	}
	httpx.WriteJSON(w, http.StatusOK, authResponse{AccessToken: newAccess, RefreshToken: newRaw})
}

func (h *Handler) lookupHrdContext(ctx context.Context, user appdb.User) (companyID, hrdUserID string) {
	if user.Role != "hrd" {
		return "", ""
	}
	var hrdUser appdb.HrdUser
	if err := h.db.WithContext(ctx).Where("user_id = ?", user.ID).First(&hrdUser).Error; err != nil {
		return "", ""
	}
	return hrdUser.CompanyID, hrdUser.ID
}

func (h *Handler) issueTokenPair(w http.ResponseWriter, r *http.Request, userID, role, companyID, hrdUserID string, status int) {
	ctx := r.Context()
	accessToken, err := h.issuer.IssueAccessToken(userID, role, companyID, hrdUserID)
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal terbitkan access token")
		return
	}
	rawRefresh, refreshHash, err := jwtutil.NewRefreshToken()
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal terbitkan refresh token")
		return
	}
	record := appdb.RefreshToken{UserID: userID, TokenHash: refreshHash, ExpiresAt: time.Now().Add(jwtutil.RefreshTokenTTL)}
	if err := h.db.WithContext(ctx).Create(&record).Error; err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal simpan refresh token")
		return
	}
	httpx.WriteJSON(w, status, authResponse{AccessToken: accessToken, RefreshToken: rawRefresh})
}
