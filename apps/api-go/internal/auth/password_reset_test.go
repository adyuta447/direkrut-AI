package auth

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestBuildPasswordResetURLWhenOriginHasTrailingSlash(t *testing.T) {
	// Given
	token := "abc+123/="

	// When
	got := buildPasswordResetURL("https://app.direkrut.ai/", token)

	// Then
	want := "https://app.direkrut.ai/auth/reset-password?token=abc%2B123%2F%3D"
	if got != want {
		t.Fatalf("buildPasswordResetURL() = %q, want %q", got, want)
	}
}

func TestBuildPasswordResetURLWhenOriginHasMultipleValues(t *testing.T) {
	// Given
	token := "token"

	// When
	got := buildPasswordResetURL("https://app.direkrut.ai, https://admin.direkrut.ai", token)

	// Then
	want := "https://app.direkrut.ai/auth/reset-password?token=token"
	if got != want {
		t.Fatalf("buildPasswordResetURL() = %q, want %q", got, want)
	}
}

func TestHandleForgotPasswordWhenEmailInvalid(t *testing.T) {
	// Given
	handler := NewHandler(nil, nil, nil, nil, nil, nil, "http://localhost:3000", nil)
	req := httptest.NewRequest(http.MethodPost, "/v1/auth/forgot-password", strings.NewReader(`{"email":"bad"}`))
	rec := httptest.NewRecorder()

	// When
	handler.handleForgotPassword(rec, req)

	// Then
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusBadRequest)
	}
}

func TestHandleForgotPasswordWhenEmailSenderNotConfigured(t *testing.T) {
	// Given
	handler := NewHandler(nil, nil, nil, nil, nil, nil, "http://localhost:3000", nil)
	req := httptest.NewRequest(http.MethodPost, "/v1/auth/forgot-password", strings.NewReader(`{"email":"user@example.com"}`))
	rec := httptest.NewRecorder()

	// When
	handler.handleForgotPassword(rec, req)

	// Then
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}
}

func TestHandleResetPasswordWhenPasswordExceedsBcryptByteLimit(t *testing.T) {
	// Given
	handler := NewHandler(nil, nil, nil, nil, nil, nil, "http://localhost:3000", nil)
	token := strings.Repeat("a", 32)
	password := strings.Repeat("é", 37)
	req := httptest.NewRequest(http.MethodPost, "/v1/auth/reset-password", strings.NewReader(`{"token":"`+token+`","newPassword":"`+password+`"}`))
	rec := httptest.NewRecorder()

	// When
	handler.handleResetPassword(rec, req)

	// Then
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusBadRequest)
	}
}
