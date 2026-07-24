package auth

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	appdb "github.com/adyuta447/direkrut-ai/api-go/internal/db"
	"github.com/adyuta447/direkrut-ai/api-go/internal/jwtutil"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
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

func TestHandleRegisterRejectsDuplicateEmailWithDifferentCase(t *testing.T) {
	handler := newAuthTestHandler(t)

	first := performRegister(handler, `{
		"name":"User Test",
		"email":"copeme3448@ronete.com",
		"password":"password123",
		"role":"hrd",
		"companyName":"Ronete"
	}`)
	if first.Code != http.StatusCreated {
		t.Fatalf("first status = %d, want %d: %s", first.Code, http.StatusCreated, first.Body.String())
	}

	second := performRegister(handler, `{
		"name":"User Test 2",
		"email":"copeme3448@ronete.cOm",
		"password":"password123",
		"role":"candidate"
	}`)
	if second.Code != http.StatusConflict {
		t.Fatalf("second status = %d, want %d: %s", second.Code, http.StatusConflict, second.Body.String())
	}

	var users []appdb.User
	if err := handler.db.Find(&users).Error; err != nil {
		t.Fatalf("Find users: %v", err)
	}
	if len(users) != 1 {
		t.Fatalf("users count = %d, want 1", len(users))
	}
	if users[0].Email != "copeme3448@ronete.com" {
		t.Fatalf("stored email = %q, want %q", users[0].Email, "copeme3448@ronete.com")
	}
}

func TestHandleLoginRejectsConfusableEmailDomain(t *testing.T) {
	handler := newAuthTestHandler(t)

	registerResponse := performRegister(handler, `{
		"name":"User Test",
		"email":"user@gmail.com",
		"password":"password123",
		"role":"hrd",
		"companyName":"Direkrut"
	}`)
	if registerResponse.Code != http.StatusCreated {
		t.Fatalf("register status = %d, want %d: %s", registerResponse.Code, http.StatusCreated, registerResponse.Body.String())
	}

	loginResponse := performLogin(handler, `{
		"email":"user@gmail.c0m",
		"password":"password123"
	}`)
	if loginResponse.Code != http.StatusBadRequest {
		t.Fatalf("login status = %d, want %d: %s", loginResponse.Code, http.StatusBadRequest, loginResponse.Body.String())
	}
}

func newAuthTestHandler(t *testing.T) *Handler {
	t.Helper()

	dbName := strings.NewReplacer("/", "_", " ", "_").Replace(t.Name())
	gdb, err := gorm.Open(sqlite.Open("file:"+dbName+"?mode=memory&cache=shared"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		t.Fatalf("open sqlite: %v", err)
	}
	if err := gdb.AutoMigrate(&appdb.User{}, &appdb.RefreshToken{}, &appdb.Candidate{}, &appdb.Company{}, &appdb.HrdUser{}); err != nil {
		t.Fatalf("migrate test db: %v", err)
	}

	return NewHandler(gdb, jwtutil.NewIssuer("test-secret"), nil, nil, nil, nil, "http://localhost:3000", nil)
}

func performRegister(handler *Handler, body string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(http.MethodPost, "/v1/auth/register", strings.NewReader(body))
	rec := httptest.NewRecorder()
	handler.handleRegister(rec, req)
	return rec
}

func performLogin(handler *Handler, body string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(http.MethodPost, "/v1/auth/login", strings.NewReader(body))
	rec := httptest.NewRecorder()
	handler.handleLogin(rec, req)
	return rec
}
