import { GapAnalysisResult } from "./types";

export function defaultGapAnalysis(jobTitle: string): GapAnalysisResult {
  return {
    matches: [
      {
        skill: "Keahlian Inti Sesuai Peran",
        matchLevel: "Tinggi",
        evidence: `Kutipan CV (Hal 1): "Memiliki rekam jejak konsisten selama 3 tahun menjabat posisi setingkat spesialis di departemen yang berhubungan langsung dengan operasional ${jobTitle}."`,
      },
      {
        skill: "Manajemen Proyek",
        matchLevel: "Tinggi",
        evidence: `Log Wawancara (09:15): "Saya mengambil inisiatif untuk memimpin 2 proyek transformasi berskala menengah yang keduanya selesai 100% tepat waktu sesuai anggaran."`,
      },
      {
        skill: "Analisis Sistem Lanjutan",
        matchLevel: "Menengah",
        evidence: `Kutipan CV (Hal 2): "Turut serta dalam tim inti (sebagai anggota) untuk membantu perancangan pembaruan sistem internal pada kuartal 4." (Catatan: Belum berperan sebagai inisiator utama)`,
      },
      {
        skill: "Keterampilan Lintas-Fungsi (Cross-functional)",
        matchLevel: "Rendah",
        evidence: "Analisis CV & Log Wawancara: Semua pencapaian berfokus pada pekerjaan individual atau dalam divisi internal yang sama. Tidak ada bukti kepemimpinan lintas departemen.",
      },
    ],
    overallAssessment: `Kandidat menunjukkan profil yang solid untuk peran ${jobTitle}. Pengalaman inti mereka valid dan didukung oleh pengalaman manajemen proyek skala menengah. Membutuhkan peningkatan dalam memimpin inisiatif lintas-divisi.`,
    recommendations: [
      `Gali lebih dalam mengenai tanggung jawab mereka sebelumnya di bidang ${jobTitle}.`,
      "Sediakan mentor untuk melatih kemampuan kepemimpinan dan komunikasi lintas departemen.",
      "Jelaskan ekspektasi terkait inisiatif independen yang harus mereka ambil.",
    ],
  };
}
