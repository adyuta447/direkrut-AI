"""Dual-track assessment: validasi kompetensi tertulis + interview video.

Menangani analisis transkrip wawancara pakai NLP (hasil Speech-to-Text
dari Groq Whisper), penilaian jawaban validasi kompetensi, dan deteksi
integritas (jawaban otentik vs hasil AI generatif).
"""

from __future__ import annotations

import base64
import json
import time

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.cache import get_or_set, make_cache_key
from app.logging import log_ai_call
from app.providers import GeminiProvider, GroqProvider
from app.rate_limit import limit
from app.storage import download_object

router = APIRouter(dependencies=[Depends(limit("assessment"))])


class ValidationAnswer(BaseModel):
    question: str
    answer: str


class ScoreValidationRequest(BaseModel):
    application_id: str
    responses: list[ValidationAnswer]


class ScoreValidationResponse(BaseModel):
    recommendation_score: float
    authenticity_score: dict[str, float]


class TranscribeInterviewRequest(BaseModel):
    application_id: str
    audio_object_key: str


class TranscribeInterviewResponse(BaseModel):
    transcript: str
    analysis_summary: str


class GenerateQuestionsRequest(BaseModel):
    job_description: str
    cv_summary: str | None = None


class GenerateQuestionsResponse(BaseModel):
    questions: list[str]


class ProctorCheckRequest(BaseModel):
    application_id: str
    image_base64: str


class ProctorCheckResponse(BaseModel):
    flagged: bool
    reason: str | None = None


_SCORING_SYSTEM_PROMPT = (
    "Kamu adalah asisten HR yang menilai jawaban validasi kompetensi kandidat. "
    "Balas HANYA dengan JSON valid, tanpa markdown code fence, berbentuk: "
    '{"recommendation_score": number 0-100, '
    '"authenticity_score": {"authentic": number, "generic": number, "aiGenerated": number}} '
    "(tiga nilai authenticity_score harus totalnya 100."
)


def _format_responses(responses: list[ValidationAnswer]) -> str:
    return "\n\n".join(f"Q: {r.question}\nA: {r.answer}" for r in responses)


def _parse_scoring_json(raw: str) -> ScoreValidationResponse:
    try:
        data = json.loads(raw)
        return ScoreValidationResponse(
            recommendation_score=float(data["recommendation_score"]),
            authenticity_score={k: float(v) for k, v in data["authenticity_score"].items()},
        )
    except (json.JSONDecodeError, KeyError, TypeError, ValueError):
        return ScoreValidationResponse(
            recommendation_score=0.0,
            authenticity_score={"authentic": 0.0, "generic": 0.0, "aiGenerated": 0.0},
        )


@router.post("/score-validation", response_model=ScoreValidationResponse)
async def score_validation(payload: ScoreValidationRequest) -> ScoreValidationResponse:
    cache_key = make_cache_key(
        "score_validation",
        payload.application_id,
        _format_responses(payload.responses),
    )

    async def compute() -> dict:
        provider = GroqProvider()
        started = time.monotonic()
        raw_result = await provider.complete(_format_responses(payload.responses), system=_SCORING_SYSTEM_PROMPT)
        log_ai_call(provider="groq", model=provider.COMPLETE_MODEL, latency_ms=(time.monotonic() - started) * 1000, cache_hit=False)
        return _parse_scoring_json(raw_result).model_dump()

    result, cache_hit = await get_or_set(cache_key, compute)
    if cache_hit:
        log_ai_call(provider="cache", model="-", latency_ms=0.0, cache_hit=True)
    return ScoreValidationResponse(**result)


_ANALYSIS_SYSTEM_PROMPT = (
    "Kamu adalah asisten HR yang meringkas transkrip wawancara kandidat. "
    "Balas dalam 2-3 kalimat ringkasan analisis (bukan JSON, teks biasa)."
)


@router.post("/transcribe-interview", response_model=TranscribeInterviewResponse)
async def transcribe_interview(payload: TranscribeInterviewRequest) -> TranscribeInterviewResponse:
    cache_key = make_cache_key("transcribe_interview", payload.application_id, payload.audio_object_key)

    async def compute() -> dict:
        provider = GroqProvider()
        audio_bytes = download_object(payload.audio_object_key)

        started = time.monotonic()
        transcript = await provider.transcribe(audio_bytes, filename=payload.audio_object_key.rsplit("/", 1)[-1])
        log_ai_call(provider="groq", model=provider.WHISPER_MODEL, latency_ms=(time.monotonic() - started) * 1000, cache_hit=False)

        started = time.monotonic()
        summary = await provider.complete(transcript, system=_ANALYSIS_SYSTEM_PROMPT)
        log_ai_call(provider="groq", model=provider.COMPLETE_MODEL, latency_ms=(time.monotonic() - started) * 1000, cache_hit=False)

        return TranscribeInterviewResponse(transcript=transcript, analysis_summary=summary).model_dump()

    result, cache_hit = await get_or_set(cache_key, compute)
    if cache_hit:
        log_ai_call(provider="cache", model="-", latency_ms=0.0, cache_hit=True)
    return TranscribeInterviewResponse(**result)


