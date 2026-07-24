# Blueprint System Design Direkrut AI untuk Excalidraw

Dokumen ini adalah panduan menggambar arsitektur **kondisi saat ini**. Buat satu canvas besar dan pisahkan menjadi tiga frame: **(1) Runtime / Production**, **(2) Alur fitur inti**, dan **(3) Development + CI/CD**. Gunakan garis **penuh** untuk request data, garis **putus-putus** untuk proses background/cache, dan garis **merah** untuk dependency eksternal yang dapat gagal.

## 1. Susunan Layer Paling Atas

Gambar dari atas ke bawah, dalam urutan berikut.

```text
Pengguna (Candidate | HRD | Admin)
        |
        v
Frontend: Next.js web
        |
        v
Backend 1: Go REST API (business/API gateway)
        |
        +----------------------+--------------------+
        |                      |                    |
        v                      v                    v
PostgreSQL + pgvector       Redis          Object storage (S3-compatible)
        |
        +----------------------+
        |
        v
Backend 2: Python FastAPI AI Engine
        |
        v
External AI providers (Groq | Gemini | OpenAI | Whisper)
```

Tambahkan satu kotak kecil **Email provider (Resend)** di kanan Go API. Kotak **Payment gateway (Xendit)** boleh digambar abu-abu/`planned`, karena endpoint payment belum siap untuk production.

## 2. Frame Utama: Runtime / Production

### A. Layer pengguna

Buat satu kotak paling atas:

```text
Users
- Candidate: cari lowongan, unggah CV, apply, pre-screening, AI interview
- HRD: buat lowongan, lihat kandidat, screening, putuskan status
- Admin: pengelolaan platform (role sudah tersedia di model akses)
```

Panah dari `Users` ke `Frontend`:

```text
HTTPS via browser
```

### B. Layer frontend — `apps/web`

Kotak utama:

```text
Frontend Web — Next.js + React
apps/web

UI yang dilayani:
- Landing/public jobs
- Authentication
- Candidate portal
- HRD dashboard
- AI interview page (microphone + webcam)

Client service layer:
- authService
- jobService
- candidateService
- applicationService
- aiService
- companyService
```

Di dalam kotak itu, buat dua subkotak:

```text
1. Public / Candidate UI
- landing dan daftar/detail lowongan
- register, login, reset password
- profil kandidat dan upload CV
- submit application
- pre-screening dan AI interview

2. HRD UI
- buat/edit/hapus lowongan
- daftar dan detail kandidat
- hasil CV screening
- konfigurasi scoring
- update status lamaran
```

**Panah utama ke Go API:**

```
Browser -> Go API
HTTPS JSON REST
Authorization: Bearer JWT
```

**Panah khusus upload file:**

```text
1. Browser -> Go API: minta presigned upload URL
2. Go API -> Browser: uploadUrl + objectKey
3. Browser -> Object Storage: PUT file langsung
4. Browser -> Go API: simpan objectKey/metadata
```

Gambar panah nomor 3 langsung dari frontend ke object storage. Beri label `temporary presigned URL (10 min)`. Ini penting karena CV dan audio **tidak** melewati memory/bandwidth Go API.

#### Mengapa memakai Next.js?

Tulis catatan kecil di samping kotak frontend:

```text
Alasan Next.js
- React untuk dashboard interaktif.
- SSR/SEO untuk halaman lowongan publik agar mudah diindeks mesin pencari.
- Satu codebase untuk portal kandidat dan dashboard HRD.
- Routing, optimasi asset, dan build/deploy web yang terstandar.

Catatan: Next.js di sini adalah presentation layer;
business logic dan akses data tetap melalui Go API.
```

### C. Backend 1 — `apps/api-go`

Kotak utama, letakkan di bawah frontend:

```text
Business API / BFF — Go REST API
apps/api-go

Tanggung jawab:
- REST API publik untuk frontend
- autentikasi JWT dan refresh-token rotation
- role-based authorization: candidate / hrd / admin
- manajemen job, kandidat, perusahaan, lamaran
- menerbitkan presigned object-storage URL
- menyimpan hasil screening/interview dan status lamaran
- menjadi satu-satunya jalur frontend ke AI engine
- notifikasi dan email
```

Di sisi kiri kotak, tulis **input**:

```text
Input
- HTTPS request dari browser
- Bearer access token
- JSON request / objectKey
```

Di sisi kanan kotak, tulis **kontrol**:

```text
Controls
- CORS allowlist
- security headers
- max JSON body 1 MB
- request ID, recovery, compression
- global request timeout 30 s
- rate limit Redis untuk auth dan aksi tertentu
```

Di bawah kotak, buat lima panah keluar:

```text
Go API -> PostgreSQL: CRUD data bisnis dan hasil assessment
Go API -> Redis: cache list lowongan + rate limit
Go API -> Object storage: presigned PUT/GET URL
Go API -> AI Engine: internal REST + X-Internal-Api-Key
Go API -> Resend: email reset password / status kandidat
```

