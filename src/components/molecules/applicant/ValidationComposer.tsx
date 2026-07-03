import { RefObject } from "react";
import { Send, ArrowRight } from "lucide-react";

interface ValidationComposerProps {
  currentInput: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  isTyping: boolean;
  hasMoreQuestions: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}

export function ValidationComposer({
  currentInput, onChange, onKeyDown, onSend, isTyping, hasMoreQuestions, textareaRef,
}: ValidationComposerProps) {
  return (
    <div className="border-t border-hairline bg-surface-1 px-6 py-5 flex-shrink-0">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2 bg-canvas border-b border-hairline focus-within:border-primary transition-none">
          <textarea
            ref={textareaRef}
            value={currentInput}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ketik balasan Anda..."
            rows={1}
            disabled={isTyping}
            className="flex-1 bg-transparent px-4 py-3 text-[14px] text-ink placeholder-ink-muted resize-none overflow-hidden focus:outline-none min-h-[44px] max-h-[160px] leading-[1.5] disabled:opacity-50"
          />
          <button
            onClick={onSend}
            disabled={!currentInput.trim() || isTyping}
            className="w-10 h-10 flex items-center justify-center bg-primary text-white hover:bg-[#0353e9] transition-none disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 m-1"
          >
            {hasMoreQuestions ? <Send className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex justify-between items-center mt-2 px-1">
          <p className="text-[12px] text-ink-muted">Tekan Enter untuk Mengirim</p>
          <p className="text-[12px] text-ink-muted">{currentInput.length} karakter</p>
        </div>
      </div>
    </div>
  );
}
