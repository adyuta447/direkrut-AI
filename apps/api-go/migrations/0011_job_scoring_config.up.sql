-- Migration 0008: Tambah kolom structured ke jobs dan tabel konfigurasi bobot AI
-- untuk Hybrid Evidence-Based Scoring System.

-- =========================================================================
-- Tambah kolom terstruktur ke tabel jobs untuk AI screening yang lebih detail
-- =========================================================================

ALTER TABLE jobs
    ADD COLUMN IF NOT EXISTS required_skills   JSONB DEFAULT '[]',
    ADD COLUMN IF NOT EXISTS preferred_skills  JSONB DEFAULT '[]',
    ADD COLUMN IF NOT EXISTS key_responsibilities TEXT,
    ADD COLUMN IF NOT EXISTS min_experience_years INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS education_requirement TEXT,
    ADD COLUMN IF NOT EXISTS candidate_type TEXT DEFAULT 'any';

-- =========================================================================
-- Tambah kolom component_scores dan weights_used ke scoring_results
-- =========================================================================

ALTER TABLE scoring_results
    ADD COLUMN IF NOT EXISTS component_scores JSONB,
    ADD COLUMN IF NOT EXISTS weights_used     JSONB;

-- =========================================================================
-- Tabel konfigurasi bobot scoring per-company (global, berlaku semua lowongan)
-- =========================================================================

CREATE TABLE IF NOT EXISTS scoring_weight_configs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    candidate_type  TEXT NOT NULL DEFAULT 'any',
    -- bobot dalam persen (0-100), harus total = 100
    weight_skill_match       NUMERIC NOT NULL DEFAULT 35,
    weight_experience        NUMERIC NOT NULL DEFAULT 25,
    weight_education         NUMERIC NOT NULL DEFAULT 10,
    weight_responsibilities  NUMERIC NOT NULL DEFAULT 20,
    weight_additional        NUMERIC NOT NULL DEFAULT 10,
    is_custom       BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (company_id, candidate_type)
);

CREATE INDEX IF NOT EXISTS scoring_weight_configs_company_id_idx ON scoring_weight_configs (company_id);

-- =========================================================================
-- Tabel konfigurasi bobot scoring per-job (override company config)
-- =========================================================================

CREATE TABLE IF NOT EXISTS job_scoring_weight_configs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id          UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    -- bobot dalam persen (0-100), harus total = 100
    weight_skill_match       NUMERIC NOT NULL DEFAULT 35,
    weight_experience        NUMERIC NOT NULL DEFAULT 25,
    weight_education         NUMERIC NOT NULL DEFAULT 10,
    weight_responsibilities  NUMERIC NOT NULL DEFAULT 20,
    weight_additional        NUMERIC NOT NULL DEFAULT 10,
    is_custom       BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (job_id)
);

CREATE INDEX IF NOT EXISTS job_scoring_weight_configs_job_id_idx ON job_scoring_weight_configs (job_id);
