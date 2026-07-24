# Konteks Direkrut AI untuk Dikirim ke AI Lain

Salin bagian di bawah ini sebagai konteks/prompt awal. Tujuannya agar AI lain memahami produk, batas MVP, arsitektur, algoritma, dan tingkat kematangannya tanpa membuat klaim berlebihan.

---

## Konteks Produk

Saya sedang mengembangkan **Direkrut AI**, platform rekrutmen berbasis AI untuk membantu proses screening awal kandidat. Produk ini **tidak menggantikan keputusan HRD**. AI hanya membuat ringkasan, rekomendasi, kategori, dan bukti pendukung; keputusan lanjut interview, diterima, atau ditolak tetap dilakukan manusia/HRD.

Pada fase proposal/MVP, fokusnya hanya pada satu alur utama:

1. Kandidat login atau mendaftar.
2. Kandidat mencari dan membuka detail lowongan.
3. Kandidat mengikuti onboarding/form lamaran: profil, CV, dan data yang diperlukan.
4. Kandidat mengirim lamaran dan mengerjakan pre-screening singkat.
5. Kandidat mengikuti AI interview berbasis audio dari browser, dengan kamera digunakan sebagai indikator integritas sesi.
6. Kandidat menunggu hasil; status/undangan berikutnya akan tampil di inbox/dashboard kandidat.
7. HRD membuat lowongan dan melihat daftar kandidat yang melamar.
8. Sistem memproses CV dan hasil interview; HRD melihat ringkasan, bukti, hasil matching, serta skor/rekomendasi.
9. HRD mengambil keputusan: lanjut ke interview berikutnya atau tolak. Status keputusan tampil di inbox/dashboard kandidat.

Pengiriman email/SMTP bukan scope MVP proposal ini. Fitur cross-role discovery dan chat AI juga **bukan** bagian MVP karena algoritma serta validasinya belum ditetapkan dengan matang.

## Aktor dan Tujuan

### Kandidat

- Menemukan lowongan yang relevan.
- Melengkapi profil dan mengunggah CV.
- Mengirim lamaran tanpa perlu mengisi ulang seluruh isi CV secara manual bila hasil ekstraksi digunakan untuk membantu profil.
- Menjawab pre-screening dan interview audio secara asinkron dari browser.
- Melihat status lamaran atau undangan tahap berikutnya pada dashboard/inbox.

### HRD

- Membuat lowongan dengan kriteria yang lebih terstruktur: skill wajib/preferensi, pengalaman minimum, pendidikan, tanggung jawab, dan tipe kandidat.
- Meninjau kandidat berdasarkan hasil screening yang menjelaskan alasan rekomendasi, bukan hanya angka tunggal.
- Mengatur bobot penilaian bila diperlukan.
- Menentukan sendiri apakah kandidat dilanjutkan atau ditolak.

### Admin

- Role admin sudah ada pada model akses, tetapi pengelolaan admin bukan fokus alur MVP.

## Arsitektur Aktual

Direkrut AI adalah monorepo dengan tiga aplikasi utama.

```text
Candidate / HRD browser
        |
        v
Frontend: Next.js + React (`apps/web`)
        |
        | HTTPS JSON REST + JWT
        v
Business API: Go (`apps/api-go`)
        |-------------------------------> PostgreSQL + pgvector
        |-------------------------------> Redis
        |-------------------------------> S3-compatible object storage
        |
        | Internal REST + X-Internal-Api-Key
        v
AI Engine: Python FastAPI (`apps/ai-engine`)
        |-------------------------------> Groq API
        |-------------------------------> Gemini API
        |-------------------------------> Object storage / Redis
```

### Frontend — Next.js + React

Frontend menyediakan portal publik/kandidat dan dashboard HRD dalam satu codebase. Next.js dipilih untuk UI React yang interaktif, routing, serta SSR/SEO pada halaman lowongan publik. Frontend memanggil Go API; frontend tidak boleh memanggil AI provider atau AI engine secara langsung.

