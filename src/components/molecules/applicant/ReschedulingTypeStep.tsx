import { Video, Clock, Check } from "lucide-react";
import { INTERVIEW_TYPES } from "../../../lib/applicant/useReschedulingModal";

interface ReschedulingTypeStepProps {
  selectedType: string | null;
  onSelectType: (id: string) => void;
  onContinue: () => void;
}

export function ReschedulingTypeStep({ selectedType, onSelectType, onContinue }: ReschedulingTypeStepProps) {
  return (
    <div className="space-y-3">
      {INTERVIEW_TYPES.map((type) => (
        <button
          key={type.id}
          onClick={() => onSelectType(type.id)}
          className={`w-full flex items-center gap-4 p-4 border text-left transition-none ${
            selectedType === type.id ? "border-primary bg-[#e5f6ff]" : "border-hairline hover:bg-surface-1"
          }`}
        >
          <div className="w-10 h-10 bg-canvas border border-hairline flex items-center justify-center flex-shrink-0">
            <Video className="w-4 h-4 text-ink-muted" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-ink">{type.label}</p>
            <p className="text-[12px] text-ink-muted mt-0.5">{type.description}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-ink-muted flex-shrink-0">
            <Clock className="w-3.5 h-3.5" />
            {type.duration}
          </div>
          {selectedType === type.id && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
        </button>
      ))}
      <div className="flex justify-end mt-4">
        <button
          disabled={!selectedType}
          onClick={onContinue}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
}
