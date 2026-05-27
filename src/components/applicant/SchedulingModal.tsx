import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Clock, Video, Users, Check } from "lucide-react";

interface SchedulingModalProps {
  onClose: () => void;
}

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const DAYS = ["Mg", "Sn", "Sl", "Rb", "Km", "Jm", "Sb"];

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30",
];

const INTERVIEW_TYPES = [
  {
    id: "technical",
    label: "Wawancara Teknis",
    description: "Deep-dive coding & system design",
    duration: "60 mnt",
    icon: "💻",
  },
  {
    id: "cultural",
    label: "Kecocokan Budaya",
    description: "Nilai tim & gaya bekerja",
    duration: "30 mnt",
    icon: "🤝",
  },
  {
    id: "case",
    label: "Studi Kasus",
    description: "Skenario pemecahan masalah",
    duration: "45 mnt",
    icon: "📋",
  },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function SchedulingModal({ onClose }: SchedulingModalProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [step, setStep] = useState<"type" | "date" | "confirm" | "done">("type");

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const isDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return date < today || date.getDay() === 0 || date.getDay() === 6;
  };

  const formatted = selectedDate
    ? new Date(currentYear, currentMonth, selectedDate).toLocaleDateString("id-ID", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const selectedTypeMeta = INTERVIEW_TYPES.find((t) => t.id === selectedType);

  if (step === "done") {
    return (
      <div className="fixed inset-0 bg-[#393939]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-canvas border border-hairline p-10 w-full max-w-md text-center">
          <div className="w-14 h-14 bg-[#defbe6] flex items-center justify-center mx-auto mb-5 border border-hairline">
            <Check className="w-7 h-7 text-[#198038]" />
          </div>
          <h3 className="text-[24px] font-normal mb-2 text-ink">Wawancara Terjadwal!</h3>
          <p className="text-[14px] text-ink-muted mb-2">
            {selectedTypeMeta?.label}
          </p>
          <p className="text-[14px] font-semibold text-ink">{formatted}</p>
          <p className="text-[14px] text-ink-muted">{selectedTime}</p>
          <p className="text-[12px] text-ink-muted mt-5 mb-6 leading-[1.5]">
            Undangan kalender telah dikirim ke email Anda. Tautan pertemuan akan 
            tersedia 15 menit sebelum sesi dimulai.
          </p>
          <button
            onClick={onClose}
            className="btn-primary mx-auto"
          >
            Kembali ke Dasbor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#393939]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-canvas border border-hairline w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-hairline bg-surface-1">
          <div>
            <h2 className="text-[16px] font-semibold text-ink">Jadwalkan Wawancara</h2>
            <p className="text-[12px] text-ink-muted mt-0.5 uppercase tracking-widest">
              {step === "type" ? "Pilih tipe wawancara" : step === "date" ? "Pilih tanggal & waktu" : "Konfirmasi pemesanan"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-hairline hover:bg-canvas transition-none"
          >
            <X className="w-4 h-4 text-ink" />
          </button>
        </div>

        <div className="p-6">
          {/* Step: Type */}
          {step === "type" && (
            <div className="space-y-3">
              {INTERVIEW_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`w-full flex items-center gap-4 p-4 border text-left transition-none ${
                    selectedType === type.id
                      ? "border-primary bg-[#e5f6ff]"
                      : "border-hairline hover:bg-surface-1"
                  }`}
                >
                  <div className="w-10 h-10 bg-canvas border border-hairline flex items-center justify-center flex-shrink-0">
                    <Video className="w-4 h-4 text-ink-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-ink">{type.label}</p>
                    <p className="text-[12px] text-ink-muted mt-0.5">{type.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-ink-muted flex-shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {type.duration}
                  </div>
                  {selectedType === type.id && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
              <div className="flex justify-end mt-4">
                <button
                  disabled={!selectedType}
                  onClick={() => setStep("date")}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Lanjutkan
                </button>
              </div>
            </div>
          )}

          {/* Step: Date */}
          {step === "date" && (
            <div>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={prevMonth}
                      className="w-8 h-8 flex items-center justify-center border border-hairline hover:bg-surface-1 transition-none"
                    >
                      <ChevronLeft className="w-4 h-4 text-ink" />
                    </button>
                    <p className="text-[14px] font-semibold text-ink">
                      {MONTHS[currentMonth]} {currentYear}
                    </p>
                    <button
                      onClick={nextMonth}
                      className="w-8 h-8 flex items-center justify-center border border-hairline hover:bg-surface-1 transition-none"
                    >
                      <ChevronRight className="w-4 h-4 text-ink" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 mb-2 border-b border-hairline pb-2">
                    {DAYS.map((d) => (
                      <div key={d} className="text-center text-[12px] text-ink-muted font-semibold uppercase">
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 mt-2">
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                      const day = idx + 1;
                      const disabled = isDisabled(day);
                      const selected = selectedDate === day;
                      return (
                        <button
                          key={day}
                          onClick={() => !disabled && setSelectedDate(day)}
                          disabled={disabled}
                          className={`h-9 w-full flex items-center justify-center text-[14px] transition-none border ${
                            selected
                              ? "bg-primary text-white border-primary"
                              : disabled
                              ? "text-ink-muted cursor-not-allowed border-transparent opacity-50"
                              : "hover:bg-surface-1 text-ink border-transparent hover:border-hairline"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                <div className="border-l border-hairline pl-6">
                  {selectedDate ? (
                    <>
                      <p className="text-[12px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
                        Waktu Tersedia
                      </p>
                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
                        {TIME_SLOTS.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 px-4 text-[14px] transition-none border ${
                              selectedTime === time
                                ? "bg-primary text-white border-primary"
                                : "border-hairline text-ink hover:bg-surface-1"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-[14px] text-ink-muted">Pilih tanggal terlebih dahulu</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-5 border-t border-hairline">
                <button
                  onClick={() => setStep("type")}
                  className="text-[14px] text-ink-muted hover:text-ink transition-none"
                >
                  Kembali
                </button>
                <button
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep("confirm")}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Tinjau Jadwal
                </button>
              </div>
            </div>
          )}

          {/* Step: Confirm */}
          {step === "confirm" && (
            <div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-4 bg-surface-1 border border-hairline">
                  <Video className="w-4 h-4 text-ink-muted flex-shrink-0" />
                  <div>
                    <p className="text-[12px] text-ink-muted uppercase">Tipe Wawancara</p>
                    <p className="text-[14px] font-semibold text-ink">{selectedTypeMeta?.label}</p>
                    <p className="text-[12px] text-ink-muted">{selectedTypeMeta?.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-surface-1 border border-hairline">
                  <Clock className="w-4 h-4 text-ink-muted flex-shrink-0" />
                  <div>
                    <p className="text-[12px] text-ink-muted uppercase">Tanggal & Waktu</p>
                    <p className="text-[14px] font-semibold text-ink">{formatted}</p>
                    <p className="text-[12px] text-ink-muted">{selectedTime} WIB</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-surface-1 border border-hairline">
                  <Users className="w-4 h-4 text-ink-muted flex-shrink-0" />
                  <div>
                    <p className="text-[12px] text-ink-muted uppercase">Format</p>
                    <p className="text-[14px] font-semibold text-ink">Panggilan Video</p>
                    <p className="text-[12px] text-ink-muted">Tautan dikirim 15 menit sebelumnya</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-hairline">
                <button
                  onClick={() => setStep("date")}
                  className="text-[14px] text-ink-muted hover:text-ink transition-none"
                >
                  Kembali
                </button>
                <button
                  onClick={() => setStep("done")}
                  className="btn-primary"
                >
                  Konfirmasi Jadwal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