Komponen alur yang tersedia/dirancang pada frontend meliputi login, lowongan, profil kandidat, upload CV, apply flow bertahap, pre-screening, interview audio dengan microphone dan webcam, dashboard kandidat, dashboard HRD, daftar kandidat, serta tampilan hasil screening.

### Backend utama — Go REST API

Go API adalah pusat aturan bisnis dan security boundary. Ia menangani autentikasi JWT, refresh token, role-based access (candidate/hrd/admin), lowongan, profil kandidat, lamaran, status lamaran, konfigurasi bobot scoring, URL upload/download file sementara, dan penyimpanan hasil AI. Go API adalah satu-satunya service yang memanggil AI engine untuk alur aplikasi.

Go dipilih karena sesuai untuk REST API yang menangani request bersamaan, memisahkan aturan bisnis dari kode AI, dan menjaga kontrak API tetap stabil walaupun model/provider AI berubah.

### AI engine — Python FastAPI

Python FastAPI dipakai karena ekosistem pemrosesan dokumen, AI, dan SDK provider lebih kuat di Python. AI engine dipisahkan dari Go API agar prompt, provider, dan eksperimen model dapat berubah tanpa mengubah aturan bisnis inti.

AI engine memiliki endpoint untuk parsing CV, screening/matching, generate pertanyaan, penilaian jawaban, transkripsi interview, proctoring frame webcam, embedding, dan chat. Namun **chat AI dan cross-role discovery tidak termasuk MVP** dan tidak boleh diposisikan sebagai kemampuan yang sudah tervalidasi.

### Data dan storage

- **PostgreSQL + pgvector:** user, perusahaan, job, kandidat, lamaran, hasil parsing, hasil scoring, assessment, transcript, status history, dan konfigurasi bobot.
- **Redis:** cache hasil AI dan listing, serta rate limiting. Redis saat ini bukan job queue durable.
- **S3-compatible object storage:** CV, rekaman audio, dan dokumen. Browser mengunggah langsung memakai presigned URL sementara; file besar tidak melalui Go API.

## Infrastruktur Development dan Production

### Development lokal

```text
Next.js web        : localhost:3000
Go API             : localhost:8080
FastAPI AI engine  : localhost:8000
PostgreSQL+pgvector: Docker Compose, host port 5433
Redis              : Docker Compose, port 6379
MinIO              : Docker Compose, port 9000
```

Developer menjalankan Docker Compose untuk PostgreSQL, Redis, dan MinIO; lalu menjalankan Next.js, Go API, dan FastAPI sebagai proses lokal. AI engine tetap memerlukan API key provider bila ingin menjalankan pemrosesan AI nyata.

### Production saat ini

- **Go API:** container Heroku, deploy otomatis melalui GitHub Actions saat push ke branch `prod`.
- **AI engine:** container Heroku terpisah, deploy otomatis melalui GitHub Actions saat push ke branch `prod`.
- **Frontend:** dokumentasi repository menyebut deployment terpisah/manual (misalnya Vercel); status hosting production frontend perlu diverifikasi sebelum diklaim.
- **Database, Redis, dan object storage:** aplikasi dikonfigurasi untuk PostgreSQL, Redis, dan storage S3-compatible. Vendor production sebenarnya tidak boleh disebut spesifik bila belum terdokumentasi/terverifikasi.

Pipeline CI saat ini menjalankan build/lint/test per service. Migration production eksplisit, smoke test, rollback formal, job queue durable, dan monitoring terpusat masih perlu ditingkatkan sebelum skala enterprise.

## Integrasi API Eksternal dan Model

### Provider aktif di desain kode

