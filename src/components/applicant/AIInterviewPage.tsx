import { useState } from "react";
import { X } from "lucide-react";

interface AIInterviewPageProps {
  onClose: () => void;
}

export default function AIInterviewPage({ onClose }: AIInterviewPageProps) {
  const [indicators] = useState([
    { id: "eye", label: "Pelacakan Mata", status: true },
    { id: "outfit", label: "Pakaian Rapi", status: true },
    { id: "tab", label: "Perpindahan Tab", status: false },
  ]);

  const [metrics] = useState({
    score: 85,
    violations: 2,
  });

  return (
    <div className="h-full flex flex-col bg-canvas font-sans">
      {/* Header */}
      <div className="border-b border-hairline bg-surface-1 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[16px] font-semibold text-ink uppercase">
            WAWANCARA VIDEO AI
          </h1>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-hairline hover:bg-canvas transition-none"
          >
            <X className="w-4 h-4 text-ink" />
          </button>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: User Video */}
        <div className="flex-1 border-r border-hairline p-6 bg-canvas">
          <div className="h-full bg-surface-1 border border-hairline flex items-center justify-center relative overflow-hidden">
             <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Video Anda" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-ink/80 text-white px-4 py-2 text-[14px] font-semibold">
                  VIDEO ANDA
                </div>
             </div>
          </div>
        </div>

        {/* Right: AI Panel */}
        <div className="w-96 border-l border-hairline p-6 flex flex-col bg-canvas">
          {/* Indicators Section */}
          <div className="mb-8">
            <div className="space-y-3">
              {indicators.map((indicator) => (
                <div
                  key={indicator.id}
                  className={`px-4 py-3 border text-[14px] font-semibold transition-none flex items-center justify-center uppercase ${
                    indicator.status
                      ? "border-hairline bg-surface-1 text-ink"
                      : "border-[#da1e28] bg-[#fff1f1] text-[#da1e28]"
                  }`}
                >
                  {indicator.label}
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Section */}
          <div className="flex gap-3 mb-8">
            {/* Score */}
            <div className="flex-1 px-4 py-3 border border-hairline bg-[#defbe6]">
              <div className="text-[12px] text-[#198038] font-semibold mb-1 uppercase">
                Skor
              </div>
              <div className="text-[24px] font-light text-[#198038]">
                {metrics.score}%
              </div>
            </div>

            {/* Violations */}
            <div className="flex-1 px-4 py-3 border border-[#da1e28] bg-[#fff1f1]">
              <div className="text-[12px] text-[#da1e28] font-semibold mb-1 uppercase">
                Pelanggaran
              </div>
              <div className="text-[24px] font-light text-[#da1e28]">
                {metrics.violations}
              </div>
            </div>
          </div>

          {/* AI Video - Bottom Right */}
          <div className="flex-1 flex items-end justify-end">
            <div className="w-48 h-32 bg-surface-1 border border-hairline flex items-center justify-center relative overflow-hidden">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-50" alt="Video AI" />
              <div className="absolute text-center">
                <div className="text-[12px] text-white font-semibold uppercase bg-ink px-2 py-1">
                  VIDEO AI
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
