"""Abstraksi provider AI biar model-agnostic.

Tiap perusahaan bisa pilih provider sesuai kebutuhan dan budget mereka:
OpenAI, Gemini, Groq, atau provider lain yang kompatibel. Router-router
di app/routers/ manggil get_provider() daripada import SDK provider
tertentu secara langsung, jadi gampang nambah provider baru tanpa ubah
logika bisnis.
"""

from __future__ import annotations

import os
from abc import ABC, abstractmethod


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


class OpenAIProvider(AIProvider):
    async def complete(self, prompt: str, *, system: str | None = None) -> str:
        # TODO: panggil OpenAI Chat Completions API.
        raise NotImplementedError

    async def embed(self, text: str) -> list[float]:
        # TODO: panggil OpenAI Embeddings API (text-embedding-3-small/large).
        raise NotImplementedError


class GeminiProvider(AIProvider):
    async def complete(self, prompt: str, *, system: str | None = None) -> str:
        # TODO: panggil Google Gemini API.
        raise NotImplementedError

    async def embed(self, text: str) -> list[float]:
        # TODO: panggil Gemini embedding model.
        raise NotImplementedError


class GroqProvider(AIProvider):
    async def complete(self, prompt: str, *, system: str | None = None) -> str:
        # TODO: panggil Groq API (biasanya dipakai buat inferensi cepat).
        raise NotImplementedError

    async def embed(self, text: str) -> list[float]:
        raise NotImplementedError


_PROVIDERS: dict[str, type[AIProvider]] = {
    "openai": OpenAIProvider,
    "gemini": GeminiProvider,
    "groq": GroqProvider,
}


def get_provider(name: str | None = None) -> AIProvider:
    """Ambil instance provider aktif. Default dibaca dari env AI_PROVIDER
    biar bisa diganti per environment tanpa redeploy kode."""
    provider_name = name or os.getenv("AI_PROVIDER", "openai")
    provider_cls = _PROVIDERS.get(provider_name)
    if provider_cls is None:
        raise ValueError(f"Provider AI '{provider_name}' belum didukung.")
    return provider_cls()
