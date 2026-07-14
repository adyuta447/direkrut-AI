import { GapAnalysisResult } from "./types";

export function marketingGapAnalysis(): GapAnalysisResult {
  return {
    matches: [
      {
        skill: "Digital Marketing & SEO",
        matchLevel: "Tinggi",
        evidence: `Kutipan CV (Hal 1): "Berhasil menjalankan kampanye SEO yang meningkatkan trafik organik sebesar 45% dalam 6 bulan pertama."`,
      },
      {
        skill: "Content Strategy",
        matchLevel: "Tinggi",
        evidence: `Log Wawancara (12:45): "Saya memimpin tim konten lintas divisi untuk merencanakan kampanye peluncuran produk kuartal 3 secara komprehensif."`,
      },
      {
        skill: "Data Analytics (Google Analytics)",
        matchLevel: "Menengah",
        evidence: `Kutipan CV (Hal 2): "Terbiasa membaca metrik dasar analitik menggunakan Google Analytics untuk pelaporan mingguan." (Catatan: Belum ada sertifikasi tingkat lanjut)`,
      },
      {
        skill: "B2B Sales",
        matchLevel: "Rendah",
        evidence: "Log Wawancara: Tidak ada indikasi atau penyebutan mengenai strategi penjualan B2B atau pengalaman negosiasi korporat ketika ditanya mengenai siklus penjualan.",
      },
    ],
    overallAssessment: `Kandidat sangat kuat di bidang pemasaran digital dan pembuatan konten. Mereka cocok untuk peran pemasaran inti, namun akan membutuhkan pelatihan terkait analitik data lanjutan dan proses penjualan B2B.`,
    recommendations: [
      "Uji pemahaman analitik data mereka menggunakan studi kasus singkat.",
      "Diskusikan ketertarikan mereka untuk belajar tentang konversi B2B.",
    ],
  };
}
