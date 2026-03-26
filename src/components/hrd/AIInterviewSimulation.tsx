import { useState, useRef, useEffect } from "react";
import { Send, X, ArrowRight, CheckCircle, ArrowLeft } from "lucide-react";
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
      content: `Hello ${candidate.applicantName}! I'm the TalentAI Interviewer. This is your first-round interview for the ${candidate.jobTitle} position. Let's get started — please answer each question naturally and thoroughly. Ready?`,
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
  }, [messages]);

  const simulateNextAnswer = () => {
    if (currentQuestion >= questions.length || isTyping) return;

    const answer = candidateResponses[currentQuestion] || "I believe I have the right skills for this role and am eager to contribute to the team.";

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
          { role: "ai", content: "Thank you for sharing that. Moving on:", timestamp: getTime() },
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

  const progress = isComplete ? 100 : ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center flex-shrink-0">
                  <span className="text-white dark:text-zinc-900 font-bold text-xs">AI</span>
                </div>
                <div>
                  <p className="text-xs font-semibold">AI Interview Simulation</p>
                  <p className="text-xs text-zinc-400">
                    {candidate.applicantName} · {candidate.jobTitle}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 font-mono">
                {Math.min(currentQuestion + 1, questions.length)}/{questions.length}
              </span>
              {!isComplete && !isAutoRunning && (
                <button
                  onClick={handleAutoRun}
                  className="text-xs bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition-opacity"
                >
                  Auto-run
                </button>
              )}
              {isAutoRunning && !isComplete && (
                <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Simulating...
                </span>
              )}
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            </div>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1">
            <div
              className="bg-zinc-900 dark:bg-white h-1 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {isComplete && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-800/30 px-6 py-2.5">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              Simulation complete — {candidate.applicantName}'s interview session recorded.
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
              <div className="flex flex-col gap-1 max-w-2xl">
                <div
                  className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${
                    message.role === "ai"
                      ? "bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                      : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                  }`}
                >
                  {message.content}
                </div>
                <div className={`flex items-center gap-1.5 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  {message.role === "user" && (
                    <div className="w-5 h-5 rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-zinc-500">
                        {candidate.applicantName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="text-xs text-zinc-300 dark:text-zinc-600">
                    {message.timestamp}
                  </span>
                </div>
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

      {/* Action bar */}
      <div className="bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          {isComplete ? (
            <div className="flex gap-3 w-full">
              <button
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 btn-primary py-3"
              >
                Back to Candidate Detail
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-sm text-zinc-400 dark:text-zinc-500">
                {isAutoRunning ? "Auto-simulating candidate responses..." : "Click 'Next Answer' to simulate the candidate's response step by step, or use 'Auto-run' to simulate the full session."}
              </div>
              {!isAutoRunning && (
                <button
                  onClick={simulateNextAnswer}
                  disabled={isTyping || isComplete}
                  className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
