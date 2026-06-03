import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, User, Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface Message {
  id: string;
  sender: "ai" | "hrd";
  text: React.ReactNode;
  actions?: { label: string; onClick: () => void }[];
}

interface AIChatAssistantProps {
  onNavigateToCandidate: (candidateId: string) => void;
}

const DEFAULT_SUGGESTIONS = [
  "Analisis 3 kandidat teratas berdasarkan skor sistem",
  "Siapa kandidat dengan pengalaman kerja paling senior?",
  "Bandingkan kandidat paling senior vs skor tertinggi",
  "Adakah kandidat fresh graduate dengan inisiatif tinggi?",
  "Tampilkan statistik pelamar untuk posisi ini",
  "Kandidat mana yang sudah menunggu respons paling lama?"
];

export default function AIChatAssistant({ onNavigateToCandidate }: AIChatAssistantProps) {
  const { applications, currentUser, jobs } = useApp();
  
  // State for Job Context
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || "");
  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [availableSuggestions, setAvailableSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [showSuggestionsPanel, setShowSuggestionsPanel] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getInitialMessage = (jobTitle: string): Message => ({
    id: `welcome-${Date.now()}`,
    sender: "ai",
    text: (
      <>
        <p className="text-[16px] mb-2 font-medium">Halo, {currentUser?.name}!</p>
        <p className="text-[14px]">Saya Asisten AI Anda, siap membantu menganalisis kandidat untuk posisi <strong className="text-primary">{jobTitle}</strong>.</p>
        <br/>
        <p className="text-[14px]">Anda dapat menanyakan berbagai hal mulai dari perbandingan kandidat, pencarian skill spesifik, hingga laporan statistik rekrutmen.</p>
        <br/>
        <p className="text-[14px]">Ada yang ingin Anda cari hari ini?</p>
      </>
    ),
  });

  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize messages on mount or when job changes
  useEffect(() => {
    if (selectedJob) {
      setMessages([getInitialMessage(selectedJob.title)]);
      setAvailableSuggestions(DEFAULT_SUGGESTIONS);
      setShowSuggestionsPanel(true);
      setInput("");
      setIsTyping(false);
    }
  }, [selectedJobId]); // Only trigger when selectedJobId changes

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const findCandidateId = (nameQuery: string) => {
    const candidate = applications.find(a => a.applicantName.toLowerCase().includes(nameQuery.toLowerCase()));
    return candidate ? candidate.id : applications[0]?.id;
  };

  const handleActionClick = (candidateName: string) => {
    const id = findCandidateId(candidateName);
    if (id) {
      onNavigateToCandidate(id);
    }
  };

  const processResponse = (text: string) => {
    const lower = text.toLowerCase();
    let responseText: React.ReactNode = "";
    let actions: { label: string; onClick: () => void }[] = [];

    const jobTitle = selectedJob?.title || "Posisi";
    const reqs = selectedJob?.requirements || ["Teknis", "Analisis", "Manajemen"];
    const req1 = reqs[0] || "Skill A";
    const req2 = reqs[1] || "Skill B";
    const req3 = reqs[2] || "Skill C";
    const req4 = reqs[3] || "Skill D";

    // SKENARIO 1: Rekomendasi / Terbaik
    if (lower.match(/terbaik|paling cocok|rekomendasi|siapa yang bagus|3 kandidat teratas/)) {
      responseText = (
        <div className="text-[14px]">
          <p>Berdasarkan data screening CV dan hasil AI interview, berikut 3 kandidat teratas untuk posisi {jobTitle}:</p>
          <br/>
          <p>🥇 <strong>Doni Wijaya</strong></p>
          <p>Pengalaman 5 tahun — Keahlian {req1}, {req2}, {req3} semua Memenuhi Syarat — Komunikasi dinilai sangat baik di interview</p>
          <br/>
          <p>🥈 <strong>Andi Pratama</strong></p>
          <p>Pengalaman 6 tahun — Paling berpengalaman di antara semua kandidat — Catatan: ekspektasi gaji sedikit di atas batas, namun kompetensi {req2} sangat kuat</p>
          <br/>
          <p>🥉 <strong>Budi Santoso</strong></p>
          <p>Pengalaman 4 tahun — Keahlian teknis solid di {req1} — Komunikasi dinilai baik</p>
          <br/>
          <p>Ingin melihat detail salah satu dari mereka, atau ingin saya bandingkan lebih lanjut?</p>
        </div>
      );
      actions = [
        { label: "Lihat Detail Doni", onClick: () => handleActionClick("Doni") },
        { label: "Lihat Detail Andi", onClick: () => handleActionClick("Andi") },
        { label: "Bandingkan Doni & Andi", onClick: () => handleSend("Bandingkan kandidat paling senior vs skor tertinggi") }
      ];
    }
    // SKENARIO 2: Pengalaman
    else if (lower.match(/pengalaman paling banyak|paling senior|paling lama bekerja/)) {
      responseText = (
        <div className="text-[14px]">
          <p>Kandidat dengan pengalaman kerja terbanyak untuk {jobTitle} adalah:</p>
          <br/>
          <p>👤 <strong>Andi Pratama</strong></p>
          <p>6 tahun pengalaman profesional di perusahaan nasional berskala besar. Pernah memimpin tim kecil dan berpengalaman menangani operasional kompleks.</p>
          <br/>
          <p>Satu catatan: ekspektasi gaji Andi sedikit di atas batas yang ditetapkan. Namun mengingat pengalamannya dalam hal {req2}, Anda mungkin ingin mempertimbangkannya.</p>
          <br/>
          <p>Ingin melihat profil lengkap Andi atau membandingkannya dengan kandidat lain?</p>
        </div>
      );
      actions = [
        { label: "Lihat Profil Andi", onClick: () => handleActionClick("Andi") },
        { label: "Bandingkan dengan skor tertinggi", onClick: () => handleSend("Bandingkan kandidat paling senior vs skor tertinggi") }
      ];
    }
    // SKENARIO 3: Komunikasi / Soft Skill
    else if (lower.match(/komunikasi|komunikasinya bagus|lancar ngomong|soft skill/)) {
      responseText = (
        <div className="text-[14px]">
          <p>Berdasarkan hasil AI interview, berikut kandidat yang dinilai memiliki komunikasi terbaik untuk peran {jobTitle}:</p>
          <br/>
          <p>⭐ <strong>Doni Wijaya</strong> — Komunikasi sangat baik, sangat komprehensif dan detail dalam menjelaskan studi kasus</p>
          <p>⭐ <strong>Andi Pratama</strong> — Komunikasi sangat baik, menjawab dengan contoh kasus nyata dari pengalaman kerja</p>
          <p>⭐ <strong>Rina Kusuma</strong> — Komunikasi sangat baik, antusias dan inisiatif tinggi meski pengalaman lebih sedikit</p>
          <br/>
          <p>Ketiganya menunjukkan kemampuan komunikasi yang solid. Ingin saya filter lebih lanjut berdasarkan {req1}?</p>
        </div>
      );
    }
    // SKENARIO 4: Perbandingan
    else if (lower.match(/bandingkan|compare|vs/)) {
      if (lower.includes("budi") || lower.includes("rina") || lower.includes("fresh graduate")) {
        responseText = (
          <div className="text-[14px]">
            <p>Berikut perbandingan <strong>Budi Santoso vs Rina Kusuma</strong> untuk posisi {jobTitle}:</p>
            <br/>
            <p className="font-semibold">PENGALAMAN KERJA</p>
            <p><strong>Budi:</strong> 4 tahun pengalaman, pernah magang di 2 tempat, mengerjakan 3 proyek menengah</p>
            <p><strong>Rina:</strong> 2 tahun pengalaman, fresh graduate, aktif di kegiatan kepanitiaan/komunitas</p>
            <br/>
            <p className="font-semibold">KEAHLIAN INTI</p>
            <p><strong>Budi:</strong> {req1} ✓ {req2} ✓ {req3} ✓ {req4 || 'Skill lain'} perlu dikembangkan</p>
            <p><strong>Rina:</strong> {req1} ✓ {req2} perlu dikembangkan ✓ {req3} ✓ Antusiasme tinggi</p>
            <br/>
            <p className="font-semibold">HASIL AI INTERVIEW</p>
            <p><strong>Budi:</strong> Komunikasi baik, menjawab pertanyaan substansial dengan percaya diri</p>
            <p><strong>Rina:</strong> Komunikasi sangat baik, inisiatif tinggi, logika bagus meski pengalaman praktik kurang mendalam</p>
            <br/>
            <p className="font-semibold">KECOCOKAN KESELURUHAN</p>
            <p><strong>Budi:</strong> Lebih kuat di pemahaman {req1} dan pengalaman kerja nyata</p>
            <p><strong>Rina:</strong> Lebih kuat di komunikasi dan potensi berkembang jangka panjang</p>
            <br/>
            <p>Pilihan tergantung prioritas Anda — kandidat yang langsung produktif (Budi) atau kandidat berpotensi jangka panjang (Rina).</p>
          </div>
        );
      } else {
        responseText = (
          <div className="text-[14px]">
            <p>Berikut perbandingan <strong>Doni Wijaya (Skor Tertinggi) vs Andi Pratama (Paling Senior)</strong> untuk posisi {jobTitle}:</p>
            <br/>
            <p className="font-semibold">PENGALAMAN KERJA</p>
            <p><strong>Doni:</strong> 5 tahun, ex-multinasional, spesialis dalam {req1}</p>
            <p><strong>Andi:</strong> 6 tahun, pernah memimpin tim, ekspertis di operasional skala besar</p>
            <br/>
            <p className="font-semibold">KEAHLIAN INTI</p>
            <p><strong>Doni:</strong> {req1} ✓ {req2} ✓ {req3} ✓ — semua Memenuhi Syarat</p>
            <p><strong>Andi:</strong> {req2} ✓ {req3} ✓ {req1} perlu dikembangkan di beberapa aspek spesifik</p>
            <br/>
            <p className="font-semibold">HASIL AI INTERVIEW</p>
            <p><strong>Doni:</strong> Sangat komprehensif, menjawab sempurna, analitis</p>
            <p><strong>Andi:</strong> Sangat berpengalaman, menjawab dengan kasus kepemimpinan nyata, sangat percaya diri</p>
            <br/>
            <p className="font-semibold">CATATAN PENTING</p>
            <p><strong>Doni:</strong> Ekspektasi gaji dalam batas yang ditetapkan</p>
            <p><strong>Andi:</strong> Ekspektasi gaji sedikit di atas batas — namun kompetensi manajerial paling kuat</p>
            <br/>
            <p><strong>Rekomendasi AI:</strong> Doni untuk eksekusi {req1} yang cepat, Andi jika Anda membutuhkan sosok pemimpin dan mentor.</p>
          </div>
        );
      }
    }
    // SKENARIO 5: Statistik
    else if (lower.match(/berapa|statistik|total|sudah berapa|progress/)) {
      responseText = (
        <div className="text-[14px]">
          <p>Berikut ringkasan statistik rekrutmen untuk posisi {jobTitle}:</p>
          <br/>
          <p>📊 Total pelamar: 5 kandidat</p>
          <p>✅ Sudah selesai AI interview: 5 kandidat (100%)</p>
          <p>🟢 Memenuhi Syarat: 4 kandidat</p>
          <p>🟡 Perlu Dikembangkan: 1 kandidat</p>
          <p>⏳ Menunggu keputusan HRD: 5 kandidat</p>
          <br/>
          <p>⚠️ <strong>Perhatian:</strong> Andi Pratama sudah menunggu 8 hari tanpa respons. Kandidat ini memiliki pengalaman terkuat. Disarankan untuk segera ditindaklanjuti.</p>
        </div>
      );
    }
    // SKENARIO 6: Fresh Graduate
    else if (lower.match(/fresh graduate|baru lulus|junior|entry level/)) {
      responseText = (
        <div className="text-[14px]">
          <p>Dari daftar kandidat saat ini untuk {jobTitle}, berikut yang masuk kategori fresh graduate atau junior:</p>
          <br/>
          <p>👤 <strong>Rina Kusuma</strong></p>
          <p>Baru lulus sarjana. Meski pengalaman 2 tahun, aktif berkontribusi di komunitas dan komunikasi dinilai sangat baik dalam hal {req3}.</p>
          <br/>
          <p>👤 <strong>Siti Rahayu</strong></p>
          <p>Baru lulus, pengalaman terbatas di proyek kampus. Saat ini masuk kategori Perlu Dikembangkan untuk menguasai {req1}.</p>
          <br/>
          <p>Berdasarkan requirement {jobTitle}, Rina lebih siap dibanding Siti karena inisiatifnya yang menonjol.</p>
        </div>
      );
    }
    // SKENARIO 7: Lama Menunggu / SLA
    else if (lower.match(/sudah lama menunggu|belum direspons|ghosting|yang pending lama|paling lama/)) {
      responseText = (
        <div className="text-[14px]">
          <p>Berikut kandidat yang sudah lama menunggu respons dari Anda untuk posisi {jobTitle}:</p>
          <br/>
          <p>⚠️ <strong>Andi Pratama — 8 hari</strong></p>
          <p>Kandidat dengan pengalaman terkuat (6 tahun). Disarankan segera ditindaklanjuti.</p>
          <br/>
          <p>⏳ <strong>Rina Kusuma — 5 hari</strong></p>
          <p>Kandidat dengan komunikasi terbaik. Menunggu keputusan.</p>
          <br/>
          <p>⏳ <strong>Budi Santoso — 3 hari</strong></p>
          <p>Kandidat dengan {req1} solid. Menunggu keputusan.</p>
          <br/>
          <p>Memberikan kepastian kepada kandidat adalah nilai utama platform ini. Apakah Anda ingin saya tampilkan profil lengkap salah satu dari mereka?</p>
        </div>
      );
      actions = [
        { label: "Lihat Detail Andi", onClick: () => handleActionClick("Andi") },
        { label: "Lihat Detail Rina", onClick: () => handleActionClick("Rina") },
        { label: "Lihat Detail Budi", onClick: () => handleActionClick("Budi") }
      ];
    }
    // SKENARIO 8: Default
    else {
      responseText = (
        <div className="text-[14px]">
          <p>Maaf, saya belum menemukan data pasti terkait hal itu untuk posisi {jobTitle}. Saya bisa membantu Anda dengan pertanyaan analisis yang lebih tajam:</p>
          <ul className="list-disc pl-4 mt-2 mb-2">
            <li>Membandingkan kandidat senior vs potensi junior</li>
            <li>Mengidentifikasi celah skill seperti {req2}</li>
            <li>Melihat statistik progress kandidat</li>
            <li>Menemukan kandidat dengan risiko tinggi (terlalu lama menunggu)</li>
          </ul>
          <p>Coba pilih salah satu saran pertanyaan di atas bar pengetikan.</p>
        </div>
      );
    }

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: "ai",
      text: responseText,
      actions: actions.length > 0 ? actions : undefined
    }]);
    setIsTyping(false);
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Remove the clicked text from suggestions if it exists
    setAvailableSuggestions(prev => prev.filter(s => s !== text));

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: "hrd",
      text: <div className="text-[14px]">{text}</div>
    }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      processResponse(text);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-canvas font-sans w-full relative">
      
      {/* Job Context Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-canvas/80 backdrop-blur-sm border-b border-hairline py-3 px-6 flex justify-center items-center gap-4">
        <span className="text-[13px] font-semibold text-ink-muted uppercase tracking-wider flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Konteks Lowongan:
        </span>
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="bg-surface-1 border border-hairline text-ink text-[14px] py-1.5 px-3 rounded-md focus:border-primary focus:outline-none min-w-[250px]"
        >
          {jobs.map(j => (
            <option key={j.id} value={j.id}>{j.title}</option>
          ))}
        </select>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pb-36 pt-20 w-full">
        <div className="max-w-3xl mx-auto w-full px-6 flex flex-col gap-8">
          
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-6 animate-in fade-in duration-500 w-full group">
              {/* Avatar */}
              <div className="flex-shrink-0 mt-1">
                {msg.sender === "ai" ? (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-surface-1 border border-hairline flex items-center justify-center font-semibold text-ink text-[14px]">
                    {currentUser?.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                  </div>
                )}
              </div>
              
              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="text-ink font-semibold mb-1 text-[14px]">
                  {msg.sender === "ai" ? "Direkrut AI" : currentUser?.name || "Anda"}
                </div>
                
                <div className="text-ink text-[14px] leading-relaxed">
                  {msg.text}
                </div>

                {/* Action Buttons */}
                {msg.actions && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {msg.actions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={action.onClick}
                        className="btn-secondary py-2 px-4 text-[13px] flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-6 animate-in fade-in w-full">
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-ink font-semibold mb-1 text-[14px]">Direkrut AI</div>
                <div className="flex items-center gap-1.5 h-6">
                  <div className="w-2 h-2 bg-ink-muted rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-ink-muted rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-ink-muted rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Sticky Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-canvas via-canvas to-transparent pt-10 pb-6 px-6">
        <div className="max-w-3xl mx-auto w-full relative">
          
          {/* Dynamic Suggestion Chips Toggle */}
          {!isTyping && availableSuggestions.length > 0 && (
            <div className="flex justify-end mb-2">
              <button 
                onClick={() => setShowSuggestionsPanel(!showSuggestionsPanel)}
                className="flex items-center gap-1 text-[11px] text-ink-muted hover:text-primary transition-none"
              >
                {showSuggestionsPanel ? (
                  <>Sembunyikan Saran <ChevronDown className="w-3 h-3" /></>
                ) : (
                  <>Tampilkan Saran <ChevronUp className="w-3 h-3" /></>
                )}
              </button>
            </div>
          )}

          {/* Dynamic Suggestion Chips */}
          {!isTyping && availableSuggestions.length > 0 && showSuggestionsPanel && (
            <div className="flex flex-wrap gap-2 mb-4 animate-in slide-in-from-bottom-2">
              {availableSuggestions.map((suggestion, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSend(suggestion)}
                  className="bg-surface-1 border border-hairline hover:border-primary text-ink text-[12px] py-2 px-3 rounded-full transition-none text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Text Input */}
          <div className="relative shadow-sm rounded-lg border border-[#c6c6c6] bg-white overflow-hidden flex items-end">
            <textarea
              placeholder={`Tanyakan tentang kandidat untuk ${selectedJob?.title}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              rows={1}
              className="w-full resize-none bg-transparent py-4 pl-4 pr-12 text-[14px] text-ink focus:outline-none min-h-[56px] max-h-[200px]"
              style={{ overflowY: input.split('\n').length > 1 ? 'auto' : 'hidden' }}
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 bottom-2 p-2 bg-primary text-white rounded hover:bg-[#0353e9] disabled:bg-[#e0e0e0] disabled:text-[#8d8d8d] transition-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-center mt-3">
            <span className="text-[11px] text-ink-muted">
              AI dapat melakukan kesalahan. Harap selalu memverifikasi informasi kandidat secara mandiri.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
