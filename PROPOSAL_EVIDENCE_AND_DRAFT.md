# Audit Klaim Proposal Direkrut AI

Status audit: **22 Juli 2026**, berdasarkan source code dan konfigurasi repository saat ini. Dokumen ini membedakan bukti kode dari bukti penggunaan nyata. Jangan mengklaim hasil pengguna, performa, akurasi, keamanan, atau kemitraan sebelum ada artefak buktinya.

## Kesimpulan Utama

**Level 3 tepat**, dengan syarat proposal menyebutnya sebagai **prototype fungsional/implementasi awal yang siap didemonstrasikan**, bukan produk yang sudah tervalidasi oleh banyak pengguna atau siap production enterprise. Kode menunjukkan alur end-to-end dan AI orchestration; repository belum menunjukkan laporan usability test formal, metrik akurasi model, performance/security test, atau bukti pilot eksternal.

## Status Fitur yang Aman Diklaim

| Status | Komponen | Dasar klaim |
|---|---|---|
| Sudah berfungsi di kode | Registrasi/login JWT, role kandidat/HRD/admin, job CRUD, profil kandidat, lamaran, status lamaran, presigned upload CV/audio, database PostgreSQL, Redis cache/rate limit | API Go, frontend, migration database |
| Sudah berfungsi di kode | Parsing CV PDF teks/gambar, ekstraksi ringkasan/skill/pengalaman, screening kandidat, pertanyaan pre-screening/interview, transkripsi audio, penilaian jawaban, feedback kandidat, proctoring berbasis frame webcam | FastAPI AI engine dan integrasi Go API |
| Sudah berfungsi di kode | Scoring evidence-based lima komponen, bobot default per track, konfigurasi bobot per perusahaan/lowongan, bukti kutipan dari CV | `vector_search.py`, konfigurasi bobot Go API |
| Simulasi/fallback | Sebagian layanan frontend masih memiliki mock/fallback bila backend tidak dapat dijangkau; fallback pertanyaan dipakai bila respons AI tidak dapat diparse | service layer frontend dan router assessment |
| Sedang dikembangkan | Sejumlah perubahan screening, konfigurasi bobot, dan flow aplikasi berada di working tree yang belum seluruhnya committed/deployed | `git status` saat audit |
| Belum boleh diklaim | Validasi pengguna formal, akurasi/bias AI, performance benchmark, penetration/security test, pilot klien, integrasi HRIS/ATS, durable job queue, monitoring terpusat | Tidak ada bukti artefak terkait di repository |
| Belum siap | Pembayaran/subscription; provider OpenAI; kesiapan production enterprise | Endpoint payment/subscription masih stub; provider OpenAI belum diimplementasikan |

## Hal yang Membuatnya Bukan Sekadar Wrapper

Direkrut AI memang menggunakan model dari provider eksternal; jangan mengklaim melatih model AI sendiri. Namun terdapat rekayasa aplikasi dan logika domain di atas model tersebut:

1. PDF teks diekstrak lebih dahulu dengan `pypdf`; CV gambar diproses lewat vision; output AI dipaksa ke struktur data CV.
2. Screening tidak memakai jawaban LLM mentah saja. Sistem meminta skor dan bukti untuk lima komponen: skill, pengalaman, pendidikan, tanggung jawab, dan kualifikasi tambahan.
3. Sistem menghitung nilai akhir berbobot sendiri: `nilai akhir = Σ(skor komponen × bobot) / Σ(bobot) × 100`. Skor per komponen dibatasi 0–1 sebelum dihitung.
4. Ada dua bobot default: professional `35/25/10/20/10` dan fresh graduate `30/15/20/25/10`; HRD dapat mengganti bobot per perusahaan atau per lowongan dan total wajib 100%.
5. Embedding dan cosine similarity dihitung sebagai sinyal pendukung; keputusan skor utama memakai komponen berbasis bukti dan bobot.
6. Hasil menampilkan kategori, alasan, kutipan CV, skor per komponen, dan bobot yang digunakan. HRD tetap menentukan keputusan akhir.
7. Ada cache, validasi schema, pembatasan request, timeout/retry provider, prompt guard, dan fallback aman bila respons AI tidak valid.

Keterbatasan yang harus disebut bila ditanya: belum ada benchmark akurasi/bias terhadap dataset berlabel; proctoring hanya indikator untuk ditinjau manusia; PDF hasil scan tanpa teks belum didukung kecuali diunggah sebagai gambar; dan ketergantungan provider AI tetap ada.

## Draf Isian Proposal

### Innovation Level — 49 kata

