package auth

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestNormalizeEmailCanonicalizesCaseAndSpace(t *testing.T) {
	got, err := normalizeEmail("  User@Gmail.COM  ")
	if err != nil {
		t.Fatalf("normalizeEmail() error = %v", err)
	}
	if got != "user@gmail.com" {
		t.Fatalf("normalizeEmail() = %q, want %q", got, "user@gmail.com")
	}
}

func TestNormalizeEmailRejectsDigitInTLD(t *testing.T) {
	if _, err := normalizeEmail("user@gmail.c0m"); err == nil {
		t.Fatal("normalizeEmail() error = nil, want error")
	}
}

func TestHandleRegisterRejectsConfusableEmailDomain(t *testing.T) {
	handler := NewHandler(nil, nil, nil, nil, nil, nil, "http://localhost:3000", nil)
	req := httptest.NewRequest(http.MethodPost, "/v1/auth/register", strings.NewReader(`{
		"name":"User Test",
		"email":"user@gmail.c0m",
		"password":"password123",
		"role":"candidate"
	}`))
	rec := httptest.NewRecorder()

	handler.handleRegister(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusBadRequest)
	}
}
