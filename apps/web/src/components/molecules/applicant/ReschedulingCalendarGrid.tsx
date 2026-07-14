import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS, DAYS } from "../../../lib/shared/calendar";

interface ReschedulingCalendarGridProps {
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

export function ReschedulingCalendarGrid({
  currentYear, currentMonth, daysInMonth, firstDay, selectedDate, onPrevMonth, onNextMonth, onSelectDate, isDisabled,
}: ReschedulingCalendarGridProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrevMonth} className="w-8 h-8 flex items-center justify-center border border-hairline hover:bg-surface-1 transition-none">
          <ChevronLeft className="w-4 h-4 text-ink" />
        </button>
        <p className="text-[14px] font-semibold text-ink">{MONTHS[currentMonth]} {currentYear}</p>
        <button onClick={onNextMonth} className="w-8 h-8 flex items-center justify-center border border-hairline hover:bg-surface-1 transition-none">
          <ChevronRight className="w-4 h-4 text-ink" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2 border-b border-hairline pb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[12px] text-ink-muted font-semibold uppercase">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mt-2">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const disabled = isDisabled(day);
          const selected = selectedDate === day;
          return (
            <button
              key={day}
              onClick={() => !disabled && onSelectDate(day)}
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
  );
}
