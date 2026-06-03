import { Target, ChevronDown, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useApp } from "../../context/AppContext";

interface SkillMatch {
  skill: string;
  matchLevel: "Tinggi" | "Menengah" | "Rendah";
  evidence: string;
}

const MATCH_STYLE = {
  Tinggi: "text-[#198038] bg-[#defbe6] border-[#198038]",
  Menengah: "text-[#f1c21b] bg-[#fcf0d3] border-[#f1c21b]",
  Rendah: "text-[#da1e28] bg-[#fff1f1] border-[#da1e28]",
};

export default function GapAnalysis() {
  const { applications, jobs } = useApp();
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [analysis, setAnalysis] = useState<{
    matches: SkillMatch[];
    overallAssessment: string;
    recommendations: string[];
  } | null>(null);

  const handleAnalyze = () => {
    if (!selectedCandidate) return;
    
    const candidate = applications.find(app => app.id === selectedCandidate);
    if (!candidate) return;

    const title = candidate.jobTitle.toLowerCase();
    let mockMatches: SkillMatch[] = [];
    let overallAssessment = "";
    let recommendations: string[] = [];

    if (title.includes("marketing") || title.includes("pemasaran")) {
      mockMatches = [
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
      ];
      overallAssessment = `Kandidat sangat kuat di bidang pemasaran digital dan pembuatan konten. Mereka cocok untuk peran pemasaran inti, namun akan membutuhkan pelatihan terkait analitik data lanjutan dan proses penjualan B2B.`;
      recommendations = [
        "Uji pemahaman analitik data mereka menggunakan studi kasus singkat.",
        "Diskusikan ketertarikan mereka untuk belajar tentang konversi B2B.",
      ];
    } else if (title.includes("design") || title.includes("desain") || title.includes("ui") || title.includes("ux")) {
      mockMatches = [
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
      ];
      overallAssessment = `Kandidat memiliki fondasi UI/UX yang sangat kuat serta terbiasa dengan riset pengguna. Keterampilan pengkodean front-end dasar mereka adalah nilai tambah, namun tidak dapat diandalkan untuk animasi 3D.`;
      recommendations = [
        "Fokuskan wawancara pada portofolio dan proses pemecahan masalah (design thinking).",
        "Tanyakan bagaimana cara mereka berkolaborasi dengan tim engineering."
      ];
    } else {
      mockMatches = [
        { 
          skill: "Keahlian Inti Sesuai Peran", 
          matchLevel: "Tinggi", 
          evidence: `Kutipan CV (Hal 1): "Memiliki rekam jejak konsisten selama 3 tahun menjabat posisi setingkat spesialis di departemen yang berhubungan langsung dengan operasional ${candidate.jobTitle}."`,
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
      ];
      overallAssessment = `Kandidat menunjukkan profil yang solid untuk peran ${candidate.jobTitle}. Pengalaman inti mereka valid dan didukung oleh pengalaman manajemen proyek skala menengah. Membutuhkan peningkatan dalam memimpin inisiatif lintas-divisi.`;
      recommendations = [
        `Gali lebih dalam mengenai tanggung jawab mereka sebelumnya di bidang ${candidate.jobTitle}.`,
        "Sediakan mentor untuk melatih kemampuan kepemimpinan dan komunikasi lintas departemen.",
        "Jelaskan ekspektasi terkait inisiatif independen yang harus mereka ambil."
      ];
    }

    setAnalysis({
      matches: mockMatches,
      overallAssessment,
      recommendations,
    });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 font-sans">
      {/* Header */}
      <div>
        <p className="text-[12px] font-semibold text-ink-muted mb-2 uppercase tracking-widest">Alat AI</p>
        <h2 className="text-[32px] font-light tracking-[-0.5px] text-ink mb-2">Validasi Kompetensi (AI)</h2>
        <p className="text-[16px] text-ink-muted">
          Validasi keterampilan kandidat secara langsung terhadap bukti yang ditemukan di CV mereka.
        </p>
      </div>

      {/* Selector */}
      <div className="bg-canvas border border-hairline p-6">
        <label className="block text-[14px] text-ink font-semibold mb-3">Pilih Lamaran Kandidat</label>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <select
              value={selectedCandidate}
              onChange={(e) => {
                setSelectedCandidate(e.target.value);
                setAnalysis(null);
              }}
              className="input-field appearance-none w-full pr-10 cursor-pointer"
            >
              <option value="">Pilih lamaran...</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.applicantName} — {app.jobTitle}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!selectedCandidate}
            className="btn-primary flex items-center justify-center gap-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Target className="w-4 h-4" />
            Analisis CV
          </button>
        </div>
      </div>

      {/* Empty state */}
      {selectedCandidate && !analysis && (
        <div className="bg-surface-1 border border-hairline p-16 text-center">
          <Target className="w-12 h-12 text-ink-muted mx-auto mb-4" />
          <p className="text-[16px] text-ink">Klik "Analisis CV" untuk mengekstrak bukti relevan dengan lowongan kerja kandidat.</p>
        </div>
      )}

      {/* Results */}
      {analysis && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          {/* Skill Matches */}
          <div className="bg-canvas border border-hairline p-6">
            <p className="text-[18px] font-normal text-ink mb-6">
              Validasi Keterampilan & Bukti
            </p>
            <div className="space-y-6">
              {analysis.matches.map((match, idx) => (
                <div key={idx} className="border-l-4 border-hairline pl-4">
                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    <span className="text-[16px] font-semibold text-ink">{match.skill}</span>
                    <span className={`text-[12px] font-semibold px-2 py-1 border uppercase tracking-widest ${MATCH_STYLE[match.matchLevel]}`}>
                      Kecocokan {match.matchLevel}
                    </span>
                  </div>
                  <div className="bg-surface-1 border border-hairline p-4 mt-2">
                    <p className="text-[12px] font-semibold text-ink-muted mb-1 flex items-center gap-1.5 uppercase tracking-widest">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Bukti AI Diekstrak dari CV
                    </p>
                    <p className="text-[14px] text-ink leading-[1.5]">
                      "{match.evidence}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Growth Projection */}
            <div className="bg-canvas border border-hairline p-6">
              <p className="text-[18px] font-normal text-ink mb-4">
                Penilaian Keseluruhan
              </p>
              <p className="text-[14px] text-ink leading-[1.5]">
                {analysis.overallAssessment}
              </p>
            </div>

            {/* Recommendations */}
            <div className="bg-canvas border border-hairline p-6">
              <p className="text-[18px] font-normal text-ink mb-4">
                Tindakan yang Disarankan
              </p>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-surface-1 border border-hairline">
                    <span className="text-[12px] font-semibold text-ink-muted mt-0.5">
                      {idx + 1}.
                    </span>
                    <p className="text-[14px] text-ink">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Plan */}
          <div className="bg-surface-1 border border-hairline p-6">
            <p className="text-[18px] font-normal text-ink mb-4">
              Langkah Selanjutnya
            </p>
            <div className="flex flex-wrap gap-4">
              {["Buat Panduan Wawancara", "Bagikan Laporan ke Manajer", "Ekspor PDF"].map((action) => (
                <button
                  key={action}
                  className="px-4 py-2 text-[14px] font-normal border border-primary text-primary hover:bg-primary hover:text-white transition-none"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
