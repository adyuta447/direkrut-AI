# Direkrut AI

AI-powered recruitment platform. This monorepo holds three services that run
independently, plus the shared API contract and the infra you need for local
development.

## Architecture

Direkrut AI is split into layers so that business logic and AI logic can scale
separately and neither one blocks the other.

**Frontend** (`apps/web`) is a Next.js app serving two interfaces from one
codebase: the public candidate portal and the private HRD dashboard.
Server-side rendering keeps job pages indexable, which is how most candidates
find us in the first place.

**Backend** is two services running side by side:

- `apps/api-go` is a Go REST API that owns the platform's business logic: JWT
  auth with role-based access control, job management, the four-tier
  subscription flow, Xendit payment integration, and real-time notifications.
  We picked Go here because this layer takes the brunt of concurrent traffic.
- `apps/ai-engine` is a Python FastAPI service that owns everything AI: CV
  parsing and skill extraction, cosine-similarity vector search, NLP over
  interview transcripts, the dual-track assessment logic, and inference for the
  Chat AI thinking partner.

The two talk over an internal REST API, with Redis acting as cache and message
queue.

**Data** lives in PostgreSQL with the pgvector extension, so relational rows and
vector embeddings sit in the same system instead of two. CV files and short
audio recordings go to object storage (MinIO locally, anything S3-compatible in
production).

**External AI** is deliberately model-agnostic (see
`apps/ai-engine/app/providers.py`). Each company can pick the provider that fits
their budget: OpenAI, Gemini, Groq, or whatever comes next. Whisper handles
speech-to-text for interview answers, which matters given how much Indonesian
accents vary.

```
apps/web       ──HTTP──▶  apps/api-go  ──internal REST──▶  apps/ai-engine
(Next.js)                  (Golang)                          (FastAPI)
                              │                                   │
                              ▼                                   ▼
                        PostgreSQL + pgvector                 AI Providers
                        Redis                                 (OpenAI/Gemini/Groq)
                        MinIO (object storage)                Whisper API
```

