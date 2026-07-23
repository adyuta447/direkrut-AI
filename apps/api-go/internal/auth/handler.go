// Package auth menangani autentikasi berbasis JWT dan role-based access
// control (RBAC) buat dua peran: kandidat dan HRD.
package auth

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	appcache "github.com/adyuta447/direkrut-ai/api-go/internal/cache"
	appdb "github.com/adyuta447/direkrut-ai/api-go/internal/db"
	"github.com/adyuta447/direkrut-ai/api-go/internal/httpx"
	"github.com/adyuta447/direkrut-ai/api-go/internal/jwtutil"
	appmw "github.com/adyuta447/direkrut-ai/api-go/internal/middleware"
	"github.com/adyuta447/direkrut-ai/api-go/internal/storage"
)

var validate = validator.New()

type Handler struct {
	db                     *gorm.DB
	issuer                 *jwtutil.Issuer
	redisCache             *appcache.Cache
	rateLimiter            func(http.Handler) http.Handler
	requireAuth            func(http.Handler) http.Handler
	sendPasswordResetEmail func(context.Context, string, string) error
	webOrigin              string
	storage                *storage.Storage
}

func NewHandler(
	gdb *gorm.DB,
	issuer *jwtutil.Issuer,
	redisCache *appcache.Cache,
	rateLimiter func(http.Handler) http.Handler,
	requireAuth func(http.Handler) http.Handler,
	sendPasswordResetEmail func(context.Context, string, string) error,
	webOrigin string,
	storageClient *storage.Storage,
) *Handler {
	return &Handler{
		db:                     gdb,
		issuer:                 issuer,
		redisCache:             redisCache,
		rateLimiter:            rateLimiter,
		requireAuth:            requireAuth,
		sendPasswordResetEmail: sendPasswordResetEmail,
		webOrigin:              webOrigin,
		storage:                storageClient,
	}
}

// Router mendaftarkan seluruh endpoint auth di bawah /v1/auth. register &
// login di-rate-limit ketat -- dua endpoint ini paling rawan
// brute-force/credential-stuffing. Endpoint /me/* butuh login (ganti
// password/email, hapus akun) -- juga di-rate-limit, biar akun yang
// kecompromise (token bocor) gak bisa dipakai buat spam ganti password/email
// atau nyoba-nyoba delete berkali-kali.
func (h *Handler) Router() chi.Router {
	accountRateLimit := appmw.RateLimit(h.redisCache, "ratelimit:account", 5, 15*time.Minute)

	r := chi.NewRouter()
	r.With(h.rateLimiter).Post("/register", h.handleRegister)
	r.With(h.rateLimiter).Post("/login", h.handleLogin)
	r.With(h.rateLimiter).Post("/forgot-password", h.handleForgotPassword)
	r.With(h.rateLimiter).Post("/reset-password", h.handleResetPassword)
	r.Post("/refresh", h.handleRefreshToken)
	r.Group(func(pr chi.Router) {
		pr.Use(h.requireAuth)
		pr.With(accountRateLimit).Patch("/me/password", h.handleChangePassword)
		pr.With(accountRateLimit).Patch("/me/email", h.handleChangeEmail)
		pr.With(accountRateLimit).Delete("/me", h.handleDeleteAccount)
	})
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
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", httpx.ValidationMessage(err))
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal proses password")
		return
	}

	ctx := r.Context()
	var (
		userID      string
		companyID   string
		hrdUserID   string
		candidateID string
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
		} else {
			candidate := appdb.Candidate{UserID: user.ID, FullName: req.Name}
			if err := tx.Create(&candidate).Error; err != nil {
				return err
			}
			candidateID = candidate.ID
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

	h.issueTokenPair(w, r, userID, req.Role, companyID, hrdUserID, candidateID, http.StatusCreated)
}

