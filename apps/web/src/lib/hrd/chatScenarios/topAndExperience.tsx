import { ChatResponse } from "../chatTypes";

// SKENARIO 1: Rekomendasi / Terbaik
export function buildTopCandidatesResponse(jobTitle: string, req1: string, req2: string, req3: string): ChatResponse {
  return {
    text: (
      <div className="text-[14px]">
        <p>Berdasarkan data screening CV dan hasil AI interview, berikut 3 kandidat teratas untuk posisi {jobTitle}:</p>
        <br />
        <p>🥇 <strong>Doni Wijaya</strong></p>
        <p>Pengalaman 5 tahun — Keahlian {req1}, {req2}, {req3} semua Memenuhi Syarat — Komunikasi dinilai sangat baik di interview</p>
        <br />
        <p>🥈 <strong>Andi Pratama</strong></p>
        <p>Pengalaman 6 tahun — Paling berpengalaman di antara semua kandidat — Catatan: ekspektasi gaji sedikit di atas batas, namun kompetensi {req2} sangat kuat</p>
        <br />
        <p>🥉 <strong>Budi Santoso</strong></p>
        <p>Pengalaman 4 tahun — Keahlian teknis solid di {req1} — Komunikasi dinilai baik</p>
        <br />
        <p>Ingin melihat detail salah satu dari mereka, atau ingin saya bandingkan lebih lanjut?</p>
      </div>
    ),
    actions: [
      { label: "Lihat Detail Doni", kind: "candidate", value: "Doni" },
      { label: "Lihat Detail Andi", kind: "candidate", value: "Andi" },
      { label: "Bandingkan Doni & Andi", kind: "send", value: "Bandingkan kandidat paling senior vs skor tertinggi" },
    ],
  };
}

// SKENARIO 2: Pengalaman
export function buildExperienceResponse(jobTitle: string, req2: string): ChatResponse {
  return {
    text: (
      <div className="text-[14px]">
        <p>Kandidat dengan pengalaman kerja terbanyak untuk {jobTitle} adalah:</p>
        <br />
        <p>👤 <strong>Andi Pratama</strong></p>
        <p>6 tahun pengalaman profesional di perusahaan nasional berskala besar. Pernah memimpin tim kecil dan berpengalaman menangani operasional kompleks.</p>
        <br />
        <p>Satu catatan: ekspektasi gaji Andi sedikit di atas batas yang ditetapkan. Namun mengingat pengalamannya dalam hal {req2}, Anda mungkin ingin mempertimbangkannya.</p>
        <br />
        <p>Ingin melihat profil lengkap Andi atau membandingkannya dengan kandidat lain?</p>
      </div>
    ),
    actions: [
      { label: "Lihat Profil Andi", kind: "candidate", value: "Andi" },
      { label: "Bandingkan dengan skor tertinggi", kind: "send", value: "Bandingkan kandidat paling senior vs skor tertinggi" },
    ],
  };
}
