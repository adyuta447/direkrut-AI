import { RotateCcw, ArrowRight } from "lucide-react";
import { PracticeMessage } from "../../../lib/applicant/useAiPracticeSimulation";
import { AI_PRACTICE_QUESTIONS } from "../../../lib/applicant/aiPracticeQuestions";

interface AiPracticeDoneProps {
  userName: string;
  messages: PracticeMessage[];
  onReset: () => void;
}

export function AiPracticeDone({ userName, messages, onReset }: AiPracticeDoneProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-canvas font-sans px-8 text-center border border-hairline max-w-[1584px] mx-auto w-full">
      <div className="w-16 h-16 bg-surface-1 border border-hairline flex items-center justify-center mb-6">
        <span className="font-semibold text-ink">AI</span>
      </div>
      <h2 className="text-[32px] font-bold text-ink mb-4">Wawancara Selesai</h2>
      <p className="text-[16px] text-ink max-w-md mb-8 leading-[1.5]">
        Anda telah menjawab semua {AI_PRACTICE_QUESTIONS.length} pertanyaan. Tanggapan Anda telah
        direkam dan dikirim untuk peninjauan lebih lanjut.
      </p>
      <div className="w-full max-w-md bg-surface-1 border border-hairline p-6 text-left mb-8 max-h-64 overflow-y-auto">
        <p className="text-[14px] font-semibold text-ink mb-4">Transkrip Percakapan</p>
        {messages.map((m, i) => (
          <div key={i} className="mb-4">
            <p className="text-[12px] font-semibold text-ink-muted mb-1">
              {m.role === "ai" ? "Pewawancara AI" : userName}
            </p>
            <p className="text-[14px] text-ink leading-[1.5]">{m.text}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-none text-[14px]"
        >
          <RotateCcw className="w-4 h-4" />
          Ulangi Wawancara
        </button>
        <button onClick={onReset} className="btn-primary inline-flex items-center gap-2">
          Selesai
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
