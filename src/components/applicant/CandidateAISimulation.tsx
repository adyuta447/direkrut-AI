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
  const [chatOpen, setChatOpen] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [currentCaption, setCurrentCaption] = useState("");
  const [callRunning, setCallRunning] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timer = useTimer(callRunning);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

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
        const closing = "Great job! That concludes your practice session. Your responses have been noted. You can review the transcript and practice again anytime.";
        setMessages((prev) => [...prev, { role: "ai", text: closing }]);
        setCurrentCaption("Practice complete.");
        setCallRunning(false);
        setTimeout(() => setPhase("done"), 2000);
      }
      setAiTyping(false);
    }, 2000);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAnswer(); }
  };

  const reset = () => {
    setPhase("lobby"); setCurrentQ(0); setMessages([]);
    setCurrentCaption(""); setInput(""); setAiTyping(false);
    setAiSpeaking(false); setCallRunning(false);
  };

  const progress = Math.min(((currentQ + 1) / QUESTIONS.length) * 100, 100);

  // ── Lobby ─────────────────────────────────────────────
  if (phase === "lobby") {
    return (
      <div className="h-full flex flex-col lg:flex-row bg-zinc-50 dark:bg-zinc-950">
        {/* Left main */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 text-center">
          {/* Avatar preview — YOU are prominent */}
          <div className="relative mb-8">
            <div className="w-28 h-28 rounded-3xl bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center">
              {camOn ? (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center">
                    <span className="text-2xl font-bold text-zinc-600 dark:text-zinc-300">{userInitial}</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">{userName}</p>
                </>
              ) : (
                <VideoOff className="w-8 h-8 text-zinc-400" />
              )}
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
              You (Preview)
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight mb-2">AI Interview Simulation</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-sm mb-8 leading-relaxed">
            Simulated video interview with the DirekrutAI AI Interviewer. Practice your answers before the real session —{" "}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">responses are not evaluated.</span>
          </p>

          {/* Device toggles */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setMicOn((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
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
            className="inline-flex items-center gap-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-3.5 rounded-xl font-semibold text-sm hover:opacity-80 transition-opacity"
          >
            Join Practice Session
            <ChevronRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-zinc-400 mt-3">
            {QUESTIONS.length} questions · Practice only
          </p>
        </div>

        {/* Right — questions list */}
        <div className="w-full lg:w-64 xl:w-72 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-3">Practice Questions</p>
          <div className="space-y-2.5">
            {QUESTIONS.map((q, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[10px] font-mono text-zinc-300 dark:text-zinc-600 mt-0.5 flex-shrink-0 w-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Done ─────────────────────────────────────────────
  if (phase === "done") {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-5">
          <span className="font-bold text-sm text-zinc-500 dark:text-zinc-400">AI</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Practice Complete</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md mb-6 leading-relaxed">
          You answered all {QUESTIONS.length} questions. Review your transcript below or practice again.
        </p>
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-left mb-6 max-h-60 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-3">Transcript</p>
          {messages.map((m, i) => (
            <div key={i} className="mb-3">
              <p className="text-[10px] font-medium text-zinc-400 mb-0.5">
                {m.role === "ai" ? "AI Interviewer" : userName}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{m.text}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Practice Again
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity"
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
          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">{timer}</span>
          <span className="text-zinc-300 dark:text-zinc-700">·</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Q {Math.min(currentQ + 1, QUESTIONS.length)}/{QUESTIONS.length}
          </span>
        </div>
        <div className="flex-1 mx-8">
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-0.5">
            <div
              className="bg-zinc-400 dark:bg-zinc-500 h-0.5 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-zinc-400">Practice Mode</p>
      </div>

      {/* Video area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main video grid */}
        <div className="flex-1 relative p-4 flex items-stretch gap-4">
          {/* YOU — large, primary tile */}
          <div className="flex-1 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden min-h-0">
            {camOn ? (
              <>
                {/* Simulated camera feed — gradient placeholder */}
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl bg-zinc-200 dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 flex items-center justify-center mb-3">
                    <span className="text-3xl font-bold text-zinc-500 dark:text-zinc-300">{userInitial}</span>
                  </div>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{userName}</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                    {!micOn ? "Muted" : "Ready"}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <VideoOff className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mb-2" />
                <p className="text-sm text-zinc-400">Camera off</p>
              </div>
            )}

            {/* Name tag */}
            <div className="absolute bottom-3 left-3 bg-black/20 dark:bg-black/40 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1.5">
              <User className="w-3 h-3 text-white" />
              <p className="text-xs text-white font-medium">{userName} (You)</p>
            </div>

            {/* Mic indicator */}
            {!micOn && (
              <div className="absolute top-3 right-3 w-7 h-7 bg-black/20 dark:bg-black/40 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <MicOff className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>

          {/* AI Interviewer — smaller tile on right */}
          <div className="w-48 xl:w-56 rounded-2xl bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0">
            <div
              className={`w-14 h-14 rounded-xl bg-zinc-300 dark:bg-zinc-700 border flex items-center justify-center mb-2 transition-all duration-300 ${
                aiSpeaking
                  ? "border-zinc-500 dark:border-zinc-400 scale-110"
                  : "border-zinc-300 dark:border-zinc-600"
              }`}
            >
              <span className="text-base font-bold text-zinc-500 dark:text-zinc-300">AI</span>
            </div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">AI Interviewer</p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
              {aiSpeaking ? "Speaking..." : aiTyping ? "Thinking..." : "Listening"}
            </p>

            {/* Caption overlay */}
            {currentCaption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-900/60 to-transparent p-3">
                <p className="text-[10px] text-white text-center leading-tight line-clamp-3">
                  {currentCaption}
                </p>
              </div>
            )}

            {/* Name tag */}
            <div className="absolute top-2 left-2 bg-black/20 dark:bg-black/40 backdrop-blur-sm rounded-md px-1.5 py-0.5">
              <p className="text-[9px] text-white">AI Interviewer</p>
            </div>
          </div>
        </div>

        {/* Chat / Q&A panel */}
        {chatOpen && (
          <div className="w-72 flex-shrink-0 border-l border-zinc-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-zinc-900">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
              <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Interview Chat</p>
              <button
                onClick={() => setChatOpen(false)}
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "ai" && (
                    <div className="w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mr-1.5 flex-shrink-0 mt-0.5">
                      <span className="text-[8px] font-bold text-zinc-400">AI</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[190px] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                      m.role === "ai"
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                        : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {aiTyping && (
                <div className="flex justify-start">
                  <div className="w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mr-1.5 flex-shrink-0">
                    <span className="text-[8px] font-bold text-zinc-400">AI</span>
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-2 rounded-xl">
                    <div className="flex gap-1">
                      {[0, 0.15, 0.3].map((d, i) => (
                        <div key={i} className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 p-3 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Type your answer..."
                  rows={2}
                  disabled={aiTyping}
                  className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-700 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 resize-none focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
                />
                <button
                  onClick={sendAnswer}
                  disabled={!input.trim() || aiTyping}
                  className="w-9 h-9 flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed self-end flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1.5 text-center">Enter to send</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom control bar */}
      <div className="flex-shrink-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-6 py-3 flex items-center justify-center gap-3">
        <button
          onClick={() => setMicOn((v) => !v)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl border text-sm transition-all ${
            micOn
              ? "border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-500"
              : "border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
          }`}
        >
          {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setCamOn((v) => !v)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl border text-sm transition-all ${
            camOn
              ? "border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-500"
              : "border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
          }`}
        >
          {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        </button>
        <button
          onClick={() => setChatOpen((v) => !v)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl border text-sm transition-all ${
            chatOpen
              ? "border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
              : "border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-400"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700" />
        <button
          onClick={() => setPhase("done")}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <PhoneOff className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
