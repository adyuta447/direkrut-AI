# Direkrut AI

Platform rekrutmen bertenaga AI. Monorepo ini berisi tiga layanan yang jalan
independen, plus kontrak API dan infra buat development lokal.

## Arsitektur

**Lapisan frontend** (`apps/web`) menggunakan Next.js yang melayani dua
antarmuka dalam satu codebase — portal publik kandidat dan dashboard privat
HRD. Server-side rendering memastikan halaman lowongan terindeks mesin
pencari secara organik untuk memperluas jangkauan kandidat.

**Lapisan backend** terdiri dari dua layanan yang berjalan secara paralel:

- `apps/api-go` — Golang REST API yang menangani seluruh logika bisnis
  platform: autentikasi berbasis JWT dengan role-based access control,
  manajemen lowongan, alur subscription empat tier, integrasi payment
  gateway Xendit, dan pengiriman notifikasi real-time. Golang dipilih
  karena kemampuan concurrency tinggi untuk menangani ribuan request
  bersamaan.
- `apps/ai-engine` — Python FastAPI yang menangani seluruh proses
  kecerdasan buatan: parsing dan ekstraksi keahlian dari CV, vector search
  berbasis cosine similarity, analisis transkrip menggunakan NLP, logika
  dual-track assessment, dan inferensi model untuk Chat AI thinking
  partner.

Kedua layanan berkomunikasi melalui internal REST API dengan Redis sebagai
message queue dan cache.

**Lapisan database** menggunakan PostgreSQL dengan ekstensi pgvector yang
menyatukan data relasional dan vector embeddings dalam satu sistem. File CV
dan rekaman audio ringan disimpan di object storage terpisah (MinIO secara
lokal, S3-compatible di production).

**Lapisan AI eksternal** dirancang model-agnostic (lihat
`apps/ai-engine/app/providers.py`) — perusahaan dapat memilih provider AI
sesuai kebutuhan dan budget mereka antara OpenAI, Gemini, Groq, atau
provider lainnya. Whisper API menangani Speech-to-Text untuk transkripsi
jawaban wawancara dalam berbagai aksen bahasa Indonesia.

```
apps/web       ──HTTP──▶  apps/api-go  ──internal REST──▶  apps/ai-engine
(Next.js)                  (Golang)                          (FastAPI)
                              │                                   │
                              ▼                                   ▼
                        PostgreSQL + pgvector                 AI Providers
                        Redis                                 (OpenAI/Gemini/Groq)
                        MinIO (object storage)                Whisper API
```

