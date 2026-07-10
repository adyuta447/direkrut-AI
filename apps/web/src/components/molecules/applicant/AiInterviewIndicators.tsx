const indicators = [
  { id: "eye", label: "Pelacakan Mata", status: true },
  { id: "outfit", label: "Pakaian Rapi", status: true },
  { id: "tab", label: "Perpindahan Tab", status: false },
];

export function AiInterviewIndicators() {
  return (
    <div className="mb-8">
      <div className="space-y-3">
        {indicators.map((indicator) => (
          <div
            key={indicator.id}
            className={`px-4 py-3 border text-[14px] font-semibold transition-none flex items-center justify-center uppercase ${
              indicator.status ? "border-hairline bg-surface-1 text-ink" : "border-[#da1e28] bg-[#fff1f1] text-[#da1e28]"
            }`}
          >
            {indicator.label}
          </div>
        ))}
      </div>
    </div>
  );
}
