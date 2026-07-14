import { TIME_SLOTS } from "../../../lib/hrd/useHrdSchedulingModal";
import { HrdSchedulingCalendarGrid } from "./HrdSchedulingCalendarGrid";

interface HrdSchedulingDateStepProps {
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

export function HrdSchedulingDateStep({
  currentYear, currentMonth, daysInMonth, firstDay, selectedDate, selectedTime,
  onPrevMonth, onNextMonth, onSelectDate, onSelectTime, isDisabled, onBack, onContinue,
}: HrdSchedulingDateStepProps) {
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6">
        <HrdSchedulingCalendarGrid
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
        <div>
          {selectedDate ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">Available Slots</p>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => onSelectTime(time)}
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
        <button onClick={onBack} className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">Back</button>
        <button disabled={!selectedDate || !selectedTime} onClick={onContinue} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
          Continue
        </button>
      </div>
    </div>
  );
}
