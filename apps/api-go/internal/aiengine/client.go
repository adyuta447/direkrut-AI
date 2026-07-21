// Package aiengine berisi HTTP client yang manggil ai-engine (Python/FastAPI)
// dari api-go. Semua request dikirim dengan header X-Internal-Api-Key buat
// autentikasi server-to-server (lihat ai-engine/app/security.py).
//
// Client ini BUKAN dipanggil langsung dari frontend -- frontend manggil
// handler.go di package ini, yang validasi JWT dulu baru forward ke ai-engine.
package aiengine

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// Client adalah HTTP client ke ai-engine.
type Client struct {
	baseURL    string
	apiKey     string
	httpClient *http.Client
}

// NewClient bikin client baru. baseURL contoh: "http://localhost:8000".
func NewClient(baseURL, apiKey string) *Client {
	return &Client{
		baseURL: baseURL,
		apiKey:  apiKey,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// IsConfigured cek apakah AI engine sudah di-configure (base URL + API key
// harus terisi). Biar handler bisa return 503 yang jelas daripada panic.
func (c *Client) IsConfigured() bool {
	return c.baseURL != "" && c.apiKey != ""
}

func (c *Client) newRequest(ctx context.Context, method, path string, body any) (*http.Request, error) {
	var bodyReader io.Reader
	if body != nil {
		jsonBytes, err := json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("aiengine: marshal request body: %w", err)
		}
		bodyReader = bytes.NewReader(jsonBytes)
	}

	req, err := http.NewRequestWithContext(ctx, method, c.baseURL+path, bodyReader)
	if err != nil {
		return nil, fmt.Errorf("aiengine: create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Internal-Api-Key", c.apiKey)
	return req, nil
}

func (c *Client) doJSON(ctx context.Context, method, path string, reqBody, respBody any) error {
	req, err := c.newRequest(ctx, method, path, reqBody)
	if err != nil {
		return err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("aiengine: %s %s: %w", method, path, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		respBytes, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("aiengine: %s %s returned %d: %s", method, path, resp.StatusCode, string(respBytes))
	}

	if respBody != nil {
		if err := json.NewDecoder(resp.Body).Decode(respBody); err != nil {
			return fmt.Errorf("aiengine: decode response: %w", err)
		}
	}
	return nil
}

// --- Request/Response types ---

type ParseCVRequest struct {
	CVObjectKey   string `json:"cv_object_key"`
	ApplicationID string `json:"application_id"`
}

type ParsedWorkHistoryItem struct {
	Role        string `json:"role"`
	Company     string `json:"company"`
	StartDate   string `json:"start_date"`
	EndDate     string `json:"end_date"`
	Description string `json:"description"`
}

type ParsedEducationItem struct {
	School    string `json:"school"`
	Degree    string `json:"degree"`
	StartYear string `json:"start_year"`
	EndYear   string `json:"end_year"`
}

type ParsedLinkItem struct {
	Platform string `json:"platform"`
	URL      string `json:"url"`
}

type ParseCVResponse struct {
	Summary             string                  `json:"summary"`
	Skills              []string                `json:"skills"`
	WorkExperienceYears *float64                `json:"work_experience_years"`
	Name                string                  `json:"name,omitempty"`
	Location            string                  `json:"location,omitempty"`
	Phone               string                  `json:"phone,omitempty"`
	Age                 *float64                `json:"age,omitempty"`
	Gender              string                  `json:"gender,omitempty"`
	Links               []ParsedLinkItem        `json:"links,omitempty"`
	WorkHistory         []ParsedWorkHistoryItem `json:"work_history,omitempty"`
	Education           []ParsedEducationItem   `json:"education,omitempty"`
}

type ValidationAnswer struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
}

type ScoreValidationRequest struct {
	ApplicationID string             `json:"application_id"`
	Responses     []ValidationAnswer `json:"responses"`
}

type ScoreValidationResponse struct {
	RecommendationScore float64            `json:"recommendation_score"`
	AuthenticityScore   map[string]float64 `json:"authenticity_score"`
}

type TranscribeInterviewRequest struct {
	ApplicationID  string `json:"application_id"`
	AudioObjectKey string `json:"audio_object_key"`
}

type TranscribeInterviewResponse struct {
	Transcript      string `json:"transcript"`
	AnalysisSummary string `json:"analysis_summary"`
}

type EmbedRequest struct {
	Text string `json:"text"`
}

type EmbedResponse struct {
	Embedding []float64 `json:"embedding"`
}

type MatchRequest struct {
	ApplicationID  string `json:"application_id"`
	JobID          string `json:"job_id"`
	CVSummary      string `json:"cv_summary"`
	JobDescription string `json:"job_description"`
}

type MatchResponse struct {
	SimilarityScore float64  `json:"similarity_score"`
	MatchedEvidence []string `json:"matched_evidence"`
}

type GenerateQuestionsRequest struct {
	JobDescription string  `json:"job_description"`
	CVSummary      *string `json:"cv_summary,omitempty"`
}

type GenerateQuestionsResponse struct {
	Questions []string `json:"questions"`
}

type GeneratePreScreenQuestionsRequest struct {
	JobDescription string `json:"job_description"`
}

type GeneratePreScreenQuestionsResponse struct {
	Questions []string `json:"questions"`
}

type ProctorCheckRequest struct {
	ApplicationID string `json:"application_id"`
	ImageBase64   string `json:"image_base64"`
}

type ProctorCheckResponse struct {
	Flagged bool    `json:"flagged"`
	Reason  *string `json:"reason"`
}

type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatRequest struct {
	SessionID string        `json:"session_id"`
	Messages  []ChatMessage `json:"messages"`
}

// --- API Methods ---

func (c *Client) ParseCV(ctx context.Context, req ParseCVRequest) (*ParseCVResponse, error) {
	var resp ParseCVResponse
	if err := c.doJSON(ctx, http.MethodPost, "/v1/cv-parser/parse", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (c *Client) ScoreValidation(ctx context.Context, req ScoreValidationRequest) (*ScoreValidationResponse, error) {
	var resp ScoreValidationResponse
	if err := c.doJSON(ctx, http.MethodPost, "/v1/assessment/score-validation", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (c *Client) TranscribeInterview(ctx context.Context, req TranscribeInterviewRequest) (*TranscribeInterviewResponse, error) {
	var resp TranscribeInterviewResponse
	if err := c.doJSON(ctx, http.MethodPost, "/v1/assessment/transcribe-interview", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (c *Client) EmbedText(ctx context.Context, req EmbedRequest) (*EmbedResponse, error) {
	var resp EmbedResponse
	if err := c.doJSON(ctx, http.MethodPost, "/v1/vector-search/embed", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (c *Client) MatchCandidate(ctx context.Context, req MatchRequest) (*MatchResponse, error) {
	var resp MatchResponse
	if err := c.doJSON(ctx, http.MethodPost, "/v1/vector-search/match", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (c *Client) GenerateQuestions(ctx context.Context, req GenerateQuestionsRequest) (*GenerateQuestionsResponse, error) {
	var resp GenerateQuestionsResponse
	if err := c.doJSON(ctx, http.MethodPost, "/v1/assessment/generate-questions", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

type GenerateFeedbackRequest struct {
	JobTitle            string   `json:"job_title"`
	JobDescription      string   `json:"job_description"`
	CVSummary           *string  `json:"cv_summary,omitempty"`
	InterviewSummary    *string  `json:"interview_summary,omitempty"`
	RecommendationScore *float64 `json:"recommendation_score,omitempty"`
}

type GenerateFeedbackResponse struct {
	Feedback string `json:"feedback"`
}

// GenerateFeedback: email feedback pengembangan buat kandidat yang ditolak
// (poin nilai tambah produk -- kandidat selalu dapet arahan, bukan cuma
// penolakan).
func (c *Client) GenerateFeedback(ctx context.Context, req GenerateFeedbackRequest) (*GenerateFeedbackResponse, error) {
	var resp GenerateFeedbackResponse
	if err := c.doJSON(ctx, http.MethodPost, "/v1/assessment/generate-feedback", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (c *Client) GeneratePreScreenQuestions(ctx context.Context, req GeneratePreScreenQuestionsRequest) (*GeneratePreScreenQuestionsResponse, error) {
	var resp GeneratePreScreenQuestionsResponse
	if err := c.doJSON(ctx, http.MethodPost, "/v1/assessment/generate-prescreen-questions", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

func (c *Client) ProctorCheck(ctx context.Context, req ProctorCheckRequest) (*ProctorCheckResponse, error) {
	var resp ProctorCheckResponse
	if err := c.doJSON(ctx, http.MethodPost, "/v1/assessment/proctor-check", req, &resp); err != nil {
		return nil, err
	}
	return &resp, nil
}

// StreamChat mengirim request ke ai-engine /v1/chat/stream dan mengembalikan
// http.Response yang body-nya bisa dibaca sebagai SSE stream. Caller harus
// Close() body setelah selesai.
func (c *Client) StreamChat(ctx context.Context, req ChatRequest) (*http.Response, error) {
	httpReq, err := c.newRequest(ctx, http.MethodPost, "/v1/chat/stream", req)
	if err != nil {
		return nil, err
	}

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("aiengine: stream chat: %w", err)
	}

	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		resp.Body.Close()
		return nil, fmt.Errorf("aiengine: stream chat returned %d: %s", resp.StatusCode, string(body))
	}

	return resp, nil
}
