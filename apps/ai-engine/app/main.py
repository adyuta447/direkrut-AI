"""Entry point Direkrut AI AI Engine.

Layanan ini menangani seluruh proses kecerdasan buatan: parsing dan
ekstraksi keahlian dari CV, vector search berbasis cosine similarity buat
mencocokkan kandidat dengan lowongan, analisis transkrip wawancara pakai
NLP, logika dual-track assessment, dan Chat AI thinking partner.

Provider AI dirancang model-agnostic (OpenAI, Gemini, Groq, dst) lewat
app/providers.py, jadi tiap perusahaan bisa pilih provider sesuai budget.
Layanan ini dipanggil oleh apps/api-go lewat internal REST API, bukan
diakses langsung oleh apps/web -- makanya trust boundary-nya BUKAN CORS
(gak pernah ada request browser ke sini), tapi shared-secret header
X-Internal-Api-Key (lihat app/security.py), dicek global di semua router
/v1/* lewat dependencies= di include_router.
"""

from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI

from app.cache import ping as redis_ping
from app.config import get_settings
from app.errors import register_error_handlers
from app.logging import RequestIDMiddleware, configure_logging
from app.routers import assessment, chat, cv_parser, vector_search
from app.security import require_internal_key


@asynccontextmanager
async def lifespan(_app: FastAPI):
    configure_logging()
    yield


app = FastAPI(
    title="Direkrut AI - AI Engine",
    description="Layanan internal buat parsing CV, vector search, assessment, dan chat AI.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(RequestIDMiddleware)
register_error_handlers(app)

_internal_only = [Depends(require_internal_key)]
app.include_router(cv_parser.router, prefix="/v1/cv-parser", tags=["cv-parser"], dependencies=_internal_only)
app.include_router(vector_search.router, prefix="/v1/vector-search", tags=["vector-search"], dependencies=_internal_only)
app.include_router(assessment.router, prefix="/v1/assessment", tags=["assessment"], dependencies=_internal_only)
app.include_router(chat.router, prefix="/v1/chat", tags=["chat"], dependencies=_internal_only)


@app.get("/healthz")
def health_check() -> dict[str, str]:
    """Pure liveness check -- selalu 200 selama proses hidup. Buat cek
    dependency (Postgres/Redis) beneran nyala, pakai /readyz."""
    return {"status": "ok", "service": "ai-engine"}


@app.get("/readyz")
async def ready_check() -> dict[str, str]:
    settings = get_settings()
    if not settings.internal_api_key:
        return {"status": "not_configured"}
    if not await redis_ping():
        return {"status": "redis_unavailable"}
    return {"status": "ready"}
