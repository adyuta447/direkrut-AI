package aiengine

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"

	"github.com/adyuta447/direkrut-ai/api-go/internal/httpx"
)

type Handler struct {
	client      *Client
	requireAuth func(http.Handler) http.Handler
}

func NewHandler(client *Client, requireAuth func(http.Handler) http.Handler) *Handler {
	return &Handler{client: client, requireAuth: requireAuth}
}

func (h *Handler) Router() chi.Router {
	r := chi.NewRouter()
	r.Group(func(pr chi.Router) {
		pr.Use(h.requireAuth)
		pr.Post("/chat/stream", h.handleChatStream)
		pr.Post("/cv/parse", h.handleParseCV)
		pr.Post("/assessment/score", h.handleScoreValidation)
		pr.Post("/assessment/transcribe", h.handleTranscribeInterview)
		pr.Post("/match", h.handleMatch)
		pr.Post("/embed", h.handleEmbed)
	})
	return r
}

func (h *Handler) ensureConfigured(w http.ResponseWriter) bool {
	if !h.client.IsConfigured() {
		httpx.WriteError(w, http.StatusServiceUnavailable, "ai_not_configured",
			"AI engine belum dikonfigurasi (AI_ENGINE_BASE_URL dan INTERNAL_API_KEY harus diset)")
		return false
	}
	return true
}

// handleChatStream proxy SSE stream dari ai-engine ke browser.
// Browser mengirim POST dengan JSON body, api-go forward ke ai-engine,
// lalu pipe stream response langsung ke browser tanpa buffering.
func (h *Handler) handleChatStream(w http.ResponseWriter, r *http.Request) {
	if !h.ensureConfigured(w) {
		return
	}

	var req ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}

	if len(req.Messages) == 0 {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "messages gak boleh kosong")
		return
	}

	if req.SessionID == "" {
		req.SessionID = "default"
	}

	resp, err := h.client.StreamChat(r.Context(), req)
	if err != nil {
		log.Printf("[aiengine] chat stream error: %v", err)
		httpx.WriteError(w, http.StatusBadGateway, "ai_error", "gagal terhubung ke AI engine")
		return
	}
	defer resp.Body.Close()

	// Set SSE headers dan pipe stream langsung
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("X-Accel-Buffering", "no")
	w.WriteHeader(http.StatusOK)

	// Flush setelah set headers
	if flusher, ok := w.(http.Flusher); ok {
		flusher.Flush()
	}

	buf := make([]byte, 1024)
	for {
		n, err := resp.Body.Read(buf)
		if n > 0 {
			if _, writeErr := w.Write(buf[:n]); writeErr != nil {
				return
			}
			if flusher, ok := w.(http.Flusher); ok {
				flusher.Flush()
			}
		}
		if err != nil {
			if err != io.EOF {
				log.Printf("[aiengine] chat stream read error: %v", err)
			}
			return
		}
	}
}

func (h *Handler) handleParseCV(w http.ResponseWriter, r *http.Request) {
	if !h.ensureConfigured(w) {
		return
	}

	var req struct {
		ApplicationID string `json:"applicationId"`
		CVObjectKey   string `json:"cvObjectKey"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}

	result, err := h.client.ParseCV(r.Context(), ParseCVRequest{
		CVObjectKey:   req.CVObjectKey,
		ApplicationID: req.ApplicationID,
	})
	if err != nil {
		log.Printf("[aiengine] parse CV error: %v", err)
		httpx.WriteError(w, http.StatusBadGateway, "ai_error", "gagal parsing CV lewat AI")
		return
	}

	httpx.WriteJSON(w, http.StatusOK, result)
}

func (h *Handler) handleScoreValidation(w http.ResponseWriter, r *http.Request) {
	if !h.ensureConfigured(w) {
		return
	}

	var req struct {
		ApplicationID string `json:"applicationId"`
		Responses     []struct {
			Question string `json:"question"`
			Answer   string `json:"answer"`
		} `json:"responses"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}

	answers := make([]ValidationAnswer, len(req.Responses))
	for i, r := range req.Responses {
		answers[i] = ValidationAnswer{Question: r.Question, Answer: r.Answer}
	}

	result, err := h.client.ScoreValidation(r.Context(), ScoreValidationRequest{
		ApplicationID: req.ApplicationID,
		Responses:     answers,
	})
	if err != nil {
		log.Printf("[aiengine] score validation error: %v", err)
		httpx.WriteError(w, http.StatusBadGateway, "ai_error", "gagal scoring validasi lewat AI")
		return
	}

	httpx.WriteJSON(w, http.StatusOK, result)
}

func (h *Handler) handleTranscribeInterview(w http.ResponseWriter, r *http.Request) {
	if !h.ensureConfigured(w) {
		return
	}

	var req struct {
		ApplicationID  string `json:"applicationId"`
		AudioObjectKey string `json:"audioObjectKey"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}

	result, err := h.client.TranscribeInterview(r.Context(), TranscribeInterviewRequest{
		ApplicationID:  req.ApplicationID,
		AudioObjectKey: req.AudioObjectKey,
	})
	if err != nil {
		log.Printf("[aiengine] transcribe interview error: %v", err)
		httpx.WriteError(w, http.StatusBadGateway, "ai_error", "gagal transkrip wawancara lewat AI")
		return
	}

	httpx.WriteJSON(w, http.StatusOK, result)
}

func (h *Handler) handleMatch(w http.ResponseWriter, r *http.Request) {
	if !h.ensureConfigured(w) {
		return
	}

	var req struct {
		ApplicationID  string `json:"applicationId"`
		JobID          string `json:"jobId"`
		CVSummary      string `json:"cvSummary"`
		JobDescription string `json:"jobDescription"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}

	result, err := h.client.MatchCandidate(r.Context(), MatchRequest{
		ApplicationID:  req.ApplicationID,
		JobID:          req.JobID,
		CVSummary:      req.CVSummary,
		JobDescription: req.JobDescription,
	})
	if err != nil {
		log.Printf("[aiengine] match candidate error: %v", err)
		httpx.WriteError(w, http.StatusBadGateway, "ai_error", "gagal mencocokkan kandidat lewat AI")
		return
	}

	httpx.WriteJSON(w, http.StatusOK, result)
}

func (h *Handler) handleEmbed(w http.ResponseWriter, r *http.Request) {
	if !h.ensureConfigured(w) {
		return
	}

	var req struct {
		Text string `json:"text"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		httpx.WriteError(w, http.StatusBadRequest, "invalid_request", "request body gak valid")
		return
	}

	result, err := h.client.EmbedText(r.Context(), EmbedRequest{Text: req.Text})
	if err != nil {
		log.Printf("[aiengine] embed text error: %v", err)
		httpx.WriteError(w, http.StatusBadGateway, "ai_error", "gagal embedding teks lewat AI")
		return
	}

	httpx.WriteJSON(w, http.StatusOK, result)
}
