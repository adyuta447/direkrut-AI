import { ChevronDown, Calendar, Clock } from "lucide-react";

interface DecisionInterviewDetailsFormProps {
  interviewType: "teknis" | "hr";
  onInterviewTypeChange: (value: "teknis" | "hr") => void;
  interviewDate: string;
  onInterviewDateChange: (value: string) => void;
  interviewTime: string;
  onInterviewTimeChange: (value: string) => void;
}

export function DecisionInterviewDetailsForm({
  interviewType, onInterviewTypeChange, interviewDate, onInterviewDateChange, interviewTime, onInterviewTimeChange,
}: DecisionInterviewDetailsFormProps) {
  return (
    <div className="bg-canvas border border-hairline p-5">
      <p className="text-[12px] font-semibold uppercase tracking-widest text-ink-muted mb-4">Detail Wawancara</p>
      <div className="space-y-4">
        <div>
          <label className="block text-[14px] text-ink mb-2">Jenis Wawancara</label>
          <div className="relative">
            <select
              value={interviewType}
              onChange={(e) => onInterviewTypeChange(e.target.value as "teknis" | "hr")}
              className="appearance-none input-field w-full pr-10 cursor-pointer"
            >
              <option value="hr">Wawancara HRD</option>
              <option value="teknis">Wawancara Teknis</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-[14px] text-ink mb-2 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Tanggal
          </label>
          <input type="date" value={interviewDate} onChange={(e) => onInterviewDateChange(e.target.value)} className="input-field w-full" />
        </div>
        <div>
          <label className="block text-[14px] text-ink mb-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Waktu
          </label>
          <input type="time" value={interviewTime} onChange={(e) => onInterviewTimeChange(e.target.value)} className="input-field w-full" />
        </div>
      </div>
    </div>
  );
}
