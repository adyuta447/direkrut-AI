"""Entry point Direkrut AI AI Engine.

Layanan ini menangani seluruh proses kecerdasan buatan: parsing dan
ekstraksi keahlian dari CV, vector search berbasis cosine similarity buat
mencocokkan kandidat dengan lowongan, analisis transkrip wawancara pakai
NLP, logika dual-track assessment, dan Chat AI thinking partner.

Provider AI dirancang model-agnostic (OpenAI, Gemini, Groq, dst) lewat
app/providers.py, jadi tiap perusahaan bisa pilih provider sesuai budget.
Layanan ini dipanggil oleh apps/api-go lewat internal REST API, bukan
diakses langsung oleh apps/web.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import assessment, chat, cv_parser, vector_search

app = FastAPI(
    title="Direkrut AI - AI Engine",
    description="Layanan internal buat parsing CV, vector search, assessment, dan chat AI.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cv_parser.router, prefix="/v1/cv-parser", tags=["cv-parser"])
app.include_router(vector_search.router, prefix="/v1/vector-search", tags=["vector-search"])
app.include_router(assessment.router, prefix="/v1/assessment", tags=["assessment"])
app.include_router(chat.router, prefix="/v1/chat", tags=["chat"])


@app.get("/healthz")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "ai-engine"}
