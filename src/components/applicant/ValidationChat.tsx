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
  }, [messages]);

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
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Progress Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-white" />
              <span className="text-sm font-medium">AI Validation</span>
            </div>
            <span className="text-xs text-zinc-400 font-mono">
              {Math.min(currentQuestion + 1, validationQuestions.length)}/{validationQuestions.length}
            </span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5">
            <div
              className="bg-zinc-900 dark:bg-white h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "ai" && (
                <div className="w-7 h-7 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center mr-2.5 flex-shrink-0 mt-0.5">
                  <span className="text-white dark:text-zinc-900 font-bold text-xs">AI</span>
                </div>
              )}
              <div
                className={`max-w-2xl px-4 py-3 rounded-xl text-sm leading-relaxed ${
                  message.role === "ai"
                    ? "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                    : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center mr-2.5 flex-shrink-0">
                <span className="text-white dark:text-zinc-900 font-bold text-xs">AI</span>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-4 py-3 rounded-xl">
                <div className="flex items-center gap-1.5">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          {/* Contained input card */}
          <div className="relative bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus-within:border-zinc-400 dark:focus-within:border-zinc-500 focus-within:bg-white dark:focus-within:bg-zinc-800 transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={currentInput}
              onChange={(e) => { setCurrentInput(e.target.value); autoResize(); }}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer..."
              rows={1}
              disabled={isTyping}
              className="w-full bg-transparent px-5 pt-4 pb-12 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 resize-none overflow-hidden focus:outline-none leading-relaxed disabled:opacity-50"
            />

            {/* Bottom bar inside card */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400 dark:text-zinc-600 select-none">
                {currentInput.length > 0
                  ? `${currentInput.length} chars · Enter to send`
                  : "Shift + Enter for new line"}
              </span>

              <button
                onClick={handleSend}
                disabled={!currentInput.trim() || isTyping}
                className="group/btn inline-flex items-center gap-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-80 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {currentQuestion < validationQuestions.length - 1 ? (
                  <>
                    Send
                    <Send className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </>
                ) : (
                  <>
                    Finish
                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
