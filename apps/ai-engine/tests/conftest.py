"""Fixture bersama: Redis palsu in-memory biar test gak butuh Redis beneran
nyala, dan gak ada test yang diam-diam manggil provider AI asli.
"""

from __future__ import annotations

import pytest


class FakeRedis:
    def __init__(self) -> None:
        self._store: dict[str, str] = {}
        self._counters: dict[str, int] = {}

    async def get(self, key: str) -> str | None:
        return self._store.get(key)

    async def set(self, key: str, value: str, ex: int | None = None) -> None:
        self._store[key] = value

    async def incr(self, key: str) -> int:
        self._counters[key] = self._counters.get(key, 0) + 1
        return self._counters[key]
    async def expire(self, key: str, seconds: int) -> bool:
        return True
    async def ping(self) -> bool:
        return True


@pytest.fixture(autouse=True)
def fake_redis(monkeypatch: pytest.MonkeyPatch) -> FakeRedis:
    from app import cache as cache_module

    fake = FakeRedis()
    cache_module.get_redis.cache_clear()
    monkeypatch.setattr(cache_module, "get_redis", lambda: fake)
    return fake


@pytest.fixture(autouse=True)
def reset_settings_cache() -> None:
    from app.config import get_settings

    get_settings.cache_clear()
    yield
    get_settings.cache_clear()