Kontrak request/response ketiga layanan didefinisikan sekali di
`packages/contracts/openapi.yaml` — lihat [Dokumentasi API](#dokumentasi-api)
di bawah buat cara bacanya.

## Dokumentasi API

Kontrak API baseline tersedia di
[`packages/contracts/openapi.yaml`](packages/contracts/openapi.yaml)
(OpenAPI 3.0.3). Endpoint yang belum diimplementasi ditandai eksplisit
`[BELUM DIIMPLEMENTASI]` di summary-nya dan balikin `501`. Implementasi
aplikasi bergerak lebih cepat daripada spec; endpoint aplikasi kandidat/HRD
yang sudah berjalan dirangkum di bawah dan perlu disinkronkan ke OpenAPI.

Raw YAML gak enak dibaca langsung — render interaktif-nya lokal (gak upload
apa pun):

```bash
npx @redocly/cli preview-docs packages/contracts/openapi.yaml
```

Sebelum commit perubahan ke `openapi.yaml`, validasi dulu (harus 0 error):

```bash
npx @redocly/cli lint packages/contracts/openapi.yaml
```

**Endpoint yang beneran jalan** (auth JWT, jobs CRUD + cursor pagination +
Redis cache, application/prescreen/interview, CV parsing lewat Groq/Gemini,
assessment scoring, transkripsi wawancara lewat Groq Whisper, dan Chat AI)
udah dites terhadap layanan serta penyimpanan yang relevan.
Subscriptions/payments/notifications/vector-search masih stub — detailnya
ditandai di bawah.

**API yang sudah live** (deploy manual lewat Heroku container registry,
CI/CD otomatis begitu di-merge ke `prod` — lihat `.github/workflows/`):

| Servis | URL | Health |
|---|---|---|
| `apps/api-go` | `https://direkrut-ai-api-go-51c4e232a2fc.herokuapp.com` | `/healthz`, `/readyz` |
| `apps/ai-engine` | `https://direkrut-ai-ai-engine-c58d5404c946.herokuapp.com` | `/healthz`, `/readyz` (probe publik; endpoint `/v1/*` butuh `X-Internal-Api-Key`) |

Keempat health probe di atas diverifikasi merespons HTTP 200 pada
26 Juli 2026.

### Endpoint utama

Semua response error (kode 4xx/5xx) di kedua servis pakai amplop yang sama,
kecuali dicatat lain di tabel:
```json
{ "error": { "code": "validation_failed", "message": "..." } }
```

#### `apps/api-go` — publik, base URL di tabel atas

| Method | Path | Auth | Keterangan |
|---|---|---|---|
| POST | `/v1/auth/register` | — | Daftar akun. `role: hrd` wajib bawa `companyName`. |
| POST | `/v1/auth/login` | — | Masuk, dapet token pair. |
| POST | `/v1/auth/forgot-password` | — | Kirim tautan ganti password ke email. Response sukses generik, token TTL 1 jam, cooldown 5 menit per akun. |
| POST | `/v1/auth/reset-password` | — | Ganti password pakai token email sekali pakai, lalu revoke semua refresh token user. |
| POST | `/v1/auth/refresh` | — | Tukar refresh token (rotate, sekali pakai). |
| GET | `/v1/jobs` | — | List lowongan published. Cursor pagination, di-cache. |
| GET | `/v1/jobs/{jobId}` | — | Detail satu lowongan. Di-cache. |
| POST | `/v1/jobs` | Bearer (hrd) | Buat lowongan baru. |
| PUT | `/v1/jobs/{jobId}` | Bearer (hrd, pemilik) | Update lowongan. |
| DELETE | `/v1/jobs/{jobId}` | Bearer (hrd, pemilik) | Hapus lowongan (hard delete). |
| POST | `/v1/jobs/{jobId}/cv-upload-url` | Bearer (candidate) | Presigned URL upload CV langsung ke object storage. |
| POST | `/v1/applications` | Bearer (candidate) | Mengirim lamaran kandidat. |
| GET | `/v1/applications` | Bearer | Daftar lamaran sesuai role dan hak akses. |
| GET | `/v1/applications/{applicationId}` | Bearer | Detail lamaran sesuai hak akses. |
| PATCH | `/v1/applications/{applicationId}/status` | Bearer (hrd) | Mengubah status/keputusan kandidat. |
| POST | `/v1/applications/{applicationId}/prescreen/questions` | Bearer (candidate) | Membuat pertanyaan pre-screening. |
| POST | `/v1/applications/{applicationId}/prescreen/submit` | Bearer (candidate) | Menyimpan jawaban dan hasil pre-screening. |
| GET | `/v1/applications/{applicationId}/prescreen` | Bearer | Membaca status, skor, dan jawaban pre-screening. |
| POST | `/v1/applications/{applicationId}/interview/questions` | Bearer (candidate) | Membuat pertanyaan AI Interview setelah lolos pre-screening. |
| POST | `/v1/applications/{applicationId}/interview/transcribe` | Bearer (candidate) | Menyimpan transkrip jawaban interview. |
| POST | `/v1/applications/{applicationId}/interview/finalize` | Bearer (candidate) | Menilai dan menyelesaikan AI Interview. |
| GET | `/v1/applications/{applicationId}/interview` | Bearer | Membaca hasil AI Interview sesuai hak akses. |
| GET | `/v1/subscriptions/me` | Bearer | **Hardcoded** `{"tier":"free"}`, belum baca DB. |
| POST | `/v1/subscriptions/upgrade` | Bearer | `[BELUM DIIMPLEMENTASI]` → `501`, body `null`. |
| POST | `/v1/subscriptions/cancel` | Bearer | `[BELUM DIIMPLEMENTASI]` → `501`, body `null`. |
| POST | `/v1/payments/invoices` | Bearer | `[BELUM DIIMPLEMENTASI]` → `501`, body `null`. |
| POST | `/v1/payments/webhooks/xendit` | — | ⚠️ Nerima callback apa pun TANPA verifikasi signature, selalu 200. |
| GET | `/v1/notifications` | Bearer | **Selalu array kosong**, belum baca DB. |
| POST | `/v1/notifications/{id}/read` | Bearer | `[BELUM DIIMPLEMENTASI]` → `501`, body `null`. |

#### `apps/ai-engine` — internal only, semua butuh header `X-Internal-Api-Key`

| Method | Path | Keterangan |
|---|---|---|
| POST | `/v1/cv-parser/parse` | PDF → Groq, gambar (jpg/png/webp) → Gemini vision. Di-cache 24 jam per konten. |
| POST | `/v1/assessment/score-validation` | Skor 0-100 + deteksi keaslian jawaban (Groq). |
| POST | `/v1/assessment/transcribe-interview` | Speech-to-text (Groq Whisper) + ringkasan. |
| POST | `/v1/vector-search/embed` | `[BELUM DIIMPLEMENTASI]` → `501`. |
| POST | `/v1/vector-search/match` | `[BELUM DIIMPLEMENTASI]` → `501`. |
| POST | `/v1/chat/stream` | Chat AI SSE aktif dengan provider fallback, rate limit, prompt-injection guard, dan pembatasan scope HR. |

### Contoh request & response

Cuma buat endpoint yang beneran jalan — field lengkap + validasi (min/max
length, enum, dst) ada di `openapi.yaml`.

<details>
<summary><code>POST /v1/auth/register</code></summary>

```jsonc
// Request (role: hrd wajib bawa companyName)
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
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",   // JWT, umur 15 menit
  "refreshToken": "89b87756dd93fb680c..."      // string opaque, umur 7 hari
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
// Response 200 (bentuknya sama utk keduanya)
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
// Response 200, selalu generik agar tidak membocorkan email terdaftar
{ "status": "ok" }
```
Token reset disimpan sebagai hash, berlaku 1 jam, dan request ulang dalam 5 menit
tidak membuat token baru supaya email user tidak bisa dibanjiri.

```jsonc
// POST /v1/auth/reset-password request
{
  "token": "token-dari-email",
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
// Response 200 — header Cache-Control: public, max-age=60
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
Halaman berikutnya: `GET /v1/jobs?limit=1&cursor=<nextCursor>`.
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
// Response 201 — bentuknya sama kayak item di GET /v1/jobs
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
Browser `PUT` langsung ke `uploadUrl` (berlaku 10 menit) — bukan lewat api-go.
Simpan `objectKey`, dipakai lagi buat `POST /v1/cv-parser/parse` di ai-engine.
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
`422` kalau format file gak didukung, atau PDF hasil scan tanpa teks yang bisa diekstrak.
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

## Struktur folder

```
direkrut-ai/
├── apps/
│   ├── web/          Next.js — portal kandidat + dashboard HRD
│   ├── api-go/        Golang REST API — logika bisnis
│   └── ai-engine/      Python FastAPI — logika AI
├── packages/
│   └── contracts/      OpenAPI spec = kontrak API bersama
├── infra/
│   └── docker-compose.yml   Postgres+pgvector, Redis, MinIO buat dev lokal
└── .github/workflows/  CI per layanan (lint+test); api-go & ai-engine auto-deploy
                        ke Heroku di push ke `prod`, apps/web tetap manual/Vercel
```

## Menjalankan secara lokal

```bash
# 1. Nyalain dependensi infra (Postgres, Redis, MinIO)
yarn infra:up

# 2. Frontend
cd apps/web
yarn install
yarn dev              # http://localhost:3000

# 3. Golang API (di terminal terpisah)
cd apps/api-go
cp .env.example .env
# Untuk forgot/reset password, isi RESEND_API_KEY dan EMAIL_FROM_ADDRESS.
go run ./cmd/server   # http://localhost:8080

# 4. AI Engine (di terminal terpisah)
cd apps/ai-engine
cp .env.example .env
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload   # http://localhost:8000
```

`apps/web` jalan penuh tanpa dua layanan lain (fallback ke mock data lewat
`apps/web/src/services/`), TAPI kalau `NEXT_PUBLIC_API_BASE_URL` diset (lihat
`apps/web/.env.local` — udah nunjuk ke `apps/api-go` yang live di Heroku),
lowongan yang ditampilkan `/candidate/jobs` dan `/hrd/jobs` beneran dari
database asli. Beberapa service layer masih punya fallback mock saat backend
benar-benar tidak terjangkau, tetapi mutasi keamanan seperti ganti email,
ganti password, hapus akun, forgot password, dan reset password wajib bicara
ke backend asli supaya state akun tidak palsu di browser.

## Status

**Bukan lagi murni boilerplate.** `apps/api-go`: auth (register dengan
provisioning company buat HRD, login, refresh-token rotation, forgot/reset
password via mailer server) dan jobs (CRUD + cursor pagination + Redis cache +
presigned CV upload) udah beneran jalan,
dites lawan Postgres+pgvector & object storage asli, dan live di Heroku.
`apps/ai-engine`: CV parsing (Groq buat teks, Gemini buat gambar) dan
assessment (scoring + transkripsi wawancara lewat Groq Whisper) juga beneran
jalan, di-cache, di-rate-limit. Subscriptions, payments, notifications,
vector-search masih placeholder (`TODO` + `501`) — lihat
[Dokumentasi API](#dokumentasi-api) buat daftar lengkap mana yang udah &
belum.
