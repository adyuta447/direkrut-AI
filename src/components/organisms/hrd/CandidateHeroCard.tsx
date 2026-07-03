import { Application } from "../../../types";
import { CandidateHeroHeader } from "../../molecules/hrd/CandidateHeroHeader";
import { CandidateMatchEvidencePanel } from "../../molecules/hrd/CandidateMatchEvidencePanel";
import { CandidateStatusGrid } from "../../molecules/hrd/CandidateStatusGrid";
import { CandidateViewedNotice } from "../../molecules/hrd/CandidateViewedNotice";

interface CandidateHeroCardProps {
  candidate: Application;
  showMatchDetails: boolean;
  onToggleMatchDetails: () => void;
}

export function CandidateHeroCard({ candidate, showMatchDetails, onToggleMatchDetails }: CandidateHeroCardProps) {
  return (
    <div className="bg-canvas border border-hairline p-6 relative">
      <CandidateHeroHeader candidate={candidate} onToggleMatchDetails={onToggleMatchDetails} />

      {/* Detailed Match Evidence (Slug / Drill-down) */}
      {showMatchDetails && <CandidateMatchEvidencePanel onClose={onToggleMatchDetails} />}

      <CandidateStatusGrid candidate={candidate} />
      <CandidateViewedNotice candidate={candidate} />
    </div>
  );
}
