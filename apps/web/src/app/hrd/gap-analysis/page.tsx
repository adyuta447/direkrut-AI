"use client";

import { useGapAnalysis } from "../../../lib/hrd/useGapAnalysis";
import { GapAnalysisSelector } from "../../../components/molecules/hrd/GapAnalysisSelector";
import { GapAnalysisEmptyState } from "../../../components/molecules/hrd/GapAnalysisEmptyState";
import { GapAnalysisSkillMatches } from "../../../components/organisms/hrd/GapAnalysisSkillMatches";
import { GapAnalysisAssessmentPanels } from "../../../components/organisms/hrd/GapAnalysisAssessmentPanels";
import { GapAnalysisActionPlan } from "../../../components/molecules/hrd/GapAnalysisActionPlan";

export default function GapAnalysisPage() {
  const g = useGapAnalysis();

  return (
    <div className="p-6 lg:p-8 space-y-6 font-sans">
      <div>
        <p className="text-[12px] font-semibold text-ink-muted mb-2 uppercase tracking-widest">Alat AI</p>
        <h2 className="text-[32px] font-light tracking-[-0.5px] text-ink mb-2">Validasi Kompetensi (AI)</h2>
        <p className="text-[16px] text-ink-muted">
          Validasi keterampilan kandidat secara langsung terhadap bukti yang ditemukan di CV mereka.
        </p>
      </div>

      <GapAnalysisSelector
        applications={g.applications}
        selectedCandidate={g.selectedCandidate}
        onSelectCandidate={g.selectCandidate}
        onAnalyze={g.handleAnalyze}
      />

      {g.selectedCandidate && !g.analysis && <GapAnalysisEmptyState />}

      {g.analysis && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4">
          <GapAnalysisSkillMatches matches={g.analysis.matches} />
          <GapAnalysisAssessmentPanels overallAssessment={g.analysis.overallAssessment} recommendations={g.analysis.recommendations} />
          <GapAnalysisActionPlan />
        </div>
      )}
    </div>
  );
}
