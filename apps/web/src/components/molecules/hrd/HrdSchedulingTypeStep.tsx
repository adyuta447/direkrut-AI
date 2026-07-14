import { Video, Clock, Check } from "lucide-react";
import { INTERVIEW_TYPES } from "../../../lib/hrd/useHrdSchedulingModal";

interface HrdSchedulingTypeStepProps {
  selectedType: string | null;
  onSelectType: (id: string) => void;
  onContinue: () => void;
}

export function HrdSchedulingTypeStep({ selectedType, onSelectType, onContinue }: HrdSchedulingTypeStepProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {INTERVIEW_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelectType(type.id)}
            className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
              selectedType === type.id
                ? "border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800"
                : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
            }`}
          >
            <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <Video className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{type.label}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{type.description}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <Clock className="w-3 h-3 text-zinc-400" />
                <span className="text-xs text-zinc-400">{type.duration}</span>
              </div>
            </div>
            {selectedType === type.id && <Check className="w-4 h-4 text-zinc-900 dark:text-white flex-shrink-0 ml-auto" />}
          </button>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <button disabled={!selectedType} onClick={onContinue} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
          Continue
        </button>
      </div>
    </div>
  );
}
