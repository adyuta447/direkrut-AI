"""Classifier kategori CV lokal (HR/IT/Designer/dst) -- model ONNX kecil hasil
fine-tune di Colab (lihat ml/train_cv_classifier.py), diserve pakai
onnxruntime di CPU. TUJUAN: tugas klasifikasi "receh" gak perlu manggil LLM
eksternal -> lebih murah & terukur (saran Bang Jason: jangan lempar semua ke
LLM eksternal).

Model di-load LAZY dari object storage sekali di request pertama, terus
di-cache di memory. Kalau CV_CLASSIFIER_PREFIX belum diset atau file-nya belum
ada, endpoint balikin 503 yang jelas -- jadi aman dideploy sebelum model siap.
"""

from __future__ import annotations

import json
import math
import threading

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.config import get_settings
from app.rate_limit import limit
from app.storage import download_object

router = APIRouter(dependencies=[Depends(limit("cv_classifier"))])


class ClassifyCVRequest(BaseModel):
    text: str


class CategoryScore(BaseModel):
    category: str
    score: float


class ClassifyCVResponse(BaseModel):
    category: str
    confidence: float
    top: list[CategoryScore]


def _softmax(logits: list[float]) -> list[float]:
    """Softmax numerik-stabil (pure Python, gampang diuji tanpa model)."""
    m = max(logits)
    exps = [math.exp(x - m) for x in logits]
    total = sum(exps) or 1.0
    return [e / total for e in exps]


class _Model:
    """Bungkus onnxruntime session + tokenizer + label map. Di-load sekali."""

    def __init__(self, session, tokenizer, id2label: dict[int, str], input_names: set[str]):
        self.session = session
        self.tokenizer = tokenizer
        self.id2label = id2label
        self.input_names = input_names

    def predict(self, text: str) -> tuple[str, float, list[CategoryScore]]:
        enc = self.tokenizer.encode(text)
        feed = {"input_ids": [enc.ids], "attention_mask": [enc.attention_mask]}
        # BERT-family butuh token_type_ids; sebagian model gak. Kirim cuma yang
        # emang jadi input model ONNX-nya.
        if "token_type_ids" in self.input_names:
            feed["token_type_ids"] = [enc.type_ids]
        import numpy as np

        np_feed = {k: np.array(v, dtype=np.int64) for k, v in feed.items()}
        logits = self.session.run(None, np_feed)[0][0].tolist()
        probs = _softmax(logits)
        ranked = sorted(
            (CategoryScore(category=self.id2label[i], score=round(p, 4)) for i, p in enumerate(probs)),
            key=lambda c: c.score,
            reverse=True,
        )
        return ranked[0].category, ranked[0].score, ranked[:3]


_model: _Model | None = None
_load_lock = threading.Lock()


def _load_model() -> _Model:
    global _model
    if _model is not None:
        return _model
    with _load_lock:
        if _model is not None:
            return _model

        settings = get_settings()
        prefix = settings.cv_classifier_prefix
        if not prefix:
            raise HTTPException(status_code=503, detail="classifier CV belum dikonfigurasi (CV_CLASSIFIER_PREFIX kosong)")

        try:
            import onnxruntime as ort
            from tokenizers import Tokenizer

            onnx_bytes = download_object(prefix + "model.onnx")
            tokenizer_json = download_object(prefix + "tokenizer.json").decode("utf-8")
            labels_raw = json.loads(download_object(prefix + "labels.json").decode("utf-8"))
        except Exception as exc:  # noqa: BLE001 -- file belum ada / storage down
            raise HTTPException(status_code=503, detail=f"model classifier CV belum tersedia: {exc}") from exc

        session = ort.InferenceSession(onnx_bytes, providers=["CPUExecutionProvider"])
        tokenizer = Tokenizer.from_str(tokenizer_json)
        tokenizer.enable_truncation(max_length=settings.cv_classifier_max_len)
        id2label = {int(k): v for k, v in labels_raw.items()}
        input_names = {i.name for i in session.get_inputs()}
        _model = _Model(session, tokenizer, id2label, input_names)
        return _model


@router.post("/classify", response_model=ClassifyCVResponse)
async def classify_cv(payload: ClassifyCVRequest) -> ClassifyCVResponse:
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=422, detail="teks CV kosong")
    model = _load_model()
    category, confidence, top = model.predict(text)
    return ClassifyCVResponse(category=category, confidence=confidence, top=top)
