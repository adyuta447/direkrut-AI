import { useState } from "react";
import { Calendar as CalendarIcon, Clock, ArrowRight, Video, CheckCircle2 } from "lucide-react";

interface SchedulingPageProps {
  onNext: (view: "ai-practice") => void;
}

export default function SchedulingPage({ onNext }: SchedulingPageProps) {
  // Generate dates: today up to 7 days in the future
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      
      const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
      const dateNum = d.getDate();
      const monthName = d.toLocaleDateString('id-ID', { month: 'short' });
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      
      dates.push({
        dateObj: d,
        dayName,
        dateNum,
        monthName,
        isWeekend,
        id: `date-${i}`
      });
    }
    return dates;
  };

  const availableDates = generateDates();
  
  // Available timeslots
  const timeSlots = [
    "09:00", "10:30", "11:00", "13:00", "14:30", "15:00", "16:30"
  ];

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      setIsScheduled(true);
    }
  };

  if (isScheduled) {
    return (
      <div className="h-full flex flex-col justify-center items-center p-6 lg:p-12 animate-in fade-in">
        <div className="w-20 h-20 bg-[#defbe6] text-[#198038] flex items-center justify-center mb-6 border border-[#198038]">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-[32px] font-light text-ink tracking-[-0.5px] mb-4 text-center">
          Wawancara AI Berhasil Dijadwalkan
        </h2>
        <p className="text-[16px] text-ink-muted text-center max-w-xl mb-8 leading-[1.5]">
          Sesi wawancara asinkron Anda telah dikonfirmasi. Tautan dan instruksi akses akan dikirimkan ke email Anda. Pastikan Anda menyiapkan koneksi internet yang stabil dan ruangan yang tenang.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
           <button 
             onClick={() => onNext("ai-practice")}
             className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-[14px]"
           >
             Mulai Wawancara Sekarang
             <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-12 font-sans flex flex-col max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-[32px] font-light text-ink tracking-[-0.5px] mb-2">
          Jadwal Wawancara AI
        </h2>
        <p className="text-[16px] text-ink-muted leading-[1.5]">
          Pilih waktu luang Anda untuk melakukan sesi wawancara asinkron. Harap pastikan jadwal yang Anda pilih berada dalam rentang waktu seleksi yang kami sediakan.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-canvas border border-hairline p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-semibold text-ink flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Pilih Tanggal
            </h3>
            <span className="text-[12px] text-ink-muted uppercase">Tersedia {availableDates.length} Hari</span>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {availableDates.map((d) => (
              <button
                key={d.id}
                disabled={d.isWeekend}
                onClick={() => setSelectedDate(d.id)}
                className={`p-3 border text-center transition-none flex flex-col items-center justify-center gap-1 ${
                  d.isWeekend 
                    ? "bg-surface-1 border-hairline opacity-50 cursor-not-allowed"
                    : selectedDate === d.id
                      ? "border-primary bg-[#e5f6ff] text-primary shadow-[inset_0_0_0_1px_#0f62fe]"
                      : "border-hairline bg-canvas hover:border-primary text-ink"
                }`}
              >
                <span className={`text-[11px] font-semibold uppercase ${d.isWeekend ? 'text-ink-muted' : (selectedDate === d.id ? 'text-primary' : 'text-ink-muted')}`}>
                  {d.dayName}
                </span>
                <span className={`text-[20px] font-light ${d.isWeekend ? 'text-ink-muted' : (selectedDate === d.id ? 'text-primary' : 'text-ink')}`}>
                  {d.dateNum}
                </span>
                <span className={`text-[11px] font-semibold uppercase ${d.isWeekend ? 'text-ink-muted' : (selectedDate === d.id ? 'text-primary' : 'text-ink-muted')}`}>
                  {d.monthName}
                </span>
              </button>
            ))}
          </div>
          
          <div className="mt-8 border-t border-hairline pt-6">
            <h3 className="text-[16px] font-semibold text-ink flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              Pilih Waktu (Zona Waktu Anda)
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  disabled={!selectedDate}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 border text-[14px] transition-none ${
                    !selectedDate
                      ? "bg-surface-1 border-hairline text-ink-muted opacity-50 cursor-not-allowed"
                      : selectedTime === time
                        ? "border-primary bg-[#e5f6ff] text-primary font-semibold shadow-[inset_0_0_0_1px_#0f62fe]"
                        : "border-hairline bg-canvas hover:border-primary text-ink"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right side panel */}
        <div className="flex flex-col gap-6">
           <div className="bg-surface-1 border border-hairline p-6 flex flex-col justify-between flex-1">
             <div>
               <p className="text-[12px] font-semibold text-ink-muted uppercase tracking-widest mb-4">Ringkasan Jadwal</p>
               
               <div className="space-y-4 mb-8">
                 <div className="flex justify-between items-center border-b border-hairline pb-2">
                   <span className="text-[14px] text-ink-muted">Tanggal:</span>
                   <span className="text-[14px] font-semibold text-ink">
                     {selectedDate ? availableDates.find(d => d.id === selectedDate)?.dateObj.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Belum dipilih"}
                   </span>
                 </div>
                 <div className="flex justify-between items-center border-b border-hairline pb-2">
                   <span className="text-[14px] text-ink-muted">Waktu:</span>
                   <span className="text-[14px] font-semibold text-ink">
                     {selectedTime ? `${selectedTime} WIB` : "Belum dipilih"}
                   </span>
                 </div>
                 <div className="flex justify-between items-center border-b border-hairline pb-2">
                   <span className="text-[14px] text-ink-muted">Durasi Estimasi:</span>
                   <span className="text-[14px] font-semibold text-ink">30 Menit</span>
                 </div>
               </div>
             </div>

             <div className="space-y-3">
               <button 
                 disabled={!selectedDate || !selectedTime}
                 onClick={handleSchedule}
                 className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
               >
                 Jadwalkan Wawancara
                 <ArrowRight className="w-4 h-4" />
               </button>
             </div>
           </div>

           <div className="bg-[#e5f6ff] border border-[#0f62fe] p-6 text-center flex flex-col items-center">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3">
               <Video className="w-6 h-6 text-primary" />
             </div>
             <p className="text-[16px] font-semibold text-ink mb-2">
               Siap lebih awal?
             </p>
             <p className="text-[14px] text-ink leading-[1.5] mb-6">
               Anda tidak perlu menunggu. Jika Anda sudah siap sekarang, Anda bisa langsung memulai sesi wawancara asinkron Anda.
             </p>
             <button 
               onClick={() => onNext("ai-practice")}
               className="text-[14px] font-normal border border-primary bg-white text-primary px-6 py-3 hover:bg-primary hover:text-white transition-none w-full"
             >
               Mulai Wawancara Sekarang
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
