import { Calendar as CalendarIcon } from "lucide-react";
import { ScheduleDate } from "../../../lib/applicant/useScheduling";

interface DatePickerProps {
  dates: ScheduleDate[];
  selectedDate: string | null;
  onSelect: (id: string) => void;
}

export function DatePicker({ dates, selectedDate, onSelect }: DatePickerProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[16px] font-semibold text-ink flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          Pilih Tanggal
        </h3>
        <span className="text-[12px] text-ink-muted uppercase">Tersedia {dates.length} Hari</span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {dates.map((d) => (
          <button
            key={d.id}
            disabled={d.isWeekend}
            onClick={() => onSelect(d.id)}
            className={`p-3 border text-center transition-none flex flex-col items-center justify-center gap-1 ${
              d.isWeekend
                ? "bg-surface-1 border-hairline opacity-50 cursor-not-allowed"
                : selectedDate === d.id
                  ? "border-primary bg-[#e5f6ff] text-primary shadow-[inset_0_0_0_1px_#0f62fe]"
                  : "border-hairline bg-canvas hover:border-primary text-ink"
            }`}
          >
            <span className={`text-[11px] font-semibold uppercase ${d.isWeekend ? "text-ink-muted" : selectedDate === d.id ? "text-primary" : "text-ink-muted"}`}>
              {d.dayName}
            </span>
            <span className={`text-[20px] font-bold ${d.isWeekend ? "text-ink-muted" : selectedDate === d.id ? "text-primary" : "text-ink"}`}>
              {d.dateNum}
            </span>
            <span className={`text-[11px] font-semibold uppercase ${d.isWeekend ? "text-ink-muted" : selectedDate === d.id ? "text-primary" : "text-ink-muted"}`}>
              {d.monthName}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
