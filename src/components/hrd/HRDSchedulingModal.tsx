import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Clock, Video, Users, Check } from "lucide-react";

interface HRDSchedulingModalProps {
  candidateName: string;
  onClose: () => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
];
const INTERVIEW_TYPES = [
  { id: "hr", label: "HR Interview", description: "Culture fit & behavioral", duration: "30 min" },
  { id: "technical", label: "Technical Interview", description: "Skills & system design", duration: "60 min" },
  { id: "case", label: "Case Study", description: "Problem-solving scenario", duration: "45 min" },
  { id: "panel", label: "Panel Interview", description: "Multi-stakeholder session", duration: "60 min" },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function HRDSchedulingModal({ candidateName, onClose }: HRDSchedulingModalProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [interviewers, setInterviewers] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<"type" | "date" | "details" | "done">("type");

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
    setSelectedDate(null); setSelectedTime(null);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
    setSelectedDate(null); setSelectedTime(null);
  };

  const isDisabled = (day: number) => {
    const d = new Date(currentYear, currentMonth, day);
    return d <= today || d.getDay() === 0 || d.getDay() === 6;
  };

  const formattedDate = selectedDate
    ? new Date(currentYear, currentMonth, selectedDate).toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
      })
    : "";

  const selectedTypeMeta = INTERVIEW_TYPES.find((t) => t.id === selectedType);

  if (step === "done") {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-10 w-full max-w-md text-center">
          <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Check className="w-7 h-7 text-zinc-900 dark:text-white" />
          </div>
          <h3 className="text-xl font-bold mb-1">Interview Scheduled</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
            Invitation sent to {candidateName}
          </p>
          <div className="space-y-2 text-left mb-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Type</span>
              <span className="font-medium">{selectedTypeMeta?.label}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Date</span>
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Time</span>
              <span className="font-medium">{selectedTime} WIB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Duration</span>
              <span className="font-medium">{selectedTypeMeta?.duration}</span>
            </div>
          </div>
          <button onClick={onClose} className="btn-primary mx-auto">Done</button>
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
            <h2 className="text-base font-bold">Schedule Interview</h2>
            <p className="text-xs text-zinc-400 mt-0.5">for {candidateName}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Step dots */}
            <div className="flex gap-1.5">
              {["type", "date", "details"].map((s, i) => (
                <div
                  key={s}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    ["type", "date", "details"].indexOf(step) >= i
                      ? "bg-zinc-900 dark:bg-white"
                      : "bg-zinc-200 dark:bg-zinc-700"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Type */}
          {step === "type" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {INTERVIEW_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                      selectedType === type.id
                        ? "border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Video className="w-3.5 h-3.5 text-zinc-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{type.label}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{type.description}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span className="text-xs text-zinc-400">{type.duration}</span>
                      </div>
                    </div>
                    {selectedType === type.id && (
                      <Check className="w-4 h-4 text-zinc-900 dark:text-white flex-shrink-0 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
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

          {/* Step 2: Date */}
          {step === "date" && (
            <div>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <p className="text-sm font-semibold">{MONTHS[currentMonth]} {currentYear}</p>
                    <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 mb-2">
                    {DAYS.map((d) => (
                      <div key={d} className="text-center text-xs text-zinc-400 font-medium py-1">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-y-1">
                    {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
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
                            selected ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                              : disabled ? "text-zinc-200 dark:text-zinc-700 cursor-not-allowed"
                              : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Time */}
                <div>
                  {selectedDate ? (
                    <>
                      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">Available Slots</p>
                      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                        {TIME_SLOTS.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                              selectedTime === time
                                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                                : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-zinc-400">Select a date</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800">
                <button onClick={() => setStep("type")} className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">Back</button>
                <button disabled={!selectedDate || !selectedTime} onClick={() => setStep("details")} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === "details" && (
            <div className="space-y-4">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Interview</span>
                  <span className="font-medium">{selectedTypeMeta?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Date</span>
                  <span className="font-medium">{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Time</span>
                  <span className="font-medium">{selectedTime} WIB · {selectedTypeMeta?.duration}</span>
                </div>
              </div>
              <div>
                <label className="label">Interviewers (optional)</label>
                <input
                  value={interviewers}
                  onChange={(e) => setInterviewers(e.target.value)}
                  placeholder="Add interviewer names or emails..."
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Notes for candidate</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Preparation tips, what to bring, etc..."
                  className="input-field resize-none"
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                <Users className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  A calendar invite and video link will be emailed to {candidateName} automatically.
                </p>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button onClick={() => setStep("date")} className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">Back</button>
                <button onClick={() => setStep("done")} className="btn-primary">Confirm & Send</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
