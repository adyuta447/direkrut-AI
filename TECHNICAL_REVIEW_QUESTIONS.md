# Pertanyaan Review Arsitektur Direkrut AI

Gunakan diagram arsitektur dari `ARCHITECTURE_SYSTEM_DESIGN.md` saat wawancara. Tujuannya adalah meminta pandangan terhadap sistem yang sudah dibuat, bukan menguji atau meminta narasumber menjelaskan pekerjaannya.

## Pembuka

> Kak, kami sedang membuat Direkrut AI, yaitu platform rekrutmen yang membantu perusahaan menyaring kandidat dari CV dan melakukan interview awal dengan bantuan AI. Tujuan kami bukan menggantikan keputusan HRD, tetapi membantu HRD mengurangi pekerjaan manual, melihat informasi kandidat lebih cepat, dan memiliki bahan pertimbangan yang lebih rapi sebelum mengambil keputusan.
>
> Di aplikasi ini ada tiga aktor utama. **Kandidat** dapat mencari lowongan, membuat profil, mengunggah CV, melamar pekerjaan, menjawab pertanyaan pre-screening, lalu mengikuti AI interview dengan rekaman suara dan kamera. **HRD** dapat membuat lowongan, melihat daftar pelamar, membaca hasil screening CV dan interview, lalu mengubah status kandidat. **Admin** nantinya mengelola kebutuhan platform secara umum.
>
> Alur sederhananya: kandidat mengunggah CV dan melamar lowongan, sistem menyimpan data tersebut lalu memproses CV menggunakan AI. Hasilnya ditampilkan ke HRD sebagai ringkasan dan bahan screening. Jika kandidat masuk tahap berikutnya, kandidat mengikuti interview awal; jawaban audio ditranskripsi dan dianalisis oleh AI, kemudian HRD melihat hasilnya untuk membantu menentukan langkah selanjutnya. Keputusan akhir tetap berada pada HRD/perusahaan.
>
> Secara teknis, kami memakai frontend Next.js untuk tampilan kandidat dan HRD, backend Go untuk mengatur akun, lowongan, lamaran, akses data, dan alur bisnis, serta AI engine Python untuk proses CV dan interview. Data utama disimpan di PostgreSQL; file CV dan audio disimpan di object storage; Redis digunakan untuk cache dan pembatasan request; dan proses AI memakai provider eksternal.
>
> Kami ingin meminta masukan Kakak: apakah alur dan arsitektur ini sudah masuk akal untuk tahap awal, risiko apa yang perlu kami antisipasi, dan perbaikan mana yang paling penting kami lakukan agar sistem aman, stabil, dan siap dikembangkan.

## Pertanyaan Utama

1. **Setelah melihat diagram arsitektur kami, apakah pembagian frontend, backend utama, AI engine, database, Redis, dan storage sudah masuk akal? Bagian mana yang paling perlu diperbaiki lebih dahulu?**

2. **Alur kami adalah kandidat upload CV, membuat lamaran, lalu sistem menjalankan screening AI. Apakah alur ini sudah tepat, atau ada bagian yang sebaiknya dipisahkan agar aplikasi tetap stabil saat banyak pengguna?**

3. **Untuk proses yang cukup lama seperti parsing CV, scoring, dan transkripsi interview, bagaimana sebaiknya kami memberi tahu pengguna bahwa prosesnya sedang berjalan atau gagal tanpa membuat mereka harus mengulang dari awal?**

4. **Saat banyak kandidat memakai sistem bersamaan, menurut Kakak bagian mana yang paling mungkin menjadi lambat atau bermasalah: backend, database, penyimpanan file, atau AI provider?**

5. **Kami memakai AI provider eksternal. Jika provider sedang lambat, error, atau terkena limit, apa penanganan paling penting yang sebaiknya kami siapkan?**

6. **CV, audio interview, transcript, dan hasil screening adalah data sensitif. Menurut Kakak, risiko keamanan dan privasi apa yang paling perlu kami antisipasi sejak sekarang?**

7. **Apakah cara kami menyimpan file di object storage dan data/hasil proses di database sudah tepat? Apa yang perlu kami lakukan agar file kandidat tidak dapat diakses oleh orang yang tidak berwenang?**

8. **Kami memiliki akses kandidat, HRD, dan admin. Apakah ada hal penting yang perlu diperhatikan agar setiap pihak hanya dapat melihat dan mengubah data yang memang menjadi haknya?**

9. **Apakah kami perlu mencatat aktivitas penting, misalnya siapa yang melihat CV, mengunduh audio, mengubah status kandidat, atau mengubah hasil/configuration AI?**

10. **Jika suatu hari hasil screening atau interview tidak muncul, informasi apa yang perlu kami catat agar tim bisa cepat menemukan sumber masalahnya?**

11. **Dari cara kami deploy aplikasi sekarang, apa yang paling perlu disiapkan agar update fitur tidak merusak sistem yang sedang digunakan?**

12. **Jika Direkrut AI ingin digunakan oleh perusahaan yang lebih besar, tiga perbaikan teknis apa yang paling Kakak sarankan untuk kami prioritaskan?**

## Pertanyaan Lanjutan Bila Ada Waktu

13. **Apakah penyimpanan login/token di aplikasi web kami perlu diperbaiki agar lebih aman?**

14. **Apakah service AI kami sebaiknya hanya bisa diakses dari backend utama? Jika iya, pengamanan apa yang paling sederhana tetapi cukup baik untuk tahap sekarang?**

15. **Apakah kami sudah perlu memakai antrean pekerjaan khusus untuk screening CV, interview, dan pengiriman email, atau masih cukup dengan desain saat ini?**

16. **Untuk data kandidat dan hasil AI, bagaimana cara sederhana menentukan berapa lama data disimpan dan kapan harus dihapus?**

## Prioritas untuk Sesi Singkat

Jika waktunya hanya 20–30 menit, pakai pertanyaan **1, 2, 4, 5, 6, 8, 10, dan 12**.

## Catatan untuk Tim Saat Wawancara

- Tunjukkan diagram, lalu ikuti alur **upload CV → apply → screening AI → HRD melihat hasil → AI interview**.
- Jangan harus membahas istilah seperti queue, mTLS, pgvector, atau deployment container kecuali narasumber sendiri mengarah ke sana.
- Setelah jawaban tiap pertanyaan, tanyakan singkat: **“Kalau begitu, langkah pertama yang paling realistis untuk kami lakukan apa?”**
