"""Hybrid Evidence-Based Scoring Engine.

Menggantikan pendekatan single cosine similarity dengan penilaian terstruktur
per komponen yang berbobot (Skill Match, Experience, Education, Responsibilities,
Additional). Setiap komponen menghasilkan skor 0-100 beserta bukti kutipan dari CV
yang dihitung secara deterministik oleh Python berdasarkan klasifikasi LLM.
"""

from __future__ import annotations

import asyncio
import json
import logging
import math
import time
from typing import TypedDict

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.cache import get_or_set, make_cache_key
from app.logging import log_ai_call
from app.prompt_guard import INJECTION_GUARD
from app.providers import get_provider_for_task
from app.rate_limit import limit

logger = logging.getLogger(__name__)

router = APIRouter(dependencies=[Depends(limit("vector_search"))])


# ─── Request Models ──────────────────────────────────────────────────────────

class EmbedRequest(BaseModel):
    text: str


class EmbedResponse(BaseModel):
    embedding: list[float]


class WeightConfig(BaseModel):
    skill_match: float = 35.0
    experience: float = 25.0
    education: float = 10.0
    responsibilities: float = 20.0
    additional: float = 10.0


class MatchRequest(BaseModel):
    application_id: str
    job_id: str
    cv_summary: str
    job_description: str
    work_experience_years: float | None = None
    # Structured job requirements for evidence-based scoring
    required_skills: list[str] = []
    preferred_skills: list[str] = []
    key_responsibilities: str | None = None
    min_experience_years: int = 0
    education_requirement: str | None = None
    candidate_type: str = "any"  # fresh_graduate | professional | any
    weights: WeightConfig | None = None


# ─── Response Models (Evidence-Based Match) ───────────────────────────────────

class LLMAssessment(BaseModel):
    requirement: str
    category: str # SKILL, EXPERIENCE, RESPONSIBILITY, EDUCATION, ADDITIONAL
    importance: str # HARD_CONSTRAINT, REQUIRED, PREFERRED
    match_status: str # MATCHED, PARTIAL_MATCH, NO_EVIDENCE, NOT_DEMONSTRATED, FAILED_HARD_REQUIREMENT
    evidence_strength: str # EXPLICIT, STRONG_INFERENCE, WEAK_INFERENCE, NO_EVIDENCE
    relationship: str # DIRECT, RELATED, TRANSFERABLE, NONE
    evidence_text: str | None # null jika NO_EVIDENCE
    source_section: str | None # misal: "Work Experience"
    reasoning: str # 1-2 kalimat netral
    score: float = 0.0 # Field diisi oleh Python, bukan LLM

class _CategoryResult(TypedDict):
    """Bentuk antara raw_comp_results sebelum dinormalisasi jadi ComponentScore
    -- eksplisit di sini biar mypy bisa narrow per-key (bukan union semua tipe
    value dalam satu dict longgar)."""

    score: float
    weight: float
    weighted_score: float
    assessments: list["LLMAssessment"]
    matched_count: int
    partial_count: int
    missing_count: int
    status: str


class ComponentScore(BaseModel):
    score: float # 0 - 100
    weight: float
    weighted_score: float
    status: str # NOT_EVALUATED, GOOD_MATCH, PARTIAL_MATCH, LOW_MATCH
    summary: str 
    matched_count: int
    partial_count: int
    missing_count: int
    assessments: list[LLMAssessment]

class MatchResponse(BaseModel):
    similarity_score: float # Murni Semantic Cosine Similarity (Fallback backend existing)
    eligibility_status: str # ELIGIBLE, NOT_ELIGIBLE, REVIEW_REQUIRED
    match_score: float # 0-100 (Evidence-Based Match Score)
    recommendation_status: str # STRONG_MATCH, POTENTIAL_MATCH, PARTIAL_MATCH, INSUFFICIENT_EVIDENCE, REVIEW_REQUIRED, NOT_RECOMMENDED
    evidence_coverage: str # HIGH, MEDIUM, LOW
    reasoning_summary: str
    component_scores: dict[str, ComponentScore]
    key_gaps: list[str] # Nama requirement REQUIRED/HARD yang memiliki status NO_EVIDENCE / NOT_DEMONSTRATED / FAILED_HARD_REQUIREMENT
    candidate_track: str
    career_consistency_note: str | None = None
    weights_used: WeightConfig


# ─── Default Weights ──────────────────────────────────────────────────────────

DEFAULT_WEIGHTS_PROFESSIONAL = WeightConfig(
    skill_match=35, experience=25, education=10, responsibilities=20, additional=10
)
DEFAULT_WEIGHTS_FRESH_GRAD = WeightConfig(
    skill_match=30, experience=10, education=25, responsibilities=25, additional=10
)

