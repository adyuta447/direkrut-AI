import { TIME_SLOTS } from "../../../lib/applicant/useReschedulingModal";
import { ReschedulingCalendarGrid } from "./ReschedulingCalendarGrid";

interface ReschedulingDateStepProps {
  currentYear: number;
  currentMonth: number;
  daysInMonth: number;
  firstDay: number;
  selectedDate: number | null;
  selectedTime: string | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (day: number) => void;
  onSelectTime: (time: string) => void;
  isDisabled: (day: number) => boolean;
  onBack: () => void;
  onContinue: () => void;
}

export function ReschedulingDateStep({
  currentYear, currentMonth, daysInMonth, firstDay, selectedDate, selectedTime,
  onPrevMonth, onNextMonth, onSelectDate, onSelectTime, isDisabled, onBack, onContinue,
}: ReschedulingDateStepProps) {
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6">
        <ReschedulingCalendarGrid
          currentYear={currentYear}
          currentMonth={currentMonth}
          daysInMonth={daysInMonth}
          firstDay={firstDay}
          selectedDate={selectedDate}
          onPrevMonth={onPrevMonth}
          onNextMonth={onNextMonth}
          onSelectDate={onSelectDate}
          isDisabled={isDisabled}
        />

        <div className="border-l border-hairline pl-6">
          {selectedDate ? (
            <>
              <p className="text-[12px] font-semibold uppercase tracking-widest text-ink-muted mb-3">Waktu Tersedia</p>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => onSelectTime(time)}
                    className={`py-2 px-4 text-[14px] transition-none border ${
                      selectedTime === time ? "bg-primary text-white border-primary" : "border-hairline text-ink hover:bg-surface-1"
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
        <button onClick={onBack} className="text-[14px] text-ink-muted hover:text-ink transition-none">Kembali</button>
        <button
          disabled={!selectedDate || !selectedTime}
          onClick={onContinue}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Tinjau Jadwal
        </button>
      </div>
    </div>
  );
}
