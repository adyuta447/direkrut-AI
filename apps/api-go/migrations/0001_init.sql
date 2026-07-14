-- Migrasi awal: extension pgvector + tabel inti.
-- Jalankan lewat tool migrasi pilihan (mis. golang-migrate) yang connect
-- ke instance Postgres yang didefinisikan di infra/docker-compose.yml.

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('applicant', 'hrd')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    subscription_tier TEXT NOT NULL DEFAULT 'free'
        CHECK (subscription_tier IN ('free', 'pro', 'pro_plus', 'max')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    department TEXT NOT NULL,
    salary_range TEXT,
    industry TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id),
    applicant_id UUID NOT NULL REFERENCES users(id),
    cv_object_key TEXT,
    -- Embedding CV buat vector search kecocokan (diisi oleh apps/ai-engine).
    cv_embedding VECTOR(1536),
    validation_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (validation_status IN ('pending', 'in-progress', 'completed')),
    status TEXT NOT NULL DEFAULT 'submitted'
        CHECK (status IN ('submitted', 'under-review', 'interview', 'rejected')),
    recommendation_score NUMERIC,
    applied_date TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS applications_cv_embedding_idx
    ON applications USING ivfflat (cv_embedding vector_cosine_ops);
