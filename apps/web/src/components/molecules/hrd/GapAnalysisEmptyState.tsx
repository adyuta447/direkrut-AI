import { Target } from "lucide-react";

export function GapAnalysisEmptyState() {
  return (
    <div className="bg-surface-1 border border-hairline p-16 text-center">
      <Target className="w-12 h-12 text-ink-muted mx-auto mb-4" />
      <p className="text-[16px] text-ink">Klik “Analisis CV” untuk mengekstrak bukti relevan dengan lowongan kerja kandidat.</p>
    </div>
  );
}
