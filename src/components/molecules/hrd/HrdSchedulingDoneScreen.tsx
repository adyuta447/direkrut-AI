import { Check } from "lucide-react";

interface HrdSchedulingDoneScreenProps {
  candidateName: string;
  typeLabel?: string;
  typeDuration?: string;
  formattedDate: string;
  selectedTime: string | null;
  onClose: () => void;
}

export function HrdSchedulingDoneScreen({
  candidateName, typeLabel, typeDuration, formattedDate, selectedTime, onClose,
}: HrdSchedulingDoneScreenProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-10 w-full max-w-md text-center">
        <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Check className="w-7 h-7 text-zinc-900 dark:text-white" />
        </div>
        <h3 className="text-xl font-bold mb-1">Interview Scheduled</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">Invitation sent to {candidateName}</p>
        <div className="space-y-2 text-left mb-6 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Type</span>
            <span className="font-medium">{typeLabel}</span>
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
            <span className="font-medium">{typeDuration}</span>
          </div>
        </div>
        <button onClick={onClose} className="btn-primary mx-auto">Done</button>
      </div>
    </div>
  );
}
