-- Migrasi awal: extension pgvector + seluruh skema inti sesuai ERD.
-- Dijalankan lewat golang-migrate (image migrate/migrate), dibungkus
-- sbg service "migrate" di infra/docker-compose.yml -- gak perlu install
-- Postgres atau migrate CLI di lokal. Lihat README di infra/ buat cara
-- pakainya.
--
-- Catatan penyesuaian dari ERD sumber ke tipe Postgres:
--   - "VARCHAR(36)" id -> UUID DEFAULT gen_random_uuid() (pgcrypto),
--     konsisten dgn seluruh FK yg jadi UUID juga.
--   - "TIMESTAMP" -> TIMESTAMPTZ.
--   - job_embeddings.embedding / candidate_embeddings.embedding: TEXT ->
--     VECTOR(1536) (pgvector), krn apps/ai-engine generate embedding
--     1536 dim (OpenAI text-embedding-3-small) buat cosine similarity
--     search, bukan disimpan sbg string.
--   - audit_logs.id: BIGINT -> BIGINT GENERATED ALWAYS AS IDENTITY.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

-- =========================================================================
-- Identity & akses
-- =========================================================================

CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL CHECK (role IN ('candidate', 'hrd', 'admin')),
    status        TEXT NOT NULL DEFAULT 'active',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at    TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id),
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS refresh_tokens_user_id_idx ON refresh_tokens (user_id);

-- =========================================================================
-- Perusahaan & akun HRD
-- =========================================================================