**Level 3 — Prototype, validasi, atau implementasi awal.** Direkrut AI telah diwujudkan sebagai prototype fungsional yang dapat mendemonstrasikan alur kandidat mencari lowongan, mengunggah CV, melamar, mengikuti pre-screening dan interview awal, sementara HRD membuat lowongan, melihat hasil screening berbasis AI, lalu meninjau kandidat. Pengujian internal dan demo end-to-end sedang digunakan untuk perbaikan.

> Hapus frasa “pengujian internal” bila tim belum menjalankan dan mendokumentasikan demo tersebut. Alternatif aman: ganti menjadi “siap diuji secara internal”.

### Current Technical Reality, Data, and Integration — 263 kata

Direkrut AI memiliki frontend Next.js untuk portal kandidat dan dashboard HRD, Go REST API untuk autentikasi, hak akses, lowongan, lamaran, dan penyimpanan hasil, serta Python FastAPI AI engine untuk pemrosesan CV dan interview. PostgreSQL menyimpan data terstruktur; Redis dipakai untuk cache dan rate limiting; CV, audio interview, dan dokumen disimpan pada object storage melalui URL unggah sementara.

Bagian yang sudah berfungsi dalam kode mencakup registrasi/login, role kandidat dan HRD, pengelolaan lowongan, profil dan upload CV, pengajuan lamaran, screening CV, pertanyaan pre-screening/interview, upload audio, transkripsi, penilaian jawaban, dan dashboard hasil. Screening menghasilkan ringkasan CV, keterampilan, pengalaman, skor berbobot, alasan, serta bukti kutipan. Hasil AI menjadi bahan pertimbangan; keputusan akhir tetap dilakukan HRD.

Data inti berasal dari data yang diisi kandidat, CV yang diunggah kandidat, jawaban interview, dan kriteria lowongan yang dibuat HRD. Pada tahap prototype, demo sebaiknya memakai data sintetis atau data yang telah disamarkan dan digunakan dengan persetujuan. Sistem terintegrasi dengan provider AI eksternal: Groq untuk pemrosesan teks/transkripsi dan Gemini untuk gambar, embedding, serta pemeriksaan frame webcam. OpenAI belum diimplementasikan sebagai jalur aktif.

Kontrol yang telah ada meliputi JWT dan role-based access, internal API key, URL file sementara, rate limiting, cache, request ID, timeout/retry provider, serta prompt guard. Sebagian tampilan masih memiliki fallback mock apabila backend tidak tersedia. Queue pekerjaan durable, observability terpusat, validasi malware file, integrasi HRIS/ATS, pembayaran, uji keamanan formal, dan validasi pengguna masih belum tersedia atau sedang dikembangkan.

### MVP Execution and Deployment Plan — 219 kata

Scope MVP adalah membantu satu perusahaan menjalankan alur kandidat: membuat profil, mengunggah CV, melamar lowongan, memperoleh screening awal, mengerjakan pre-screening, dan mengikuti interview audio; HRD membuat lowongan, meninjau hasil, lalu memperbarui status kandidat. Fitur prioritas adalah autentikasi dan akses per role, job management, upload file aman, screening CV berbobot, interview/transkripsi, serta hasil yang dapat ditinjau HRD. Pembayaran, integrasi HRIS/ATS, chat, dan otomasi enterprise tidak termasuk scope pilot.

Milestone 1: stabilisasi dan demo internal alur end-to-end; outputnya video demo, test case, dan daftar bug. Milestone 2: uji coba terbatas dengan kandidat/HRD; outputnya task-success rate, feedback, dan perbaikan UX. Milestone 3: pilot terbatas; outputnya laporan penggunaan dan keputusan kelanjutan. Isi tanggal, PIC, serta jumlah peserta sesuai keputusan tim—jangan mengarangnya di proposal.

Web dijalankan dengan Next.js; Go API dan AI engine dikemas dalam container dan backend dapat di-deploy melalui GitHub Actions ke Heroku. PostgreSQL, Redis, dan object storage menjadi kebutuhan layanan pendukung. Risiko utama adalah kegagalan/biaya provider AI, waktu proses CV/audio, data pribadi, dan pekerjaan background yang belum durable. Mitigasi awal: timeout dan retry terbatas, cache, rate limit, URL unggah sementara, role access, logging, pengujian dengan data tersamarkan, serta prioritas penambahan job queue, monitoring, file scan, backup, migration, dan rollback sebelum skala lebih besar.

### Problem and System Complexity — 181 kata

Rekrutmen awal bukan sekadar membaca CV. Kandidat memiliki format CV, pengalaman, pendidikan, keterampilan, dan cara menjawab yang berbeda; setiap lowongan juga memiliki persyaratan, tanggung jawab, serta bobot penilaian berbeda. HRD perlu menilai banyak pelamar secara konsisten tanpa kehilangan konteks bukti pada CV atau jawaban interview.

