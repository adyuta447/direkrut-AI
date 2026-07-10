import { CheckCircle2 } from "lucide-react";
import { SkillMatch, MATCH_STYLE } from "../../../lib/hrd/gapAnalysisMocks";

interface GapAnalysisSkillMatchesProps {
  matches: SkillMatch[];
}

export function GapAnalysisSkillMatches({ matches }: GapAnalysisSkillMatchesProps) {
  return (
    <div className="bg-canvas border border-hairline p-6">
      <p className="text-[18px] font-normal text-ink mb-6">Validasi Keterampilan & Bukti</p>
      <div className="space-y-6">
        {matches.map((match, idx) => (
          <div key={idx} className="border-l-4 border-hairline pl-4">
            <div className="flex flex-wrap items-center gap-4 mb-2">
              <span className="text-[16px] font-semibold text-ink">{match.skill}</span>
              <span className={`text-[12px] font-semibold px-2 py-1 border uppercase tracking-widest ${MATCH_STYLE[match.matchLevel]}`}>
                Kecocokan {match.matchLevel}
              </span>
            </div>
            <div className="bg-surface-1 border border-hairline p-4 mt-2">
              <p className="text-[12px] font-semibold text-ink-muted mb-1 flex items-center gap-1.5 uppercase tracking-widest">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Bukti AI Diekstrak dari CV
              </p>
              <p className="text-[14px] text-ink leading-[1.5]">“{match.evidence}”</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
