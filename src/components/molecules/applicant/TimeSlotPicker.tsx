import { Clock } from "lucide-react";

interface TimeSlotPickerProps {
  timeSlots: string[];
  selectedDate: string | null;
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

export function TimeSlotPicker({ timeSlots, selectedDate, selectedTime, onSelect }: TimeSlotPickerProps) {
  return (
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
            onClick={() => onSelect(time)}
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
  );
}
