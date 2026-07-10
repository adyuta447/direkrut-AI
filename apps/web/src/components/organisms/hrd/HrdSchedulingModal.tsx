import { X } from "lucide-react";
import { useHrdSchedulingModal } from "../../../lib/hrd/useHrdSchedulingModal";
import { HrdSchedulingTypeStep } from "../../molecules/hrd/HrdSchedulingTypeStep";
import { HrdSchedulingDateStep } from "../../molecules/hrd/HrdSchedulingDateStep";
import { HrdSchedulingDetailsStep } from "../../molecules/hrd/HrdSchedulingDetailsStep";
import { HrdSchedulingDoneScreen } from "../../molecules/hrd/HrdSchedulingDoneScreen";

interface HrdSchedulingModalProps {
  candidateName: string;
  onClose: () => void;
}

export function HrdSchedulingModal({ candidateName, onClose }: HrdSchedulingModalProps) {
  const m = useHrdSchedulingModal();

  if (m.step === "done") {
    return (
      <HrdSchedulingDoneScreen
        candidateName={candidateName}
        typeLabel={m.selectedTypeMeta?.label}
        typeDuration={m.selectedTypeMeta?.duration}
        formattedDate={m.formattedDate}
        selectedTime={m.selectedTime}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-bold">Schedule Interview</h2>
            <p className="text-xs text-zinc-400 mt-0.5">for {candidateName}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {["type", "date", "details"].map((s, i) => (
                <div
                  key={s}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    ["type", "date", "details"].indexOf(m.step) >= i ? "bg-zinc-900 dark:bg-white" : "bg-zinc-200 dark:bg-zinc-700"
                  }`}
                />
              ))}
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              <X className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {m.step === "type" && (
            <HrdSchedulingTypeStep selectedType={m.selectedType} onSelectType={m.setSelectedType} onContinue={() => m.setStep("date")} />
          )}
          {m.step === "date" && (
            <HrdSchedulingDateStep
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
              onContinue={() => m.setStep("details")}
            />
          )}
          {m.step === "details" && (
            <HrdSchedulingDetailsStep
              candidateName={candidateName}
              typeLabel={m.selectedTypeMeta?.label}
              typeDuration={m.selectedTypeMeta?.duration}
              formattedDate={m.formattedDate}
              selectedTime={m.selectedTime}
              interviewers={m.interviewers}
              onInterviewersChange={m.setInterviewers}
              notes={m.notes}
              onNotesChange={m.setNotes}
              onBack={() => m.setStep("date")}
              onConfirm={() => m.setStep("done")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
