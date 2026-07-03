import { Video, Calendar } from "lucide-react";

interface CandidateInterviewActionsProps {
  onStartAiInterview: () => void;
  onScheduleManual: () => void;
}

export function CandidateInterviewActions({ onStartAiInterview, onScheduleManual }: CandidateInterviewActionsProps) {
  return (
    <div className="bg-canvas border border-hairline p-6">
      <p className="text-[14px] font-semibold text-ink mb-6">Tindakan Wawancara</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <button
          onClick={onStartAiInterview}
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
          onClick={onScheduleManual}
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
  );
}
