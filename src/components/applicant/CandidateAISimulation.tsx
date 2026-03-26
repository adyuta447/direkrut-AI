import { useState, useRef, useEffect } from "react";
import { Send, ArrowRight, RotateCcw, CheckCircle } from "lucide-react";

interface Message {
  role: "ai" | "user";
  content: string;
}

const practiceQuestions = [
  "Tell me about yourself and your professional background.",
  "What is your greatest technical strength, and can you give an example of how you've applied it?",
  "Describe a challenging project. How did you approach it and what was the outcome?",
  "How do you prioritize tasks when working under pressure or tight deadlines?",
  "Where do you see yourself in 3 years, and how does this role help you get there?",
];

const tips = [
  { title: "Be concise", body: "Aim for 2–3 minute answers. Cover the key point without rambling." },
  { title: "Use STAR method", body: "Situation → Task → Action → Result. Works for behavioral questions." },
  { title: "Show enthusiasm", body: "Mention why you're specifically excited about the role and company." },
  { title: "Quantify impact", body: "Numbers stand out. \"Reduced load time by 40%\" beats \"improved performance\"." },
  { title: "Prepare questions", body: "The AI session may ask if you have questions. Have 1–2 ready." },
];

export default function CandidateAISimulation() {
  const [mode, setMode] = useState<"intro" | "chat" | "done">("intro");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startSession = () => {
    setMessages([
      { role: "ai", content: "Welcome to your AI Interview Practice session. This simulates what the actual AI interview will feel like. Answer each question just as you would in the real session. Let's begin:" },
      { role: "ai", content: practiceQuestions[0] },
    ]);
    setCurrentQ(0);
    setMode("chat");
  };

  const handleSend = () => {
    if (!currentInput.trim() || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", content: currentInput }]);
    setCurrentInput("");
    setIsTyping(true);

    setTimeout(() => {
      if (currentQ < practiceQuestions.length - 1) {
        const next = currentQ + 1;
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Good answer. Next question:" },
          { role: "ai", content: practiceQuestions[next] },
        ]);
        setCurrentQ(next);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content:
              "That wraps up the practice session. You've answered all 5 questions. Review your responses above to identify areas to improve. When you feel ready, the real AI interview will follow the same format.",
          },
        ]);
        setMode("done");
      }
      setIsTyping(false);
    }, 1500);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const restart = () => {
    setMessages([]);
    setCurrentInput("");
    setCurrentQ(0);
    setIsTyping(false);
    setMode("intro");
  };

  const progress = mode === "done" ? 100 : ((currentQ + 1) / practiceQuestions.length) * 100;

  if (mode === "intro") {
    return (
      <div className="h-full flex flex-col lg:flex-row bg-zinc-50 dark:bg-zinc-950">
        {/* Left — main CTA */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
              Practice Mode
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Prepare for<br />Your AI Interview.
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-md mb-8">
              This session simulates the actual AI interview you will take when shortlisted.
              Practice your answers to{" "}
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                {practiceQuestions.length} real-style questions
              </span>{" "}
              before the real session. Your practice answers are not evaluated.
            </p>
            <button
              onClick={startSession}
              className="inline-flex items-center gap-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-7 py-3.5 rounded-xl font-semibold text-sm hover:opacity-80 transition-opacity"
            >
              Start Practice Session
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Question list */}
          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
              Questions You'll Practice
            </p>
            <div className="space-y-2">
              {practiceQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl"
                >
                  <span className="text-xs font-mono text-zinc-300 dark:text-zinc-600 mt-0.5 flex-shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — tips panel */}
        <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
            Interview Tips
          </p>
          <div className="space-y-4">
            {tips.map((tip) => (
              <div key={tip.title}>
                <p className="text-xs font-semibold mb-1">{tip.title}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header with progress */}
      <div className="flex-shrink-0 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 px-6 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-white dark:text-zinc-900 font-bold text-xs">AI</span>
              </div>
              <div>
                <p className="text-xs font-semibold">AI Interview Practice</p>
                <p className="text-xs text-zinc-400">Practice mode — responses not evaluated</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 font-mono">
                {Math.min(currentQ + 1, practiceQuestions.length)}/{practiceQuestions.length}
              </span>
              <button
                onClick={restart}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </div>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1">
            <div
              className="bg-zinc-900 dark:bg-white h-1 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {mode === "done" && (
        <div className="flex-shrink-0 bg-zinc-900 dark:bg-white px-6 py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-white dark:text-zinc-900 flex-shrink-0" />
            <p className="text-xs text-white dark:text-zinc-900 font-medium">
              Practice session complete. Review your answers above.
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center mr-2.5 flex-shrink-0 mt-0.5">
                  <span className="text-white dark:text-zinc-900 font-bold text-xs">AI</span>
                </div>
              )}
              <div
                className={`max-w-2xl px-4 py-3 rounded-xl text-sm leading-relaxed ${
                  msg.role === "ai"
                    ? "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                    : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center ml-2.5 flex-shrink-0 mt-0.5">
                  <span className="text-zinc-500 dark:text-zinc-400 text-xs font-bold">
                    You
                  </span>
                </div>
              )}
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

      {/* Input or completion actions */}
      <div className="flex-shrink-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          {mode === "done" ? (
            <div className="flex gap-3">
              <button
                onClick={restart}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Practice Again
              </button>
              <p className="flex-1 flex items-center justify-center text-xs text-zinc-400 text-center leading-relaxed">
                You're ready. The real AI interview will start once you're shortlisted.
              </p>
            </div>
          ) : (
            <div className="flex gap-3">
              <textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKey}
                placeholder="Type your answer... (Enter to send)"
                rows={2}
                disabled={isTyping}
                className="flex-1 input-field resize-none py-3 text-sm"
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