def _get_default_weights(candidate_track: str) -> WeightConfig:
    if candidate_track == "Fresh Graduate":
        return DEFAULT_WEIGHTS_FRESH_GRAD
    return DEFAULT_WEIGHTS_PROFESSIONAL


# ─── Cosine Similarity ───────────────────────────────────────────────────────

def _cosine_similarity(a: list[float], b: list[float]) -> float:
    if len(a) != len(b) or not a:
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(x * x for x in b))
    if mag_a == 0.0 or mag_b == 0.0:
        return 0.0
    return dot / (mag_a * mag_b)


# ─── System Prompts ───────────────────────────────────────────────────────────

_EVIDENCE_BASED_SYSTEM_PROMPT = """Kamu adalah AI CV Screening asisten HR Senior. Tugasmu mengekstrak bukti nyata dari CV secara objektif untuk dicocokkan dengan setiap Requirement Pekerjaan.
JANGAN MENGHITUNG ATAU MENGELUARKAN SKOR ANGKA. Tugasmu murni mengekstraksi dan mengklasifikasi bukti.

Diberikan CV Kandidat dan Daftar Requirement (JSON). 
Untuk setiap requirement dalam daftar, analisis CV dan keluarkan JSON array of Assessment.

Taksonomi Wajib untuk setiap Assessment:
1. "category": "SKILL" | "EXPERIENCE" | "RESPONSIBILITY" | "EDUCATION" | "ADDITIONAL"
2. "importance": "HARD_CONSTRAINT" | "REQUIRED" | "PREFERRED" (Sesuai dengan input requirement)
3. "match_status": 
   - "MATCHED" (Bukti sepenuhnya mendukung)
   - "PARTIAL_MATCH" (Bukti mendukung sebagian / serumpun)
   - "NO_EVIDENCE" (Tidak ada bukti di CV)
   - "NOT_DEMONSTRATED" (KHUSUS HARD_CONSTRAINT: Syarat mutlak butuh verifikasi eksternal, tidak ada bukti di CV)
   - "FAILED_HARD_REQUIREMENT" (KHUSUS HARD_CONSTRAINT: Bukti eksplisit menyatakan gagal. Misal: Belum Lulus)
4. "evidence_strength": 
   - "EXPLICIT" (Tersebut jelas dalam konteks kerja)
   - "STRONG_INFERENCE" (Aktivitas jelas, walau keyword tidak sama persis)
   - "WEAK_INFERENCE" (Hanya job title atau disebut tanpa konteks)
   - "NO_EVIDENCE" (Tidak ada)
5. "relationship":
   - "DIRECT" (Langsung berhubungan dengan profesi)
   - "RELATED" (Berhubungan secara tidak langsung)
   - "TRANSFERABLE" (Misal: Skill komunikasi dari organisasi kampus/luar profesi inti)
   - "NONE"

ATURAN KRITIS:
- Jika tidak ada bukti, isi `evidence_text` dengan null, `source_section` dengan null, dan `reasoning` wajib menyatakan "Tidak ditemukan bukti di CV" (BUKAN "Kandidat tidak memiliki skill ini").
- Jabatan saja (Contoh: "Finance Manager") tidak boleh diklasifikasi "EXPLICIT" untuk "Financial Modeling". Maksimal "WEAK_INFERENCE".
- Sistem ini Domain-Agnostic. Penilaian untuk Sales, Marketing, Healthcare, dan Tech diperlakukan sama adilnya berdasarkan aktivitas yang dideskripsikan kandidat.

Balas HANYA dengan JSON valid tanpa markdown fence. Format JSON WAJIB seperti ini:
{
  "assessments": [
    {
      "requirement": "Nama Requirement",
      "category": "SKILL",
      "importance": "REQUIRED",
      "match_status": "MATCHED",
      "evidence_strength": "EXPLICIT",
      "relationship": "DIRECT",
      "evidence_text": "Kalimat kutipan asli dari CV",
      "source_section": "Experience",
      "reasoning": "1-2 kalimat netral mengapa bukti ini diklasifikasi demikian"
    }
  ],
  "reasoning_summary": "2-3 kalimat rangkuman keseluruhan kecocokan berbasis bukti (tanpa sebut angka).",
  "candidate_track": "Fresh Graduate / Professional",
  "career_consistency_note": "Ringkasan jejak karir (progresif/berpindah bidang)"
}
""" + INJECTION_GUARD


# ─── Scoring Deterministic Engine ──────────────────────────────────────────────