func (h *Handler) handleLogin(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := decodeAndValidate(r, &req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", httpx.ValidationMessage(err))
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

	companyID, hrdUserID, candidateID := h.lookupUserContext(ctx, user)
	h.issueTokenPair(w, r, user.ID, user.Role, companyID, hrdUserID, candidateID, http.StatusOK)
}

func (h *Handler) handleRefreshToken(w http.ResponseWriter, r *http.Request) {
	var req refreshRequest
	if err := decodeAndValidate(r, &req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", httpx.ValidationMessage(err))
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

	companyID, hrdUserID, candidateID := h.lookupUserContext(ctx, user)
	newAccess, err := h.issuer.IssueAccessToken(user.ID, user.Role, companyID, hrdUserID, candidateID)
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal terbitkan access token")
		return
	}
	httpx.WriteJSON(w, http.StatusOK, authResponse{AccessToken: newAccess, RefreshToken: newRaw})
}

// lookupUserContext ngambil ID tambahan yang perlu masuk ke JWT claims sesuai
// role -- hrd butuh company_id/hrd_user_id (buat ownership check di jobs),
// candidate butuh candidate_id (buat ownership check di applications).
func (h *Handler) lookupUserContext(ctx context.Context, user appdb.User) (companyID, hrdUserID, candidateID string) {
	switch user.Role {
	case "hrd":
		var hrdUser appdb.HrdUser
		if err := h.db.WithContext(ctx).Where("user_id = ?", user.ID).First(&hrdUser).Error; err != nil {
			return "", "", ""
		}
		return hrdUser.CompanyID, hrdUser.ID, ""
	case "candidate":
		var candidate appdb.Candidate
		if err := h.db.WithContext(ctx).Where("user_id = ?", user.ID).First(&candidate).Error; err != nil {
			return "", "", ""
		}
		return "", "", candidate.ID
	default:
		return "", "", ""
	}
}

func (h *Handler) issueTokenPair(w http.ResponseWriter, r *http.Request, userID, role, companyID, hrdUserID, candidateID string, status int) {
	ctx := r.Context()
	accessToken, err := h.issuer.IssueAccessToken(userID, role, companyID, hrdUserID, candidateID)
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


func (h *Handler) revokeAllRefreshTokens(ctx context.Context, tx *gorm.DB, userID string) error {
	return tx.WithContext(ctx).Model(&appdb.RefreshToken{}).
		Where("user_id = ? AND revoked_at IS NULL", userID).
		Update("revoked_at", time.Now()).Error
}

type changePasswordRequest struct {
	CurrentPassword string `json:"currentPassword" validate:"required"`
	NewPassword     string `json:"newPassword" validate:"required,min=8,max=72"`
}

func (h *Handler) handleChangePassword(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok {
		httpx.WriteError(w, http.StatusUnauthorized, "unauthorized", "missing auth context")
		return
	}
	var req changePasswordRequest
	if err := decodeAndValidate(r, &req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", httpx.ValidationMessage(err))
		return
	}

	ctx := r.Context()
	var user appdb.User
	if err := h.db.WithContext(ctx).First(&user, "id = ?", claims.UserID).Error; err != nil {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "user gak ditemukan")
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.CurrentPassword)); err != nil {
		httpx.WriteError(w, http.StatusUnauthorized, "invalid_credentials", "kata sandi saat ini salah")
		return
	}
	newHash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal proses password")
		return
	}

	txErr := h.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&appdb.User{}).Where("id = ?", user.ID).Update("password_hash", string(newHash)).Error; err != nil {
			return err
		}
		return h.revokeAllRefreshTokens(ctx, tx, user.ID)
	})
	if txErr != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal ganti kata sandi")
		return
	}
	httpx.WriteJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

type changeEmailRequest struct {
	NewEmail string `json:"newEmail" validate:"required,email"`
}

