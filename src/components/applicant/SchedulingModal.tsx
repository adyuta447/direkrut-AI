import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Clock, Video, Users, Check } from "lucide-react";

interface SchedulingModalProps {
  onClose: () => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30",
];

const INTERVIEW_TYPES = [
  {
    id: "technical",
    label: "Technical Interview",
    description: "Deep-dive coding & system design",
    duration: "60 min",
    icon: "💻",
  },
  {
    id: "cultural",
    label: "Culture Fit",
    description: "Team values & working style",
    duration: "30 min",
    icon: "🤝",
  },
  {
    id: "case",
    label: "Case Study",
    description: "Problem-solving scenario",
    duration: "45 min",
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
    ? new Date(currentYear, currentMonth, selectedDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const selectedTypeMeta = INTERVIEW_TYPES.find((t) => t.id === selectedType);

  if (step === "done") {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-10 w-full max-w-md text-center">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Check className="w-7 h-7 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Interview Scheduled!</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
            {selectedTypeMeta?.label}
          </p>
          <p className="text-sm font-medium">{formatted}</p>
          <p className="text-sm text-zinc-400">{selectedTime}</p>
          <p className="text-xs text-zinc-400 mt-5 mb-6">
            A calendar invite has been sent to your email. The meeting link will be
            available 15 minutes before the session.
          </p>
          <button
            onClick={onClose}
            className="btn-primary mx-auto"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-semibold">Schedule Interview</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {step === "type" ? "Select interview type" : step === "date" ? "Choose date & time" : "Confirm booking"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-zinc-500" />
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
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    selectedType === type.id
                      ? "border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Video className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{type.label}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{type.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 flex-shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {type.duration}
                  </div>
                  {selectedType === type.id && (
                    <Check className="w-4 h-4 text-zinc-900 dark:text-white flex-shrink-0" />
                  )}
                </button>
              ))}
              <div className="flex justify-end mt-4">
                <button
                  disabled={!selectedType}
                  onClick={() => setStep("date")}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
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
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <p className="text-sm font-semibold">
                      {MONTHS[currentMonth]} {currentYear}
                    </p>
                    <button
                      onClick={nextMonth}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 mb-2">
                    {DAYS.map((d) => (
                      <div key={d} className="text-center text-xs text-zinc-400 font-medium py-1">
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-y-1">
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
                          className={`h-9 w-full flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                            selected
                              ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                              : disabled
                              ? "text-zinc-200 dark:text-zinc-700 cursor-not-allowed"
                              : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                <div>
                  {selectedDate ? (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
                        Available Times
                      </p>
                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                        {TIME_SLOTS.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                              selectedTime === time
                                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                                : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-500"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-zinc-400">Select a date first</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => setStep("type")}
                  className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  Back
                </button>
                <button
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep("confirm")}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Review Booking
                </button>
              </div>
            </div>
          )}

          {/* Step: Confirm */}
          {step === "confirm" && (
            <div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <Video className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-zinc-400">Interview Type</p>
                    <p className="text-sm font-semibold">{selectedTypeMeta?.label}</p>
                    <p className="text-xs text-zinc-400">{selectedTypeMeta?.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <Clock className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-zinc-400">Date & Time</p>
                    <p className="text-sm font-semibold">{formatted}</p>
                    <p className="text-xs text-zinc-400">{selectedTime} WIB</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <Users className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-zinc-400">Format</p>
                    <p className="text-sm font-semibold">Video Call</p>
                    <p className="text-xs text-zinc-400">Link sent 15 min before</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => setStep("date")}
                  className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("done")}
                  className="btn-primary"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
