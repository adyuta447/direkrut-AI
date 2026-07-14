import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS, DAYS } from "../../../lib/hrd/useHrdSchedulingModal";

interface HrdSchedulingCalendarGridProps {
  currentYear: number;
  currentMonth: number;
  daysInMonth: number;
  firstDay: number;
  selectedDate: number | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (day: number) => void;
  isDisabled: (day: number) => boolean;
}

export function HrdSchedulingCalendarGrid({
  currentYear, currentMonth, daysInMonth, firstDay, selectedDate, onPrevMonth, onNextMonth, onSelectDate, isDisabled,
}: HrdSchedulingCalendarGridProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <p className="text-sm font-semibold">{MONTHS[currentMonth]} {currentYear}</p>
        <button onClick={onNextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
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
              onClick={() => !disabled && onSelectDate(day)}
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
  );
}
