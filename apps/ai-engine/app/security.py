"""Dependency FastAPI yang jadi trust boundary servis ini. ai-engine cuma
dipanggil server-to-server oleh api-go (gak pernah langsung dari browser --
gak ada proxy di apps/web yang manggil ini, konfirmasi dari README), jadi
CORS bukan kontrol yang relevan di sini. Shared-secret header ini yang
gantiin CORSMiddleware(allow_origins=["*"]) yang sebelumnya ada.
"""

from __future__ import annotations

import hmac

from fastapi import Header, HTTPException

from app.config import get_settings


async def require_internal_key(x_internal_api_key: str = Header(default="")) -> None:
    settings = get_settings()
    if not settings.internal_api_key:
        raise HTTPException(status_code=500, detail="INTERNAL_API_KEY belum dikonfigurasi di server ini")
    # compare_digest, bukan != -- != short-circuit di byte pertama yang beda,
    # bocorin timing yang bisa dipakai brute-force key karakter demi karakter.
    if not hmac.compare_digest(x_internal_api_key, settings.internal_api_key):
        raise HTTPException(status_code=401, detail="internal API key gak valid")
