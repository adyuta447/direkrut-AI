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
  "Halo! Selamat datang. Mari kita mulai — bisakah Anda memperkenalkan diri Anda dan latar belakang profesional Anda?",
  "Apa keahlian teknis terbesar Anda, dan bisakah Anda memberikan contoh terbaru kapan Anda menggunakannya?",
  "Ceritakan tentang proyek atau situasi yang paling menantang. Bagaimana Anda menanganinya dan apa hasilnya?",
  "Bagaimana cara Anda mengelola berbagai prioritas dengan tenggat waktu yang ketat?",
  "Pertanyaan terakhir — di mana Anda melihat diri Anda dalam 2–3 tahun ke depan, dan bagaimana peran ini sesuai dengan visi tersebut?",
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
  const userName = currentUser?.name || "Anda";
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
          "Terima kasih telah menyelesaikan wawancara. Tanggapan Anda telah direkam dan akan ditinjau oleh tim rekrutmen kami. Anda akan menerima kabar lanjutan dalam 2-3 hari kerja. Semoga sukses!";
        setMessages((prev) => [...prev, { role: "ai", text: closing }]);
        setCurrentCaption("Latihan selesai.");
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
    return (
      <div className="h-full flex flex-col lg:flex-row bg-canvas font-sans max-w-[1584px] mx-auto w-full border border-hairline">
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-surface-1 border border-hairline flex flex-col items-center justify-center">
              {camOn ? (
                <>
                  <div className="w-12 h-12 bg-ink text-white flex items-center justify-center">
                    <span className="text-xl font-normal">
                      {userInitial}
                    </span>
                  </div>
                  <p className="text-[12px] text-ink mt-2">
                    {userName}
                  </p>
                </>
              ) : (
                <VideoOff className="w-8 h-8 text-ink-muted" />
              )}
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-ink text-white text-[12px] px-2 py-0.5 whitespace-nowrap">
              Anda (Preview)
            </span>
          </div>

          <h2 className="text-[32px] font-light tracking-[-0.5px] mb-4 text-ink">
            Wawancara Video AI
          </h2>
          <p className="text-[16px] text-ink max-w-sm mb-8 leading-[1.5]">
            Sesi wawancara video dengan Pewawancara AI Direkrut AI. Jawab 
            setiap pertanyaan dengan jelas dan natural —{" "}
            <span className="font-semibold">
              tanggapan Anda akan dievaluasi oleh sistem kami.
            </span>
          </p>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setMicOn((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 border text-[14px] transition-none ${
                micOn
                  ? "border-primary text-primary bg-[#e5f6ff]"
                  : "border-hairline text-ink-muted bg-surface-1"
              }`}
            >
              {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              Mikrofon
            </button>
            <button
              onClick={() => setCamOn((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 border text-[14px] transition-none ${
                camOn
                  ? "border-primary text-primary bg-[#e5f6ff]"
                  : "border-hairline text-ink-muted bg-surface-1"
              }`}
            >
              {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              Kamera
            </button>
          </div>

          <button
            onClick={startCall}
            className="btn-primary inline-flex items-center gap-2"
          >
            Gabung Sesi Wawancara
            <ChevronRight className="w-4 h-4" />
          </button>
          <p className="text-[12px] text-ink-muted mt-4">
            {QUESTIONS.length} pertanyaan
          </p>
        </div>

        <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-hairline bg-surface-1 p-6">
          <p className="text-[14px] font-semibold text-ink mb-4">
            Daftar Pertanyaan
          </p>
          <div className="space-y-4">
            {QUESTIONS.map((q, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[14px] text-ink-muted font-semibold mt-0.5 flex-shrink-0 w-4">
                  {i + 1}
                </span>
                <p className="text-[14px] text-ink leading-[1.5]">
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
    return (
      <div className="h-full flex flex-col items-center justify-center bg-canvas font-sans px-8 text-center border border-hairline max-w-[1584px] mx-auto w-full">
        <div className="w-16 h-16 bg-surface-1 border border-hairline flex items-center justify-center mb-6">
          <span className="font-semibold text-ink">
            AI
          </span>
        </div>
        <h2 className="text-[32px] font-light text-ink mb-4">Wawancara Selesai</h2>
        <p className="text-[16px] text-ink max-w-md mb-8 leading-[1.5]">
          Anda telah menjawab semua {QUESTIONS.length} pertanyaan. Tanggapan Anda telah 
          direkam dan dikirim untuk peninjauan lebih lanjut.
        </p>
        <div className="w-full max-w-md bg-surface-1 border border-hairline p-6 text-left mb-8 max-h-64 overflow-y-auto">
          <p className="text-[14px] font-semibold text-ink mb-4">
            Transkrip Percakapan
          </p>
          {messages.map((m, i) => (
            <div key={i} className="mb-4">
              <p className="text-[12px] font-semibold text-ink-muted mb-1">
                {m.role === "ai" ? "Pewawancara AI" : userName}
              </p>
              <p className="text-[14px] text-ink leading-[1.5]">
                {m.text}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-none text-[14px]"
          >
            <RotateCcw className="w-4 h-4" />
            Ulangi Wawancara
          </button>
          <button
            onClick={reset}
            className="btn-primary inline-flex items-center gap-2"
          >
            Selesai
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── In-Call ─────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col bg-surface-1 font-sans border border-hairline max-w-[1584px] mx-auto w-full overflow-hidden">
      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-canvas border-b border-hairline">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-[#0353e9] animate-pulse" />
          <span className="text-[14px] font-semibold text-ink">
            {timer}
          </span>
          <span className="text-ink-muted">·</span>
          <span className="text-[14px] text-ink">
            P {Math.min(currentQ + 1, QUESTIONS.length)}/{QUESTIONS.length}
          </span>
        </div>
        <div className="flex-1 mx-8">
          <div className="w-full bg-[#e0e0e0] h-1">
            <div
              className="bg-primary h-1 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <p className="text-[14px] text-ink-muted">Sesi Wawancara</p>
      </div>

      {/* Video area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main video grid */}
        <div className="flex-1 relative p-4 flex flex-col lg:flex-row items-stretch gap-4 w-full">
          {/* YOU — large, primary tile */}
          <div className="flex-1 bg-canvas border border-hairline flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
            {camOn ? (
              <>
                <img
                  src="/aiinterview.png"
                  alt="User Feed"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 flex flex-col items-center"></div>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <VideoOff className="w-12 h-12 text-ink-muted mb-4" />
                <p className="text-[16px] text-ink">Kamera mati</p>
              </div>
            )}

            {/* Name tag */}
            <div className="absolute bottom-4 left-4 bg-ink/80 backdrop-blur-md px-3 py-1.5 flex items-center gap-2">
              <User className="w-4 h-4 text-white" />
              <p className="text-[12px] text-white">{userName} (Anda)</p>
            </div>

            {/* Mic indicator */}
            {!micOn && (
              <div className="absolute top-4 right-4 w-8 h-8 bg-ink/80 backdrop-blur-md flex items-center justify-center">
                <MicOff className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {/* AI Panel — Column on the right */}
          <div className="w-full lg:w-72 flex flex-col gap-4 flex-shrink-0 justify-end">
            
            {/* AI Video Interviewer (Pojok Bawah Kanan) */}
            <div className="w-full h-64 bg-canvas border border-hairline flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0">
              <div
                className={`w-16 h-16 bg-surface-1 border flex items-center justify-center mb-4 transition-none ${
                  aiSpeaking
                    ? "border-primary"
                    : "border-hairline"
                }`}
              >
                <span className="text-[20px] font-semibold text-ink">
                  AI
                </span>
              </div>
              <p className="text-[14px] font-semibold text-ink">
                Pewawancara AI
              </p>
              <p className="text-[12px] text-ink-muted mt-1">
                {aiSpeaking
                  ? "BERBICARA..."
                  : aiTyping
                    ? "MEMPROSES..."
                    : "MENDENGARKAN"}
              </p>

              {/* Caption overlay */}
              {currentCaption && (
                <div className="absolute bottom-0 left-0 right-0 bg-ink/90 p-3">
                  <p className="text-[12px] text-white text-center leading-[1.5]">
                    {currentCaption}
                  </p>
                </div>
              )}

              {/* Name tag */}
              <div className="absolute top-4 left-4 bg-surface-1 border border-hairline px-2 py-1">
                <p className="text-[10px] font-semibold text-ink">
                  Video AI
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── UPDATED CHAT PANEL ── */}
        {chatOpen && (
          <div className="absolute top-4 right-4 bottom-4 w-[calc(100%-32px)] sm:w-[400px] z-50 flex flex-col bg-canvas border border-hairline shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-1">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#0353e9] animate-pulse" />
                <p className="text-[14px] font-semibold text-ink">
                  Transkrip Langsung
                </p>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-[#e8e8e8] transition-none text-ink"
              >
                <X className="w-4 h-4" />
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
                  <span className="text-[12px] text-ink-muted mb-1 px-1">
                    {m.role === "user" ? userName : "Pewawancara AI"}
                  </span>
                  <div
                    className={`max-w-[85%] px-5 py-4 text-[14px] leading-[1.5] ${
                      m.role === "ai"
                        ? "bg-surface-1 border border-hairline text-ink"
                        : "bg-ink text-white"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {aiTyping && (
                <div className="flex flex-col items-start">
                  <span className="text-[12px] text-ink-muted mb-1 px-1">
                    Pewawancara AI
                  </span>
                  <div className="bg-surface-1 border border-hairline px-5 py-4">
                    <div className="flex gap-1.5">
                      {[0, 0.15, 0.3].map((d, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 bg-ink-muted animate-pulse"
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
            <div className="p-4 bg-surface-1 border-t border-hairline">
              <div className="flex items-end gap-2 bg-canvas border border-hairline focus-within:border-primary transition-none">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ketik balasan Anda..."
                  rows={1}
                  disabled={aiTyping}
                  className="flex-1 bg-transparent px-4 py-3 text-[14px] text-ink placeholder-ink-muted resize-none focus:outline-none min-h-[44px] max-h-[120px]"
                />
                <button
                  onClick={sendAnswer}
                  disabled={!input.trim() || aiTyping}
                  className="w-10 h-10 m-1 flex items-center justify-center bg-primary text-white hover:bg-[#0353e9] transition-none disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[12px] text-ink-muted mt-2 text-center">
                Tekan Enter untuk Mengirim
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom control bar */}
      <div className="flex-shrink-0 bg-canvas border-t border-hairline px-6 py-4 flex items-center justify-center gap-4">
        <button
          onClick={() => setMicOn((v) => !v)}
          className={`w-12 h-12 flex items-center justify-center border transition-none ${
            micOn
              ? "border-hairline text-ink hover:bg-surface-1"
              : "border-[#da1e28] bg-[#fff1f1] text-[#da1e28]"
          }`}
        >
          {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setCamOn((v) => !v)}
          className={`w-12 h-12 flex items-center justify-center border transition-none ${
            camOn
              ? "border-hairline text-ink hover:bg-surface-1"
              : "border-[#da1e28] bg-[#fff1f1] text-[#da1e28]"
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
          className={`w-12 h-12 flex items-center justify-center border transition-none ${
            chatOpen
              ? "border-primary bg-primary text-white"
              : "border-hairline text-ink hover:bg-surface-1"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-hairline mx-2" />
        <button
          onClick={() => setPhase("done")}
          className="w-12 h-12 flex items-center justify-center border border-[#da1e28] bg-[#da1e28] text-white hover:bg-[#ba1b23] transition-none"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}