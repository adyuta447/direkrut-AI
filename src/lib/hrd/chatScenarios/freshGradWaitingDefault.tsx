import { ChatResponse } from "../chatTypes";

// SKENARIO 6: Fresh Graduate
export function buildFreshGraduateResponse(jobTitle: string, req3: string, req1: string): ChatResponse {
  return {
    text: (
      <div className="text-[14px]">
        <p>Dari daftar kandidat saat ini untuk {jobTitle}, berikut yang masuk kategori fresh graduate atau junior:</p>
        <br />
        <p>👤 <strong>Rina Kusuma</strong></p>
        <p>Baru lulus sarjana. Meski pengalaman 2 tahun, aktif berkontribusi di komunitas dan komunikasi dinilai sangat baik dalam hal {req3}.</p>
        <br />
        <p>👤 <strong>Siti Rahayu</strong></p>
        <p>Baru lulus, pengalaman terbatas di proyek kampus. Saat ini masuk kategori Perlu Dikembangkan untuk menguasai {req1}.</p>
        <br />
        <p>Berdasarkan requirement {jobTitle}, Rina lebih siap dibanding Siti karena inisiatifnya yang menonjol.</p>
      </div>
    ),
  };
}

// SKENARIO 7: Lama Menunggu / SLA
export function buildLongWaitingResponse(jobTitle: string, req1: string): ChatResponse {
  return {
    text: (
      <div className="text-[14px]">
        <p>Berikut kandidat yang sudah lama menunggu respons dari Anda untuk posisi {jobTitle}:</p>
        <br />
        <p>⚠️ <strong>Andi Pratama — 8 hari</strong></p>
        <p>Kandidat dengan pengalaman terkuat (6 tahun). Disarankan segera ditindaklanjuti.</p>
        <br />
        <p>⏳ <strong>Rina Kusuma — 5 hari</strong></p>
        <p>Kandidat dengan komunikasi terbaik. Menunggu keputusan.</p>
        <br />
        <p>⏳ <strong>Budi Santoso — 3 hari</strong></p>
        <p>Kandidat dengan {req1} solid. Menunggu keputusan.</p>
        <br />
        <p>Memberikan kepastian kepada kandidat adalah nilai utama platform ini. Apakah Anda ingin saya tampilkan profil lengkap salah satu dari mereka?</p>
      </div>
    ),
    actions: [
      { label: "Lihat Detail Andi", kind: "candidate", value: "Andi" },
      { label: "Lihat Detail Rina", kind: "candidate", value: "Rina" },
      { label: "Lihat Detail Budi", kind: "candidate", value: "Budi" },
    ],
  };
}

// SKENARIO 8: Default
export function buildDefaultResponse(jobTitle: string, req2: string): ChatResponse {
  return {
    text: (
      <div className="text-[14px]">
        <p>Maaf, saya belum menemukan data pasti terkait hal itu untuk posisi {jobTitle}. Saya bisa membantu Anda dengan pertanyaan analisis yang lebih tajam:</p>
        <ul className="list-disc pl-4 mt-2 mb-2">
          <li>Membandingkan kandidat senior vs potensi junior</li>
          <li>Mengidentifikasi celah skill seperti {req2}</li>
          <li>Melihat statistik progress kandidat</li>
          <li>Menemukan kandidat dengan risiko tinggi (terlalu lama menunggu)</li>
        </ul>
        <p>Coba pilih salah satu saran pertanyaan di atas bar pengetikan.</p>
      </div>
    ),
  };
}
