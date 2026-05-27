import { useState, useRef, useEffect } from "react";
import { Send, ArrowRight } from "lucide-react";

// For this specific view, we'll hardcode Indonesian questions
const validationQuestionsId = [
  "Bisa tolong ceritakan secara singkat tentang pengalaman kerja terakhir Anda?",
  "Apa pencapaian terbesar yang pernah Anda raih dalam karir Anda sejauh ini?",
  "Bagaimana cara Anda menyelesaikan masalah yang kompleks di tempat kerja?",
  "Mengapa Anda tertarik untuk bergabung dengan perusahaan kami di posisi ini?"
];

interface ValidationChatProps {
  onComplete: () => void;
}

interface Message {
  role: "ai" | "user";
  content: string;
}

export default function ValidationChat({ onComplete }: ValidationChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Halo! Saya telah meninjau CV Anda dan saya memiliki beberapa pertanyaan awal untuk memvalidasi keahlian Anda. Mari kita mulai:",
    },
    {
      role: "ai",
      content: validationQuestionsId[0],
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!currentInput.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: currentInput }]);
    setCurrentInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsTyping(true);

    setTimeout(() => {
      if (currentQuestion < validationQuestionsId.length - 1) {
        const nextQuestion = currentQuestion + 1;
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Terima kasih. Pertanyaan selanjutnya:" },
          { role: "ai", content: validationQuestionsId[nextQuestion] },
        ]);
        setCurrentQuestion(nextQuestion);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content:
              "Terima kasih telah menyelesaikan proses validasi! Jawaban Anda telah kami rekam dan akan dianalisis secara mendalam oleh sistem. Anda sekarang bisa melihat status lamaran Anda.",
          },
        ]);
        setTimeout(() => {
          onComplete();
        }, 3000);
      }
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const progress = ((currentQuestion + 1) / validationQuestionsId.length) * 100;

  return (
    <div className="h-full flex flex-col bg-canvas font-sans border border-hairline max-w-[1584px] mx-auto w-full">
      {/* Progress Header */}
      <div className="bg-surface-1 border-b border-hairline px-6 py-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-ink">
              Validasi Sistem
            </span>
            <span className="text-[12px] text-ink-muted">
              {Math.min(currentQuestion + 1, validationQuestionsId.length)} /{" "}
              {validationQuestionsId.length}
            </span>
          </div>
          <div className="w-full bg-[#e0e0e0] h-1 mt-2">
            <div
              className="bg-primary h-1 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <span className="text-[12px] text-ink-muted mb-1 px-1">
                {message.role === "ai" ? "Sistem AI" : "Kandidat"}
              </span>
              <div
                className={`max-w-[85%] sm:max-w-[75%] px-5 py-4 text-[14px] leading-[1.5] ${
                  message.role === "ai"
                    ? "bg-surface-1 border border-hairline text-ink"
                    : "bg-ink text-white"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex flex-col items-start">
              <span className="text-[12px] text-ink-muted mb-1 px-1">
                Sistem AI
              </span>
              <div className="bg-surface-1 border border-hairline px-5 py-4">
                <div className="flex gap-1.5">
                  {[0, 0.15, 0.3].map((delay, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-ink-muted animate-pulse"
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

      {/* Input Panel */}
      <div className="border-t border-hairline bg-surface-1 px-6 py-5 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 bg-canvas border-b border-hairline focus-within:border-primary transition-none">
            <textarea
              ref={textareaRef}
              value={currentInput}
              onChange={(e) => {
                setCurrentInput(e.target.value);
                autoResize();
              }}
              onKeyDown={handleKeyPress}
              placeholder="Ketik balasan Anda..."
              rows={1}
              disabled={isTyping}
              className="flex-1 bg-transparent px-4 py-3 text-[14px] text-ink placeholder-ink-muted resize-none overflow-hidden focus:outline-none min-h-[44px] max-h-[160px] leading-[1.5] disabled:opacity-50"
            />

            <button
              onClick={handleSend}
              disabled={!currentInput.trim() || isTyping}
              className="w-10 h-10 flex items-center justify-center bg-primary text-white hover:bg-[#0353e9] transition-none disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 m-1"
            >
              {currentQuestion < validationQuestionsId.length - 1 ? (
                <Send className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex justify-between items-center mt-2 px-1">
            <p className="text-[12px] text-ink-muted">
              Tekan Enter untuk Mengirim
            </p>
            <p className="text-[12px] text-ink-muted">
              {currentInput.length} karakter
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}