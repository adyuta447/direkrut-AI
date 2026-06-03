import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
  Video,
  Calendar,
  BarChart3,
  CheckCircle2,
  X,
  Briefcase,
  Bell,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import DecisionPanel from "./DecisionPanel";
import HRDSchedulingModal from "./HRDSchedulingModal";
import AIInterviewSimulation from "./AIInterviewSimulation";

interface CandidateDetailProps {
  candidateId: string;
  onBack: () => void;
}

export default function CandidateDetail({ candidateId, onBack }: CandidateDetailProps) {
  const { applications } = useApp();
  const [showDecisionPanel, setShowDecisionPanel] = useState(false);
  const [decision, setDecision] = useState<"invite" | "reject" | null>(null);
  const [showScheduling, setShowScheduling] = useState(false);
  const [showAIInterview, setShowAIInterview] = useState(false);
  const [showMatchDetails, setShowMatchDetails] = useState(false);

  const candidate = applications.find((app) => app.id === candidateId);

  if (!candidate) {
    return (
      <div className="p-8 text-ink-muted text-[14px]">
        Kandidat tidak ditemukan.
      </div>
    );
  }

  const handleDecision = (type: "invite" | "reject") => {
    setDecision(type);
    setShowDecisionPanel(true);
  };

  if (showDecisionPanel && decision) {
    return (
      <DecisionPanel
        candidate={candidate}
        decision={decision}
        onBack={() => setShowDecisionPanel(false)}
      />
    );
  }

  if (showAIInterview) {
    return (
      <AIInterviewSimulation
        candidate={candidate}
        onClose={() => setShowAIInterview(false)}
      />
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {showScheduling && (
        <HRDSchedulingModal
          candidateName={candidate.applicantName}
          onClose={() => setShowScheduling(false)}
        />
      )}

      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[14px] text-ink hover:underline transition-none mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Manajemen Pelamar
      </button>

      {/* Hero card */}
      <div className="bg-canvas border border-hairline p-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-surface-1 border border-hairline flex items-center justify-center text-ink font-semibold text-[24px] flex-shrink-0">
              {candidate.applicantName.charAt(0)}
            </div>
            <div>
              <h1 className="text-[28px] font-light text-ink mb-1">
                {candidate.applicantName}
              </h1>
              <p className="text-[16px] text-ink-muted mb-4">
                {candidate.jobTitle}
              </p>
              <div className="flex flex-wrap gap-4 text-[14px] text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  {candidate.applicantId}@email.com
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  +62 812-3456-7890
                </span>
                {candidate.resumeLink && (
                  <a
                    href={candidate.resumeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-primary hover:underline transition-none"
                  >
                    <FileText className="w-4 h-4" />
                    Lihat CV
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[12px] text-ink-muted mb-1 uppercase font-semibold">Profil Keahlian Kandidat</p>
            {/* REVISI 2: Label teks, bukan angka persen */}
            {candidate.recommendationScore ? (
              <>
                <span className={`inline-block text-[13px] font-semibold px-3 py-1.5 border uppercase tracking-wide mt-1 ${
                  candidate.recommendationScore >= 75
                    ? "text-[#198038] bg-[#defbe6] border-[#198038]"
                    : candidate.recommendationScore >= 55
                      ? "text-[#f1c21b] bg-[#fcf0d3] border-[#f1c21b]"
                      : "text-[#da1e28] bg-[#fff1f1] border-[#da1e28]"
                }`}>
                  {candidate.recommendationScore >= 75
                    ? "Memenuhi Syarat"
                    : candidate.recommendationScore >= 55
                      ? "Perlu Dikembangkan"
                      : "Tidak Sesuai"}
                </span>
              </>
            ) : (
              <p className="text-[42px] font-light text-ink-muted">—</p>
            )}
            <button
              onClick={() => setShowMatchDetails(!showMatchDetails)}
              className="text-[12px] text-primary mt-3 hover:underline flex items-center justify-end gap-1 w-full"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Lihat Detail Metrik AI
            </button>
          </div>
        </div>

        {/* Detailed Match Evidence (Slug / Drill-down) */}
        {showMatchDetails && (
          <div className="mt-6 border-t border-hairline pt-6 animate-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-semibold text-ink flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Detail Analisis Kecocokan AI
              </h3>
              <button onClick={() => setShowMatchDetails(false)}>
                <X className="w-4 h-4 text-ink-muted hover:text-ink" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-surface-1 border border-hairline p-4">
                <p className="text-[12px] font-semibold uppercase text-ink-muted mb-3">Dari Bukti CV (Bobot 60%)</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[14px] mb-1">
                      <span className="text-ink">Relevansi Pengalaman</span>
                      <span className="font-semibold text-[#198038]">Tinggi (90%)</span>
                    </div>
                    <p className="text-[12px] text-ink-muted leading-[1.5]">
                      "Disebutkan 3x di CV terkait pengalaman langsung pada proyek serupa."
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between text-[14px] mb-1">
                      <span className="text-ink">Pendidikan & Sertifikasi</span>
                      <span className="font-semibold text-[#f1c21b]">Menengah (70%)</span>
                    </div>
                    <p className="text-[12px] text-ink-muted leading-[1.5]">
                      "Memiliki gelar relevan, namun sertifikasi spesifik tidak ditemukan."
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-1 border border-hairline p-4">
                <p className="text-[12px] font-semibold uppercase text-ink-muted mb-3">Dari Wawancara AI (Bobot 40%)</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[14px] mb-1">
                      <span className="text-ink">Pemahaman Teknis/Praktikal</span>
                      <span className="font-semibold text-[#198038]">Sangat Baik (88%)</span>
                    </div>
                    <p className="text-[12px] text-ink-muted leading-[1.5]">
                      "Menyinggung studi kasus relevan 2x saat menjawab pertanyaan."
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between text-[14px] mb-1">
                      <span className="text-ink">Kecocokan Budaya (Culture Fit)</span>
                      <span className="font-semibold text-ink">Baik (82%)</span>
                    </div>
                    <p className="text-[12px] text-ink-muted leading-[1.5]">
                      "Gaya komunikasi profesional dan kolaboratif."
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-[#e5f6ff] border border-[#0f62fe] p-3 flex gap-3 items-start">
               <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
               <p className="text-[12px] text-ink leading-[1.5]">
                 <span className="font-semibold">Kesimpulan AI:</span> Kandidat ini menunjukkan korelasi yang kuat antara apa yang ditulis di CV dengan apa yang disampaikan saat wawancara. Probabilitas kecocokan sangat tinggi.
               </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-hairline">
          <div className="bg-surface-1 p-4">
            <p className="text-[12px] text-ink-muted mb-1 font-semibold uppercase">Status</p>
            <p className="text-[16px] font-normal text-ink capitalize">
              {candidate.status === "under-review" ? "Administrasi" : candidate.status === "interview" ? "Wawancara" : candidate.status === "rejected" ? "Ditolak" : "Terkirim"}
            </p>
          </div>
          <div className="bg-surface-1 p-4">
            <p className="text-[12px] text-ink-muted mb-1 font-semibold uppercase">Tanggal Melamar</p>
            <p className="text-[16px] font-normal text-ink">{candidate.appliedDate}</p>
          </div>
        </div>
        {/* REVISI 9: CV Dilihat Notification */}
        {["under-review", "interview", "rejected"].includes(candidate.status) && (
          <div className="mt-4 p-3 bg-[#e5f6ff] border border-[#0f62fe] flex items-center gap-3">
            <Bell className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-[12px] text-ink">
              <span className="font-semibold">Pemberitahuan:</span> CV kandidat ini telah dilihat oleh tim HRD pada {candidate.appliedDate}.
            </p>
          </div>
        )}
      </div>

      {/* AI Interview + Manual Schedule Actions */}
      <div className="bg-canvas border border-hairline p-6">
        <p className="text-[14px] font-semibold text-ink mb-6">
          Tindakan Wawancara
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => setShowAIInterview(true)}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 border border-hairline hover:bg-surface-1 transition-none text-left h-full"
          >
            <div className="w-full sm:w-24 sm:h-24 bg-surface-2 border border-hairline flex items-center justify-center flex-shrink-0 relative overflow-hidden">
               {/* Screenshot of interview */}
               <img src="/aiinterview.png" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Tangkapan Layar Wawancara" />
               <div className="relative z-10 w-8 h-8 bg-ink rounded-full flex items-center justify-center">
                 <Video className="w-4 h-4 text-white" />
               </div>
            </div>
            <div className="flex-1">
              <p className="text-[16px] font-semibold text-ink">Simulasi Wawancara Video AI</p>
              <p className="text-[12px] text-ink-muted mt-1 leading-[1.5]">
                Tinjau rekaman tangkapan layar, transkrip, dan cara AI mewawancarai kandidat ini secara otomatis.
              </p>
            </div>
          </button>
          
          <button
            onClick={() => setShowScheduling(true)}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 border border-hairline hover:bg-surface-1 transition-none text-left h-full"
          >
            <div className="w-full sm:w-24 sm:h-24 bg-surface-2 border border-hairline flex items-center justify-center flex-shrink-0 transition-none">
              <Calendar className="w-8 h-8 text-ink-muted" />
            </div>
            <div className="flex-1">
              <p className="text-[16px] font-semibold text-ink">Jadwalkan Wawancara Manual</p>
              <p className="text-[12px] text-ink-muted mt-1 leading-[1.5]">
                Pesan jadwal wawancara teknis atau wawancara HRD secara langsung dengan kandidat.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* REVISI 3: Ringkasan Pengalaman Kerja */}
      <div className="bg-canvas border border-hairline p-6">
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="w-5 h-5 text-ink" />
          <p className="text-[14px] font-semibold text-ink">Ringkasan Pengalaman Kerja</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-surface-1 p-4 border border-hairline">
            <p className="text-[12px] font-semibold uppercase text-ink-muted mb-1">Total Pengalaman</p>
            <p className="text-[20px] font-light text-ink">2–3 Tahun</p>
          </div>
          <div className="bg-surface-1 p-4 border border-hairline">
            <p className="text-[12px] font-semibold uppercase text-ink-muted mb-1">Perusahaan Sebelumnya</p>
            <p className="text-[20px] font-light text-ink">2 Perusahaan</p>
          </div>
          <div className="bg-surface-1 p-4 border border-hairline">
            <p className="text-[12px] font-semibold uppercase text-ink-muted mb-1">Relevansi Bidang</p>
            <p className="text-[20px] font-light text-[#198038]">Sesuai</p>
          </div>
        </div>
        <p className="text-[14px] text-ink-muted leading-[1.5]">
          Kandidat memiliki riwayat kerja yang linier dan relevan di bidang {candidate.jobTitle}. Pengalaman sebelumnya mendukung kesiapan untuk mengambil tanggung jawab di posisi ini.
        </p>
      </div>

      {/* CV Summary */}
      <div className="bg-canvas border border-hairline p-6">
        <p className="text-[14px] font-semibold text-ink mb-4">
          Ringkasan CV (AI Ekstraksi)
        </p>
        <p className="text-[16px] text-ink leading-[1.5]">
          {candidate.cvSummary || "Tidak ada ringkasan yang tersedia."}
        </p>
      </div>

      {/* Validation Log */}
      {candidate.validationResponses && candidate.validationResponses.length > 0 && (
        <div className="bg-canvas border border-hairline p-6">
          <p className="text-[14px] font-semibold text-ink mb-6">
            Log Validasi Wawancara AI & Bukti Visual
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-1">
              <p className="text-[12px] font-semibold uppercase text-ink-muted mb-3">Tangkapan Layar Wawancara</p>
              <div className="relative aspect-video bg-surface-1 border border-hairline overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop" 
                  alt="Kandidat saat wawancara AI"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-[#da1e28] text-white text-[10px] px-2 py-0.5 font-semibold animate-pulse">
                  REC
                </div>
              </div>
              <p className="text-[11px] text-ink-muted mt-2">Bukti kehadiran kandidat pada saat evaluasi asinkron berlangsung.</p>
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <p className="text-[12px] font-semibold uppercase text-ink-muted mb-1">Transkrip Tanya Jawab</p>
              {candidate.validationResponses.map((response, idx) => (
                <div key={idx} className="border border-hairline p-4">
                  <p className="text-[14px] font-semibold text-ink mb-2">
                    P{idx + 1}: {response.question}
                  </p>
                  <p className="text-[13px] text-ink leading-[1.5] bg-surface-1 p-3 border border-hairline">
                    {response.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Decision Panel */}
      <div className="bg-canvas border border-hairline p-6">
        <p className="text-[14px] font-semibold text-ink mb-2">
          Keputusan Perekrutan
        </p>
        <p className="text-[14px] text-ink-muted mb-6">
          Tinjau seluruh data kandidat dan ambil tindakan untuk tahap selanjutnya.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => handleDecision("invite")}
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#198038] bg-[#defbe6] text-[#198038] hover:bg-[#198038] hover:text-white text-[14px] font-normal transition-none"
          >
            <CheckCircle className="w-4 h-4" />
            Undang Wawancara
          </button>
          <button
            onClick={() => handleDecision("reject")}
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#da1e28] bg-[#fff1f1] text-[#da1e28] hover:bg-[#da1e28] hover:text-white text-[14px] font-normal transition-none"
          >
            <XCircle className="w-4 h-4" />
            Tolak Lamaran
          </button>
        </div>
      </div>
    </div>
  );
}
