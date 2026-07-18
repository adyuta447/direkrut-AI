"""Cache-aside buat hasil panggilan AI yang mahal (CV parsing, scoring,
transcription). Key-nya SHA-256 dari payload yang relevan, jadi input yang
identik gak pernah dibayar dua kali -- ini yang bikin pilar cost-efficient
di arsitektur beneran kepakai, bukan cuma slogan.
"""

from __future__ import annotations

import hashlib
import json
from functools import lru_cache
from typing import Any, Awaitable, Callable

import redis.asyncio as redis

from app.config import get_settings

_DEFAULT_TTL_SECONDS = 24 * 60 * 60  # 24 jam


@lru_cache
def get_redis() -> redis.Redis:
    settings = get_settings()
    kwargs: dict[str, Any] = {"decode_responses": True}
    if settings.redis_url.startswith("rediss://"):
        kwargs["ssl_cert_reqs"] = None
    return redis.from_url(settings.redis_url, **kwargs)


def make_cache_key(namespace: str, *parts: str) -> str:
    digest = hashlib.sha256("|".join(parts).encode("utf-8")).hexdigest()
    return f"{namespace}:{digest}"


async def get_or_set(
    key: str,
    compute: Callable[[], Awaitable[dict[str, Any]]],
    ttl_seconds: int = _DEFAULT_TTL_SECONDS,
) -> tuple[dict[str, Any], bool]:
    """Balikin (value, cache_hit). `compute` cuma dipanggil kalau cache
    miss -- caller (router) yang nentuin apa yang di-cache."""
    client = get_redis()
    cached = await client.get(key)
    if cached is not None:
        return json.loads(cached), True

    value = await compute()
    await client.set(key, json.dumps(value), ex=ttl_seconds)
    return value, False


async def ping() -> bool:
    try:
        return bool(await get_redis().ping())
    except Exception:
        return False