- **Groq:** completion teks untuk parsing/scoring/pertanyaan/feedback, serta transkripsi audio melalui Whisper yang tersedia di Groq.
- **Gemini:** vision untuk CV berbasis gambar dan pemeriksaan frame webcam; embedding teks untuk semantic signal.
- **OpenAI:** interface/provider sudah disiapkan, tetapi implementasi aktifnya masih stub dan tidak boleh diklaim sebagai integrasi yang selesai.
- **Resend/email:** ada integrasi kode untuk reset password/status/feedback, tetapi SMTP/email tidak masuk scope MVP proposal ini.
- **Xendit:** belum production-ready; bukan scope MVP.

Tidak ada bukti bahwa Direkrut AI melatih foundation model sendiri. Sistem ini adalah **AI orchestration + domain scoring engine** di atas provider model eksternal. Fase berikutnya sebaiknya bukan langsung mengklaim “tinggal training”, melainkan: mengumpulkan data berizin dan teranonymisasi, menyusun dataset berlabel dari penilaian HRD, membandingkan model/provider lokal dan cloud, mengukur akurasi/bias/biaya/latensi, lalu memutuskan apakah fine-tuning atau model lokal memang layak.

### Posisi AI MVP: bukan wrapper biasa, tetapi belum model terlatih sendiri

Dalam narasi proposal, jelaskan bahwa MVP **bukan sekadar form yang mengirim satu prompt lalu menampilkan jawaban mentah LLM**. Tim sudah membangun lapisan algoritma dan aturan domain di atas LLM: input terstruktur, validasi schema, guardrail, jalur fresh graduate/professional, penilaian lima komponen, rumus nilai akhir berbobot, konfigurasi bobot HRD, kutipan bukti, cache, dan human review. Dengan kata lain, ini adalah **applied AI scoring engine** yang sedang dikembangkan dan diuji pada prototype.

Namun, jangan menyamakan klaim tersebut dengan “kami sudah melatih model sendiri”. Pemahaman bahasa, ekstraksi, generasi pertanyaan, dan penilaian semantik masih menggunakan model eksternal. Pengembangan model berikutnya berarti menguji dan menyempurnakan rubric, mengumpulkan evaluasi HRD, membangun benchmark, lalu menilai kelayakan model lokal atau fine-tuning secara berbasis bukti.

## Alur Data MVP

### 1. Kandidat melamar

```text
Candidate -> Next.js: login, pilih lowongan, isi onboarding/form
Candidate -> Go API: minta presigned URL untuk CV
Candidate -> Object storage: upload CV langsung
Candidate -> Go API: simpan object key CV dan submit application
Go API -> PostgreSQL: simpan application + status history
Go API -> AI engine: mulai screening CV
```

### 2. Parsing CV

```text
AI engine -> Object storage: mengambil file CV berdasarkan object key
PDF teks -> pypdf: ekstraksi teks
CV gambar (jpg/png/webp) -> Gemini vision
Teks CV -> provider completion: hasil JSON terstruktur
Go API -> PostgreSQL: simpan summary, skills, pengalaman, dan hasil parse
```

Catatan akurat: PDF dengan teks dapat diproses; CV gambar dapat diproses. Jangan mengklaim dukungan DOCX atau OCR untuk PDF scan sebelum benar-benar diimplementasikan dan diuji.

### 3. Algoritma screening dan matching

Input screening:

- Ringkasan CV, skills, dan pengalaman hasil parsing.
- Required skills dan preferred skills dari lowongan.
- Pengalaman minimum, pendidikan, tanggung jawab utama, dan deskripsi lowongan.
- Tipe kandidat/bobot dari HRD atau bobot default sistem.

Proses:

1. Sistem membuat embedding untuk ringkasan CV dan deskripsi lowongan, lalu menghitung **cosine similarity**. Nilai ini merupakan sinyal pendukung, bukan satu-satunya keputusan.
2. Sistem menentukan jalur kandidat: `Fresh Graduate` bila pengalaman kurang dari dua tahun; selain itu `Professional`.
3. Provider AI menerima CV dan kriteria lowongan dalam prompt terstruktur, lalu memberi skor `0–1` dan bukti kutipan CV pada lima dimensi:
   - `skill_match`
   - `experience`
   - `education`
   - `responsibilities`
   - `additional`
