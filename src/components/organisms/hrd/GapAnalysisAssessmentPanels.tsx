interface GapAnalysisAssessmentPanelsProps {
  overallAssessment: string;
  recommendations: string[];
}

export function GapAnalysisAssessmentPanels({ overallAssessment, recommendations }: GapAnalysisAssessmentPanelsProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-canvas border border-hairline p-6">
        <p className="text-[18px] font-normal text-ink mb-4">Penilaian Keseluruhan</p>
        <p className="text-[14px] text-ink leading-[1.5]">{overallAssessment}</p>
      </div>

      <div className="bg-canvas border border-hairline p-6">
        <p className="text-[18px] font-normal text-ink mb-4">Tindakan yang Disarankan</p>
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-surface-1 border border-hairline">
              <span className="text-[12px] font-semibold text-ink-muted mt-0.5">{idx + 1}.</span>
              <p className="text-[14px] text-ink">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
