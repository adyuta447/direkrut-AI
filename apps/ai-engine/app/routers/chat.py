"""Chat AI thinking partner.

Sesi chat buat HRD (mis. gap analysis kandidat, cross-role discovery)
maupun kandidat (mis. persiapan interview). Streaming response via SSE
(Server-Sent Events) biar terasa responsif di apps/web.

Provider default: Groq (Llama 3.3 70B) -- low latency, cocok buat chat.
Kalau Groq down, otomatis fallback ke Gemini (flash-lite).
"""

from __future__ import annotations

import json
import logging
import time

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.logging import log_ai_call
from app.prompt_guard import INJECTION_GUARD
from app.providers import get_provider_for_task
from app.rate_limit import limit

logger = logging.getLogger(__name__)

router = APIRouter(dependencies=[Depends(limit("chat"))])

_CHAT_SYSTEM_PROMPT = (
    "Kamu adalah asisten HR AI bernama Direkrut AI. Kamu membantu HRD "
    "menganalisis kandidat (gap analysis, cross-role discovery, strategi "
    "perekrutan) dan membantu kandidat mempersiapkan interview. "
    "Jawab dalam bahasa Indonesia yang profesional tapi tetap ramah. "
    "Kalau ditanya di luar konteks HR/rekrutmen, arahkan kembali ke topik "
    "yang relevan dengan sopan."
    "\n\n" + INJECTION_GUARD
)


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    session_id: str
    messages: list[ChatMessage]


async def _stream_chat_response(messages: list[ChatMessage]):
    """Stream response dari LLM via SSE. Format tiap chunk:
    data: {"content": "...", "done": false}\n\n

    Chunk terakhir:
    data: {"content": "", "done": true, "provider": "...", "latency_ms": ...}\n\n
    """
    # Gabungkan history jadi satu prompt (provider complete_stream cuma
    # terima satu string prompt + system). Kita format conversation
    # history jadi konteks yang jelas buat model.
    conversation_parts: list[str] = []
    for msg in messages[:-1]:  # semua kecuali message terakhir
        prefix = "User" if msg.role == "user" else "Asisten"
        conversation_parts.append(f"{prefix}: {msg.content}")

    # Message terakhir (yang baru) jadi prompt utama
    last_message = messages[-1].content if messages else ""

    if conversation_parts:
        prompt = (
            "Berikut riwayat percakapan sebelumnya:\n"
            + "\n".join(conversation_parts)
            + f"\n\nUser: {last_message}\n\nAsisten:"
        )
    else:
        prompt = last_message

    provider = get_provider_for_task("stream")
    provider_name = type(provider).__name__
    started = time.monotonic()

    try:
        async for chunk in provider.complete_stream(prompt, system=_CHAT_SYSTEM_PROMPT):
            sse_data = json.dumps({"content": chunk, "done": False}, ensure_ascii=False)
            yield f"data: {sse_data}\n\n"

        latency_ms = (time.monotonic() - started) * 1000
        log_ai_call(
            provider=provider_name.lower().replace("provider", ""),
            model=getattr(provider, "COMPLETE_MODEL", "unknown"),
            latency_ms=latency_ms,
            cache_hit=False,
        )

        # Kirim chunk terakhir yang menandakan streaming selesai
        done_data = json.dumps({
            "content": "",
            "done": True,
            "provider": provider_name,
            "latency_ms": round(latency_ms, 2),
        }, ensure_ascii=False)
        yield f"data: {done_data}\n\n"

    except Exception as exc:
        logger.error("Chat streaming error: %s", exc, exc_info=True)
        error_data = json.dumps({
            "content": "",
            "done": True,
            "error": str(exc),
        }, ensure_ascii=False)
        yield f"data: {error_data}\n\n"


@router.post("/stream")
async def stream_chat(payload: ChatRequest) -> StreamingResponse:
    return StreamingResponse(
        _stream_chat_response(payload.messages),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # Nginx: jangan buffer SSE
        },
    )
