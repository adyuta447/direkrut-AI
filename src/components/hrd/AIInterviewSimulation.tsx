import { useState, useRef, useEffect } from "react";
import { Send, X, ArrowRight, ArrowLeft } from "lucide-react";
import { Application } from "../../types";

interface AIInterviewSimulationProps {
  candidate: Application;
  onClose: () => void;
}

interface Message {
  role: "ai" | "user";
  content: string;
  timestamp: string;
}

const generateQuestions = (jobTitle: string) => [
  `Tell me about your background and why you applied for the ${jobTitle} position.`,
  `What's the most technically challenging problem you've solved recently? Walk me through your approach.`,
  `How do you stay up-to-date with industry developments relevant to ${jobTitle}?`,
  `Describe a situation where you had to collaborate with a difficult stakeholder. How did you handle it?`,
  `Where do you see yourself in 2-3 years, and how does this role align with your goals?`,
];

const candidateResponses = [
  "I've been in the industry for several years and am excited about this opportunity because it aligns well with my skill set and career goals...",
  "One challenging project involved optimizing a critical data pipeline that was causing bottlenecks. I used profiling tools to identify the bottleneck and refactored the code to improve performance by 40%...",
  "I follow industry blogs, attend webinars, participate in online communities, and regularly complete courses to stay current with best practices...",
  "I once worked with a stakeholder who had conflicting priorities. I scheduled a dedicated meeting to understand their perspective and found a middle ground that satisfied both parties...",
  "In 2-3 years, I aim to take on senior responsibilities and mentor junior team members. This role gives me the ideal environment to develop those skills while contributing meaningfully...",
];

function getTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AIInterviewSimulation({
  candidate,
  onClose,
}: AIInterviewSimulationProps) {
  const questions = generateQuestions(candidate.jobTitle);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: `Hello ${candidate.applicantName}! I'm the DirekrutAI Interviewer. This is your first-round interview for the ${candidate.jobTitle} position. Let's get started — please answer each question naturally and thoroughly. Ready?`,
      timestamp: getTime(),
    },
    {
      role: "ai",
      content: questions[0],
      timestamp: getTime(),
    },
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const simulateNextAnswer = () => {
    if (currentQuestion >= questions.length || isTyping) return;

    const answer =
      candidateResponses[currentQuestion] ||
      "I believe I have the right skills for this role and am eager to contribute to the team.";

    setMessages((prev) => [
      ...prev,
      { role: "user", content: answer, timestamp: getTime() },
    ]);
    setIsTyping(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        const next = currentQuestion + 1;
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: "Thank you for sharing that. Moving on:",
            timestamp: getTime(),
          },
          { role: "ai", content: questions[next], timestamp: getTime() },
        ]);
        setCurrentQuestion(next);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: `Thank you, ${candidate.applicantName}! That concludes the AI interview session. Your responses will be reviewed by the hiring team within 2-3 business days. We'll be in touch soon. Good luck!`,
            timestamp: getTime(),
          },
        ]);
        setIsComplete(true);
        setIsAutoRunning(false);
      }
      setIsTyping(false);
    }, 2000);
  };

  const handleAutoRun = () => {
    setIsAutoRunning(true);
  };

  useEffect(() => {
    if (isAutoRunning && !isTyping && !isComplete) {
      const timer = setTimeout(simulateNextAnswer, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAutoRunning, isTyping, currentQuestion, isComplete]);

  const progress = isComplete
    ? 100
    : ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0a0a0a] font-sans">
      {/* Header */}
      <div className="bg-transparent border-b border-zinc-200/60 dark:border-zinc-800/60 px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-zinc-900 dark:text-white" />
              </button>
              <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white animate-pulse" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                    Live Simulation
                  </p>
                </div>
                <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                  {candidate.applicantName} • {candidate.jobTitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono tracking-widest text-zinc-400">
                {Math.min(currentQuestion + 1, questions.length)} /{" "}
                {questions.length}
              </span>

              {!isComplete && !isAutoRunning && (
                <button
                  onClick={handleAutoRun}
                  className="text-[9px] font-bold uppercase tracking-widest border border-zinc-900 dark:border-white text-zinc-900 dark:text-white px-4 py-2 rounded-full hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-colors"
                >
                  Auto-run
                </button>
              )}

              {isAutoRunning && !isComplete && (
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Simulating
                </span>
              )}

              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800/50 h-[2px]">
            <div
              className="bg-zinc-900 dark:bg-white h-[2px] transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {isComplete && (
        <div className="bg-transparent border-b border-zinc-200/60 dark:border-zinc-800/60 px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <img src="/public/success.svg" alt="Success" className="w-4 h-4" />
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
              Simulation complete — Session Recorded
            </p>
          </div>
        </div>
      )}

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
              <div
                className={`flex items-center gap-2 mb-1.5 px-1 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                  {message.role === "ai" ? "System AI" : candidate.applicantName}
                </span>
                <span className="text-[9px] font-mono tracking-widest text-zinc-300 dark:text-zinc-600">
                  {message.timestamp}
                </span>
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
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 px-1">
                System AI
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

      {/* Action bar */}
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
                {isAutoRunning
                  ? "> Executing auto-simulation sequence..."
                  : "> Awaiting manual trigger for next response..."}
              </div>
              {!isAutoRunning && (
                <button
                  onClick={simulateNextAnswer}
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
    </div>
  );
}