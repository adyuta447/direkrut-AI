import { BarChart3, X, CheckCircle2 } from "lucide-react";

interface CandidateMatchEvidencePanelProps {
  onClose: () => void;
}

export function CandidateMatchEvidencePanel({ onClose }: CandidateMatchEvidencePanelProps) {
  return (
    <div className="mt-6 border-t border-hairline pt-6 animate-in slide-in-from-top-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-semibold text-ink flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Detail Analisis Kecocokan AI
        </h3>
        <button onClick={onClose}>
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
              <p className="text-[12px] text-ink-muted leading-[1.5]">"Gaya komunikasi profesional dan kolaboratif."</p>
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
  );
}
