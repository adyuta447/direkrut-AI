import { AI_PRACTICE_QUESTIONS } from "../../../lib/applicant/aiPracticeQuestions";

interface AiPracticeTopBarProps {
  timer: string;
  currentQ: number;
  progress: number;
}

export function AiPracticeTopBar({ timer, currentQ, progress }: AiPracticeTopBarProps) {
  return (
    <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-canvas border-b border-hairline">
      <div className="flex items-center gap-4">
        <div className="w-2 h-2 bg-[#0353e9] animate-pulse" />
        <span className="text-[14px] font-semibold text-ink">{timer}</span>
        <span className="text-ink-muted">·</span>
        <span className="text-[14px] text-ink">
          P {Math.min(currentQ + 1, AI_PRACTICE_QUESTIONS.length)}/{AI_PRACTICE_QUESTIONS.length}
        </span>
      </div>
      <div className="flex-1 mx-8">
        <div className="w-full bg-[#e0e0e0] h-1">
          <div className="bg-primary h-1 transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <p className="text-[14px] text-ink-muted">Sesi Wawancara</p>
    </div>
  );
}