Kompleksitas meningkat karena sistem melibatkan kandidat, HRD, dan admin dengan hak akses berbeda; data sensitif berupa CV, audio, dan transkrip; serta proses berurutan dari upload file, ekstraksi informasi, pencocokan terhadap lowongan, interview, hingga keputusan manusia. Hasil AI tidak boleh langsung menjadi keputusan karena dapat salah, kurang lengkap, atau dipengaruhi kualitas data input. Karena itu sistem harus menampilkan bukti, bobot penilaian, dan ruang koreksi bagi HRD.

Pendekatan manual sulit dipertahankan ketika jumlah pelamar bertambah, sebab HRD perlu membaca dokumen tidak terstruktur dan membandingkannya dengan kriteria yang berbeda secara berulang. Pendekatan sederhana berbasis kata kunci juga tidak cukup untuk membedakan skill yang hanya disebutkan dengan bukti pengalaman nyata. Direkrut AI menggabungkan ekstraksi, penilaian per komponen, aturan bobot, dan tinjauan manusia agar proses lebih terstruktur, bukan otomatis sepenuhnya.

### Processing Pipeline and Engineering Depth — 234 kata

Kandidat membuat profil, mengunggah CV ke object storage melalui URL sementara, lalu mengajukan lamaran. Go API memverifikasi identitas dan hak akses, menyimpan lamaran ke PostgreSQL, kemudian memanggil AI engine. Untuk PDF berbasis teks, engine mengekstrak teks; untuk CV gambar, engine memakai vision. AI menghasilkan data terstruktur seperti ringkasan, skill, pengalaman, riwayat kerja, dan pendidikan. Input CV serta kriteria lowongan kemudian diproses oleh mesin screening.

Mesin screening menentukan jalur fresh graduate atau professional dari pengalaman kerja, meminta evaluasi lima komponen berbasis bukti, membatasi skor komponen, lalu menghitung nilai akhir menggunakan bobot default atau bobot yang dikonfigurasi HRD. Output mencakup skor, kategori, alasan, kutipan CV, bukti per komponen, dan bobot yang dipakai. Kandidat dapat mengikuti pre-screening dan interview audio. Audio disimpan di object storage, ditranskripsi melalui provider AI, dan hasilnya disimpan untuk ditinjau HRD. Frame webcam dapat diperiksa sebagai indikator proctoring; flag bukan keputusan otomatis.

Arsitektur dipisahkan antara frontend, business API, dan AI engine agar logika bisnis dan provider AI tidak bercampur. API memakai role access, cache, rate limit, presigned URL, request ID, dan error handling; AI engine memakai schema validation, cache hasil, timeout/retry, dan prompt guard. Keterbatasan saat ini adalah screening/email background masih belum memakai job queue durable dan observability/benchmark formal belum tersedia. Karena itu reliability skala besar masih menjadi prioritas pengembangan, bukan klaim saat ini.

### Algorithm or Rule Quality and Decision Transparency — 271 kata

Logika utama screening menggunakan pendekatan hybrid berbasis bukti. Inputnya adalah ringkasan CV hasil ekstraksi, pengalaman kerja, skill wajib/preferensi, tanggung jawab, pendidikan minimum, dan deskripsi lowongan. Sistem menghitung embedding CV serta lowongan dan cosine similarity sebagai sinyal pendukung. Penilaian utama bukan cosine similarity tunggal: AI diminta mengevaluasi lima dimensi—skill match, pengalaman, pendidikan, kesesuaian tanggung jawab, dan kualifikasi tambahan—dengan skor 0–1 serta satu sampai tiga bukti dari CV pada setiap dimensi.

Backend membatasi skor ke rentang 0–1 dan menghitung nilai akhir sendiri dengan rumus `Σ(skor × bobot) / Σ(bobot) × 100`. Untuk professional, bobot awalnya skill 35%, pengalaman 25%, pendidikan 10%, tanggung jawab 20%, dan tambahan 10%; untuk fresh graduate, bobot pengalaman diturunkan dan pendidikan/tanggung jawab dinaikkan. HRD dapat membuat bobot khusus per perusahaan atau lowongan; sistem menolak konfigurasi yang totalnya tidak mendekati 100%.

Output menampilkan skor akhir, kategori, jalur kandidat, alasan, kutipan CV, rincian skor setiap komponen, dan bobot yang dipakai. Dengan demikian HRD dapat melihat dasar rekomendasi, mengganti bobot sesuai kebutuhan lowongan, dan tetap memutuskan hasil seleksi. Jawaban interview juga memperoleh skor kompetensi, indikator keaslian jawaban, dan tingkat keyakinan bukti.

