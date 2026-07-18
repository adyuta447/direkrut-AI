"""Dual-track assessment: validasi kompetensi tertulis + interview video.

Menangani analisis transkrip wawancara pakai NLP (hasil Speech-to-Text
dari Groq Whisper), penilaian jawaban validasi kompetensi, dan deteksi
integritas (jawaban otentik vs hasil AI generatif).
"""

from __future__ import annotations

import json
import time

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.cache import get_or_set, make_cache_key
from app.logging import log_ai_call
from app.providers import GroqProvider
from app.rate_limit import limit
from app.storage import download_object

# X-Internal-Api-Key dicek satu kali secara global di main.py buat semua
# router /v1/* -- di sini cuma nambahin rate limit yang spesifik buat
# endpoint yang beneran manggil provider AI berbayar.
router = APIRouter(dependencies=[Depends(limit("assessment"))])


class ValidationAnswer(BaseModel):
    question: str
    answer: str


class ScoreValidationRequest(BaseModel):
    application_id: str
    responses: list[ValidationAnswer]


class ScoreValidationResponse(BaseModel):
    recommendation_score: float
    authenticity_score: dict[str, float]  # authentic / generic / aiGenerated


class TranscribeInterviewRequest(BaseModel):
    application_id: str
    audio_object_key: str


class TranscribeInterviewResponse(BaseModel):
    transcript: str
    analysis_summary: str


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
        # Fallback netral kalau model gak nurut format -- mending nilai
        # netral yang jelas butuh review manual daripada 500.
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