_QUESTIONS_SYSTEM_PROMPT = (
    "Kamu adalah pewawancara HR yang berpengalaman selama 10 tahun lebih. Diberikan deskripsi lowongan (dan opsional "
    "ringkasan CV kandidat), buat 4-5 pertanyaan interview yang relevan -- "
    "campuran teknis dan perilaku, spesifik ke lowongan ini, bukan pertanyaan "
    "generik. Balas HANYA dengan JSON valid, tanpa markdown code fence, "
    'berbentuk: {"questions": ["pertanyaan 1", "pertanyaan 2", ...]}'
)

_FALLBACK_QUESTIONS = [
    "Ceritakan pengalaman kerja yang paling relevan dengan posisi ini.",
    "Apa tantangan terbesar yang pernah kamu hadapi di pekerjaan sebelumnya, dan bagaimana kamu mengatasinya?",
    "Kenapa kamu tertarik dengan posisi ini?",
    "Ceritakan situasi di mana kamu harus bekerja dalam tim untuk mencapai target.",
]


def _parse_questions_json(raw: str) -> GenerateQuestionsResponse:
    try:
        data = json.loads(raw)
        questions = [str(q) for q in data["questions"]]
        if not questions:
            raise ValueError("empty questions list")
        return GenerateQuestionsResponse(questions=questions)
    except (json.JSONDecodeError, KeyError, TypeError, ValueError):
        return GenerateQuestionsResponse(questions=_FALLBACK_QUESTIONS)


@router.post("/generate-questions", response_model=GenerateQuestionsResponse)
async def generate_questions(payload: GenerateQuestionsRequest) -> GenerateQuestionsResponse:
    cache_key = make_cache_key("generate_questions", payload.job_description, payload.cv_summary or "")

    async def compute() -> dict:
        provider = GroqProvider()
        prompt = f"Deskripsi lowongan:\n{payload.job_description}"
        if payload.cv_summary:
            prompt += f"\n\nRingkasan CV kandidat:\n{payload.cv_summary}"

        started = time.monotonic()
        raw_result = await provider.complete(prompt, system=_QUESTIONS_SYSTEM_PROMPT)
        log_ai_call(provider="groq", model=provider.COMPLETE_MODEL, latency_ms=(time.monotonic() - started) * 1000, cache_hit=False)
        return _parse_questions_json(raw_result).model_dump()

    result, cache_hit = await get_or_set(cache_key, compute)
    if cache_hit:
        log_ai_call(provider="cache", model="-", latency_ms=0.0, cache_hit=True)
    return GenerateQuestionsResponse(**result)


_PROCTOR_SYSTEM_PROMPT = (
    "Kamu adalah sistem pengawas ujian (proctoring) yang menganalisis satu "
    "frame webcam dari sesi interview kandidat. Deteksi tanda-tanda kecurangan: "
    "tidak ada wajah terlihat, lebih dari satu orang di frame, kandidat "
    "terlihat membaca dari perangkat lain (HP/kertas contekan). "
    "Balas HANYA dengan JSON valid, tanpa markdown code fence, berbentuk: "
    '{"flagged": boolean, "reason": string|null} '
    "(reason singkat dalam Bahasa Indonesia, null kalau flagged false)."
)


def _parse_proctor_json(raw: str) -> ProctorCheckResponse:
    try:
        data = json.loads(raw)
        return ProctorCheckResponse(
            flagged=bool(data["flagged"]),
            reason=(str(data["reason"]) if data.get("reason") else None),
        )
    except (json.JSONDecodeError, KeyError, TypeError, ValueError):
        # Gagal parse -> jangan flag palsu, cukup gak ke-check frame ini.
        return ProctorCheckResponse(flagged=False, reason=None)


@router.post("/proctor-check", response_model=ProctorCheckResponse)
async def proctor_check(payload: ProctorCheckRequest) -> ProctorCheckResponse:
    """Cek satu frame webcam buat tanda kecurangan. TIDAK di-cache (tiap
    frame unik, beda waktu) dan gambar dikirim langsung sebagai base64 di
    body request -- bukan lewat object storage kayak cv_parser.py, karena
    frame proctoring itu sering & ephemeral, bukan file yang perlu tersimpan
    permanen."""
    try:
        image_bytes = base64.b64decode(payload.image_base64)
    except (ValueError, TypeError):
        return ProctorCheckResponse(flagged=False, reason=None)

    provider = GeminiProvider()
    started = time.monotonic()
    raw_result = await provider.complete(
        "Analisis frame webcam ini untuk tanda kecurangan interview.",
        system=_PROCTOR_SYSTEM_PROMPT,
        image_bytes=image_bytes,
        image_mime_type="image/jpeg",
    )
    log_ai_call(provider="gemini", model=provider.COMPLETE_MODEL, latency_ms=(time.monotonic() - started) * 1000, cache_hit=False)
    return _parse_proctor_json(raw_result)