def _get_base_score(relationship: str, evidence_strength: str) -> float:
    # DIRECT
    if relationship == "DIRECT":
        if evidence_strength == "EXPLICIT":
            return 100.0
        if evidence_strength == "STRONG_INFERENCE":
            return 85.0
        if evidence_strength == "WEAK_INFERENCE":
            return 50.0
    # RELATED
    elif relationship == "RELATED":
        if evidence_strength == "EXPLICIT":
            return 75.0
        if evidence_strength == "STRONG_INFERENCE":
            return 60.0
        if evidence_strength == "WEAK_INFERENCE":
            return 30.0
    # TRANSFERABLE
    elif relationship == "TRANSFERABLE":
        if evidence_strength == "EXPLICIT":
            return 70.0
        if evidence_strength == "STRONG_INFERENCE":
            return 50.0
        if evidence_strength == "WEAK_INFERENCE":
            return 25.0
    return 0.0


# ─── Endpoints ───────────────────────────────────────────────────────────────

@router.post("/embed", response_model=EmbedResponse)
async def embed_text(payload: EmbedRequest) -> EmbedResponse:
    cache_key = make_cache_key("embed", payload.text)

    async def compute() -> dict:
        provider = get_provider_for_task("embed")
        started = time.monotonic()
        embedding = await provider.embed(payload.text)
        log_ai_call(
            provider="gemini",
            model="gemini-embedding-001",
            latency_ms=(time.monotonic() - started) * 1000,
            cache_hit=False,
        )
        return {"embedding": embedding}

    result, cache_hit = await get_or_set(cache_key, compute)
    if cache_hit:
        log_ai_call(provider="cache", model="-", latency_ms=0.0, cache_hit=True)
    return EmbedResponse(**result)


