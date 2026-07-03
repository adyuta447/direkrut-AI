interface CandidateCvSummaryProps {
  cvSummary?: string;
}

export function CandidateCvSummary({ cvSummary }: CandidateCvSummaryProps) {
  return (
    <div className="bg-canvas border border-hairline p-6">
      <p className="text-[14px] font-semibold text-ink mb-4">Ringkasan CV (AI Ekstraksi)</p>
      <p className="text-[16px] text-ink leading-[1.5]">{cvSummary || "Tidak ada ringkasan yang tersedia."}</p>
    </div>
  );
}
