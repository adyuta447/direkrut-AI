import { useState, useRef, useEffect } from "react";
import { Send, ArrowRight } from "lucide-react";
import { validationQuestions } from "../../mockData";

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
        "Hello! I've reviewed your CV and I have a few questions to validate your skills and experience. Let's begin:",
    },
    {
      role: "ai",
      content: validationQuestions[0],
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
      if (currentQuestion < validationQuestions.length - 1) {
        const nextQuestion = currentQuestion + 1;
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Thank you. Next question:" },
          { role: "ai", content: validationQuestions[nextQuestion] },
        ]);
        setCurrentQuestion(nextQuestion);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content:
              "Thank you for completing the validation! Your responses have been recorded and will be carefully analyzed. You can now view your application status.",
          },
        ]);
        setTimeout(() => {
          onComplete();
        }, 2000);
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

  const progress = ((currentQuestion + 1) / validationQuestions.length) * 100;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0a0a0a] font-sans">
      {/* Progress Header */}
      <div className="bg-transparent border-b border-zinc-200/60 dark:border-zinc-800/60 px-6 py-5 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                System Validation
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-zinc-400">
              {Math.min(currentQuestion + 1, validationQuestions.length)} /{" "}
              {validationQuestions.length}
            </span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800/50 h-[2px]">
            <div
              className="bg-zinc-900 dark:bg-white h-[2px] transition-all duration-700 ease-out"
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
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 px-1">
                {message.role === "ai" ? "System" : "Candidate"}
              </span>
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
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 px-1">
                System
              </span>
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

      {/* Input Panel */}
      <div className="bg-transparent border-t border-zinc-200/60 dark:border-zinc-800/60 px-6 py-5 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-1.5 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-colors">
            <textarea
              ref={textareaRef}
              value={currentInput}
              onChange={(e) => {
                setCurrentInput(e.target.value);
                autoResize();
              }}
              onKeyDown={handleKeyPress}
              placeholder="Type your response..."
              rows={1}
              disabled={isTyping}
              className="flex-1 bg-transparent px-4 py-3 text-[13px] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 resize-none overflow-hidden focus:outline-none min-h-[44px] max-h-[160px] leading-relaxed disabled:opacity-50"
            />

            <button
              onClick={handleSend}
              disabled={!currentInput.trim() || isTyping}
              className="w-10 h-10 flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 mb-0.5 mr-0.5"
            >
              {currentQuestion < validationQuestions.length - 1 ? (
                <Send className="w-4 h-4 ml-0.5" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex justify-between items-center mt-3 px-2">
            <p className="text-[9px] font-medium uppercase tracking-widest text-zinc-400">
              Press Enter to Submit
            </p>
            <p className="text-[9px] font-mono tracking-widest text-zinc-400">
              {currentInput.length} CHARS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}