CREATE TABLE IF NOT EXISTS companies (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    industry   TEXT,
    logo_url   TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hrd_users (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL UNIQUE REFERENCES users(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    job_title  TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS hrd_users_company_id_idx ON hrd_users (company_id);

-- =========================================================================
-- Subscription & billing
-- =========================================================================

CREATE TABLE IF NOT EXISTS subscription_plans (
    id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code                      TEXT NOT NULL UNIQUE,
    name                      TEXT NOT NULL,
    price_idr                 BIGINT NOT NULL,
    max_active_jobs           INT NOT NULL,
    max_candidates_per_month  INT NOT NULL
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id            UUID NOT NULL REFERENCES companies(id),
    plan_id               UUID NOT NULL REFERENCES subscription_plans(id),
    status                TEXT NOT NULL,
    current_period_start  TIMESTAMPTZ NOT NULL,
    current_period_end    TIMESTAMPTZ NOT NULL,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS subscriptions_company_id_idx ON subscriptions (company_id);
CREATE INDEX IF NOT EXISTS subscriptions_plan_id_idx ON subscriptions (plan_id);

CREATE TABLE IF NOT EXISTS payments (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id      UUID NOT NULL REFERENCES subscriptions(id),
    xendit_reference_id  TEXT NOT NULL UNIQUE,
    amount_idr           BIGINT NOT NULL,
    status               TEXT NOT NULL,
    paid_at              TIMESTAMPTZ,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payments_subscription_id_idx ON payments (subscription_id);

-- =========================================================================
-- Skills, jobs & matching
-- =========================================================================

CREATE TABLE IF NOT EXISTS skills (
    id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name     TEXT NOT NULL UNIQUE,
    category TEXT
);

CREATE TABLE IF NOT EXISTS jobs (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id       UUID NOT NULL REFERENCES companies(id),
    created_by       UUID NOT NULL REFERENCES hrd_users(id),
    title            TEXT NOT NULL,
    description      TEXT NOT NULL,
    requirements     TEXT,
    location         TEXT,
    employment_type  TEXT NOT NULL,
    salary_min       BIGINT,
    salary_max       BIGINT,
    status           TEXT NOT NULL,
    published_at     TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS jobs_company_id_idx ON jobs (company_id);
CREATE INDEX IF NOT EXISTS jobs_created_by_idx ON jobs (created_by);

CREATE TABLE IF NOT EXISTS job_skills (
    job_id          UUID NOT NULL REFERENCES jobs(id),
    skill_id        UUID NOT NULL REFERENCES skills(id),
    required_level  TEXT NOT NULL,
    PRIMARY KEY (job_id, skill_id)
);

CREATE INDEX IF NOT EXISTS job_skills_skill_id_idx ON job_skills (skill_id);

CREATE TABLE IF NOT EXISTS job_embeddings (
    job_id     UUID PRIMARY KEY REFERENCES jobs(id),
    embedding  VECTOR(1536) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS job_embeddings_embedding_idx
    ON job_embeddings USING ivfflat (embedding vector_cosine_ops);

-- =========================================================================
-- Kandidat
-- =========================================================================

CREATE TABLE IF NOT EXISTS candidates (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL UNIQUE REFERENCES users(id),
    full_name   TEXT NOT NULL,
    phone       TEXT,
    headline    TEXT,
    location    TEXT,
    cv_file_url TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS candidate_skills (
    candidate_id  UUID NOT NULL REFERENCES candidates(id),
    skill_id      UUID NOT NULL REFERENCES skills(id),
    proficiency   TEXT NOT NULL,
    PRIMARY KEY (candidate_id, skill_id)
);

CREATE INDEX IF NOT EXISTS candidate_skills_skill_id_idx ON candidate_skills (skill_id);

CREATE TABLE IF NOT EXISTS candidate_embeddings (
    candidate_id UUID PRIMARY KEY REFERENCES candidates(id),
    embedding    VECTOR(1536) NOT NULL,
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS candidate_embeddings_embedding_idx
    ON candidate_embeddings USING ivfflat (embedding vector_cosine_ops);

-- =========================================================================
-- Lamaran & pipeline seleksi
-- =========================================================================

CREATE TABLE IF NOT EXISTS applications (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id        UUID NOT NULL REFERENCES jobs(id),
    candidate_id  UUID NOT NULL REFERENCES candidates(id),
    status        TEXT NOT NULL,
    applied_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS applications_job_id_idx ON applications (job_id);
CREATE INDEX IF NOT EXISTS applications_candidate_id_idx ON applications (candidate_id);

CREATE TABLE IF NOT EXISTS application_status_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id  UUID NOT NULL REFERENCES applications(id),
    changed_by      UUID REFERENCES users(id),
    from_status     TEXT,
    to_status       TEXT NOT NULL,
    note            TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS application_status_history_application_id_idx
    ON application_status_history (application_id);
CREATE INDEX IF NOT EXISTS application_status_history_changed_by_idx
    ON application_status_history (changed_by);

CREATE TABLE IF NOT EXISTS cv_parse_results (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id              UUID NOT NULL UNIQUE REFERENCES applications(id),
    parsed_json                 TEXT NOT NULL,
    extracted_years_experience  NUMERIC,
    parsed_at                   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scoring_results (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id      UUID NOT NULL UNIQUE REFERENCES applications(id),
    overall_score       NUMERIC NOT NULL,
    skill_match_score   NUMERIC,
    model_used          TEXT,
    scored_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================================
-- Assessment
-- =========================================================================

CREATE TABLE IF NOT EXISTS assessments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id  UUID NOT NULL REFERENCES applications(id),
    track_type      TEXT NOT NULL,
    status          TEXT NOT NULL,
    score           NUMERIC,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS assessments_application_id_idx ON assessments (application_id);

CREATE TABLE IF NOT EXISTS assessment_items (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id     UUID NOT NULL REFERENCES assessments(id),
    question_text     TEXT NOT NULL,
    candidate_answer  TEXT,
    ai_feedback       TEXT,
    item_score        NUMERIC,
    order_index       INT NOT NULL
);

CREATE INDEX IF NOT EXISTS assessment_items_assessment_id_idx ON assessment_items (assessment_id);

-- =========================================================================
-- Interview
-- =========================================================================

CREATE TABLE IF NOT EXISTS interviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id  UUID NOT NULL REFERENCES applications(id),
    interview_type  TEXT NOT NULL,
    status          TEXT NOT NULL,
    scheduled_at    TIMESTAMPTZ NOT NULL,
    meeting_url     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS interviews_application_id_idx ON interviews (application_id);

CREATE TABLE IF NOT EXISTS interview_transcripts (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id       UUID NOT NULL UNIQUE REFERENCES interviews(id),
    audio_file_url     TEXT,
    transcript_text    TEXT,
    sentiment_summary  TEXT,
    analyzed_at        TIMESTAMPTZ
);

-- =========================================================================
-- Keputusan akhir
-- =========================================================================

CREATE TABLE IF NOT EXISTS decisions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id  UUID NOT NULL UNIQUE REFERENCES applications(id),
    decided_by      UUID NOT NULL REFERENCES hrd_users(id),
    decision        TEXT NOT NULL,
    reason          TEXT,
    decided_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS decisions_decided_by_idx ON decisions (decided_by);

-- =========================================================================
-- Chat AI
-- =========================================================================

CREATE TABLE IF NOT EXISTS chat_conversations (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES users(id),
    related_job_id UUID REFERENCES jobs(id),
    context_type   TEXT NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_conversations_user_id_idx ON chat_conversations (user_id);
CREATE INDEX IF NOT EXISTS chat_conversations_related_job_id_idx ON chat_conversations (related_job_id);

CREATE TABLE IF NOT EXISTS chat_messages (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id  UUID NOT NULL REFERENCES chat_conversations(id),
    sender           TEXT NOT NULL,
    content          TEXT NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS chat_messages_conversation_id_idx ON chat_messages (conversation_id);

-- =========================================================================
-- Notifikasi & audit
-- =========================================================================

CREATE TABLE IF NOT EXISTS notifications (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id),
    type       TEXT NOT NULL,
    title      TEXT NOT NULL,
    body       TEXT,
    is_read    BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications (user_id);

CREATE TABLE IF NOT EXISTS audit_logs (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_user_id  UUID REFERENCES users(id),
    action         TEXT NOT NULL,
    entity_type    TEXT NOT NULL,
    entity_id      UUID,
    metadata       TEXT,
    ip_address     TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_logs_actor_user_id_idx ON audit_logs (actor_user_id);
