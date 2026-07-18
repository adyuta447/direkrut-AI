"""Chat AI thinking partner.

Sesi chat buat HRD (mis. gap analysis kandidat, cross-role discovery)
maupun kandidat (mis. persiapan interview). Streaming response biar
terasa responsif di apps/web.
"""

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

router = APIRouter()


class ChatMessage(BaseModel):
    role: str  # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    session_id: str
    messages: list[ChatMessage]


async def _stream_placeholder():
    # TODO: ganti dengan streaming asli dari AIProvider.complete().
    yield "data: not-implemented\n\n"


@router.post("/stream")
async def stream_chat(payload: ChatRequest) -> StreamingResponse:
    return StreamingResponse(_stream_placeholder(), media_type="text/event-stream")
