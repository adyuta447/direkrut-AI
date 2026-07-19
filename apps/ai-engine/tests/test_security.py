"""X-Internal-Api-Key adalah satu-satunya trust boundary servis ini (gak
ada CORS lagi -- lihat app/main.py). Tes ini mastiin endpoint /v1/* beneran
ketolak tanpa key yang benar, TANPA pernah manggil provider AI asli
(cv_parser.parse butuh key valid dulu sebelum logika bisnisnya sempat
jalan sama sekali, jadi gak ada resiko network call ke Groq/Gemini di sini).
"""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

_PAYLOAD = {"cv_object_key": "cv/example.pdf", "application_id": "app-1"}


def test_rejects_request_with_no_key(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("INTERNAL_API_KEY", "correct-secret")
    res = client.post("/v1/cv-parser/parse", json=_PAYLOAD)
    assert res.status_code == 401
    assert res.json()["error"]["code"] == "http_error"


def test_rejects_request_with_wrong_key(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("INTERNAL_API_KEY", "correct-secret")
    res = client.post("/v1/cv-parser/parse", json=_PAYLOAD, headers={"X-Internal-Api-Key": "wrong-secret"})
    assert res.status_code == 401


def test_fails_closed_when_server_has_no_key_configured(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("INTERNAL_API_KEY", "")
    res = client.post("/v1/cv-parser/parse", json=_PAYLOAD, headers={"X-Internal-Api-Key": "anything"})
    assert res.status_code == 500


def test_healthz_and_readyz_are_not_gated(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("INTERNAL_API_KEY", "correct-secret")
    assert client.get("/healthz").status_code == 200
    assert client.get("/readyz").status_code == 200