Request and response shapes for all three services are defined once in
`packages/contracts/openapi.yaml`. See [API documentation](#api-documentation)
below for how to read it.

## API documentation

The baseline contract lives in
[`packages/contracts/openapi.yaml`](packages/contracts/openapi.yaml)
(OpenAPI 3.0.3). Anything not built yet is tagged `[BELUM DIIMPLEMENTASI]` in
its summary and returns `501`. Be aware that the apps have outrun the spec: the
candidate and HRD endpoints that already ship are summarized below and still
need to be folded back into the OpenAPI file.

Raw YAML is painful to read, so render it locally instead (nothing gets
uploaded):

```bash
npx @redocly/cli preview-docs packages/contracts/openapi.yaml
```

Before you commit a change to `openapi.yaml`, lint it. Zero errors or it
doesn't go in:

```bash
npx @redocly/cli lint packages/contracts/openapi.yaml
```

**What actually works today**: JWT auth, jobs CRUD with cursor pagination and
Redis caching, the application, prescreen and interview flow, CV parsing via
Groq and Gemini, assessment scoring, interview transcription via Groq Whisper,
and Chat AI. All of it has been tested against the real services and storage.
Subscriptions, payments, notifications, and vector search are still stubs, and
each one is flagged in the tables below.

**Live deployments** (pushed manually through the Heroku container registry;
CI/CD takes over automatically on merge to `prod`, see `.github/workflows/`):

| Service | URL | Health |
|---|---|---|
| `apps/api-go` | `https://direkrut-ai-api-go-51c4e232a2fc.herokuapp.com` | `/healthz`, `/readyz` |
| `apps/ai-engine` | `https://direkrut-ai-ai-engine-c58d5404c946.herokuapp.com` | `/healthz`, `/readyz` (public probes; `/v1/*` needs `X-Internal-Api-Key`) |

All four probes above were verified returning HTTP 200 on July 26, 2026.

### Main endpoints

Both services return the same error envelope for every 4xx and 5xx response
unless a table note says otherwise:

```json
{ "error": { "code": "validation_failed", "message": "..." } }
```

#### `apps/api-go`, public, base URL in the table above

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/v1/auth/register` | none | Create an account. `role: hrd` requires `companyName`. |
| POST | `/v1/auth/login` | none | Sign in, returns a token pair. |
| POST | `/v1/auth/forgot-password` | none | Emails a reset link. Response is intentionally generic, token TTL is 1 hour, 5 minute cooldown per account. |
| POST | `/v1/auth/reset-password` | none | Consumes the single-use email token, then revokes every refresh token for that user. |
| POST | `/v1/auth/refresh` | none | Trade in a refresh token. Rotating, single use. |
| GET | `/v1/jobs` | none | Published jobs. Cursor paginated and cached. |
| GET | `/v1/jobs/{jobId}` | none | One job. Cached. |
| POST | `/v1/jobs` | Bearer (hrd) | Create a job. |
| PUT | `/v1/jobs/{jobId}` | Bearer (hrd, owner) | Update a job. |
| DELETE | `/v1/jobs/{jobId}` | Bearer (hrd, owner) | Delete a job. Hard delete, no soft flag. |
| POST | `/v1/jobs/{jobId}/cv-upload-url` | Bearer (candidate) | Presigned URL for uploading a CV straight to object storage. |
| POST | `/v1/applications` | Bearer (candidate) | Submit an application. |
| GET | `/v1/applications` | Bearer | Applications visible to the caller's role. |
| GET | `/v1/applications/{applicationId}` | Bearer | One application, subject to access rules. |
| PATCH | `/v1/applications/{applicationId}/status` | Bearer (hrd) | Move a candidate to a new status or decision. |
| POST | `/v1/applications/{applicationId}/prescreen/questions` | Bearer (candidate) | Generate pre-screening questions. |
| POST | `/v1/applications/{applicationId}/prescreen/submit` | Bearer (candidate) | Store answers and pre-screening results. |
| GET | `/v1/applications/{applicationId}/prescreen` | Bearer | Read pre-screening status, score, and answers. |
| POST | `/v1/applications/{applicationId}/interview/questions` | Bearer (candidate) | Generate AI interview questions once pre-screening passes. |
| POST | `/v1/applications/{applicationId}/interview/transcribe` | Bearer (candidate) | Store the transcript of an interview answer. |
| POST | `/v1/applications/{applicationId}/interview/finalize` | Bearer (candidate) | Score and close out the AI interview. |
| GET | `/v1/applications/{applicationId}/interview` | Bearer | Read interview results, subject to access rules. |
| GET | `/v1/subscriptions/me` | Bearer | **Hardcoded** `{"tier":"free"}`, does not hit the DB yet. |
| POST | `/v1/subscriptions/upgrade` | Bearer | Not implemented. Returns `501` with a `null` body. |
| POST | `/v1/subscriptions/cancel` | Bearer | Not implemented. Returns `501` with a `null` body. |
| POST | `/v1/payments/invoices` | Bearer | Not implemented. Returns `501` with a `null` body. |
| POST | `/v1/payments/webhooks/xendit` | none | ⚠️ Accepts any callback with **no signature verification** and always answers 200. |
| GET | `/v1/notifications` | Bearer | **Always an empty array**, does not hit the DB yet. |
| POST | `/v1/notifications/{id}/read` | Bearer | Not implemented. Returns `501` with a `null` body. |

#### `apps/ai-engine`, internal only, every route requires `X-Internal-Api-Key`

| Method | Path | Notes |
|---|---|---|
| POST | `/v1/cv-parser/parse` | PDFs go to Groq, images (jpg/png/webp) go to Gemini vision. Cached 24 hours per content hash. |
| POST | `/v1/assessment/score-validation` | Score from 0 to 100 plus an authenticity read on the answers (Groq). |
| POST | `/v1/assessment/transcribe-interview` | Speech-to-text via Groq Whisper, plus a summary. |
| POST | `/v1/vector-search/embed` | Not implemented. Returns `501`. |
| POST | `/v1/vector-search/match` | Not implemented. Returns `501`. |
| POST | `/v1/chat/stream` | Live SSE chat with provider fallback, rate limiting, a prompt-injection guard, and HR scope enforcement. |

### Request and response examples

Only for endpoints that actually work. Full field lists and validation rules
(min/max length, enums, and so on) live in `openapi.yaml`.

<details>
<summary><code>POST /v1/auth/register</code></summary>

```jsonc
// Request (role: hrd must include companyName)
{
  "name": "Dewi Anggraini",
  "email": "hrd@contoh.com",
  "password": "supersecret123",
  "role": "hrd",
  "companyName": "PT Contoh Sejahtera"
}
```
```jsonc
// Response 201
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",   // JWT, 15 minute lifetime
  "refreshToken": "89b87756dd93fb680c..."      // opaque string, 7 day lifetime
}
```
</details>

<details>
<summary><code>POST /v1/auth/login</code> / <code>POST /v1/auth/refresh</code></summary>

```jsonc
// POST /v1/auth/login request
{ "email": "hrd@contoh.com", "password": "supersecret123" }
```
```jsonc
// POST /v1/auth/refresh request
{ "refreshToken": "89b87756dd93fb680c..." }
```
```jsonc
// Response 200 (same shape for both)
{ "accessToken": "eyJhbGciOiJIUzI1NiIs...", "refreshToken": "010f3fbd8ccaf966..." }
```
</details>

<details>
<summary><code>POST /v1/auth/forgot-password</code> / <code>POST /v1/auth/reset-password</code></summary>

```jsonc
// POST /v1/auth/forgot-password request
{ "email": "user@contoh.com" }
```
```jsonc
// Response 200, always generic so we never leak which emails are registered
{ "status": "ok" }
```
Reset tokens are stored hashed and expire after an hour. Asking again within
five minutes reuses the existing token rather than minting a new one, so nobody
can flood a user's inbox.

```jsonc
// POST /v1/auth/reset-password request
{
  "token": "token-from-email",
  "newPassword": "passwordbaru123"
}
```
```jsonc
// Response 200
{ "status": "ok" }
```
</details>

<details>
<summary><code>GET /v1/jobs?limit=1</code></summary>

```jsonc
// Response 200, sent with Cache-Control: public, max-age=60
{
  "items": [
    {
      "id": "b10fb44b-2720-4bd6-939d-38582db1386f",
      "companyId": "6ad5774a-29f6-4cf4-9ed3-cb09c06a3608",
      "companyName": "PT Finansial Prima",
      "companyIndustry": "Keuangan",
      "title": "Financial Analyst",
      "description": "Analisis laporan keuangan klien korporat...",
      "requirements": "S1 Akuntansi/Keuangan\nMahir Excel dan financial modeling",
      "location": "Jakarta Pusat",
      "employmentType": "full-time",
      "salaryMin": 9000000,
      "salaryMax": 15000000,
      "status": "published",
      "publishedAt": "2026-07-17T18:14:05.052Z",
      "createdAt": "2026-07-17T18:14:05.052Z"
    }
  ],
  "nextCursor": "MjAyNi0wNy0xN1QxODoxNDowNS4wNTI3OVpfMmM0MTc5NzctZTNkZC00Yjc0LTgzNDItYTgxY2NmNzY3ZjE0"
}
```
For the next page: `GET /v1/jobs?limit=1&cursor=<nextCursor>`.
</details>

<details>
<summary><code>POST /v1/jobs</code> (Bearer, role hrd)</summary>

```jsonc
// Request
{
  "title": "Backend Engineer",
  "description": "Bangun dan maintain layanan Go & Python...",
  "requirements": "Minimal 2 tahun pengalaman Go\nPaham REST API",
  "location": "Jakarta Selatan (Hybrid)",
  "employmentType": "full-time",
  "salaryMin": 12000000,
  "salaryMax": 20000000,
  "status": "published"
}
```
```jsonc
// Response 201, same shape as an item in GET /v1/jobs
{ "id": "a7213f18-...", "companyId": "7a8d6652-...", "title": "Backend Engineer", "...": "..." }
```
</details>

<details>
<summary><code>POST /v1/jobs/{jobId}/cv-upload-url</code> (Bearer, role candidate)</summary>

```jsonc
// Response 200
{
  "uploadUrl": "https://.../cv/e9f2155f-.../a7213f18-...-1784306575556814000.pdf?X-Amz-Algorithm=...",
  "objectKey": "cv/e9f2155f-.../a7213f18-...-1784306575556814000.pdf"
}
```
The browser `PUT`s straight to `uploadUrl` (valid for 10 minutes), never through
api-go. Hold on to `objectKey`, you'll need it for
`POST /v1/cv-parser/parse` on the ai-engine side.
</details>

<details>
<summary><code>POST /v1/cv-parser/parse</code> (header <code>X-Internal-Api-Key</code>)</summary>

```jsonc
// Request
{ "cv_object_key": "cv/e9f2155f-.../a7213f18-...-....pdf", "application_id": "app-1" }
```
```jsonc
// Response 200
{
  "summary": "Software Engineer dengan 3 tahun pengalaman backend Go...",
  "skills": ["Go", "PostgreSQL", "Docker"],
  "work_experience_years": 3
}
```
Returns `422` on unsupported file types, and on scanned PDFs with no extractable
text.
</details>

<details>
<summary><code>POST /v1/assessment/score-validation</code> (header <code>X-Internal-Api-Key</code>)</summary>

```jsonc
// Request
{
  "application_id": "app-1",
  "responses": [
    { "question": "Ceritakan pengalaman lead sebuah tim", "answer": "..." }
  ]
}
```
```jsonc
// Response 200
{
  "recommendation_score": 82,
  "authenticity_score": { "authentic": 70, "generic": 25, "aiGenerated": 5 }
}
```
</details>

<details>
<summary><code>POST /v1/assessment/transcribe-interview</code> (header <code>X-Internal-Api-Key</code>)</summary>

```jsonc
// Request
{ "application_id": "app-1", "audio_object_key": "interviews/app-1/rec.wav" }
```
```jsonc
// Response 200
{
  "transcript": "Jadi pengalaman saya di tim sebelumnya...",
  "analysis_summary": "Kandidat menunjukkan pemahaman teknis yang solid dan komunikasi jelas."
}
```
</details>

## Repository layout

```
direkrut-ai/
├── apps/
│   ├── web/           Next.js, candidate portal + HRD dashboard
│   ├── api-go/        Golang REST API, business logic
│   └── ai-engine/     Python FastAPI, AI logic
├── packages/
│   └── contracts/     OpenAPI spec, the shared API contract
├── infra/
│   └── docker-compose.yml   Postgres+pgvector, Redis, MinIO for local dev
└── .github/workflows/  CI per service (lint + test); api-go and ai-engine
                        auto-deploy to Heroku on push to `prod`, while
                        apps/web stays manual via Vercel
