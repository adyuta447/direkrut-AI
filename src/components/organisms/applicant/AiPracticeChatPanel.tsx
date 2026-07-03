import { RefObject } from "react";
import { X, Send } from "lucide-react";
import { TypingDots } from "../../atoms/shared/TypingDots";
import { PracticeMessage } from "../../../lib/applicant/useAiPracticeSimulation";

interface AiPracticeChatPanelProps {
  userName: string;
  messages: PracticeMessage[];
  aiTyping: boolean;
  chatEndRef: RefObject<HTMLDivElement | null>;
  input: string;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  onClose: () => void;
}

export function AiPracticeChatPanel({
  userName, messages, aiTyping, chatEndRef, input, onInputChange, onKeyDown, onSend, onClose,
}: AiPracticeChatPanelProps) {
  return (
    <div className="absolute top-4 right-4 bottom-4 w-[calc(100%-32px)] sm:w-[400px] z-50 flex flex-col bg-canvas border border-hairline shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-1">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-[#0353e9] animate-pulse" />
          <p className="text-[14px] font-semibold text-ink">Transkrip Langsung</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-[#e8e8e8] transition-none text-ink">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
            <span className="text-[12px] text-ink-muted mb-1 px-1">
              {m.role === "user" ? userName : "Pewawancara AI"}
            </span>
            <div
              className={`max-w-[85%] px-5 py-4 text-[14px] leading-[1.5] ${
                m.role === "ai" ? "bg-surface-1 border border-hairline text-ink" : "bg-ink text-white"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {aiTyping && (
          <div className="flex flex-col items-start">
            <span className="text-[12px] text-ink-muted mb-1 px-1">Pewawancara AI</span>
            <div className="bg-surface-1 border border-hairline px-5 py-4">
              <TypingDots />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-surface-1 border-t border-hairline">
        <div className="flex items-end gap-2 bg-canvas border border-hairline focus-within:border-primary transition-none">
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ketik balasan Anda..."
            rows={1}
            disabled={aiTyping}
            className="flex-1 bg-transparent px-4 py-3 text-[14px] text-ink placeholder-ink-muted resize-none focus:outline-none min-h-[44px] max-h-[120px]"
          />
          <button
            onClick={onSend}
            disabled={!input.trim() || aiTyping}
            className="w-10 h-10 m-1 flex items-center justify-center bg-primary text-white hover:bg-[#0353e9] transition-none disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[12px] text-ink-muted mt-2 text-center">Tekan Enter untuk Mengirim</p>
      </div>
    </div>
  );
}
