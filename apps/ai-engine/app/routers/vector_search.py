"""Vector search berbasis cosine similarity.

Mencocokkan embedding CV kandidat dengan embedding deskripsi lowongan
yang tersimpan di kolom pgvector, buat fitur rekomendasi posisi dan
ranking kandidat.
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class EmbedRequest(BaseModel):
    text: str


class EmbedResponse(BaseModel):
    embedding: list[float]


class MatchRequest(BaseModel):
    application_id: str
    job_id: str


class MatchResponse(BaseModel):
    similarity_score: float
    matched_evidence: list[str]


@router.post("/embed", response_model=EmbedResponse)
async def embed_text(payload: EmbedRequest) -> EmbedResponse:
    # TODO: panggil AIProvider.embed(), kembalikan vector buat disimpan
    # ke kolom cv_embedding di Postgres (pgvector).
    raise NotImplementedError


@router.post("/match", response_model=MatchResponse)
async def match_candidate_to_job(payload: MatchRequest) -> MatchResponse:
    # TODO: hitung cosine similarity antara embedding CV dan embedding
    # lowongan, kembalikan skor + kutipan bukti dari CV (biar transparan,
    # bukan skor kotak hitam).
    raise NotImplementedError