```

## Running locally

```bash
# 1. Bring up the infra dependencies (Postgres, Redis, MinIO)
yarn infra:up

# 2. Frontend
cd apps/web
yarn install
yarn dev              # http://localhost:3000

# 3. Golang API (separate terminal)
cd apps/api-go
cp .env.example .env
# Forgot/reset password needs RESEND_API_KEY and EMAIL_FROM_ADDRESS.
go run ./cmd/server   # http://localhost:8080

# 4. AI Engine (separate terminal)
cd apps/ai-engine
cp .env.example .env
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload   # http://localhost:8000
```

`apps/web` runs fine on its own without the other two services, falling back to
mock data in `apps/web/src/services/`. Set `NEXT_PUBLIC_API_BASE_URL` (see
`apps/web/.env.local`, which already points at the live api-go on Heroku) and
`/candidate/jobs` and `/hrd/jobs` will read real rows from the database
instead. A few service modules still fall back to mocks when the backend is
genuinely unreachable, but anything security-sensitive stays strict: changing
your email or password, deleting an account, forgot password, and reset
password all have to reach the real backend. Faking that state in the browser
is worse than failing loudly.

## Status

**Past the boilerplate stage.** In `apps/api-go`, auth (register with company
provisioning for HRD accounts, login, refresh-token rotation, forgot and reset
password through the mail server) and jobs (CRUD, cursor pagination, Redis
cache, presigned CV upload) are real, tested against actual Postgres+pgvector
and object storage, and live on Heroku. In `apps/ai-engine`, CV parsing (Groq
for text, Gemini for images) and assessment (scoring plus interview
transcription via Groq Whisper) are equally real, cached, and rate limited.

Subscriptions, payments, notifications, and vector search are still
placeholders sitting behind `TODO`s and `501`s. The
[API documentation](#api-documentation) above has the full breakdown of what
ships and what doesn't.
