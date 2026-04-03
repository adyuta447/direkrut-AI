import { useState, useRef, useEffect } from "react";
import { Send, X, ArrowRight, CheckCircle } from "lucide-react";

interface AIInterviewPageProps {
  onClose: () => void;
}

interface Message {
  role: "ai" | "user";
  content: string;
}

const interviewQuestions = [
  "Tell me about yourself and why you're interested in this role.",
  "Can you walk me through a project you're particularly proud of and your specific contribution?",
  "How do you handle situations where you disagree with your team or manager on a technical decision?",
  "Describe your problem-solving approach when faced with an unfamiliar technical challenge.",
  "Where do you see yourself professionally in the next 2-3 years, and how does this role fit into that vision?",
];

export default function AIInterviewPage({ onClose }: AIInterviewPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Welcome to your DirekrutAI interview session. I'm your AI Interviewer for today. This is a standard first-round conversation — just be yourself and answer naturally. Ready to begin?",
    },
    {
      role: "ai",
      content: interviewQuestions[0],
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!currentInput.trim() || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", content: currentInput }]);
    setCurrentInput("");
    setIsTyping(true);

    setTimeout(() => {
      if (currentQuestion < interviewQuestions.length - 1) {
        const next = currentQuestion + 1;
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Thank you for sharing that. My next question:" },
          { role: "ai", content: interviewQuestions[next] },
        ]);
        setCurrentQuestion(next);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content:
              "Thank you for completing the interview. Your responses have been recorded and will be reviewed by the hiring team. You'll receive feedback within 2-3 business days. Good luck!",
          },
        ]);
        setIsComplete(true);
      }
      setIsTyping(false);
    }, 1800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const progress = ((currentQuestion + 1) / interviewQuestions.length) * 100;

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-white dark:text-zinc-900 font-bold text-xs">AI</span>
              </div>
              <div>
                <p className="text-sm font-semibold">AI Interviewer</p>
                <p className="text-xs text-zinc-400">First-round screening</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 font-mono">
                {Math.min(currentQuestion + 1, interviewQuestions.length)}/{interviewQuestions.length}
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            </div>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1">
            <div
              className="bg-zinc-900 dark:bg-white h-1 rounded-full transition-all duration-500"
              style={{ width: isComplete ? "100%" : `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Completed state */}
      {isComplete && messages[messages.length - 1].role === "ai" && (
        <div className="bg-zinc-900 dark:bg-white border-b border-zinc-800 dark:border-zinc-200 px-6 py-2.5">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-white dark:text-zinc-900 flex-shrink-0" />
            <p className="text-xs text-white dark:text-zinc-900 font-medium">
              Interview complete — your responses have been saved.
            </p>
          </div>
        </div>
      )}

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
          {isComplete ? (
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 btn-primary py-3 px-7"
              >
                Back to Status
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Your answer... (Enter to send, Shift+Enter for new line)"
                rows={2}
                className="flex-1 input-field resize-none py-3"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!currentInput.trim() || isTyping}
                className="w-11 h-11 flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed self-end flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