Metode ini dipilih karena kata kunci atau cosine similarity saja tidak cukup membedakan skill yang disebutkan dari bukti pengalaman. Keterbatasannya: kualitas hasil bergantung pada CV, deskripsi lowongan, dan provider AI; sistem belum memiliki benchmark akurasi/bias pada dataset berlabel. Bila respons AI gagal diparse, sistem mengembalikan nilai aman/perlu validasi atau pertanyaan fallback. Evaluasi berikutnya perlu membandingkan rekomendasi sistem dengan penilaian HRD pada data yang disetujui.

### User Flow, Usability Testing, and Product Iteration — 206 kata

Kandidat masuk atau membuat akun, mencari lowongan, melengkapi profil, mengunggah CV, lalu mengajukan lamaran. Sistem memproses CV dan HRD dapat melihat ringkasan serta hasil screening. Untuk tahap lanjutan, kandidat menjawab tiga pertanyaan pre-screening, memberi izin kamera/mikrofon, menjawab pertanyaan interview, mengunggah audio jawaban, dan menerima tampilan hasil awal. HRD membuat dan mengelola lowongan, membuka daftar pelamar, meninjau bukti screening dan hasil interview, lalu memperbarui status kandidat.

Sistem membantu mencegah kesalahan melalui validasi form dan role access, tombol lanjutan yang terkunci sampai jawaban pre-screening terisi, status loading saat proses AI, URL unggah sementara, refresh token, serta fallback/error handling bila respons AI tidak valid. Pada interview, timer menghentikan jawaban saat waktu habis; peringatan integritas dicatat saat kandidat meninggalkan halaman atau frame kamera terindikasi bermasalah.

Repository belum menyediakan bukti usability testing formal, jumlah pengguna, completion rate, task-success rate, atau kepuasan pengguna. Karena itu bagian ini **tidak boleh** menyatakan bahwa pengguna telah menyukai atau berhasil menggunakan produk. Untuk mencapai klaim tersebut, jalankan uji 5–10 kandidat dan 2–3 HRD dengan tugas yang sama, catat waktu penyelesaian, error, tugas selesai/tidak, dan feedback. Lampirkan temuan serta perubahan yang benar-benar dilakukan, misalnya penyederhanaan form, perbaikan pesan error, atau pengurangan langkah upload.

## Lampiran Bukti yang Sebaiknya Disiapkan

Pilih bukti yang benar-benar bisa diperlihatkan, lalu samarkan data pribadi kandidat.

1. **Video demo 3–5 menit:** HRD membuat lowongan → kandidat upload CV → apply → hasil screening berbobot muncul → interview audio → HRD melihat hasil.
2. **Screenshot berurutan:** dashboard HRD, form lowongan dengan kriteria/bobot, halaman kandidat, hasil screening dengan rincian lima komponen, halaman interview, dan status lamaran.
3. **Contoh input-output nyata yang disamarkan:** satu CV contoh, satu job description, JSON/layar hasil ekstraksi CV, component score, bukti kutipan, dan final score.
4. **Diagram arsitektur:** gunakan `ARCHITECTURE_SYSTEM_DESIGN.md`, lalu buat versi Excalidraw yang menampilkan Next.js, Go API, FastAPI AI engine, PostgreSQL, Redis, storage, dan AI provider.
5. **Bukti kode/repository:** struktur monorepo, OpenAPI contract, migration database, endpoint AI, dan commit history; sertakan link/repository sesuai aturan lomba.
6. **Bukti test teknis:** hasil `go test ./...`, `pytest`, lint/typecheck, dan screenshot GitHub Actions yang hijau. Jalankan ulang sebelum dilampirkan.
7. **Bukti uji pengguna yang perlu dikumpulkan:** consent peserta, skenario tugas, tabel hasil, feedback ringkas, perubahan produk sesudah uji, dan bukti sebelum/sesudah.

## Klaim yang Sebaiknya Dihindari

- “Model AI kami dilatih sendiri” atau “algoritma kami terbukti akurat.”
- “Proctoring mendeteksi kecurangan secara akurat.”
- “Sudah tervalidasi pengguna/mitra” tanpa dokumen uji atau surat dukungan.
- “Production-ready, aman, scalable” tanpa uji beban, security assessment, backup/DR, dan queue/monitoring yang memadai.
- “Terintegrasi dengan HRIS/ATS/Xendit/OpenAI” bila jalur aktifnya belum selesai diuji.
