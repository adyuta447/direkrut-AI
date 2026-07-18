# API Contracts

`openapi.yaml` adalah dokumentasi lengkap & akurat buat kedua layanan backend
(`apps/api-go` dan `apps/ai-engine`) — ditulis dari implementasi asli, termasuk
endpoint yang belum diimplementasi (ditandai jelas, bukan disembunyikan).

## Lihat dokumentasinya

Raw YAML gak enak dibaca langsung. Preview interaktif (di-render lokal, gak upload apa pun):

```bash
npx @redocly/cli preview-docs packages/contracts/openapi.yaml
```

Buka `http://localhost:8080` (Redocly milih port sendiri, cek output terminal).

## Validasi

Setiap kali `openapi.yaml` diubah, jalankan ini dulu sebelum commit:

```bash
npx @redocly/cli lint packages/contracts/openapi.yaml
```

Harus 0 error (warning dari built-in ruleset `recommended` seperti `operationId`
yang hilang atau `license` di `info` boleh diabaikan — gak mempengaruhi validitas
dokumen, cuma preferensi gaya Redocly).

## Kalau nambah/ubah endpoint

Update `openapi.yaml` di PR yang sama dengan kode-nya. Dokumen ini ditulis
buat mencerminkan apa yang BENERAN jalan, bukan rencana — kalau suatu endpoint
belum diimplementasi, tandai eksplisit di `summary` (`[BELUM DIIMPLEMENTASI]`)
dan balikin `501`, jangan didiamkan seolah-olah udah kelar.
