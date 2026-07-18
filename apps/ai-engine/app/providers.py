"""Abstraksi provider AI biar model-agnostic.

Tiap perusahaan bisa pilih provider sesuai kebutuhan dan budget mereka:
OpenAI, Gemini, Groq, atau provider lain yang kompatibel. Router-router
di app/routers/ manggil get_provider() daripada import SDK provider
tertentu secara langsung, jadi gampang nambah provider baru tanpa ubah
logika bisnis.

Groq (Llama) dipakai buat completion berbasis teks (CV parsing, scoring) --
default/primary path. Gemini (flash-lite) dipakai buat input berbasis
gambar (CV upload berformat image), karena model Llama Groq gak nerima
input vision. Groq Whisper dipakai buat transcribe wawancara. OpenAI masih
stub -- belum ada API key buat ditest end-to-end.
"""

from __future__ import annotations

import asyncio
from abc import ABC, abstractmethod
from typing import Any, Awaitable, Callable, TypeVar

from app.config import get_settings

T = TypeVar("T")

# "Legitimately slow" (respons LLM/Whisper emang bisa makan waktu) dan
# "hung selamanya makan slot worker" harus jadi dua hal yang beda.
_TIMEOUT_SECONDS = 20.0
_MAX_RETRIES = 1
_RETRY_BACKOFF_SECONDS = 1.5


async def _with_timeout_and_retry(fn: Callable[[], Awaitable[T]]) -> T:
    """Timeout eksplisit + satu retry buat error transient (timeout, 5xx,
    connection reset). BUKAN buat 4xx -- retry request yang emang salah
    cuma buang-buang quota provider buat kegagalan yang sama."""
    last_exc: Exception | None = None
    for attempt in range(_MAX_RETRIES + 1):
        try:
            return await asyncio.wait_for(fn(), timeout=_TIMEOUT_SECONDS)
        except TimeoutError as exc:
            last_exc = exc
        except Exception as exc:  # noqa: BLE001 -- SDK provider beda-beda tipe exception-nya
            status_code = getattr(exc, "status_code", None)
            if status_code is not None and status_code < 500:
                raise
            last_exc = exc

        if attempt < _MAX_RETRIES:
            await asyncio.sleep(_RETRY_BACKOFF_SECONDS)

    assert last_exc is not None
    raise last_exc


class AIProvider(ABC):
    """Kontrak minimal yang harus dipenuhi tiap provider AI."""

    @abstractmethod
    async def complete(self, prompt: str, *, system: str | None = None) -> str:
        """Generate teks dari prompt. Dipakai buat CV parsing, assessment,
        dan Chat AI thinking partner."""
        raise NotImplementedError

    @abstractmethod
    async def embed(self, text: str) -> list[float]:
        """Generate vector embedding buat vector search (pgvector)."""
        raise NotImplementedError

    @abstractmethod
    async def transcribe(self, audio_bytes: bytes, *, filename: str = "audio.wav") -> str:
        """Speech-to-text buat transkrip wawancara."""
        raise NotImplementedError


class OpenAIProvider(AIProvider):
    async def complete(self, prompt: str, *, system: str | None = None) -> str:
        # TODO: panggil OpenAI Chat Completions API begitu ada API key buat ditest.
        raise NotImplementedError

    async def embed(self, text: str) -> list[float]:
        # TODO: panggil OpenAI Embeddings API (text-embedding-3-small/large).
        raise NotImplementedError

    async def transcribe(self, audio_bytes: bytes, *, filename: str = "audio.wav") -> str:
        # TODO: panggil OpenAI Whisper API kalau suatu saat dipakai sbg fallback.
        raise NotImplementedError


class GeminiProvider(AIProvider):
    EMBED_MODEL = "models/text-embedding-004"
    COMPLETE_MODEL = "gemini-flash-lite-latest"

    def __init__(self) -> None:
        import google.generativeai as genai

        settings = get_settings()
        genai.configure(api_key=settings.gemini_api_key)
        self._genai = genai

    async def complete(
        self,
        prompt: str,
        *,
        system: str | None = None,
        image_bytes: bytes | None = None,
        image_mime_type: str = "image/jpeg",
    ) -> str:
        """Bisa nerima teks doang atau teks+gambar (vision) -- dipakai
        cv_parser.py buat CV yang di-upload sebagai file gambar, bukan PDF."""
        model = self._genai.GenerativeModel(self.COMPLETE_MODEL, system_instruction=system)
        content: list[Any] = [prompt]
        if image_bytes is not None:
            content.append({"mime_type": image_mime_type, "data": image_bytes})

        async def _call() -> str:
            response = await model.generate_content_async(content)
            return response.text or ""

        return await _with_timeout_and_retry(_call)

    async def embed(self, text: str) -> list[float]:
        async def _call() -> list[float]:
            result = await self._genai.embed_content_async(model=self.EMBED_MODEL, content=text)
            return list(result["embedding"])

        return await _with_timeout_and_retry(_call)

    async def transcribe(self, audio_bytes: bytes, *, filename: str = "audio.wav") -> str:
        raise NotImplementedError("Gemini provider belum handle audio di prototype ini -- pakai GroqProvider.transcribe()")


class GroqProvider(AIProvider):
    COMPLETE_MODEL = "llama-3.3-70b-versatile"
    WHISPER_MODEL = "whisper-large-v3"

    def __init__(self) -> None:
        from groq import AsyncGroq

        settings = get_settings()
        self._client = AsyncGroq(api_key=settings.groq_api_key)

    async def complete(self, prompt: str, *, system: str | None = None) -> str:
        messages: list[dict[str, str]] = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        async def _call() -> str:
            response = await self._client.chat.completions.create(
                model=self.COMPLETE_MODEL,
                messages=messages,  # type: ignore[arg-type]
                temperature=0.2,
            )
            return response.choices[0].message.content or ""

        return await _with_timeout_and_retry(_call)

    async def embed(self, text: str) -> list[float]:
        raise NotImplementedError("Groq belum sediakan embeddings API -- pakai GeminiProvider.embed()")

    async def transcribe(self, audio_bytes: bytes, *, filename: str = "audio.wav") -> str:
        async def _call() -> str:
            response = await self._client.audio.transcriptions.create(
                model=self.WHISPER_MODEL,
                file=(filename, audio_bytes),
            )
            return response.text

        return await _with_timeout_and_retry(_call)


_PROVIDERS: dict[str, type[AIProvider]] = {
    "openai": OpenAIProvider,
    "gemini": GeminiProvider,
    "groq": GroqProvider,
}


def get_provider(name: str | None = None) -> AIProvider:
    """Ambil instance provider aktif. Default dibaca dari Settings.ai_provider
    (env AI_PROVIDER) biar bisa diganti per environment tanpa redeploy kode."""
    provider_name = name or get_settings().ai_provider
    provider_cls = _PROVIDERS.get(provider_name)
    if provider_cls is None:
        raise ValueError(f"Provider AI '{provider_name}' belum didukung.")
    return provider_cls()
