"""Rate limiter berbasis Redis (pola INCR+EXPIRE yang sama dengan sisi Go),
dipasang khusus di endpoint yang beneran manggil provider AI berbayar --
ini kontrol cost-abuse sekaligus kontrol keamanan (satu caller yang
kompromi/salah konfigurasi gak bisa nge-drain kuota/biaya provider).
"""

from __future__ import annotations

from fastapi import HTTPException, Request

from app import cache


def limit(key_prefix: str, max_requests: int = 20, window_seconds: int = 60):
    async def dependency(request: Request) -> None:
        client_id = request.headers.get("X-Internal-Api-Key", "unknown")[:16]
        key = f"ratelimit:{key_prefix}:{client_id}"
        # Referensi lewat modul (bukan `from app.cache import get_redis`)
        # sengaja, biar gampang di-monkeypatch di test tanpa perlu patch
        # dua tempat terpisah.
        redis_client = cache.get_redis()

        count = await redis_client.incr(key)
        if count == 1:
            await redis_client.expire(key, window_seconds)

        if count > max_requests:
            raise HTTPException(status_code=429, detail="terlalu banyak request, coba lagi sebentar lagi")

    return dependency