func (h *Handler) handleChangeEmail(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok {
		httpx.WriteError(w, http.StatusUnauthorized, "unauthorized", "missing auth context")
		return
	}
	var req changeEmailRequest
	if err := decodeAndValidate(r, &req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", httpx.ValidationMessage(err))
		return
	}

	ctx := r.Context()
	var existing appdb.User
	if err := h.db.WithContext(ctx).Where("email = ?", req.NewEmail).First(&existing).Error; err == nil {
		httpx.WriteError(w, http.StatusConflict, "email_taken", "email ini udah kepake")
		return
	}
	if err := h.db.WithContext(ctx).Model(&appdb.User{}).Where("id = ?", claims.UserID).Update("email", req.NewEmail).Error; err != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal ganti email")
		return
	}
	httpx.WriteJSON(w, http.StatusOK, map[string]string{"email": req.NewEmail})
}

type deleteAccountRequest struct {
	Password string `json:"password" validate:"required"`
}

func (h *Handler) handleDeleteAccount(w http.ResponseWriter, r *http.Request) {
	claims, ok := appmw.ClaimsFromContext(r.Context())
	if !ok {
		httpx.WriteError(w, http.StatusUnauthorized, "unauthorized", "missing auth context")
		return
	}
	var req deleteAccountRequest
	if err := decodeAndValidate(r, &req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", httpx.ValidationMessage(err))
		return
	}

	ctx := r.Context()
	var user appdb.User
	if err := h.db.WithContext(ctx).First(&user, "id = ?", claims.UserID).Error; err != nil {
		httpx.WriteError(w, http.StatusNotFound, "not_found", "user gak ditemukan")
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		httpx.WriteError(w, http.StatusUnauthorized, "invalid_credentials", "kata sandi salah")
		return
	}

	// Simpan object key CV sebelum di-null-kan, buat dihapus dari object
	// storage sesudah transaksi DB sukses.
	var cvObjectKey string

	txErr := h.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := h.revokeAllRefreshTokens(ctx, tx, user.ID); err != nil {
			return err
		}

		// Purge PII (data deletion request): baris user & lamaran tetap ada
		// (soft-delete, FK riwayat gak keputus), tapi semua data pribadi
		// dianonimkan permanen -- nama, kontak, profil, CV. Email diganti
		// alamat sintetis biar bebas dipakai daftar ulang.
		if user.Role == "candidate" {
			var cand appdb.Candidate
			if err := tx.Where("user_id = ?", user.ID).First(&cand).Error; err == nil {
				if cand.CvFileURL != nil {
					cvObjectKey = *cand.CvFileURL
				}
				if err := tx.Model(&appdb.Candidate{}).Where("id = ?", cand.ID).Updates(map[string]any{
					"full_name": "Akun Dihapus", "phone": nil, "headline": nil, "location": nil,
					"cv_file_url": nil, "age": nil, "gender": nil, "about": nil,
					"photo_url": nil, "cover_url": nil,
					"experience": "[]", "education": "[]", "links": "[]",
				}).Error; err != nil {
					return err
				}
				if err := tx.Where("candidate_id = ?", cand.ID).Delete(&appdb.CandidateSkill{}).Error; err != nil {
					return err
				}
			}
		}
		if err := tx.Model(&appdb.User{}).Where("id = ?", user.ID).
			Update("email", "deleted-"+user.ID+"@deleted.invalid").Error; err != nil {
			return err
		}

		return tx.Delete(&user).Error
	})
	if txErr != nil {
		httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal hapus akun")
		return
	}

	// Hapus file CV dari object storage -- best-effort sesudah DB sukses;
	// pointer di DB udah hilang duluan, jadi kalau delete-nya gagal pun file
	// itu gak bisa diakses lagi lewat aplikasi.
	if cvObjectKey != "" && h.storage != nil {
		if err := h.storage.DeleteObject(ctx, cvObjectKey); err != nil {
			log.Printf("[auth] gagal hapus file CV %s dari storage: %v", cvObjectKey, err)
		}
	}
	w.WriteHeader(http.StatusNoContent)
}