4. Backend membatasi setiap skor pada rentang 0–1 dan menghitung nilai akhir sendiri:

```text
final_score = Σ(component_score × component_weight)
              / Σ(component_weight) × 100
```

5. Sistem mengembalikan kategori, reasoning, kutipan bukti, skor per komponen, bobot yang dipakai, dan skor akhir.

Bobot default:

```text
Professional: Skill 35%, Experience 25%, Education 10%,
              Responsibilities 20%, Additional 10%

Fresh Graduate: Skill 30%, Experience 15%, Education 20%,
                Responsibilities 25%, Additional 10%
```

HRD dapat mengubah bobot per perusahaan atau per lowongan. Sistem memvalidasi agar total bobot mendekati 100%. Ini membuat penilaian lebih transparan daripada ranking kata kunci saja, tetapi **belum membuktikan akurasi atau bebas bias**. Hasil harus ditinjau manusia.

### 4. Pre-screening dan AI interview

```text
Candidate -> Go API -> AI engine: generate 3 pertanyaan pre-screening
Candidate -> Go API: kirim jawaban pre-screening
Candidate -> Go API -> AI engine: generate pertanyaan interview
Candidate -> Object storage: upload audio jawaban per pertanyaan
Candidate -> Go API -> AI engine: transcribe audio dan analisis
Go API -> PostgreSQL: simpan transcript, feedback, skor kompetensi, flag
HRD -> dashboard: melihat hasil untuk meninjau kandidat
```

Penilaian jawaban dapat menghasilkan skor rekomendasi, skor kompetensi, indikator keaslian jawaban, dan `evidence_confidence`. Frame webcam diperiksa berkala untuk indikasi seperti tidak ada wajah atau lebih dari satu orang; perpindahan tab/blur juga dicatat. Ini adalah **indikator proctoring untuk tinjauan HRD**, bukan bukti kecurangan otomatis. Tidak ada bukti watermarking sesi pada implementasi saat ini.

Pertanyaan juga tidak dibuat secara generik tanpa konteks. Generator pertanyaan menerima judul posisi, deskripsi lowongan, dan ringkasan CV kandidat. System prompt membatasi topik pada peran, kualifikasi, pengalaman, aspek teknis/perilaku yang relevan, serta menolak pertanyaan di luar pekerjaan. Pre-screening saat ini menghasilkan tiga pertanyaan jawaban singkat untuk menyaring pelamar sebelum interview yang lebih mahal. Ini sudah merupakan guardrailed question generation, tetapi belum model interviewer yang dilatih sendiri atau sistem adaptive follow-up yang tervalidasi.

### 5. Feedback kandidat yang ditolak — status pengembangan

Generator feedback penolakan sudah ada di kode. Inputnya adalah judul/deskripsi lowongan, ringkasan CV bila tersedia, dan ringkasan hasil interview bila tersedia. Prompt meminta output Bahasa Indonesia yang hangat, berisi 2–3 kekuatan, 2–3 area pengembangan yang terkait posisi, saran skill/pelatihan, dan penegasan bahwa AI hanya bahan bantu. Hasilnya di-cache dan dapat disimpan sebagai notifikasi; kode juga memiliki jalur pengiriman email, tetapi SMTP/email **tidak masuk scope MVP proposal saat ini**.

Jangan menyebut algoritma feedback ini sudah sedetail screening utama. Saat ini ia masih prompt-based generation; belum ada rubric berbobot khusus, pemetaan evidence per kalimat, evaluasi kualitas, katalog pelatihan terintegrasi, atau validasi pengguna. Posisi yang akurat: **feedback personal sedang dikembangkan sebagai roadmap lanjutan; generator awal sudah tersedia untuk eksperimen internal.**

