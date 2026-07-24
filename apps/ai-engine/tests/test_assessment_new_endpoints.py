"""Tes buat generate-questions & proctor-check: parsing JSON defensif
(gak boleh 500 kalau LLM balikin sampah) dan trust boundary auth -- gak ada
test yang manggil provider AI asli (lihat conftest.py & test_security.py).
"""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.routers.assessment import (
    _FALLBACK_QUESTIONS,
    _PRESCREEN_FALLBACK_QUESTIONS,
    _parse_prescreen_questions_json,
    _parse_proctor_json,
    _parse_questions_json,
)

client = TestClient(app)


def test_parse_questions_json_happy_path() -> None:
    raw = '{"questions": ["Ceritakan pengalamanmu.", "Kenapa mau kerja di sini?"]}'
    result = _parse_questions_json(raw)
    assert result.questions == ["Ceritakan pengalamanmu.", "Kenapa mau kerja di sini?"]


def test_parse_questions_json_falls_back_on_malformed_json() -> None:
    assert _parse_questions_json("bukan json").questions == _FALLBACK_QUESTIONS


def test_parse_questions_json_falls_back_on_empty_list() -> None:
    assert _parse_questions_json('{"questions": []}').questions == _FALLBACK_QUESTIONS


def test_parse_proctor_json_happy_path_flagged() -> None:
    result = _parse_proctor_json('{"flagged": true, "reason": "dua orang di frame"}')
    assert result.flagged is True
    assert result.reason == "dua orang di frame"


def test_parse_proctor_json_happy_path_clean() -> None:
    result = _parse_proctor_json('{"flagged": false, "reason": null}')
    assert result.flagged is False
    assert result.reason is None


def test_parse_proctor_json_falls_back_to_unflagged_on_malformed_json() -> None:
    result = _parse_proctor_json("bukan json")
    assert result.flagged is False
    assert result.reason is None


def test_generate_questions_rejects_request_with_no_key(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("INTERNAL_API_KEY", "correct-secret")
    res = client.post("/v1/assessment/generate-questions", json={"job_description": "Backend Engineer"})
    assert res.status_code == 401


def test_proctor_check_rejects_request_with_no_key(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("INTERNAL_API_KEY", "correct-secret")
    res = client.post("/v1/assessment/proctor-check", json={"application_id": "app-1", "image_base64": "AAAA"})
    assert res.status_code == 401


def test_parse_prescreen_questions_json_happy_path() -> None:
    raw = '{"questions": ["Berapa tahun pengalamanmu?", "Kenapa tertarik posisi ini?", "Skill utamamu apa?"]}'
    result = _parse_prescreen_questions_json(raw)
    assert result.questions == ["Berapa tahun pengalamanmu?", "Kenapa tertarik posisi ini?", "Skill utamamu apa?"]


def test_parse_prescreen_questions_json_falls_back_on_malformed_json() -> None:
    assert _parse_prescreen_questions_json("bukan json").questions == _PRESCREEN_FALLBACK_QUESTIONS


def test_parse_prescreen_questions_json_falls_back_on_empty_list() -> None:
    assert _parse_prescreen_questions_json('{"questions": []}').questions == _PRESCREEN_FALLBACK_QUESTIONS


def test_generate_prescreen_questions_rejects_request_with_no_key(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("INTERNAL_API_KEY", "correct-secret")
    res = client.post("/v1/assessment/generate-prescreen-questions", json={"job_description": "Backend Engineer"})
    assert res.status_code == 401


def test_generate_feedback_rejects_request_with_no_key(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("INTERNAL_API_KEY", "correct-secret")
    res = client.post(
        "/v1/assessment/generate-feedback",
        json={"job_title": "Backend Engineer", "job_description": "Go & PostgreSQL"},
    )
    assert res.status_code == 401


def test_cv_classifier_softmax_and_gated(monkeypatch: pytest.MonkeyPatch) -> None:
    from app.routers.cv_classifier import _softmax

    p = _softmax([3.0, 1.0, 0.0])
    assert abs(sum(p) - 1.0) < 1e-9
    assert p[0] == max(p)

    # Endpoint terdaftar & digembok internal key (sama kayak endpoint lain).
    monkeypatch.setenv("INTERNAL_API_KEY", "correct-secret")
    res = client.post("/v1/cv-classifier/classify", json={"text": "Software Engineer 5 tahun Go"})
    assert res.status_code == 401
