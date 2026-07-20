/**
 * Service layer buat fitur AI -- semua request ke LLM (chat, CV parsing,
 * scoring, matching) lewat api-go (/v1/ai/*), BUKAN langsung ke ai-engine.
 *
 * Chat streaming pakai SSE (Server-Sent Events) -- api-go proxy stream
 * dari ai-engine biar token muncul satu per satu di UI.
 */

import { apiFetch, isApiConfigured, getAuthToken } from "./apiClient";

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

export interface ParseCVResult {
  summary: string;
  skills: string[];
  work_experience_years: number | null;
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
