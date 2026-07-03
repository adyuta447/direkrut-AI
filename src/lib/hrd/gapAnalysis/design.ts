import { GapAnalysisResult } from "./types";

export function designGapAnalysis(): GapAnalysisResult {
  return {
    matches: [
      {
        skill: "UI/UX Prototyping (Figma)",
        matchLevel: "Tinggi",
        evidence: `Kutipan CV (Hal 1): "Mendesain ulang sistem desain internal dan membuat lebih dari 50 prototipe aplikasi seluler interaktif menggunakan Figma."`,
      },
      {
        skill: "User Research & Testing",
        matchLevel: "Tinggi",
        evidence: `Log Wawancara (05:22): "Dalam proyek terakhir, saya memfasilitasi wawancara pengguna mendalam dan A/B testing selama 2 minggu untuk memvalidasi ulang alur checkout."`,
      },
      {
        skill: "HTML/CSS Dasar",
        matchLevel: "Menengah",
        evidence: `Kutipan CV (Hal 2): "Bekerja sama erat dengan developer frontend dalam implementasi desain UI dan dapat membaca kode HTML/CSS untuk panduan gaya."`,
      },
      {
        skill: "3D Animation",
        matchLevel: "Rendah",
        evidence: "Kutipan Portofolio/Log Wawancara: Seluruh portofolio berfokus pada desain antarmuka 2D; tidak ditemukan bukti pengalaman animasi 3D atau motion design.",
      },
    ],
    overallAssessment: `Kandidat memiliki fondasi UI/UX yang sangat kuat serta terbiasa dengan riset pengguna. Keterampilan pengkodean front-end dasar mereka adalah nilai tambah, namun tidak dapat diandalkan untuk animasi 3D.`,
    recommendations: [
      "Fokuskan wawancara pada portofolio dan proses pemecahan masalah (design thinking).",
      "Tanyakan bagaimana cara mereka berkolaborasi dengan tim engineering.",
    ],
  };
}
