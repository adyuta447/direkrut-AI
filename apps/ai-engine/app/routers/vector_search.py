"""Vector search berbasis cosine similarity.

Mencocokkan embedding CV kandidat dengan embedding deskripsi lowongan
yang tersimpan di kolom pgvector, buat fitur rekomendasi posisi dan
ranking kandidat.

Embedding dihasilkan oleh GeminiProvider (text-embedding-004), karena
Groq belum menyediakan embeddings API. Untuk match, saat ini pakai
in-memory cosine similarity (belum ada koneksi pgvector langsung dari
ai-engine) -- nanti bisa dioptimasi pakai query pgvector di Postgres
begitu infranya siap.
"""

from __future__ import annotations

import asyncio
import json
import logging
import math
import time

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.cache import get_or_set, make_cache_key
from app.logging import log_ai_call
from app.prompt_guard import INJECTION_GUARD, wrap_untrusted
from app.providers import get_provider_for_task
from app.rate_limit import limit

logger = logging.getLogger(__name__)

router = APIRouter(dependencies=[Depends(limit("vector_search"))])


class EmbedRequest(BaseModel):
    text: str


class EmbedResponse(BaseModel):
    embedding: list[float]


class MatchRequest(BaseModel):
    application_id: str
    job_id: str
    cv_summary: str
    job_description: str


class MatchResponse(BaseModel):
    similarity_score: float
    matched_evidence: list[str]


def _cosine_similarity(a: list[float], b: list[float]) -> float:
    """Hitung cosine similarity antara dua vector. Return 0.0 kalau
    salah satu vector kosong atau magnitude-nya nol."""
    if len(a) != len(b) or not a:
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(x * x for x in b))
    if mag_a == 0.0 or mag_b == 0.0:
        return 0.0
    return dot / (mag_a * mag_b)


_EVIDENCE_SYSTEM_PROMPT = (
    "Kamu adalah asisten HR. Diberikan ringkasan CV kandidat dan deskripsi "
    "lowongan, identifikasi 3-5 kecocokan spesifik antara keahlian/pengalaman "
    "kandidat dengan persyaratan lowongan. "
    "Balas HANYA dengan JSON valid, tanpa markdown code fence, berbentuk: "
    '{"matched_evidence": ["kecocokan 1", "kecocokan 2", ...]}'
    "\n\n" + INJECTION_GUARD
)


@router.post("/embed", response_model=EmbedResponse)
async def embed_text(payload: EmbedRequest) -> EmbedResponse:
    """Generate embedding vector dari teks. Pakai Gemini text-embedding-004."""
    cache_key = make_cache_key("embed", payload.text)

    async def compute() -> dict:
        provider = get_provider_for_task("embed")
        started = time.monotonic()
        embedding = await provider.embed(payload.text)
        log_ai_call(
            provider="gemini",
            model="gemini-embedding-001",
            latency_ms=(time.monotonic() - started) * 1000,
            cache_hit=False,
        )
        return {"embedding": embedding}

    result, cache_hit = await get_or_set(cache_key, compute)
    if cache_hit:
        log_ai_call(provider="cache", model="-", latency_ms=0.0, cache_hit=True)
    return EmbedResponse(**result)


@router.post("/match", response_model=MatchResponse)
async def match_candidate_to_job(payload: MatchRequest) -> MatchResponse:
    """Hitung kecocokan kandidat dengan lowongan:
    1. Embed CV summary dan job description pakai Gemini
    2. Hitung cosine similarity
    3. Identifikasi bukti kecocokan spesifik pakai Groq (LLM analysis)
    """
    cache_key = make_cache_key(
        "match",
        payload.application_id,
        payload.job_id,
        payload.cv_summary,
        payload.job_description,
    )

    async def compute() -> dict:
        embed_provider = get_provider_for_task("embed")
        complete_provider = get_provider_for_task("complete")

        started = time.monotonic()

        cv_embed_task = asyncio.create_task(embed_provider.embed(payload.cv_summary))
        job_embed_task = asyncio.create_task(embed_provider.embed(payload.job_description))
        cv_embedding, job_embedding = await asyncio.gather(cv_embed_task, job_embed_task)

        embed_latency = (time.monotonic() - started) * 1000
        log_ai_call(
            provider="gemini",
            model="gemini-embedding-001",
            latency_ms=embed_latency,
            cache_hit=False,
        )

        # Step 2: Cosine similarity
        similarity = _cosine_similarity(cv_embedding, job_embedding)

        # Step 3: Identifikasi bukti kecocokan pakai LLM
        match_prompt = (
            wrap_untrusted("RINGKASAN_CV_KANDIDAT", payload.cv_summary)
            + "\n\n"
            + wrap_untrusted("DESKRIPSI_LOWONGAN", payload.job_description)
        )
        started = time.monotonic()
        raw_evidence = await complete_provider.complete(
            match_prompt, system=_EVIDENCE_SYSTEM_PROMPT
        )
        log_ai_call(
            provider="groq",
            model=getattr(complete_provider, "COMPLETE_MODEL", "unknown"),
            latency_ms=(time.monotonic() - started) * 1000,
            cache_hit=False,
        )

        # Parse evidence JSON
        evidence: list[str] = []
        try:
            data = json.loads(raw_evidence)
            evidence = [str(e) for e in data.get("matched_evidence", [])]
        except (json.JSONDecodeError, TypeError, AttributeError):
            logger.warning("Gagal parse evidence JSON: %s", raw_evidence[:200])
            evidence = [raw_evidence.strip()] if raw_evidence.strip() else []

        return MatchResponse(
            similarity_score=round(similarity, 4),
            matched_evidence=evidence,
        ).model_dump()

    result, cache_hit = await get_or_set(cache_key, compute)
    if cache_hit:
        log_ai_call(provider="cache", model="-", latency_ms=0.0, cache_hit=True)
    return MatchResponse(**result)
