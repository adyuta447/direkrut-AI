"""Dual-track assessment: validasi kompetensi tertulis + interview video.

Menangani analisis transkrip wawancara pakai NLP (hasil Speech-to-Text
dari Whisper API), penilaian jawaban validasi kompetensi, dan deteksi
integritas (jawaban otentik vs hasil AI generatif).
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


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


@router.post("/score-validation", response_model=ScoreValidationResponse)
async def score_validation(payload: ScoreValidationRequest) -> ScoreValidationResponse:
    # TODO: nilai tiap jawaban dengan AIProvider.complete(), agregasi jadi
    # recommendation_score, dan jalankan deteksi integritas jawaban.
    raise NotImplementedError


@router.post("/transcribe-interview", response_model=TranscribeInterviewResponse)
async def transcribe_interview(payload: TranscribeInterviewRequest) -> TranscribeInterviewResponse:
    # TODO: kirim audio ke Whisper API buat Speech-to-Text (support
    # berbagai aksen bahasa Indonesia), lalu analisis transkrip dengan NLP.
    raise NotImplementedError
