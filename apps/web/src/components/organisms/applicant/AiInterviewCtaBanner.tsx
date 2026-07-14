import { ArrowRight } from "lucide-react";

interface AiInterviewCtaBannerProps {
  onStartSession: () => void;
  onSchedule: () => void;
}

export function AiInterviewCtaBanner({ onStartSession, onSchedule }: AiInterviewCtaBannerProps) {
  return (
    <div className="bg-[#0f62fe] text-white p-8 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-[12px] font-semibold uppercase tracking-widest text-white">Tindakan Diperlukan</span>
        </div>
        <h2 className="text-[32px] font-bold text-white mb-4">Wawancara AI Siap Dimulai</h2>
        <p className="text-[16px] text-[#e0e0e0] leading-relaxed max-w-xl">
          Anda telah lolos seleksi awal. Selesaikan sesi wawancara AI di bawah
          ini sebelum wawancara dengan tim HRD. Wawancara ini mencakup pertanyaan teknis dan perilaku.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row lg:flex-col gap-4 flex-shrink-0 w-full lg:w-auto">
        <button
          onClick={onStartSession}
          className="group inline-flex items-center justify-center gap-3 bg-white text-[#0f62fe] px-8 py-4 text-[14px] font-semibold hover:bg-[#e0e0e0] transition-none"
        >
          Mulai Sesi
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <button
          onClick={onSchedule}
          className="inline-flex items-center justify-center gap-3 bg-transparent border border-white text-white px-8 py-4 text-[14px] font-semibold hover:bg-white hover:text-[#0f62fe] transition-none"
        >
          Jadwalkan Wawancara
        </button>
      </div>
    </div>
  );
}
