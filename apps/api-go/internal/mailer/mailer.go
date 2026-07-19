// Package mailer ngirim email transaksional (keputusan HRD ke kandidat)
// lewat Resend API. Sengaja bukan raw SMTP -- API HTTP kayak gini otomatis
// ngindarin header injection klasik (subject/body dikirim sebagai field
// JSON, bukan disisipin manual ke header SMTP mentah), dan deliverability
// (SPF/DKIM/bounce handling) ditangani provider, bukan kode ini.
package mailer

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"
)

const (
	resendAPIURL  = "https://api.resend.com/emails"
	maxSubjectLen = 200
	maxBodyLen    = 10000
)

type Mailer struct {
	apiKey     string
	fromEmail  string
	httpClient *http.Client
	baseURL    string // overridable in tests; defaults to resendAPIURL
}

func New(apiKey, fromEmail string) *Mailer {
	return &Mailer{
		apiKey:     apiKey,
		fromEmail:  fromEmail,
		httpClient: &http.Client{Timeout: 10 * time.Second},
		baseURL:    resendAPIURL,
	}
}

type sendRequest struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	Text    string   `json:"text"`
}

// Send ngirim satu email. `to` HARUS selalu diturunin dari data server-side
// (mis. email kandidat pemilik lamaran yang udah lolos ownership check di
// handler pemanggil) -- jangan pernah diambil langsung dari input request,
// supaya akun pengirim ini gak bisa disalahgunain buat ngirim ke sembarang
// alamat (open relay / spam-by-proxy).
//
// Kalau RESEND_API_KEY belum diset, ini no-op (cuma log) daripada bikin
// fitur lain yang manggilnya (update status lamaran) ikut gagal -- sama
// kayak pola notification.Create, pengiriman email bersifat best-effort.
func (m *Mailer) Send(ctx context.Context, to, subject, body string) error {
	if m.apiKey == "" {
		log.Printf("[mailer] RESEND_API_KEY belum diset, skip kirim email ke %s: %s", to, subject)
		return nil
	}
	if to == "" {
		return fmt.Errorf("mailer: recipient kosong")
	}

	subject = sanitizeSingleLine(subject, maxSubjectLen)
	body = truncate(body, maxBodyLen)

	payload := sendRequest{
		From:    m.fromEmail,
		To:      []string{to},
		Subject: subject,
		Text:    body,
	}
	raw, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("mailer: encode payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, m.baseURL, bytes.NewReader(raw))
	if err != nil {
		return fmt.Errorf("mailer: build request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+m.apiKey)
	req.Header.Set("Content-Type", "application/json")

	res, err := m.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("mailer: send request: %w", err)
	}
	defer res.Body.Close()

	if res.StatusCode >= 300 {
		return fmt.Errorf("mailer: resend returned status %d", res.StatusCode)
	}
	return nil
}

// sanitizeSingleLine ngebuang CR/LF (pertahanan lapis kedua terhadap header
// injection walau JSON body ke Resend udah aman by design) dan motong
// panjangnya biar gak dipakai buat flood/abuse.
func sanitizeSingleLine(s string, max int) string {
	s = strings.ReplaceAll(s, "\r", "")
	s = strings.ReplaceAll(s, "\n", " ")
	return truncate(strings.TrimSpace(s), max)
}

func truncate(s string, max int) string {
	if len(s) <= max {
		return s
	}
	return s[:max]
}
