"""Client S3-compatible (boto3, endpoint MinIO lokal / S3-compatible di
prod) buat DOWNLOAD file dari object storage -- arah sebaliknya dari
internal/storage di api-go (yang cuma nerbitin presigned PUT URL buat
upload). ai-engine yang narik file-nya buat diproses.
"""

from __future__ import annotations

from functools import lru_cache

import boto3
from botocore.config import Config

from app.config import get_settings


@lru_cache
def get_client():  # type: ignore[no-untyped-def]
    settings = get_settings()
    return boto3.client(
        "s3",
        endpoint_url=settings.object_storage_endpoint,
        aws_access_key_id=settings.object_storage_access_key,
        aws_secret_access_key=settings.object_storage_secret_key,
        region_name="us-east-1",
        config=Config(signature_version="s3v4", s3={"addressing_style": "auto"}),
    )


def download_object(object_key: str) -> bytes:
    settings = get_settings()
    response = get_client().get_object(Bucket=settings.object_storage_bucket, Key=object_key)
    return response["Body"].read()
