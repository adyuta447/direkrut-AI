import { Application } from "../../../types";
import { hrdStatusLabel } from "../../../lib/hrd/scoring";

interface CandidateStatusGridProps {
  candidate: Application;
}

export function CandidateStatusGrid({ candidate }: CandidateStatusGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-hairline">
      <div className="bg-surface-1 p-4">
        <p className="text-[12px] text-ink-muted mb-1 font-semibold uppercase">Status</p>
        <p className="text-[16px] font-normal text-ink capitalize">{hrdStatusLabel(candidate.status)}</p>
      </div>
      <div className="bg-surface-1 p-4">
        <p className="text-[12px] text-ink-muted mb-1 font-semibold uppercase">Tanggal Melamar</p>
        <p className="text-[16px] font-normal text-ink">{candidate.appliedDate}</p>
      </div>
    </div>
  );
}
