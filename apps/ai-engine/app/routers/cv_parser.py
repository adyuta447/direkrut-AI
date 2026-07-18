"""Parsing dan ekstraksi keahlian dari CV.

Menerima file CV (dari object storage, di-upload lewat apps/api-go),
mengekstrak riwayat kerja, skill, dan kualifikasi terstruktur, lalu
mengembalikan hasilnya buat disimpan sebagai cv_summary di Postgres.

Dua jalur ekstraksi tergantung ekstensi file:
  - PDF  -> ekstrak teks (pypdf) -> GroqProvider.complete()
  - gambar (jpg/png/webp) -> GeminiProvider.complete() (vision), karena
    model Llama Groq gak nerima input gambar.
Rasterisasi PDF hasil scan (gak ada teks yang bisa diekstrak) SENGAJA di
luar scope -- butuh dependency system-level (poppler) yang gak sepadan buat
prototype ini; endpoint balikin 422 yang jelas daripada gagal diam-diam.
"""

from __future__ import annotations

import io
import json
import time

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from pypdf import PdfReader

from app.cache import get_or_set, make_cache_key
from app.logging import log_ai_call
from app.providers import AIProvider, GeminiProvider, GroqProvider
from app.rate_limit import limit
from app.storage import download_object

# X-Internal-Api-Key dicek satu kali secara global di main.py buat semua
# router /v1/* -- di sini cuma nambahin rate limit yang spesifik buat
# endpoint yang beneran manggil provider AI berbayar.
router = APIRouter(dependencies=[Depends(limit("cv_parser"))])

_IMAGE_MIME_BY_EXTENSION = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}

_EXTRACTION_SYSTEM_PROMPT = (
    "Kamu adalah asisten HR yang mengekstrak informasi terstruktur dari CV. "
    "Balas HANYA dengan JSON valid, tanpa markdown code fence, berbentuk: "
    '{"summary": string, "skills": [string], "work_experience_years": number|null}'
)


class ParseCVRequest(BaseModel):
    cv_object_key: str
    application_id: str


class ParsedCV(BaseModel):
    summary: str
    skills: list[str]
    work_experience_years: float | None = None


def _extract_pdf_text(raw: bytes) -> str:
    reader = PdfReader(io.BytesIO(raw))
    return "\n".join(page.extract_text() or "" for page in reader.pages).strip()


def _parse_ai_json(raw: str) -> ParsedCV:
    try:
        data = json.loads(raw)
        return ParsedCV(
            summary=str(data.get("summary", "")),
            skills=[str(s) for s in data.get("skills", [])],
            work_experience_years=data.get("work_experience_years"),
        )
    except (json.JSONDecodeError, TypeError, AttributeError):
        # Model kadang gak strictly nurut instruksi format JSON -- daripada
        # 500, balikin teks mentah sbg summary biar tetap ada yang berguna.
        return ParsedCV(summary=raw.strip(), skills=[], work_experience_years=None)


def _file_extension(object_key: str) -> str:
    if "." not in object_key:
        return ""
    return "." + object_key.rsplit(".", 1)[-1].lower()


async def _compute_parsed_cv(object_key: str) -> ParsedCV:
    raw_bytes = download_object(object_key)
    extension = _file_extension(object_key)
    started = time.monotonic()

    provider: AIProvider
    if extension in _IMAGE_MIME_BY_EXTENSION:
        provider = GeminiProvider()
        result = await provider.complete(
            "Ekstrak informasi CV dari gambar ini.",
            system=_EXTRACTION_SYSTEM_PROMPT,
            image_bytes=raw_bytes,
            image_mime_type=_IMAGE_MIME_BY_EXTENSION[extension],
        )
        provider_name, model_name = "gemini", provider.COMPLETE_MODEL
    elif extension == ".pdf":
        text = _extract_pdf_text(raw_bytes)
        if not text:
            raise HTTPException(
                status_code=422,
                detail="PDF gak punya teks yang bisa diekstrak (kemungkinan hasil scan) -- "
                "rasterisasi PDF-ke-gambar di luar scope prototype ini",
            )
        provider = GroqProvider()
        result = await provider.complete(text, system=_EXTRACTION_SYSTEM_PROMPT)
        provider_name, model_name = "groq", provider.COMPLETE_MODEL
    else:
        raise HTTPException(status_code=422, detail=f"format file '{extension or '(tanpa ekstensi)'}' belum didukung -- cuma PDF & gambar (jpg/png/webp)")

    log_ai_call(provider=provider_name, model=model_name, latency_ms=(time.monotonic() - started) * 1000, cache_hit=False)
    return _parse_ai_json(result)


@router.post("/parse", response_model=ParsedCV)
async def parse_cv(payload: ParseCVRequest) -> ParsedCV:
    cache_key = make_cache_key("cv_parse", payload.cv_object_key, payload.application_id)

    async def compute() -> dict:
        parsed = await _compute_parsed_cv(payload.cv_object_key)
        return parsed.model_dump()

    result, cache_hit = await get_or_set(cache_key, compute)
    if cache_hit:
        log_ai_call(provider="cache", model="-", latency_ms=0.0, cache_hit=True)
    return ParsedCV(**result)
