import { RefObject } from "react";
import { InterviewMessage } from "../../../lib/hrd/useAiInterviewSimulation";

interface InterviewMessageListProps {
  candidateName: string;
  messages: InterviewMessage[];
  isTyping: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export function InterviewMessageList({ candidateName, messages, isTyping, messagesEndRef }: InterviewMessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message, idx) => (
          <div key={idx} className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}>
            <div className={`flex items-center gap-2 mb-1.5 px-1 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                {message.role === "ai" ? "System AI" : candidateName}
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-300 dark:text-zinc-600">{message.timestamp}</span>
            </div>
            <div
              className={`max-w-[85%] sm:max-w-[75%] px-5 py-4 text-[13px] leading-relaxed ${
                message.role === "ai"
                  ? "bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-800 dark:text-zinc-200 rounded-3xl rounded-tl-sm"
                  : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-3xl rounded-tr-sm"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col items-start">
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 px-1">System AI</span>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 px-5 py-4 rounded-3xl rounded-tl-sm">
              <div className="flex gap-1.5">
                {[0, 0.15, 0.3].map((delay, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-pulse"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
}
