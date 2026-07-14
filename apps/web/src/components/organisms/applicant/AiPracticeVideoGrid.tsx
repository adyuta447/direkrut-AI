import { VideoOff, User, MicOff } from "lucide-react";

interface AiPracticeVideoGridProps {
  camOn: boolean;
  micOn: boolean;
  userName: string;
  aiSpeaking: boolean;
  aiTyping: boolean;
  currentCaption: string;
}

export function AiPracticeVideoGrid({
  camOn, micOn, userName, aiSpeaking, aiTyping, currentCaption,
}: AiPracticeVideoGridProps) {
  return (
    <div className="flex-1 relative p-4 flex flex-col lg:flex-row items-stretch gap-4 w-full">
      <div className="flex-1 bg-canvas border border-hairline flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
        {camOn ? (
          <>
            <img src="/aiinterview.png" alt="User Feed" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-10 flex flex-col items-center"></div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <VideoOff className="w-12 h-12 text-ink-muted mb-4" />
            <p className="text-[16px] text-ink">Kamera mati</p>
          </div>
        )}

        <div className="absolute bottom-4 left-4 bg-ink/80 backdrop-blur-md px-3 py-1.5 flex items-center gap-2">
          <User className="w-4 h-4 text-white" />
          <p className="text-[12px] text-white">{userName} (Anda)</p>
        </div>

        {!micOn && (
          <div className="absolute top-4 right-4 w-8 h-8 bg-ink/80 backdrop-blur-md flex items-center justify-center">
            <MicOff className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div className="w-full lg:w-72 flex flex-col gap-4 flex-shrink-0 justify-end">
        <div className="w-full h-64 bg-canvas border border-hairline flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0">
          <div
            className={`w-16 h-16 bg-surface-1 border flex items-center justify-center mb-4 transition-none ${
              aiSpeaking ? "border-primary" : "border-hairline"
            }`}
          >
            <span className="text-[20px] font-semibold text-ink">AI</span>
          </div>
          <p className="text-[14px] font-semibold text-ink">Pewawancara AI</p>
          <p className="text-[12px] text-ink-muted mt-1">
            {aiSpeaking ? "BERBICARA..." : aiTyping ? "MEMPROSES..." : "MENDENGARKAN"}
          </p>

          {currentCaption && (
            <div className="absolute bottom-0 left-0 right-0 bg-ink/90 p-3">
              <p className="text-[12px] text-white text-center leading-[1.5]">{currentCaption}</p>
            </div>
          )}

          <div className="absolute top-4 left-4 bg-surface-1 border border-hairline px-2 py-1">
            <p className="text-[10px] font-semibold text-ink">Video AI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
