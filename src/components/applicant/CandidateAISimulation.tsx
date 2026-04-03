import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  X,
  ArrowRight,
  Send,
  RotateCcw,
  ChevronRight,
  User,
  Eye,
  Shirt,
  Monitor,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const QUESTIONS = [
  "Hello! Welcome. Let's start — could you briefly introduce yourself and your professional background?",
  "What is your greatest technical skill, and can you give a recent example where you applied it?",
  "Tell me about a challenging project or situation. How did you handle it and what was the result?",
  "How do you manage competing priorities and tight deadlines?",
  "Last question — where do you see yourself in 2–3 years, and how does this role fit that vision?",
];

function useTimer(running: boolean) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function CandidateAISimulation() {
  const { currentUser } = useApp();
  const userName = currentUser?.name || "You";
  const userInitial = userName.charAt(0).toUpperCase();

  const [phase, setPhase] = useState<"lobby" | "call" | "done">("lobby");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [messages, setMessages] = useState<
    { role: "ai" | "user"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [currentCaption, setCurrentCaption] = useState("");
  const [callRunning, setCallRunning] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timer = useTimer(callRunning);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping, chatOpen]);

  const startCall = () => {
    setPhase("call");
    setCallRunning(true);
    setTimeout(() => {
      const q = QUESTIONS[0];
      setMessages([{ role: "ai", text: q }]);
      setCurrentCaption(q);
      setAiSpeaking(true);
      setTimeout(() => setAiSpeaking(false), 3500);
    }, 1200);
  };

  const sendAnswer = () => {
    if (!input.trim() || aiTyping) return;
    const answer = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: answer }]);
    setAiTyping(true);
    setCurrentCaption("");

    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        const next = currentQ + 1;
        const nextQ = QUESTIONS[next];
        setMessages((prev) => [...prev, { role: "ai", text: nextQ }]);
        setCurrentQ(next);
        setCurrentCaption(nextQ);
        setAiSpeaking(true);
        setTimeout(() => setAiSpeaking(false), 3000);
      } else {
        const closing =
          "Thank you for completing the interview. Your responses have been recorded and will be reviewed by the hiring team. You'll receive feedback within 2-3 business days. Good luck!";
        setMessages((prev) => [...prev, { role: "ai", text: closing }]);
        setCurrentCaption("Practice complete.");
        setCallRunning(false);
        setTimeout(() => setPhase("done"), 2000);
      }
      setAiTyping(false);
    }, 2000);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendAnswer();
    }
  };

  const reset = () => {
    setPhase("lobby");
    setCurrentQ(0);
    setMessages([]);
    setCurrentCaption("");
    setInput("");
    setAiTyping(false);
    setAiSpeaking(false);
    setCallRunning(false);
  };

  const progress = Math.min(((currentQ + 1) / QUESTIONS.length) * 100, 100);

  // ── Lobby ─────────────────────────────────────────────
  if (phase === "lobby") {
    // ... (Lobby code remains untouched)
    return (
      <div className="h-full flex flex-col lg:flex-row bg-zinc-50 dark:bg-zinc-950">
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 text-center">
          <div className="relative mb-8">
            <div className="w-28 h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center">
              {camOn ? (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center">
                    <span className="text-2xl font-bold text-zinc-600 dark:text-zinc-300">
                      {userInitial}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                    {userName}
                  </p>
                </>
              ) : (
                <VideoOff className="w-8 h-8 text-zinc-400" />
              )}
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-semibold px-2 py-0.5 rounded-2xl whitespace-nowrap">
              You (Preview)
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight mb-2">
            AI Video Interview
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-sm mb-8 leading-relaxed">
            Video interview session with the DirekrutAI AI Interviewer. Answer
            each question clearly and naturally —{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              your responses will be evaluated.
            </span>
          </p>

          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setMicOn((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-medium transition-all ${
                micOn
                  ? "border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 bg-zinc-50 dark:bg-zinc-900 line-through"
              }`}
            >
              {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              Microphone
            </button>
            <button
              onClick={() => setCamOn((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-medium transition-all ${
                camOn
                  ? "border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 bg-zinc-50 dark:bg-zinc-900 line-through"
              }`}
            >
              {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              Camera
            </button>
          </div>

          <button
            onClick={startCall}
            className="inline-flex items-center gap-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-3.5 rounded-2xl font-semibold text-sm hover:opacity-80 transition-opacity"
          >
            Join Interview Session
            <ChevronRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-zinc-400 mt-3">
            {QUESTIONS.length} questions
          </p>
        </div>

        <div className="w-full lg:w-64 xl:w-72 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-3">
            Interview Questions
          </p>
          <div className="space-y-2.5">
            {QUESTIONS.map((q, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[10px] font-mono text-zinc-300 dark:text-zinc-600 mt-0.5 flex-shrink-0 w-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {q}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Done ─────────────────────────────────────────────
  if (phase === "done") {
    // ... (Done code remains untouched)
    return (
      <div className="h-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-5">
          <span className="font-bold text-sm text-zinc-500 dark:text-zinc-400">
            AI
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Interview Complete</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md mb-6 leading-relaxed">
          You answered all {QUESTIONS.length} questions. Your responses have
          been recorded and submitted for review.
        </p>
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-left mb-6 max-h-60 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-3">
            Transcript
          </p>
          {messages.map((m, i) => (
            <div key={i} className="mb-3">
              <p className="text-[10px] font-medium text-zinc-400 mb-0.5">
                {m.role === "ai" ? "AI Interviewer" : userName}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {m.text}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Redo Interview
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-2xl text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            Done
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── In-Call ─────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col bg-zinc-100 dark:bg-zinc-950 overflow-hidden">
      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-2.5 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-pulse" />
          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
            {timer}
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">·</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Q {Math.min(currentQ + 1, QUESTIONS.length)}/{QUESTIONS.length}
          </span>
        </div>
        <div className="flex-1 mx-8">
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-2xl h-0.5">
            <div
              className="bg-zinc-400 dark:bg-zinc-500 h-0.5 rounded-2xl transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-zinc-400">Interview Session</p>
      </div>

      {/* Video area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main video grid */}
        <div className="flex-1 relative p-4 flex items-stretch gap-4 w-full">
          {/* YOU — large, primary tile */}
          <div className="flex-1 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden min-h-0">
            {camOn ? (
              <>
                <img
                  src="/public/aiinterview.png"
                  alt="User Feed"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 flex flex-col items-center"></div>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <VideoOff className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mb-2" />
                <p className="text-sm text-zinc-400">Camera off</p>
              </div>
            )}

            {/* Name tag */}
            <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-white" />
              <p className="text-xs text-white font-medium">{userName} (You)</p>
            </div>

            {/* Mic indicator */}
            {!micOn && (
              <div className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center">
                <MicOff className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {/* AI Panel — Column on the right */}
          <div className="w-56 xl:w-64 flex flex-col gap-3 flex-shrink-0 justify-end">
            
            {/* 3 Indicators (Vertical) */}
            <div className="flex flex-col gap-2 w-full">
              {[
                { label: "Eye Tracking", icon: Eye },
                { label: "Neat Clothing", icon: Shirt },
                { label: "Tab Browser", icon: Monitor },
              ].map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      {label}
                    </span>
                  </div>
                  <div className="w-2 h-2 rounded-2xl bg-green-500" />
                </div>
              ))}
            </div>

            {/* 2 Stats Buttons (Horizontal) */}
            <div className="flex gap-2 w-full">
              <div className="flex-1 bg-[#F0FDF4] border border-[#bbf7d0] rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 mb-1">
                  Score
                </span>
                <span className="text-xl font-black text-green-900 tracking-tighter">
                  85%
                </span>
              </div>
              <div className="flex-1 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-700 dark:text-red-500 mb-1">
                  Violation
                </span>
                <span className="text-xl font-black text-red-900 dark:text-red-400 tracking-tighter">
                  2
                </span>
              </div>
            </div>

            {/* AI Video Interviewer (Pojok Bawah Kanan) */}
            <div className="w-full h-48 rounded-2xl bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0">
              <div
                className={`w-14 h-14 rounded-2xl bg-zinc-300 dark:bg-zinc-700 border flex items-center justify-center mb-2 transition-all duration-300 ${
                  aiSpeaking
                    ? "border-zinc-500 dark:border-zinc-400 scale-110"
                    : "border-zinc-300 dark:border-zinc-600"
                }`}
              >
                <span className="text-base font-bold text-zinc-500 dark:text-zinc-300">
                  AI
                </span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                AI Interviewer
              </p>
              <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 mt-0.5">
                {aiSpeaking
                  ? "SPEAKING..."
                  : aiTyping
                    ? "THINKING..."
                    : "LISTENING"}
              </p>

              {/* Caption overlay */}
              {currentCaption && (
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-zinc-950/95 p-3 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-[10px] font-medium text-zinc-900 dark:text-white text-center leading-tight line-clamp-3">
                    {currentCaption}
                  </p>
                </div>
              )}

              {/* Name tag */}
              <div className="absolute top-3 left-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-2.5 py-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
                  AI Video
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── UPDATED CHAT PANEL (AWWWARDS / MODERN AGENCY STYLE) ── */}
        {chatOpen && (
          <div className="absolute top-4 right-4 bottom-4 w-[calc(100%-32px)] sm:w-[380px] z-50 flex flex-col bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2rem] overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-transparent">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                  Live Transcript
                </p>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    m.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 px-1">
                    {m.role === "user" ? userName : "AI Interviewer"}
                  </span>
                  <div
                    className={`max-w-[85%] px-5 py-3.5 text-[13px] leading-relaxed ${
                      m.role === "ai"
                        ? "bg-zinc-100/50 dark:bg-zinc-900/50 text-zinc-800 dark:text-zinc-200 rounded-3xl rounded-tl-sm border border-zinc-200/30 dark:border-zinc-800/30"
                        : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-3xl rounded-tr-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {aiTyping && (
                <div className="flex flex-col items-start">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5 px-1">
                    AI Interviewer
                  </span>
                  <div className="bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/30 dark:border-zinc-800/30 px-5 py-4 rounded-3xl rounded-tl-sm">
                    <div className="flex gap-1.5">
                      {[0, 0.15, 0.3].map((d, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-pulse"
                          style={{ animationDelay: `${d}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white/30 dark:bg-zinc-950/30 border-t border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-md">
              <div className="flex items-end gap-2 bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-1.5 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-colors">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Type your response..."
                  rows={1}
                  disabled={aiTyping}
                  className="flex-1 bg-transparent px-4 py-2.5 text-[13px] text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 resize-none focus:outline-none min-h-[44px] max-h-[120px]"
                />
                <button
                  onClick={sendAnswer}
                  disabled={!input.trim() || aiTyping}
                  className="w-10 h-10 flex items-center justify-center bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[9px] text-zinc-400 mt-3 font-medium uppercase tracking-widest text-center">
                Press Enter to Submit
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom control bar */}
      <div className="flex-shrink-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-6 py-3 flex items-center justify-center gap-3">
        <button
          onClick={() => setMicOn((v) => !v)}
          className={`w-12 h-12 flex items-center justify-center rounded-2xl border text-sm transition-all ${
            micOn
              ? "border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              : "border-red-500 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-500"
          }`}
        >
          {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setCamOn((v) => !v)}
          className={`w-12 h-12 flex items-center justify-center rounded-2xl border text-sm transition-all ${
            camOn
              ? "border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              : "border-red-500 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-500"
          }`}
        >
          {camOn ? (
            <Video className="w-5 h-5" />
          ) : (
            <VideoOff className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={() => setChatOpen((v) => !v)}
          className={`w-12 h-12 flex items-center justify-center rounded-2xl border text-sm transition-all ${
            chatOpen
              ? "border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
              : "border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 mx-1" />
        <button
          onClick={() => setPhase("done")}
          className="w-12 h-12 flex items-center justify-center rounded-2xl border border-red-500 bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}