### 6. Keputusan HRD dan inbox kandidat

```text
HRD -> Go API: ubah status lamaran (mis. under-review, interview, rejected)
Go API -> PostgreSQL: simpan status history dan notifikasi in-app
Candidate -> dashboard/inbox: membaca status atau undangan tahap berikutnya
```

Notifikasi in-app dan status bisa digunakan di MVP. Jangan menyebut “real-time” kecuali WebSocket, SSE, atau mekanisme push yang benar-benar telah diimplementasikan dan diuji. Email otomatis/SMTP tidak termasuk scope MVP ini.

## Fitur: Klasifikasi Klaim yang Benar

### Boleh disebut MVP / ada implementasi inti

- Login/registrasi dan role kandidat/HRD.
- Pencarian dan pengelolaan lowongan.
- Onboarding/application flow kandidat.
- Upload CV ke storage dengan URL sementara.
- Parsing CV terstruktur untuk PDF teks dan gambar yang didukung.
- Pre-screening dan AI interview audio dari browser.
- Transkripsi, ringkasan/penilaian interview, serta hasil yang dapat ditinjau HRD.
- Screening CV evidence-based dengan bobot yang dapat dikonfigurasi.
- Human-in-the-loop: keputusan status dibuat HRD.
- Notifikasi/status in-app sebagai bagian flow dashboard.
- Indikator integritas interview: kamera dan peringatan tab blur.

### Ada di kode atau konsep, tetapi jangan dijadikan janji MVP/validasi utama

- CV auto-fill penuh ke semua kolom profil: ekstraksi CV tersedia, tetapi pemetaan/UX pengisian otomatis harus didemonstrasikan terlebih dahulu.
- Feedback penolakan otomatis/email rekomendasi pelatihan: kode ada, tetapi email/SMTP tidak scope MVP dan integrasi B2G/Kemnaker belum terbukti.
- Cross-role discovery: ada arah implementasi, tetapi algoritma dan validasinya belum matang.
- Chat AI thinking partner/RAG: jangan klaim RAG/vector database siap pakai; algoritma dan scope belum final.
- API B2B enterprise: REST API tersedia untuk aplikasi sendiri, tetapi integrasi ke career site/HRIS pihak ketiga belum dibuktikan.
- AI categorization: kategori kualitatif tersedia, tetapi skor angka dan detail bukti juga tersedia; jangan menyatakan produk hanya menampilkan kategori.

### Jangan klaim saat ini

- Dukungan CV DOCX bila belum diimplementasikan.
- Video perkenalan yang direkam/disimpan 3–5 menit; yang ada adalah interview audio dengan akses webcam untuk proctoring.
- Notifikasi real-time/push tanpa bukti implementasi mekanisme real-time.
- Watermarking interview.
- Akurasi tinggi, bebas bias, atau deteksi kecurangan yang pasti.
- Model AI yang dilatih sendiri, fine-tuned, atau model lokal aktif.
- Production-ready enterprise, integrasi HRIS/ATS, Xendit, atau B2G/Kemnaker tanpa bukti integrasi dan pengujian.

## Tindak Lanjut atas Review Engineer Eksternal (Bang Jason, 21 Juli 2026)

Masukan review eksternal selaras dengan arah sistem. Gunakan status berikut agar AI lain tidak menganggap seluruh rekomendasi sudah selesai.

