import { Mic, MicOff, Video, VideoOff, ChevronRight } from "lucide-react";
import { AI_PRACTICE_QUESTIONS } from "../../../lib/applicant/aiPracticeQuestions";

interface AiPracticeLobbyProps {
  userName: string;
  userInitial: string;
  micOn: boolean;
  camOn: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onStart: () => void;
}

export function AiPracticeLobby({
  userName, userInitial, micOn, camOn, onToggleMic, onToggleCam, onStart,
}: AiPracticeLobbyProps) {
  return (
    <div className="h-full flex flex-col lg:flex-row bg-canvas font-sans max-w-[1584px] mx-auto w-full border border-hairline">
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 text-center">
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-surface-1 border border-hairline flex flex-col items-center justify-center">
            {camOn ? (
              <>
                <div className="w-12 h-12 bg-ink text-white flex items-center justify-center">
                  <span className="text-xl font-normal">{userInitial}</span>
                </div>
                <p className="text-[12px] text-ink mt-2">{userName}</p>
              </>
            ) : (
              <VideoOff className="w-8 h-8 text-ink-muted" />
            )}
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-ink text-white text-[12px] px-2 py-0.5 whitespace-nowrap">
            Anda (Preview)
          </span>
        </div>

        <h2 className="text-[32px] font-bold tracking-[-0.5px] mb-4 text-ink">Wawancara Video AI</h2>
        <p className="text-[16px] text-ink max-w-sm mb-8 leading-[1.5]">
          Sesi wawancara video dengan Pewawancara AI Direkrut AI. Jawab
          setiap pertanyaan dengan jelas dan natural —{" "}
          <span className="font-semibold">tanggapan Anda akan dievaluasi oleh sistem kami.</span>
        </p>

        <div className="flex gap-4 mb-8">
          <button
            onClick={onToggleMic}
            className={`flex items-center gap-2 px-4 py-2 border text-[14px] transition-none ${
              micOn ? "border-primary text-primary bg-[#e5f6ff]" : "border-hairline text-ink-muted bg-surface-1"
            }`}
          >
            {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            Mikrofon
          </button>
          <button
            onClick={onToggleCam}
            className={`flex items-center gap-2 px-4 py-2 border text-[14px] transition-none ${
              camOn ? "border-primary text-primary bg-[#e5f6ff]" : "border-hairline text-ink-muted bg-surface-1"
            }`}
          >
            {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            Kamera
          </button>
        </div>

        <button onClick={onStart} className="btn-primary inline-flex items-center gap-2">
          Gabung Sesi Wawancara
          <ChevronRight className="w-4 h-4" />
        </button>
        <p className="text-[12px] text-ink-muted mt-4">{AI_PRACTICE_QUESTIONS.length} pertanyaan</p>
      </div>

      <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-hairline bg-surface-1 p-6">
        <p className="text-[14px] font-semibold text-ink mb-4">Daftar Pertanyaan</p>
        <div className="space-y-4">
          {AI_PRACTICE_QUESTIONS.map((q, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-[14px] text-ink-muted font-semibold mt-0.5 flex-shrink-0 w-4">{i + 1}</span>
              <p className="text-[14px] text-ink leading-[1.5]">{q}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
