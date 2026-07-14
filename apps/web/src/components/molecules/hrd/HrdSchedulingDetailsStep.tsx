import { Users } from "lucide-react";

interface HrdSchedulingDetailsStepProps {
  candidateName: string;
  typeLabel?: string;
  typeDuration?: string;
  formattedDate: string;
  selectedTime: string | null;
  interviewers: string;
  onInterviewersChange: (value: string) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export function HrdSchedulingDetailsStep({
  candidateName, typeLabel, typeDuration, formattedDate, selectedTime,
  interviewers, onInterviewersChange, notes, onNotesChange, onBack, onConfirm,
}: HrdSchedulingDetailsStepProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-zinc-400">Interview</span>
          <span className="font-medium">{typeLabel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Date</span>
          <span className="font-medium">{formattedDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Time</span>
          <span className="font-medium">{selectedTime} WIB · {typeDuration}</span>
        </div>
      </div>
      <div>
        <label className="label">Interviewers (optional)</label>
        <input
          value={interviewers}
          onChange={(e) => onInterviewersChange(e.target.value)}
          placeholder="Add interviewer names or emails..."
          className="input-field"
        />
      </div>
      <div>
        <label className="label">Notes for candidate</label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
          placeholder="Preparation tips, what to bring, etc..."
          className="input-field resize-none"
        />
      </div>
      <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
        <Users className="w-4 h-4 text-zinc-400 flex-shrink-0" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          A calendar invite and video link will be emailed to {candidateName} automatically.
        </p>
      </div>
      <div className="flex justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <button onClick={onBack} className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">Back</button>
        <button onClick={onConfirm} className="btn-primary">Confirm & Send</button>
      </div>
    </div>
  );
}
