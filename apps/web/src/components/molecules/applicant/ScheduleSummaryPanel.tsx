import { ArrowRight } from "lucide-react";
import { ScheduleDate } from "../../../lib/applicant/useScheduling";

interface ScheduleSummaryPanelProps {
  selectedDate: string | null;
  selectedTime: string | null;
  availableDates: ScheduleDate[];
  onSchedule: () => void;
}

export function ScheduleSummaryPanel({ selectedDate, selectedTime, availableDates, onSchedule }: ScheduleSummaryPanelProps) {
  const dateLabel = selectedDate
    ? availableDates.find((d) => d.id === selectedDate)?.dateObj.toLocaleDateString("id-ID", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      })
    : "Belum dipilih";

  return (
    <div className="bg-surface-1 border border-hairline p-6 flex flex-col justify-between flex-1">
      <div>
        <p className="text-[12px] font-semibold text-ink-muted uppercase tracking-widest mb-4">Ringkasan Jadwal</p>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center border-b border-hairline pb-2">
            <span className="text-[14px] text-ink-muted">Tanggal:</span>
            <span className="text-[14px] font-semibold text-ink">{dateLabel}</span>
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
          onClick={onSchedule}
          className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Jadwalkan Wawancara
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
