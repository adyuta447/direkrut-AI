# Direkrut AI

Platform rekrutmen bertenaga AI. Monorepo ini berisi tiga layanan yang jalan
independen, plus kontrak API dan infra buat development lokal.

## Arsitektur

Direkrut AI dibangun di atas arsitektur modular berlapis yang memisahkan
logika bisnis dari logika kecerdasan buatan untuk memaksimalkan performa
dan skalabilitas.

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
`packages/contracts/openapi.yaml`.

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
└── .github/workflows/  CI per layanan (lint+test, deploy tetap manual/Vercel)
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
go run ./cmd/server   # http://localhost:8080

# 4. AI Engine (di terminal terpisah)
cd apps/ai-engine
cp .env.example .env
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload   # http://localhost:8000
```

`apps/web` jalan penuh tanpa dua layanan lain — semua fitur masih baca dari
mock data lewat `apps/web/src/services/`. Set `NEXT_PUBLIC_API_BASE_URL` di
`apps/web/.env.local` begitu mau connect ke `apps/api-go` beneran.

## Status

Ini boilerplate/skeleton. `apps/api-go` dan `apps/ai-engine` punya routing,
struktur folder, dan kontrak yang jelas, tapi handler-nya masih placeholder
(`TODO` di tiap file) — logikanya diisi bertahap per modul.
