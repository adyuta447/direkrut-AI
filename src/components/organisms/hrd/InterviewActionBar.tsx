import { ArrowRight, Send } from "lucide-react";

interface InterviewActionBarProps {
  isComplete: boolean;
  isAutoRunning: boolean;
  isTyping: boolean;
  onClose: () => void;
  onSendNext: () => void;
}

export function InterviewActionBar({ isComplete, isAutoRunning, isTyping, onClose, onSendNext }: InterviewActionBarProps) {
  return (
    <div className="bg-transparent border-t border-zinc-200/60 dark:border-zinc-800/60 px-6 py-5">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        {isComplete ? (
          <button
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-all duration-300"
          >
            Close Simulation
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 rounded-full text-[10px] font-mono tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
              {isAutoRunning ? "> Executing auto-simulation sequence..." : "> Awaiting manual trigger for next response..."}
            </div>
            {!isAutoRunning && (
              <button
                onClick={onSendNext}
                disabled={isTyping || isComplete}
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
