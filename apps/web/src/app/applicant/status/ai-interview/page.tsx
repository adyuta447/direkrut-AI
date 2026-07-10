"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { AiInterviewIndicators } from "../../../../components/molecules/applicant/AiInterviewIndicators";
import { AiInterviewMetrics } from "../../../../components/molecules/applicant/AiInterviewMetrics";

export default function AiInterviewFormalPage() {
  const router = useRouter();
  const onClose = () => router.push("/applicant/status");

  return (
    <div className="h-full flex flex-col bg-canvas font-sans">
      <div className="border-b border-hairline bg-surface-1 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[16px] font-semibold text-ink uppercase">WAWANCARA VIDEO AI</h1>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center border border-hairline hover:bg-canvas transition-none">
            <X className="w-4 h-4 text-ink" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 border-r border-hairline p-6 bg-canvas">
          <div className="h-full bg-surface-1 border border-hairline flex items-center justify-center relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop"
              className="w-full h-full object-cover opacity-80"
              alt="Video Anda"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-ink/80 text-white px-4 py-2 text-[14px] font-semibold">VIDEO ANDA</div>
            </div>
          </div>
        </div>

        <div className="w-96 border-l border-hairline p-6 flex flex-col bg-canvas">
          <AiInterviewIndicators />
          <AiInterviewMetrics />

          <div className="flex-1 flex items-end justify-end">
            <div className="w-48 h-32 bg-surface-1 border border-hairline flex items-center justify-center relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop"
                className="w-full h-full object-cover grayscale opacity-50"
                alt="Video AI"
              />
              <div className="absolute text-center">
                <div className="text-[12px] text-white font-semibold uppercase bg-ink px-2 py-1">VIDEO AI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
