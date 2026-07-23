from __future__ import annotations

import json

import pytest

from app.prompt_guard import HR_SCOPE_REFUSAL
from app.routers import chat
from app.routers.chat import ChatMessage


@pytest.mark.asyncio
async def test_chat_scope_guard_rejects_coding_before_provider(monkeypatch: pytest.MonkeyPatch) -> None:
    def fail_provider(_: str) -> None:
        raise AssertionError("provider should not be called for out-of-scope requests")

    monkeypatch.setattr(chat, "get_provider_for_task", fail_provider)

    events = [
        event
        async for event in chat._stream_chat_response(
            [ChatMessage(role="user", content="Buatkan kode Python untuk sorting array")]
        )
    ]

    payloads = [json.loads(event.removeprefix("data: ").strip()) for event in events]
    assert payloads[0]["content"] == HR_SCOPE_REFUSAL
    assert payloads[-1] == {"content": "", "done": True, "provider": "guard", "latency_ms": 0}
