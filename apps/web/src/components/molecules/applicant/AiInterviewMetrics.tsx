const metrics = { score: 85, violations: 2 };

export function AiInterviewMetrics() {
  return (
    <div className="flex gap-3 mb-8">
      <div className="flex-1 px-4 py-3 border border-hairline bg-[#defbe6]">
        <div className="text-[12px] text-[#198038] font-semibold mb-1 uppercase">Skor</div>
        <div className="text-[24px] font-light text-[#198038]">{metrics.score}%</div>
      </div>
      <div className="flex-1 px-4 py-3 border border-[#da1e28] bg-[#fff1f1]">
        <div className="text-[12px] text-[#da1e28] font-semibold mb-1 uppercase">Pelanggaran</div>
        <div className="text-[24px] font-light text-[#da1e28]">{metrics.violations}</div>
      </div>
    </div>
  );
}