@router.post("/match", response_model=MatchResponse)
async def match_candidate_to_job(payload: MatchRequest) -> MatchResponse:
    cache_key = make_cache_key(
        "match_v3_mvp",
        payload.application_id,
        payload.job_id,
        payload.cv_summary,
        payload.job_description,
        ",".join(payload.required_skills),
        str(payload.weights.model_dump() if payload.weights else "default"),
    )

    async def compute() -> dict:
        embed_provider = get_provider_for_task("embed")
        complete_provider = get_provider_for_task("complete")

        started = time.monotonic()

        # Step 1: Semantic Cosine Similarity (Strictly isolated legacy score)
        cv_embed_task = asyncio.create_task(embed_provider.embed(payload.cv_summary))
        job_embed_task = asyncio.create_task(embed_provider.embed(payload.job_description))
        cv_embedding, job_embedding = await asyncio.gather(cv_embed_task, job_embed_task)

        similarity_score = _cosine_similarity(cv_embedding, job_embedding)
        log_ai_call(provider="gemini", model="gemini-embedding-001", latency_ms=(time.monotonic() - started) * 1000, cache_hit=False)

        # Step 2: Requirement Normalization
        requirements_input = []
        
        # Hard constraint / Minimum Education
        if payload.education_requirement:
            requirements_input.append({
                "requirement": f"Education: {payload.education_requirement}",
                "category": "EDUCATION",
                "importance": "HARD_CONSTRAINT"
            })
            
        # Hard constraint / Minimum Experience
        if payload.min_experience_years and payload.min_experience_years > 0:
            requirements_input.append({
                "requirement": f"Experience: Minimal {payload.min_experience_years} tahun",
                "category": "EXPERIENCE",
                "importance": "HARD_CONSTRAINT"
            })
            
        for skill in payload.required_skills:
            requirements_input.append({
                "requirement": skill,
                "category": "SKILL",
                "importance": "REQUIRED"
            })
            
        for skill in payload.preferred_skills:
            requirements_input.append({
                "requirement": skill,
                "category": "SKILL",
                "importance": "PREFERRED"
            })
            
        if payload.key_responsibilities:
            # Sederhananya, split by newline atau representasikan sebagai 1 text blok jika tidak terstruktur
            resp_list = [r.strip() for r in payload.key_responsibilities.split('\n') if r.strip()]
            if not resp_list:
                resp_list = [payload.key_responsibilities]
            for r in resp_list:
                # Hindari duplikasi teks panjang
                short_r = r if len(r) < 100 else r[:100] + "..."
                requirements_input.append({
                    "requirement": short_r,
                    "category": "RESPONSIBILITY",
                    "importance": "REQUIRED"
                })

        work_years = payload.work_experience_years or 0
        candidate_track = "Fresh Graduate" if work_years < 2 else "Professional"

        match_prompt = (
            f"[JALUR KANDIDAT TERDETEKSI: {candidate_track}]\n"
            f"[PENGALAMAN KERJA: {work_years:.1f} tahun]\n\n"
            "=== DAFTAR REQUIREMENT ===\n"
            f"{json.dumps(requirements_input, indent=2)}\n\n"
            "=== PROFIL CV KANDIDAT ===\n"
            f"{payload.cv_summary}"
        )

        # Step 3: LLM Inference
        started = time.monotonic()
        raw_response = await complete_provider.complete(
            match_prompt, system=_EVIDENCE_BASED_SYSTEM_PROMPT
        )
        log_ai_call(
            provider="groq",
            model=getattr(complete_provider, "COMPLETE_MODEL", "unknown"),
            latency_ms=(time.monotonic() - started) * 1000,
            cache_hit=False,
        )

        # Step 4: Parse & Deterministic Scoring
        raw_assessments = []
        reasoning_summary = ""
        career_consistency_note = ""
        llm_candidate_track = candidate_track

        try:
            data = json.loads(raw_response)
            raw_assessments = data.get("assessments", [])
            reasoning_summary = data.get("reasoning_summary", "")
            career_consistency_note = data.get("career_consistency_note", "")
            llm_candidate_track = data.get("candidate_track", candidate_track)
        except (json.JSONDecodeError, TypeError, AttributeError):
            logger.warning("Gagal parse evidence-based JSON MVP: %s", raw_response[:300])

        assessments_obj: list[LLMAssessment] = []
        key_gaps = []
        
        has_failed_hard_req = False
        has_not_demonstrated = False

        for raw_a in raw_assessments:
            a = LLMAssessment(
                requirement=raw_a.get("requirement", ""),
                category=raw_a.get("category", "ADDITIONAL").upper(),
                importance=raw_a.get("importance", "PREFERRED").upper(),
                match_status=raw_a.get("match_status", "NO_EVIDENCE").upper(),
                evidence_strength=raw_a.get("evidence_strength", "NO_EVIDENCE").upper(),
                relationship=raw_a.get("relationship", "NONE").upper(),
                evidence_text=raw_a.get("evidence_text"),
                source_section=raw_a.get("source_section"),
                reasoning=raw_a.get("reasoning", "")
            )

            # Deterministic Score
            if a.match_status in ("NO_EVIDENCE", "NOT_DEMONSTRATED", "FAILED_HARD_REQUIREMENT"):
                a.score = 0.0
            else:
                base = _get_base_score(a.relationship, a.evidence_strength)
                if a.match_status == "PARTIAL_MATCH":
                    base *= 0.6
                a.score = base
                
            # Gaps & Eligibility Evaluator
            if a.importance in ("HARD_CONSTRAINT", "REQUIRED") and a.match_status in ("NO_EVIDENCE", "NOT_DEMONSTRATED", "FAILED_HARD_REQUIREMENT"):
                key_gaps.append(a.requirement)
                
            if a.importance == "HARD_CONSTRAINT":
                if a.match_status == "FAILED_HARD_REQUIREMENT":
                    has_failed_hard_req = True
                elif a.match_status == "NOT_DEMONSTRATED":
                    has_not_demonstrated = True

            assessments_obj.append(a)

        # Step 5: Component Aggregation
        categories = ["SKILL", "EXPERIENCE", "RESPONSIBILITY", "EDUCATION", "ADDITIONAL"]
        # Map pydantic category to WeightConfig property
        cat_to_weightkey = {
            "SKILL": "skill_match",
            "EXPERIENCE": "experience",
            "EDUCATION": "education",
            "RESPONSIBILITY": "responsibilities",
            "ADDITIONAL": "additional"
        }

        if payload.weights:
            weights = payload.weights
        else:
            weights = _get_default_weights(llm_candidate_track)

        component_scores: dict[str, ComponentScore] = {}
        total_valid_weight = 0.0
        
        # Calculate raw component scores
        raw_comp_results: dict[str, _CategoryResult] = {}
        for cat in categories:
            cat_assessments = [a for a in assessments_obj if a.category == cat]
            req_scores = [a.score for a in cat_assessments if a.importance in ("REQUIRED", "HARD_CONSTRAINT")]
            pref_scores = [a.score for a in cat_assessments if a.importance == "PREFERRED"]
            
            if not req_scores and not pref_scores:
                # NOT_EVALUATED
                continue
                
            req_avg = sum(req_scores) / len(req_scores) if req_scores else None
            pref_avg = sum(pref_scores) / len(pref_scores) if pref_scores else None
            
            if req_avg is not None and pref_avg is not None:
                final_score = (req_avg * 0.8) + (pref_avg * 0.2)
            elif req_avg is not None:
                final_score = req_avg
            else:
                # Kalau bukan dua cabang di atas, req_avg pasti None -- dan
                # baris "if not req_scores and not pref_scores: continue" di
                # atas udah jamin minimal satu dari keduanya ada, jadi
                # pref_avg pasti bukan None di sini.
                assert pref_avg is not None
                final_score = pref_avg
                
            w_key = cat_to_weightkey[cat]
            w_val = getattr(weights, w_key, 0.0)
            
            matched_count = sum(1 for a in cat_assessments if a.match_status == "MATCHED")
            partial_count = sum(1 for a in cat_assessments if a.match_status == "PARTIAL_MATCH")
            missing_count = sum(1 for a in cat_assessments if a.match_status in ("NO_EVIDENCE", "NOT_DEMONSTRATED", "FAILED_HARD_REQUIREMENT"))
            
            if final_score >= 80:
                comp_status = "GOOD_MATCH"
            elif final_score >= 40:
                comp_status = "PARTIAL_MATCH"
            else:
                comp_status = "LOW_MATCH"
            
            raw_comp_results[w_key] = {
                "score": round(final_score, 2),
                "weight": w_val,
                "weighted_score": 0.0,
                "assessments": cat_assessments,
                "matched_count": matched_count,
                "partial_count": partial_count,
                "missing_count": missing_count,
                "status": comp_status
            }
            total_valid_weight += w_val
            
        # Normalize weights and compute final Match Score
        final_match_score = 0.0
        for w_key, c_data in raw_comp_results.items():
            norm_weight = (c_data["weight"] / total_valid_weight) * 100.0 if total_valid_weight > 0 else 0.0
            c_data["weight"] = norm_weight
            c_data["weighted_score"] = round((c_data["score"] * norm_weight) / 100.0, 2)
            final_match_score += c_data["weighted_score"]
            
            component_scores[w_key] = ComponentScore(
                score=c_data["score"],
                weight=round(norm_weight, 2),
                weighted_score=c_data["weighted_score"],
                status=c_data["status"],
                summary=f"{c_data['matched_count']} matched, {c_data['partial_count']} partial, {c_data['missing_count']} missing",
                matched_count=c_data["matched_count"],
                partial_count=c_data["partial_count"],
                missing_count=c_data["missing_count"],
                assessments=c_data["assessments"]
            )
            
        final_match_score = round(final_match_score, 2)
        
        # Step 6: Eligibility & Recommendation
        if has_failed_hard_req:
            eligibility_status = "NOT_ELIGIBLE"
            recommendation_status = "NOT_RECOMMENDED"
        elif has_not_demonstrated:
            eligibility_status = "REVIEW_REQUIRED"
            recommendation_status = "REVIEW_REQUIRED"
        else:
            eligibility_status = "ELIGIBLE"
            if final_match_score >= 80:
                recommendation_status = "STRONG_MATCH"
            elif final_match_score >= 60:
                recommendation_status = "POTENTIAL_MATCH"
            elif final_match_score >= 40:
                recommendation_status = "PARTIAL_MATCH"
            else:
                recommendation_status = "INSUFFICIENT_EVIDENCE"
            
        # Evidence Coverage (Simplifikasi: % dari skor yang bukan WEAK/NO_EVIDENCE)
        high_evidence_count = sum(1 for a in assessments_obj if a.evidence_strength in ("EXPLICIT", "STRONG_INFERENCE"))
        total_assessed = len(assessments_obj)
        if total_assessed == 0:
            evidence_coverage = "LOW"
        else:
            cov_ratio = high_evidence_count / total_assessed
            if cov_ratio >= 0.7:
                evidence_coverage = "HIGH"
            elif cov_ratio >= 0.4:
                evidence_coverage = "MEDIUM"
            else:
                evidence_coverage = "LOW"

        return MatchResponse(
            similarity_score=round(similarity_score, 4),
            eligibility_status=eligibility_status,
            match_score=final_match_score,
            recommendation_status=recommendation_status,
            evidence_coverage=evidence_coverage,
            reasoning_summary=reasoning_summary,
            component_scores=component_scores,
            key_gaps=key_gaps,
            candidate_track=llm_candidate_track,
            career_consistency_note=career_consistency_note,
            weights_used=weights
        ).model_dump()

    result, cache_hit = await get_or_set(cache_key, compute)
    if cache_hit:
        log_ai_call(provider="cache", model="-", latency_ms=0.0, cache_hit=True)
    return MatchResponse(**result)
