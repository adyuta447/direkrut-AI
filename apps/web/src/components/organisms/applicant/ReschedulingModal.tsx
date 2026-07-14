import { X } from "lucide-react";
import { useReschedulingModal } from "../../../lib/applicant/useReschedulingModal";
import { ReschedulingTypeStep } from "../../molecules/applicant/ReschedulingTypeStep";
import { ReschedulingDateStep } from "../../molecules/applicant/ReschedulingDateStep";
import { ReschedulingConfirmStep } from "../../molecules/applicant/ReschedulingConfirmStep";
import { ReschedulingDoneScreen } from "../../molecules/applicant/ReschedulingDoneScreen";

interface ReschedulingModalProps {
  onClose: () => void;
}

export function ReschedulingModal({ onClose }: ReschedulingModalProps) {
  const m = useReschedulingModal();

  if (m.step === "done") {
    return (
      <ReschedulingDoneScreen
        typeLabel={m.selectedTypeMeta?.label}
        formatted={m.formatted}
        selectedTime={m.selectedTime}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-[#393939]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-canvas border border-hairline w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-hairline bg-surface-1">
          <div>
            <h2 className="text-[16px] font-semibold text-ink">Jadwalkan Wawancara</h2>
            <p className="text-[12px] text-ink-muted mt-0.5 uppercase tracking-widest">
              {m.step === "type" ? "Pilih tipe wawancara" : m.step === "date" ? "Pilih tanggal & waktu" : "Konfirmasi pemesanan"}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center border border-hairline hover:bg-canvas transition-none">
            <X className="w-4 h-4 text-ink" />
          </button>
        </div>

        <div className="p-6">
          {m.step === "type" && (
            <ReschedulingTypeStep
              selectedType={m.selectedType}
              onSelectType={m.setSelectedType}
              onContinue={() => m.setStep("date")}
            />
          )}
          {m.step === "date" && (
            <ReschedulingDateStep
              currentYear={m.currentYear}
              currentMonth={m.currentMonth}
              daysInMonth={m.daysInMonth}
              firstDay={m.firstDay}
              selectedDate={m.selectedDate}
              selectedTime={m.selectedTime}
              onPrevMonth={m.prevMonth}
              onNextMonth={m.nextMonth}
              onSelectDate={m.setSelectedDate}
              onSelectTime={m.setSelectedTime}
              isDisabled={m.isDisabled}
              onBack={() => m.setStep("type")}
              onContinue={() => m.setStep("confirm")}
            />
          )}
          {m.step === "confirm" && (
            <ReschedulingConfirmStep
              typeLabel={m.selectedTypeMeta?.label}
              typeDuration={m.selectedTypeMeta?.duration}
              formatted={m.formatted}
              selectedTime={m.selectedTime}
              onBack={() => m.setStep("date")}
              onConfirm={() => m.setStep("done")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
