import { AlertCircle, Eye } from "lucide-react";
import { Application } from "../../../types";
import { getScoreLabel } from "../../../lib/hrd/scoring";

interface PotentialCandidatesPanelProps {
  candidates: Application[];
  onViewCandidate: (id: string) => void;
}

export function PotentialCandidatesPanel({ candidates, onViewCandidate }: PotentialCandidatesPanelProps) {
  if (candidates.length === 0) return null;

  return (
    <div className="bg-canvas border border-hairline">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-hairline bg-[#fcf0d3]">
        <AlertCircle className="w-5 h-5 text-[#f1c21b]" />
        <div>
          <p className="text-[14px] font-semibold text-ink">Rekomendasi Tambahan</p>
          <p className="text-[12px] text-ink-muted">Kandidat potensial yang mungkin terlewat dari filter utama Anda</p>
        </div>
      </div>
      <div className="divide-y divide-hairline">
        {candidates.map((app) => {
          const scoreInfo = getScoreLabel(app.recommendationScore);
          return (
            <div key={app.id} className="flex items-center justify-between px-6 py-4 hover:bg-surface-1">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-surface-2 text-ink flex items-center justify-center font-semibold text-[12px] border border-hairline">
                  {app.applicantName.charAt(0)}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-ink">{app.applicantName}</p>
                  <p className="text-[12px] text-ink-muted">{app.jobTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[11px] font-semibold px-2 py-1 border uppercase ${scoreInfo.className}`}>
                  {scoreInfo.label}
                </span>
                <p className="text-[12px] text-ink-muted max-w-xs hidden lg:block">
                  Kandidat ini memiliki profil keahlian yang kuat namun belum diproses. Direkomendasikan untuk ditinjau.
                </p>
                <button
                  onClick={() => onViewCandidate(app.id)}
                  className="text-[14px] font-semibold text-primary hover:underline flex items-center gap-1 flex-shrink-0"
                >
                  <Eye className="w-4 h-4" /> Tinjau
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
