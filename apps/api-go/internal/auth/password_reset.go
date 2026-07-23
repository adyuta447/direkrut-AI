package auth

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"net/url"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	appdb "github.com/adyuta447/direkrut-ai/api-go/internal/db"
	"github.com/adyuta447/direkrut-ai/api-go/internal/httpx"
	"github.com/adyuta447/direkrut-ai/api-go/internal/jwtutil"
)

const (
	passwordResetTTL           = time.Hour
	passwordResetCooldown      = 5 * time.Minute
	passwordResetResponseFloor = 250 * time.Millisecond
	maxBcryptPasswordBytes     = 72
)

var (
	errInvalidResetToken                = errors.New("auth: invalid password reset token")
	errExpiredResetToken                = errors.New("auth: expired password reset token")
	errPasswordResetEmailNotConfigured  = errors.New("auth: password reset email not configured")
	errPasswordResetPasswordByteTooLong = errors.New("auth: password exceeds bcrypt byte limit")
)

type forgotPasswordRequest struct {
	Email string `json:"email" validate:"required,email"`
}

type resetPasswordRequest struct {
	Token       string `json:"token" validate:"required,min=32"`
	NewPassword string `json:"newPassword" validate:"required,min=8,max=72"`
}

type statusResponse struct {
	Status string `json:"status"`
}

func (h *Handler) handleForgotPassword(w http.ResponseWriter, r *http.Request) {
	started := time.Now()
	var req forgotPasswordRequest
	if err := decodeAndValidate(r, &req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", httpx.ValidationMessage(err))
		return
	}

	ctx := r.Context()
	if err := h.issuePasswordReset(ctx, req.Email); err != nil {
		slog.WarnContext(ctx, "password reset request failed", "err", err)
	}
	waitForPasswordResetResponseFloor(ctx, started)
	httpx.WriteJSON(w, http.StatusOK, statusResponse{Status: "ok"})
}

func (h *Handler) issuePasswordReset(ctx context.Context, email string) error {
	rawToken, tokenHash, err := jwtutil.NewRefreshToken()
	if err != nil {
		return err
	}
	if h.sendPasswordResetEmail == nil {
		return errPasswordResetEmailNotConfigured
	}

	now := time.Now()
	var recipient string
	var userID string
	shouldSend := false
	if err := h.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var user appdb.User
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
			Where("email = ?", email).
			First(&user).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil
			}
			return err
		}

		var recent appdb.PasswordResetToken
		err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
			Where("user_id = ? AND used_at IS NULL AND expires_at > ? AND created_at > ?", user.ID, now, now.Add(-passwordResetCooldown)).
			Order("created_at DESC").
			First(&recent).Error
		if err == nil {
			return nil
		}
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return err
		}

		if err := tx.Model(&appdb.PasswordResetToken{}).
			Where("user_id = ? AND used_at IS NULL", user.ID).
			Update("used_at", now).Error; err != nil {
			return err
		}
		if err := tx.Create(&appdb.PasswordResetToken{
			UserID: user.ID, TokenHash: tokenHash, ExpiresAt: now.Add(passwordResetTTL),
		}).Error; err != nil {
			return err
		}
		recipient = user.Email
		userID = user.ID
		shouldSend = true
		return nil
	}); err != nil {
		return err
	}

	if shouldSend {
		h.sendPasswordResetEmailAsync(userID, tokenHash, recipient, buildPasswordResetURL(h.webOrigin, rawToken))
	}
	return nil
}

func (h *Handler) sendPasswordResetEmailAsync(userID, tokenHash, recipient, resetURL string) {
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancel()

		if err := h.sendPasswordResetEmail(ctx, recipient, resetURL); err != nil {
			slog.WarnContext(ctx, "password reset email failed", "user_id", userID, "err", err)
			if err := h.db.WithContext(ctx).Model(&appdb.PasswordResetToken{}).
				Where("token_hash = ? AND used_at IS NULL", tokenHash).
				Update("used_at", time.Now()).Error; err != nil {
				slog.WarnContext(ctx, "failed to invalidate unsent password reset token", "user_id", userID, "err", err)
			}
		}
	}()
}

func waitForPasswordResetResponseFloor(ctx context.Context, started time.Time) {
	remaining := passwordResetResponseFloor - time.Since(started)
	if remaining <= 0 {
		return
	}
	timer := time.NewTimer(remaining)
	defer timer.Stop()
	select {
	case <-ctx.Done():
	case <-timer.C:
	}
}

func buildPasswordResetURL(webOrigin, token string) string {
	origin := strings.TrimRight(strings.TrimSpace(strings.Split(webOrigin, ",")[0]), "/")
	return origin + "/auth/reset-password?token=" + url.QueryEscape(token)
}

func (h *Handler) handleResetPassword(w http.ResponseWriter, r *http.Request) {
	var req resetPasswordRequest
	if err := decodeAndValidate(r, &req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", httpx.ValidationMessage(err))
		return
	}

	if err := h.resetPasswordWithToken(r.Context(), req.Token, req.NewPassword); err != nil {
		switch {
		case errors.Is(err, errPasswordResetPasswordByteTooLong):
			httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "Password terlalu panjang")
		case errors.Is(err, errExpiredResetToken):
			httpx.WriteError(w, http.StatusBadRequest, "expired_reset_token", "tautan reset kata sandi sudah kedaluwarsa")
		case errors.Is(err, errInvalidResetToken):
			httpx.WriteError(w, http.StatusBadRequest, "invalid_reset_token", "tautan reset kata sandi tidak valid")
		default:
			httpx.WriteError(w, http.StatusInternalServerError, "internal_error", "gagal mengganti kata sandi")
		}
		return
	}

	httpx.WriteJSON(w, http.StatusOK, statusResponse{Status: "ok"})
}

func (h *Handler) resetPasswordWithToken(ctx context.Context, rawToken, newPassword string) error {
	if len(newPassword) > maxBcryptPasswordBytes {
		return errPasswordResetPasswordByteTooLong
	}
	tokenHash := jwtutil.HashRefreshToken(rawToken)
	return h.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		var resetToken appdb.PasswordResetToken
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
			Where("token_hash = ?", tokenHash).
			First(&resetToken).Error; err != nil {
			if !errors.Is(err, gorm.ErrRecordNotFound) {
				return err
			}
			return errInvalidResetToken
		}
		if resetToken.UsedAt != nil {
			return errInvalidResetToken
		}
		now := time.Now()
		if now.After(resetToken.ExpiresAt) {
			return errExpiredResetToken
		}

		passwordHash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		result := tx.Model(&appdb.User{}).
			Where("id = ?", resetToken.UserID).
			Update("password_hash", string(passwordHash))
		if result.Error != nil {
			return result.Error
		}
		if result.RowsAffected == 0 {
			return errInvalidResetToken
		}
		if err := tx.Model(&appdb.PasswordResetToken{}).
			Where("user_id = ? AND used_at IS NULL", resetToken.UserID).
			Update("used_at", now).Error; err != nil {
			return err
		}
		return h.revokeAllRefreshTokens(ctx, tx, resetToken.UserID)
	})
}
