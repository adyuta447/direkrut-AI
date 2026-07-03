import { Briefcase } from "lucide-react";
import { Job } from "../../../types";

interface HrdChatHeaderProps {
  jobs: Job[];
  selectedJobId: string;
  onSelectJob: (id: string) => void;
}

export function HrdChatHeader({ jobs, selectedJobId, onSelectJob }: HrdChatHeaderProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-canvas/80 backdrop-blur-sm border-b border-hairline py-3 px-6 flex justify-center items-center gap-4">
      <span className="text-[13px] font-semibold text-ink-muted uppercase tracking-wider flex items-center gap-2">
        <Briefcase className="w-4 h-4" />
        Konteks Lowongan:
      </span>
      <select
        value={selectedJobId}
        onChange={(e) => onSelectJob(e.target.value)}
        className="bg-surface-1 border border-hairline text-ink text-[14px] py-1.5 px-3 rounded-md focus:border-primary focus:outline-none min-w-[250px]"
      >
        {jobs.map((j) => (
          <option key={j.id} value={j.id}>{j.title}</option>
        ))}
      </select>
    </div>
  );
}
