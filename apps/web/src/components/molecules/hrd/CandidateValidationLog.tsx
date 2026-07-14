import { ValidationResponse } from "../../../types";

interface CandidateValidationLogProps {
  responses: ValidationResponse[];
}

export function CandidateValidationLog({ responses }: CandidateValidationLogProps) {
  if (responses.length === 0) return null;

  return (
    <div className="bg-canvas border border-hairline p-6">
      <p className="text-[14px] font-semibold text-ink mb-6">Log Validasi Wawancara AI & Bukti Visual</p>

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
          {responses.map((response, idx) => (
            <div key={idx} className="border border-hairline p-4">
              <p className="text-[14px] font-semibold text-ink mb-2">
                P{idx + 1}: {response.question}
              </p>
              <p className="text-[13px] text-ink leading-[1.5] bg-surface-1 p-3 border border-hairline">{response.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
