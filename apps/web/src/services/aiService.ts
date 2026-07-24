/**
 * Service layer buat fitur AI -- semua request ke LLM (chat, CV parsing,
 * scoring, matching) lewat api-go (/v1/ai/*), BUKAN langsung ke ai-engine.
 *
 * Chat streaming pakai SSE (Server-Sent Events) -- api-go proxy stream
 * dari ai-engine biar token muncul satu per satu di UI.
 */

import { apiFetch, isApiConfigured, getAuthToken, ApiError } from "./apiClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// --- Types ---

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatStreamChunk {
  content: string;
  done: boolean;
  error?: string;
  provider?: string;
  latency_ms?: number;
}

export interface ParsedWorkHistoryItem {
  role: string;
  company: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface ParsedEducationItem {
  school: string;
  degree: string;
  start_year: string;
  end_year: string;
}

export interface ParsedLinkItem {
  platform: string;
  url: string;
}

export interface ParseCVResult {
  summary: string;
  skills: string[];
  work_experience_years: number | null;
  name?: string;
  location?: string;
  phone?: string;
  age?: number | null;
  gender?: string;
  links?: ParsedLinkItem[];
  work_history?: ParsedWorkHistoryItem[];
  education?: ParsedEducationItem[];
}

export interface ScoreValidationResult {
  recommendation_score: number;
  authenticity_score: {
    authentic: number;
    generic: number;
    aiGenerated: number;
  };
}

export interface MatchResult {
  similarity_score: number;
  matched_evidence: string[];
}

// --- Chat Streaming ---

/**
 * Stream chat response dari AI lewat SSE. Callback `onChunk` dipanggil
 * setiap ada token baru dari LLM.
 *
 * @returns Promise yang resolve begitu stream selesai.
 */
export async function streamChat(
  sessionId: string,
  messages: ChatMessage[],
  onChunk: (chunk: ChatStreamChunk) => void,
  signal?: AbortSignal,
): Promise<void> {
  if (!isApiConfigured) {
    // Fallback kalau API belum diset -- simulasi response biar UI tetap jalan
    onChunk({
      content: "AI engine belum terhubung. Set NEXT_PUBLIC_API_BASE_URL untuk mengaktifkan fitur AI.",
      done: true,
    });
    return;
  }

  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/v1/ai/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ session_id: sessionId, messages }),
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    onChunk({
      content: "",
      done: true,
      error: errorBody?.error?.message || `AI error: ${response.status}`,
    });
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    onChunk({ content: "", done: true, error: "Streaming tidak didukung browser ini" });
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Parse SSE lines: "data: {...}\n\n"
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";  // simpan sisa yang belum lengkap

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data: ")) continue;

        const jsonStr = trimmed.slice(6); // hapus "data: "
        try {
          const chunk: ChatStreamChunk = JSON.parse(jsonStr);
          onChunk(chunk);
          if (chunk.done) return;
        } catch {
          // Abaikan line yang bukan JSON valid (bisa jadi SSE comment)
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// --- CV Parsing ---

export async function parseCV(
  applicationId: string,
  cvObjectKey: string,
): Promise<ParseCVResult> {
  return apiFetch<ParseCVResult>("/v1/ai/cv/parse", {
    method: "POST",
    body: JSON.stringify({ applicationId, cvObjectKey }),
  });
}

// --- Assessment Scoring ---

export async function scoreValidation(
  applicationId: string,
  responses: Array<{ question: string; answer: string }>,
): Promise<ScoreValidationResult> {
  return apiFetch<ScoreValidationResult>("/v1/ai/assessment/score", {
    method: "POST",
    body: JSON.stringify({ applicationId, responses }),
  });
}

// --- Candidate Matching ---

export async function matchCandidate(
  applicationId: string,
  jobId: string,
  cvSummary: string,
  jobDescription: string,
): Promise<MatchResult> {
  return apiFetch<MatchResult>("/v1/ai/match", {
    method: "POST",
    body: JSON.stringify({ applicationId, jobId, cvSummary, jobDescription }),
  });
}

// --- AI Screening (per-lamaran, dipersist backend, dipakai HRD) ---
//
// Beda sama parseCV/matchCandidate di atas: fungsi-fungsi di bawah ini
// manggil /v1/applications/{id}/... (bukan /v1/ai/...) -- endpoint yang
// baca CV dari Candidate.CvFileURL yang udah tersimpan, jalanin CV-parse +
// job-match, DAN nyimpen hasilnya ke Postgres, jadi gak perlu dihitung ulang
// tiap kali halaman detail kandidat dibuka.

export interface LLMAssessment {
  requirement: string;
  category: string;
  importance: string;
  match_status: string;
  evidence_strength: string;
  relationship: string;
  evidence_text?: string;
  source_section?: string;
  reasoning: string;
  score: number;
}

export interface ComponentScore {
  score: number;         // 0.0 – 1.0
  weight: number;        // bobot persen
  weighted_score: number;
  status: string;
  summary: string;
  matched_count: number;
  partial_count: number;
  missing_count: number;
  assessments: LLMAssessment[];
}

export interface WeightConfig {
  skillMatch: number;
  experience: number;
  education: number;
  responsibilities: number;
  additional: number;
}

export interface ScreeningResult {
  cvSummary: string;
  skills: string[];
  workExperienceYears: number | null;
  overallScore: number;
  finalWeightedScore?: number;
  category?: string;
  candidateTrack?: string;
  reasoning?: string;
  quotes?: string[];
  matchedEvidence?: string[]; // legacy
  
  // MVP Evidence-Based Scoring fields
  eligibilityStatus?: string;
  matchScore?: number;
  recommendationStatus?: string;
  evidenceCoverage?: string;
  keyGaps?: string[];

  componentScores?: {
    skill_match?: ComponentScore;
    experience?: ComponentScore;
    education?: ComponentScore;
    responsibilities?: ComponentScore;
    additional?: ComponentScore;
  };
  weightsUsed?: WeightConfig;
  careerConsistencyNote?: string;
}

export async function screenApplication(applicationId: string, force: boolean = false): Promise<ScreeningResult> {
  const query = force ? "?force=true" : "";
  return apiFetch<ScreeningResult>(`/v1/applications/${applicationId}/screen${query}`, { method: "POST" });
}

export async function getScreeningResult(applicationId: string): Promise<ScreeningResult | null> {
  try {
    return await apiFetch<ScreeningResult>(`/v1/applications/${applicationId}/screening`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

// --- Cross-role recommendation (lowongan lain yang cocok buat CV kandidat) ---
//
// Butuh kandidat ini udah discreen dulu (reuse ringkasan CV-nya) -- kalau
// belum, backend balikin 422 screening_required.

export interface CrossRoleMatch {
  jobId: string;
  jobTitle: string;
  score: number;
  matchedEvidence: string[];
}

export async function getCrossRoleRecommendations(applicationId: string): Promise<CrossRoleMatch[]> {
  const data = await apiFetch<{ matches: CrossRoleMatch[] }>(`/v1/applications/${applicationId}/cross-role`);
  return data.matches;
}

/** HRD menawarkan posisi lain ke kandidat -- backend cuma kirim
 * notifikasi + email ajakan, TIDAK memindahkan kandidat. Kandidat yang
 * memutuskan mau melamar (lewat seleksi role baru) atau nggak. */
export async function offerCrossRole(applicationId: string, jobId: string): Promise<void> {
  await apiFetch(`/v1/applications/${applicationId}/cross-role/offer`, {
    method: "POST",
    body: JSON.stringify({ jobId }),
  });
}

// --- Pre-screening (3 pertanyaan singkat sebelum wawancara AI yang lebih mahal) ---

export interface PreScreenAnswer {
  question: string;
  answer: string;
}

export async function generatePreScreenQuestions(applicationId: string): Promise<string[]> {
  const res = await apiFetch<{ questions: string[] }>(`/v1/applications/${applicationId}/prescreen/questions`, {
    method: "POST",
  });
  return res.questions;
}

export interface PreScreenResult {
  passed: boolean;
  score: number;
}

export async function submitPreScreen(applicationId: string, responses: PreScreenAnswer[]): Promise<PreScreenResult> {
  return apiFetch<PreScreenResult>(`/v1/applications/${applicationId}/prescreen/submit`, {
    method: "POST",
    body: JSON.stringify({ responses }),
  });
}

export interface PreScreenGetResult {
  status: string;
  score: number | null;
  items: PreScreenAnswer[];
}

export async function getPreScreenResult(applicationId: string): Promise<PreScreenGetResult | null> {
  try {
    return await apiFetch<PreScreenGetResult>(`/v1/applications/${applicationId}/prescreen`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

// --- AI Interview (kamera+mic wajib buat proctoring, jawaban direkam suara) ---

export async function generateInterviewQuestions(applicationId: string): Promise<string[]> {
  const res = await apiFetch<{ questions: string[] }>(`/v1/applications/${applicationId}/interview/questions`, {
    method: "POST",
  });
  return res.questions;
}

export async function getAudioUploadUrl(
  applicationId: string,
  questionIndex: number,
): Promise<{ uploadUrl: string; objectKey: string }> {
  return apiFetch(`/v1/applications/${applicationId}/interview/audio-upload-url`, {
    method: "POST",
    body: JSON.stringify({ questionIndex }),
  });
}

export interface ProctorCheckResult {
  flagged: boolean;
  reason: string | null;
}

export async function proctorCheck(applicationId: string, imageBase64: string): Promise<ProctorCheckResult> {
  return apiFetch<ProctorCheckResult>(`/v1/applications/${applicationId}/interview/proctor-check`, {
    method: "POST",
    body: JSON.stringify({ imageBase64 }),
  });
}

export interface TranscribeAnswerResult {
  transcript: string;
  analysisSummary: string;
}

export async function transcribeAnswer(
  applicationId: string,
  objectKey: string,
  questionIndex: number,
  questionText: string,
): Promise<TranscribeAnswerResult> {
  return apiFetch<TranscribeAnswerResult>(`/v1/applications/${applicationId}/interview/transcribe`, {
    method: "POST",
    body: JSON.stringify({ objectKey, questionIndex, questionText }),
  });
}

export interface FinalizeInterviewResult {
  recommendationScore: number | null;
  authenticityScore?: { authentic: number; generic: number; aiGenerated: number };
}

export async function finalizeInterview(applicationId: string): Promise<FinalizeInterviewResult> {
  return apiFetch<FinalizeInterviewResult>(`/v1/applications/${applicationId}/interview/finalize`, {
    method: "POST",
  });
}

export interface InterviewItem {
  questionIndex: number;
  question: string;
  answer: string;
  aiFeedback?: string;
}

export interface ProctoringFlag {
  at: string;
  reason: string;
}

export interface InterviewCompetency {
  score: number;
  match_status: string;
  reasoning: string;
  quotes: string[];
}

export interface InterviewResult {
  status: string;
  recommendationScore?: number;
  competencyScores?: Record<string, InterviewCompetency>;
  evidenceConfidence?: string;
  items: InterviewItem[];
  proctoringFlags: { at: string; reason: string }[];
}

export async function getInterviewResult(applicationId: string): Promise<InterviewResult | null> {
  try {
    return await apiFetch<InterviewResult>(`/v1/applications/${applicationId}/interview`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function getInterviewAudioUrl(applicationId: string, questionIndex: number): Promise<string> {
  const res = await apiFetch<{ url: string }>(`/v1/applications/${applicationId}/interview/audio/${questionIndex}`);
  return res.url;
}
