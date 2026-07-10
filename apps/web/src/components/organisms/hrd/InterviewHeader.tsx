import { ArrowLeft, X } from "lucide-react";
import { Application } from "../../../types";

interface InterviewHeaderProps {
  candidate: Application;
  currentQuestion: number;
  totalQuestions: number;
  progress: number;
  isComplete: boolean;
  isAutoRunning: boolean;
  onClose: () => void;
  onAutoRun: () => void;
}

export function InterviewHeader({
  candidate, currentQuestion, totalQuestions, progress, isComplete, isAutoRunning, onClose, onAutoRun,
}: InterviewHeaderProps) {
  return (
    <div className="bg-transparent border-b border-zinc-200/60 dark:border-zinc-800/60 px-6 py-5">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
              <ArrowLeft className="w-4 h-4 text-zinc-900 dark:text-white" />
            </button>
            <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">Live Simulation</p>
              </div>
              <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                {candidate.applicantName} • {candidate.jobTitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono tracking-widest text-zinc-400">
              {Math.min(currentQuestion + 1, totalQuestions)} / {totalQuestions}
            </span>

            {!isComplete && !isAutoRunning && (
              <button
                onClick={onAutoRun}
                className="text-[9px] font-bold uppercase tracking-widest border border-zinc-900 dark:border-white text-zinc-900 dark:text-white px-4 py-2 rounded-full hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-colors"
              >
                Auto-run
              </button>
            )}

            {isAutoRunning && !isComplete && (
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Simulating
              </span>
            )}

            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
              <X className="w-4 h-4 text-zinc-500" />
            </button>
          </div>
        </div>
        <div className="w-full bg-zinc-100 dark:bg-zinc-800/50 h-[2px]">
          <div className="bg-zinc-900 dark:bg-white h-[2px] transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