#### Mengapa Go sebagai backend utama?

```text
Alasan Go API
- Kuat untuk HTTP API ber-concurrency tinggi dan footprint ringan.
- Memisahkan aturan bisnis/akses data dari kode AI.
- Cocok sebagai boundary yang stabil bagi frontend, walaupun AI provider berubah.
- Type-safe untuk kontrak API dan mudah dibuat health/readiness endpoint.
```

### D. Data dan cache

Letakkan tiga kotak sejajar di bawah Go API.

```text
PostgreSQL + pgvector
- users, companies, jobs, candidates, applications
- assessment, transcript, skor, status history, audit-log schema
- metadata file (object key/URL), bukan file bytes
- vector/embedding untuk pencarian/matching
```

```text
Redis
- cache data yang sering dibaca (contoh: job listing)
- rate limiter API dan AI
- cache hasil AI selama 24 jam

Bukan queue durable pada implementasi saat ini.
```

```text
S3-compatible object storage
- file CV
- rekaman audio interview
- dokumen verifikasi perusahaan
- MinIO pada development; provider S3-compatible pada production
```

Panah `AI Engine -> Redis` juga perlu digambar, untuk cache dan rate limiting AI. Panah `AI Engine -> Object storage` juga perlu digambar karena AI engine mengambil CV/audio berdasarkan `objectKey`.

### E. Backend 2 — `apps/ai-engine`

Letakkan di samping atau di bawah Go API, tetapi **jangan** beri panah langsung dari browser ke sini.

```text
AI Engine — Python FastAPI
apps/ai-engine

Tanggung jawab:
- parse CV PDF dan gambar
- ekstrak summary, skills, pengalaman
- generate pertanyaan pre-screening / interview
- scoring jawaban dan assessment
- transkripsi audio interview dan ringkasan
- proctoring check dari frame webcam
- embedding dan candidate-job matching
- generate feedback kandidat
```

Label panah Go API ke AI Engine:

```text
Internal REST
X-Internal-Api-Key
request timeout client 30 s
```

Di dalam kotak AI Engine, tambahkan tiga subkotak:

```text
Security & reliability
- validasi internal API key
- Redis rate limiting per endpoint AI
- prompt guard untuk input dari CV/jawaban
- structured log + request ID

Cache
- hasil AI berdasarkan hash input
- TTL 24 jam

Routers
- cv-parser
- assessment
- vector-search
- chat
```

#### Mengapa Python + FastAPI untuk AI engine?

```text
Alasan Python/FastAPI
- Ekosistem AI/NLP, SDK provider, dan pemrosesan dokumen paling matang di Python.
- FastAPI memudahkan schema validation dan endpoint async.
- Service AI dipisahkan agar perubahan model/prompt/provider tidak mengganggu API bisnis.
- Tim dapat scale atau mengganti engine AI secara terpisah dari Go API.
```

### F. Provider eksternal

Buat kotak di paling bawah/kanan:

```text
External AI Providers
- Groq: text completion, scoring, Whisper transcription
- Gemini: vision untuk CV gambar dan proctoring frame
- OpenAI: provider alternatif / embedding sesuai konfigurasi
```

Panah dari AI Engine ke kotak ini diberi label:

```text
HTTPS API call
rate limit / timeout / provider failure risk
```

## 3. Frame Kedua: Alur Fitur yang Diberi Panah

Jangan masukkan semua alur ke diagram runtime utama. Buat frame terpisah di kanan canvas memakai nomor langkah berikut.

### A. Alur autentikasi

```text
1. Browser -> Go API: register/login
2. Go API -> PostgreSQL: buat/verifikasi user dan password hash
3. Go API -> Browser: access token (15 menit) + refresh token (7 hari)
4. Browser: menyimpan token dan mengirim Bearer token pada request berikutnya
5. Saat 401: Browser -> Go API: refresh token -> token pair baru
```

### B. Alur upload CV dan apply

```text
1. Candidate -> Go API: request CV upload URL
2. Go API -> Object storage: membuat presigned PUT URL
3. Go API -> Candidate: uploadUrl + objectKey
4. Candidate -> Object storage: upload PDF/image langsung
5. Candidate -> Go API: simpan objectKey sebagai CV profile
6. Candidate -> Go API: submit application
7. Go API -> PostgreSQL: simpan application + status history
8. Go API -> AI Engine: mulai CV screening di background
9. AI Engine -> Object storage: baca CV dengan objectKey
10. AI Engine -> Provider: parse/extract/score
11. AI Engine -> Go API: mengembalikan hasil screening
12. Go API -> PostgreSQL: menyimpan hasil screening agar tersedia bagi HRD
13. HRD -> Go API -> PostgreSQL: membaca application dan screening result
```

Gambar langkah `8` sebagai garis putus-putus dan beri label **`current: in-process goroutine, bukan durable queue`**.

### C. Alur AI interview

