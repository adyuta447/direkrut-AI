"""Config typed dari env var, di-load sekali di startup lewat
pydantic-settings -- gantiin os.getenv() manual yang sebelumnya cuma
dipakai satu tempat (AI_PROVIDER di providers.py) dan gak ada validasi tipe
sama sekali.
"""

from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    ai_provider: str = "groq"
    groq_api_key: str = ""
    gemini_api_key: str = ""
    openai_api_key: str = ""
    whisper_api_key: str = ""
    database_url: str = ""
    redis_url: str = ""
    object_storage_endpoint: str = ""
    object_storage_access_key: str = ""
    object_storage_secret_key: str = ""
    object_storage_bucket: str = ""
    internal_api_key: str = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()
