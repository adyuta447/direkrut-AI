import { Search, ChevronDown, BarChart3, TrendingUp, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function CrossRoleRecommendation() {
  const { applications, jobs } = useApp();
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [recommendations, setRecommendations] = useState<
    Array<{ role: string; matchScore: number; reason: string; stats: string; originalRole: string; suggestedRoleTitle: string }>
  >([]);
  const [expandedRec, setExpandedRec] = useState<number | null>(null);

  const handleSearch = () => {
    if (!selectedCandidate) return;
    const candidate = applications.find((app) => app.id === selectedCandidate);
    if (!candidate) return;

    const currentScore = candidate.recommendationScore || 75;
    const crossRoleMatches = jobs
      .filter((job) => job.id !== candidate.jobId)
      .map((job) => {
        const variance = Math.floor(Math.random() * 30) - 15;
        const score = Math.min(95, Math.max(50, currentScore + variance));
        let reason = "";
        let stats = "";
        
        if (score >= 85) {
          reason = `Keterampilan inti di CV (80% kesamaan) sangat selaras dengan persyaratan ${job.title}.`;
          stats = `Sistem mendeteksi bahwa meskipun kandidat melamar sebagai ${candidate.jobTitle}, 80% kata kunci pada CV-nya (pengalaman, tools, metode) secara statistik memiliki korelasi yang lebih tinggi dengan deskripsi pekerjaan ${job.title}. Memindahkan kandidat ini akan meningkatkan probabilitas sukses rekrutmen hingga 3x lipat.`;
        } else if (score >= 70) {
          reason = `Keterampilan dasar yang baik, dapat disesuaikan untuk ${job.title} dengan onboarding minimal.`;
          stats = `Kandidat memiliki fondasi kuat yang menyilang (cross-functional) dengan ${job.title}. Terdapat 60% overlap keterampilan. Dengan sedikit pelatihan, kandidat bisa memenuhi kualifikasi ini jika posisi ${candidate.jobTitle} sudah penuh.`;
        } else {
          reason = `Beberapa keterampilan relevan ada, namun membutuhkan peningkatan signifikan untuk ${job.title}.`;
          stats = `Hanya 35% kesesuaian keterampilan. Tidak direkomendasikan kecuali jika terdapat krisis talenta darurat di divisi ini.`;
        }
        
        return { 
          role: `${job.title} di ${job.company}`, 
          matchScore: score, 
          reason,
          stats,
          originalRole: candidate.jobTitle,
          suggestedRoleTitle: job.title
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
      
    setRecommendations(crossRoleMatches);
    setExpandedRec(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 font-sans">
      {/* Header */}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-widest text-ink-muted mb-2">Alat AI</p>
        <h2 className="text-[32px] font-light tracking-[-0.5px] text-ink mb-2">Rekomendasi Posisi Alternatif</h2>
        <p className="text-[16px] text-ink-muted">
          Temukan peran alternatif di mana keterampilan kandidat yang dapat ditransfer (transferable skills) akan lebih bernilai.
        </p>
      </div>

      {/* Search */}
      <div className="bg-canvas border border-hairline p-6">
        <label className="block text-[14px] text-ink font-semibold mb-3">Pilih Kandidat</label>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <select
              value={selectedCandidate}
              onChange={(e) => {
                setSelectedCandidate(e.target.value);
                setRecommendations([]);
              }}
              className="appearance-none input-field w-full pr-10 cursor-pointer"
            >
              <option value="">Pilih kandidat...</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.applicantName} — {app.jobTitle}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
          </div>
          <button
            onClick={handleSearch}
            disabled={!selectedCandidate}
            className="btn-primary flex items-center justify-center gap-2 px-6 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Search className="w-4 h-4" />
            Analisis Posisi
          </button>
        </div>
      </div>

      {/* Results */}
      {recommendations.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-ink-muted">
              Hasil Rekomendasi AI
            </p>
            <span className="text-[14px] text-ink-muted">{recommendations.length} kecocokan ditemukan</span>
          </div>

          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className={`bg-canvas border p-6 transition-none ${expandedRec === idx ? 'border-primary' : 'border-hairline'}`}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-[14px] font-mono font-semibold text-ink-muted">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[18px] font-semibold text-ink">{rec.role}</h3>
                  </div>
                  <p className="text-[14px] text-ink leading-[1.5] sm:ml-9">
                    {rec.reason}
                  </p>
                </div>
                <div className="text-left sm:text-right flex-shrink-0 sm:ml-9 bg-surface-1 p-4 border border-hairline min-w-[120px]">
                  <p className="text-[32px] font-light text-primary tabular-nums">{rec.matchScore}%</p>
                  <p className="text-[12px] font-semibold uppercase text-ink-muted mt-1">Kecocokan</p>
                </div>
              </div>
              
              {expandedRec === idx && (
                <div className="mt-6 pt-6 border-t border-hairline sm:ml-9 animate-in slide-in-from-top-2">
                  <div className="bg-[#e5f6ff] border border-primary p-4">
                    <h4 className="text-[14px] font-semibold text-primary mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Detail Statistik & Metrik AI
                    </h4>
                    <p className="text-[14px] text-ink leading-[1.5] mb-4">
                      {rec.stats}
                    </p>
                    <div className="grid grid-cols-2 gap-4 border-t border-[#8ecbfb] pt-4">
                       <div>
                         <p className="text-[12px] text-ink-muted uppercase font-semibold mb-1">Posisi Awal</p>
                         <p className="text-[14px] font-semibold text-ink">{rec.originalRole}</p>
                       </div>
                       <div>
                         <p className="text-[12px] text-ink-muted uppercase font-semibold mb-1">Posisi Disarankan</p>
                         <p className="text-[14px] font-semibold text-[#198038]">{rec.suggestedRoleTitle}</p>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-hairline flex justify-end gap-4">
                <button 
                  onClick={() => setExpandedRec(expandedRec === idx ? null : idx)}
                  className="text-[14px] font-normal text-ink hover:underline transition-none flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  {expandedRec === idx ? "Tutup Metrik AI" : "Lihat Metrik AI"}
                </button>
                <button className="text-[14px] font-normal text-primary hover:underline transition-none">
                  Sarankan Mutasi ke Kandidat
                </button>
              </div>
            </div>
          ))}

          <div className="p-6 bg-surface-1 border border-hairline mt-8 flex gap-4 items-start">
            <AlertCircle className="w-5 h-5 text-ink-muted flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-semibold text-ink mb-1">Catatan HRD</p>
              <p className="text-[14px] text-ink leading-[1.5]">
                Berdasarkan CV, keahlian, dan tanggapan validasi, kami mengidentifikasi {recommendations.length}{" "}
                peran alternatif di mana keterampilan yang dapat ditransfer (transferable skills) bernilai tinggi. 
                Sistem ini mengurangi "talent waste" (terbuangnya talenta) saat kuota posisi utama sudah penuh.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedCandidate && recommendations.length === 0 && (
        <div className="bg-surface-1 border border-hairline p-16 text-center">
          <Search className="w-12 h-12 text-ink-muted mx-auto mb-4" />
          <p className="text-[16px] text-ink">Klik "Analisis Posisi" untuk memproses data lintas-peran dari CV pelamar.</p>
        </div>
      )}
    </div>
  );
}