| Rekomendasi | Status saat ini | Catatan akurat |
|---|---|---|
| Pertegas MVP | Sebagian sudah ditindaklanjuti | Scope proposal sudah memusat pada apply, pre-screening, AI interview, screening, dan review HRD; chat/cross-role/email dikeluarkan dari MVP. |
| Pre-screening sebelum interview | Sudah ada, perlu validasi | Sistem membuat tiga pertanyaan singkat. Belum berupa lima soal pilihan ganda dan belum ada bukti efektivitas/cost saving. |
| Pipeline scoring konsisten | Sebagian sudah ditindaklanjuti | Completion/scoring diarahkan ke provider teks utama; embedding memakai Gemini dan transkripsi memakai Groq. Tetapkan versi model/prompt per periode evaluasi agar hasil kandidat konsisten. |
| Jangan hanya lempar semua ke LLM | Sudah ada kemajuan | Ada ekstraksi PDF, input terstruktur, rumus bobot, validasi bobot, cache, dan evidence. Namun skor komponen masih berasal dari LLM sehingga harus dibenchmark. |
| Guardrail/prompt injection | Sudah ada implementasi | Ada delimiter untuk data tidak tepercaya, guard system prompt, pola deteksi jailbreak, schema JSON, dan fallback. Tetap perlu test adversarial berkala. |
| Status kandidat jelas | Sebagian | Backend menyimpan status dan notifikasi, tetapi state machine visual, legend, stepper, serta definisi aksi UI perlu dipastikan konsisten. |
| Cross-role tidak otomatis | Ada perbaikan di kode, di luar MVP | Sistem mengirim tawaran posisi lain dan kandidat tetap perlu melamar/proses seleksi baru. Algoritma serta validasinya belum menjadi fokus MVP. |
| Privasi, consent, deletion | Sebagian | Ada RBAC, URL sementara, internal key, rate limit, dan hapus akun/CV. Consent eksplisit, kebijakan retensi, enkripsi terverifikasi, audit log operasional, dan data deletion request formal masih perlu dilengkapi. |
| Cost/reliability provider | Sebagian | Cache, timeout, retry, dan rate limit tersedia. Belum ada cost dashboard, load test, queue durable, atau fallback provider yang tervalidasi untuk semua alur. |

## Penilaian Teknis Singkat

Fondasi MVP sudah lebih kuat daripada prototype UI karena alur bisnis, data persistence, provider integration, keamanan dasar, dan **lapisan scoring berbobot** telah diimplementasikan. Nilai pembeda paling kuat adalah bukan “menggunakan LLM”, melainkan membuat output LLM masuk ke proses yang terstruktur, dapat ditelusuri, dan dapat dikoreksi HRD.

Gap paling penting sebelum memperluas klaim adalah evaluasi kualitas: bandingkan hasil screening/interview dengan penilaian HRD pada sampel data yang disetujui; ukur konsistensi, false positive/false negative, waktu proses, biaya, dan bias. Setelah itu baru pilih apakah rubric diperbaiki, model utama dikunci, fine-tuning diperlukan, atau model lokal layak. Jangan memulai training/model lokal hanya karena tersedia; keputusan itu perlu didasarkan pada dataset, metrik, biaya, dan kebutuhan privasi.

## Cara AI Lain Harus Membantu

Saat memberi masukan atau menulis proposal untuk Direkrut AI:

1. Gunakan istilah **prototype fungsional / MVP awal / Level 3**, bukan production-ready.
2. Jelaskan bahwa AI adalah alat bantu dan HRD tetap pembuat keputusan final.
3. Sebutkan formula scoring berbobot dan bukti per komponen; jangan menyederhanakannya sebagai keyword matching biasa.
4. Bedakan dengan tegas fitur **MVP sekarang**, **di luar MVP**, dan **rencana riset berikutnya**.
5. Jangan mengarang metrik akurasi, jumlah pengguna, feedback, partner, atau SLA.
6. Jika menyarankan fase lanjutan, prioritaskan: uji pengguna, dataset berizin, benchmark dengan penilaian HRD, evaluasi bias, job queue durable, observability, keamanan file/PII, dan riset model lokal/fine-tuning yang berbasis data.

---

Tolong gunakan konteks ini sebagai sumber fakta. Jika ada pernyataan yang belum jelas, tanyakan terlebih dahulu daripada mengasumsikan fitur tersebut sudah aktif atau sudah tervalidasi.
