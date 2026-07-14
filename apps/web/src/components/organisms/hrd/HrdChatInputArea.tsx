import { ChevronDown, ChevronUp, Send } from "lucide-react";

interface HrdChatInputAreaProps {
  jobTitle?: string;
  input: string;
  onInputChange: (value: string) => void;
  onSend: (text: string) => void;
  isTyping: boolean;
  suggestions: string[];
  showSuggestions: boolean;
  onToggleSuggestions: () => void;
}

export function HrdChatInputArea({
  jobTitle, input, onInputChange, onSend, isTyping, suggestions, showSuggestions, onToggleSuggestions,
}: HrdChatInputAreaProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-canvas via-canvas to-transparent pt-10 pb-6 px-6">
      <div className="max-w-3xl mx-auto w-full relative">
        {!isTyping && suggestions.length > 0 && (
          <div className="flex justify-end mb-2">
            <button onClick={onToggleSuggestions} className="flex items-center gap-1 text-[11px] text-ink-muted hover:text-primary transition-none">
              {showSuggestions ? (
                <>Sembunyikan Saran <ChevronDown className="w-3 h-3" /></>
              ) : (
                <>Tampilkan Saran <ChevronUp className="w-3 h-3" /></>
              )}
            </button>
          </div>
        )}

        {!isTyping && suggestions.length > 0 && showSuggestions && (
          <div className="flex flex-wrap gap-2 mb-4 animate-in slide-in-from-bottom-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSend(suggestion)}
                className="bg-surface-1 border border-hairline hover:border-primary text-ink text-[12px] py-2 px-3 rounded-full transition-none text-left"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div className="relative shadow-sm rounded-lg border border-[#c6c6c6] bg-white overflow-hidden flex items-end">
          <textarea
            placeholder={`Tanyakan tentang kandidat untuk ${jobTitle}...`}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend(input);
              }
            }}
            rows={1}
            className="w-full resize-none bg-transparent py-4 pl-4 pr-12 text-[14px] text-ink focus:outline-none min-h-[56px] max-h-[200px]"
            style={{ overflowY: input.split("\n").length > 1 ? "auto" : "hidden" }}
          />
          <button
            onClick={() => onSend(input)}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 bottom-2 p-2 bg-primary text-white rounded hover:bg-[#0353e9] disabled:bg-[#e0e0e0] disabled:text-[#8d8d8d] transition-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center mt-3">
          <span className="text-[11px] text-ink-muted">
            AI dapat melakukan kesalahan. Harap selalu memverifikasi informasi kandidat secara mandiri.
          </span>
        </div>
      </div>
    </div>
  );
}
