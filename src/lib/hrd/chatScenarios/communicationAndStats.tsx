import { ChatResponse } from "../chatTypes";

// SKENARIO 3: Komunikasi / Soft Skill
export function buildCommunicationResponse(jobTitle: string, req1: string): ChatResponse {
  return {
    text: (
      <div className="text-[14px]">
        <p>Berdasarkan hasil AI interview, berikut kandidat yang dinilai memiliki komunikasi terbaik untuk peran {jobTitle}:</p>
        <br />
        <p>⭐ <strong>Doni Wijaya</strong> — Komunikasi sangat baik, sangat komprehensif dan detail dalam menjelaskan studi kasus</p>
        <p>⭐ <strong>Andi Pratama</strong> — Komunikasi sangat baik, menjawab dengan contoh kasus nyata dari pengalaman kerja</p>
        <p>⭐ <strong>Rina Kusuma</strong> — Komunikasi sangat baik, antusias dan inisiatif tinggi meski pengalaman lebih sedikit</p>
        <br />
        <p>Ketiganya menunjukkan kemampuan komunikasi yang solid. Ingin saya filter lebih lanjut berdasarkan {req1}?</p>
      </div>
    ),
  };
}

// SKENARIO 5: Statistik
export function buildStatsResponse(jobTitle: string): ChatResponse {
  return {
    text: (
      <div className="text-[14px]">
        <p>Berikut ringkasan statistik rekrutmen untuk posisi {jobTitle}:</p>
        <br />
        <p>📊 Total pelamar: 5 kandidat</p>
        <p>✅ Sudah selesai AI interview: 5 kandidat (100%)</p>
        <p>🟢 Memenuhi Syarat: 4 kandidat</p>
        <p>🟡 Perlu Dikembangkan: 1 kandidat</p>
        <p>⏳ Menunggu keputusan HRD: 5 kandidat</p>
        <br />
        <p>⚠️ <strong>Perhatian:</strong> Andi Pratama sudah menunggu 8 hari tanpa respons. Kandidat ini memiliki pengalaman terkuat. Disarankan untuk segera ditindaklanjuti.</p>
      </div>
    ),
  };
}
