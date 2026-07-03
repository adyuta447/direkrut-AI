import { Application } from "../../types";
import { GapAnalysisResult, SkillMatch } from "./gapAnalysis/types";
import { marketingGapAnalysis } from "./gapAnalysis/marketing";
import { designGapAnalysis } from "./gapAnalysis/design";
import { defaultGapAnalysis } from "./gapAnalysis/defaultAnalysis";

export type { GapAnalysisResult, SkillMatch };

export const MATCH_STYLE: Record<SkillMatch["matchLevel"], string> = {
  Tinggi: "text-[#198038] bg-[#defbe6] border-[#198038]",
  Menengah: "text-[#f1c21b] bg-[#fcf0d3] border-[#f1c21b]",
  Rendah: "text-[#da1e28] bg-[#fff1f1] border-[#da1e28]",
};

export function generateGapAnalysis(candidate: Application): GapAnalysisResult {
  const title = candidate.jobTitle.toLowerCase();
  if (title.includes("marketing") || title.includes("pemasaran")) return marketingGapAnalysis();
  if (title.includes("design") || title.includes("desain") || title.includes("ui") || title.includes("ux")) return designGapAnalysis();
  return defaultGapAnalysis(candidate.jobTitle);
}