```text
1. Candidate -> Go API: minta pertanyaan interview
2. Go API -> AI Engine -> AI provider: generate questions
3. Candidate -> Go API: minta upload URL untuk setiap audio jawaban
4. Candidate -> Object storage: upload audio langsung
5. Candidate -> Go API: kirim objectKey audio untuk transcribe
6. Go API -> AI Engine -> Object storage: ambil audio
7. AI Engine -> Whisper/provider: transkripsi + analisis
8. AI Engine -> Go API -> PostgreSQL: simpan transcript, score, feedback
9. HRD -> Go API: lihat result dan minta presigned GET URL untuk playback audio
10. Go API -> HRD: URL audio sementara
11. HRD -> Object storage: stream/playback audio
```

Tambahkan cabang proctoring:

```text
Browser webcam frame -> Go API -> AI Engine -> Gemini vision -> flagged/reason -> Browser
```

### D. Alur keputusan HRD dan email

```text
1. HRD -> Go API: update status application
2. Go API -> PostgreSQL: update status + status history + notification
3. Go API -> Resend: email status kandidat (best effort/background)
4. Jika rejected tanpa email manual:
   Go API -> AI Engine -> provider: generate feedback kandidat
   Go API -> Resend: kirim feedback
```

## 4. Frame Ketiga: Development Lokal

Gambar laptop developer di kiri, lalu empat proses lokal berikut.

```text
Developer machine
  |
  +-> Next.js development server :3000
  |      yarn dev
  |
  +-> Go API :8080
  |      go run ./cmd/server
  |
  +-> FastAPI AI engine :8000
  |      uvicorn app.main:app --reload
  |
  +-> Docker Compose
         PostgreSQL + pgvector :5433
         Redis :6379
         MinIO S3 API :9000 / console :9001
```

Panah lokal:

```text
Browser localhost:3000 -> Go API localhost:8080
Go API localhost:8080 -> FastAPI localhost:8000
Go API + AI Engine -> local Postgres / Redis / MinIO
AI Engine -> real external AI provider API (jika API key dikonfigurasi)
```

Tambahkan catatan:

```text
Web dapat berjalan dengan mock/fallback bila API belum dikonfigurasi.
Untuk uji integrasi sebenarnya, set NEXT_PUBLIC_API_BASE_URL
dan jalankan seluruh dependency lokal.
```

## 5. Frame Keempat: Production dan CI/CD

### A. Runtime production saat ini

```text
Internet
  -> Frontend hosting (Vercel/manual menurut dokumentasi repo)
  -> Heroku app: Go API container
  -> Heroku app: AI Engine container
  -> Managed PostgreSQL / Redis / S3-compatible storage
  -> External AI provider + Resend
```

Gambar frontend sebagai deployment terpisah dari dua backend. Beri peringatan kecil pada AI Engine:

```text
Harus hanya dapat dipanggil Go API.
Saat ini kontrol aplikasi: X-Internal-Api-Key.
Validasi juga network exposure, secret rotation, dan access restriction di hosting.
```

### B. Pipeline deployment saat ini

```text
Developer push / Pull Request
  -> GitHub Actions
       web: yarn install -> typecheck -> lint -> build
       api-go: build -> go vet -> go test
       ai-engine: ruff -> mypy -> pytest

Merge / push ke branch prod
  -> GitHub Actions backend per service
       -> docker build Go API -> push Heroku Container Registry -> release
       -> docker build AI Engine -> push Heroku Container Registry -> release

Frontend
  -> CI build ada; deploy production terpisah/manual menurut dokumentasi saat ini
```

### C. Kotak “perlu ditambahkan sebelum scale”

Buat kotak merah putus-putus, karena ini **target design**, bukan komponen yang sudah ada:

```text
Recommended production additions
- Durable job queue + worker untuk screening, transkripsi, dan email
- Job status: queued / processing / succeeded / failed
- retry with backoff + dead-letter queue
- centralized metrics, alerts, tracing, error tracking
- malware scan dan file validation setelah upload
- database migration step + backup/restore test
- staging + smoke test + rollback strategy
- secret management dan rotation
```

## 6. Legenda Warna yang Disarankan

```text
Biru     = frontend / pengguna
Hijau    = Go API dan business/data service
Ungu     = AI engine dan AI processing
Oranye   = database/cache/object storage
Merah    = provider eksternal atau risiko kegagalan
Abu-abu  = planned / belum production-ready
```

## 7. Ringkasan Singkat untuk Dipresentasikan

> Direkrut AI memakai frontend Next.js sebagai pengalaman pengguna dan SEO lowongan, Go API sebagai pusat business logic, security, dan akses data, serta Python FastAPI sebagai engine AI yang dapat berkembang terpisah. File besar seperti CV dan audio tidak melewati backend utama, tetapi langsung ke object storage dengan URL sementara. Go API tetap menjadi pengendali akses dan satu-satunya jalur frontend ke AI engine. Di production, dua backend dibungkus container dan di-deploy terpisah; prioritas scale berikutnya adalah durable queue, observability, file security, dan pipeline migration/rollback.
