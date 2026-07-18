"""Structured (JSON) logging + request-ID propagation.

Setiap baris log dapet request_id yang sama dengan header X-Request-Id
(diambil dari request kalau api-go udah mengirimkannya, di-generate sendiri
kalau enggak) -- ini versi MINIMAL dari pilar Observability di diagram
arsitektur (Langfuse/prompt-versioning/latency-cost tracking): belum ada
dependency eksternal baru, tapi data provider/model/latency/cache-hit tiap
panggilan AI udah tercatat & bisa di-query dari log sejak hari pertama.
Cross-service correlation (X-Request-Id diteruskan api-go -> ai-engine)
baru lengkap begitu client HTTP api-go->ai-engine beneran dibangun -- untuk
sekarang, header cuma dibaca kalau ADA, gak dipaksa.
"""

from __future__ import annotations

import json
import logging
import sys
import uuid
from contextvars import ContextVar
from typing import Any

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.types import ASGIApp

_request_id_ctx: ContextVar[str] = ContextVar("request_id", default="-")

# Placeholder kasar, BUKAN harga resmi provider -- cukup buat kasih gambaran
# order-of-magnitude biaya di log. Update kalau udah ada angka pasti per
# model yang benar-benar dipakai.
_PRICE_PER_1K_TOKENS_USD: dict[str, float] = {
    "groq": 0.0,
    "gemini": 0.0,
    "openai": 0.0,
}


class JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
            "request_id": _request_id_ctx.get(),
        }
        extra_fields = getattr(record, "extra_fields", None)
        if extra_fields:
            payload.update(extra_fields)
        return json.dumps(payload)


def configure_logging() -> None:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JSONFormatter())
    root = logging.getLogger()
    root.handlers = [handler]
    root.setLevel(logging.INFO)


class RequestIDMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp) -> None:
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):  # type: ignore[no-untyped-def]
        request_id = request.headers.get("X-Request-Id") or str(uuid.uuid4())
        token = _request_id_ctx.set(request_id)
        try:
            response = await call_next(request)
        finally:
            _request_id_ctx.reset(token)
        response.headers["X-Request-Id"] = request_id
        return response


def log_ai_call(
    *,
    provider: str,
    model: str,
    latency_ms: float,
    cache_hit: bool,
    estimated_tokens: int | None = None,
) -> None:
    """Satu baris log terstruktur per panggilan AI (real atau cache hit) --
    ini yang jawab "apa yang lambat" dan "berapa biayanya" tanpa perlu
    dashboard terpisah dulu."""
    estimated_cost = None
    if estimated_tokens is not None:
        price = _PRICE_PER_1K_TOKENS_USD.get(provider, 0.0)
        estimated_cost = round((estimated_tokens / 1000) * price, 6)

    logging.getLogger("ai_call").info(
        "ai_call",
        extra={
            "extra_fields": {
                "provider": provider,
                "model": model,
                "latency_ms": round(latency_ms, 2),
                "cache_hit": cache_hit,
                "estimated_tokens": estimated_tokens,
                "estimated_cost_usd": estimated_cost,
            }
        },
    )
