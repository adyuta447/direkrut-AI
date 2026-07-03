import { Application } from "../../../types";
import { getScoreLabel } from "../../../lib/hrd/scoring";

interface DecisionCandidateInfoProps {
  candidate: Application;
}

export function DecisionCandidateInfo({ candidate }: DecisionCandidateInfoProps) {
  const scoreInfo = getScoreLabel(candidate.recommendationScore);

  return (
    <div className="bg-canvas border border-hairline p-5">
      <p className="text-[12px] font-semibold uppercase tracking-widest text-ink-muted mb-3">Kandidat</p>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-ink text-white flex items-center justify-center font-semibold text-[14px] flex-shrink-0">
          {candidate.applicantName.charAt(0)}
        </div>
        <div>
          <p className="text-[14px] font-semibold text-ink">{candidate.applicantName}</p>
          <p className="text-[12px] text-ink-muted">{candidate.jobTitle}</p>
        </div>
      </div>
      <div className="flex items-center justify-between p-3 bg-surface-1 border border-hairline">
        <p className="text-[12px] text-ink-muted uppercase font-semibold">Profil Keahlian</p>
        {candidate.recommendationScore ? (
          <span className={`text-[11px] font-semibold px-2 py-1 border uppercase ${scoreInfo.className}`}>{scoreInfo.label}</span>
        ) : (
          <p className="text-[14px] font-semibold text-ink">—</p>
        )}
      </div>
    </div>
  );
}
