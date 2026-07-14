"""Parsing dan ekstraksi keahlian dari CV.

Menerima file CV (dari object storage, di-upload lewat apps/api-go),
mengekstrak riwayat kerja, skill, dan kualifikasi terstruktur, lalu
mengembalikan hasilnya buat disimpan sebagai cv_summary di Postgres.
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ParseCVRequest(BaseModel):
    cv_object_key: str
    application_id: str


class ParsedCV(BaseModel):
    summary: str
    skills: list[str]
    work_experience_years: float | None = None


@router.post("/parse", response_model=ParsedCV)
async def parse_cv(payload: ParseCVRequest) -> ParsedCV:
    # TODO: unduh file dari object storage, ekstrak teks (PDF/DOCX),
    # lalu panggil AIProvider.complete() dengan prompt terstruktur
    # buat ekstraksi riwayat kerja + skill.
    raise NotImplementedError
