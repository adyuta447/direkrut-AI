package mailer

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestSend_NoAPIKeyIsNoop(t *testing.T) {
	m := New("", "from@example.com")
	if err := m.Send(context.Background(), "to@example.com", "subject", "body"); err != nil {
		t.Fatalf("expected no-op success, got error: %v", err)
	}
}

func TestSend_EmptyRecipientErrors(t *testing.T) {
	m := New("key", "from@example.com")
	if err := m.Send(context.Background(), "", "subject", "body"); err == nil {
		t.Fatal("expected error for empty recipient")
	}
}

func TestSend_StripsHeaderInjectionAttempt(t *testing.T) {
	var captured sendRequest
	var gotAuth string
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		gotAuth = r.Header.Get("Authorization")
		_ = json.NewDecoder(r.Body).Decode(&captured)
		w.WriteHeader(http.StatusOK)
	}))
	defer server.Close()

	m := New("test-key", "from@example.com")
	m.baseURL = server.URL

	err := m.Send(context.Background(), "candidate@example.com", "Halo\r\nBcc: attacker@evil.com", "body")
	if err != nil {
		t.Fatalf("Send() error = %v", err)
	}

	if gotAuth != "Bearer test-key" {
		t.Errorf("Authorization header = %q, want %q", gotAuth, "Bearer test-key")
	}
	if strings.ContainsAny(captured.Subject, "\r\n") {
		t.Errorf("subject sent to provider still contains a newline: %q", captured.Subject)
	}
	if captured.Subject != "Halo Bcc: attacker@evil.com" {
		t.Errorf("captured.Subject = %q", captured.Subject)
	}
	if len(captured.To) != 1 || captured.To[0] != "candidate@example.com" {
		t.Errorf("captured.To = %v", captured.To)
	}
}

func TestTruncate(t *testing.T) {
	if got := truncate("hello", 10); got != "hello" {
		t.Errorf("truncate() = %q, want unchanged", got)
	}
	if got := truncate("hello world", 5); got != "hello" {
		t.Errorf("truncate() = %q, want %q", got, "hello")
	}
}
