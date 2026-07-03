import { ChevronDown } from "lucide-react";
import { Job } from "../../../types";

interface JobSelectPanelProps {
  jobs: Job[];
  selectedJob: string;
  onSelectJob: (id: string) => void;
  selectedJobData?: Job;
}

export function JobSelectPanel({ jobs, selectedJob, onSelectJob, selectedJobData }: JobSelectPanelProps) {
  return (
    <div className="lg:col-span-7 bg-canvas border border-hairline p-8 flex flex-col gap-6">
      <label className="block text-[14px] text-ink mb-2">1. Pilih Posisi Pekerjaan</label>

      <div className="relative">
        <select
          value={selectedJob}
          onChange={(e) => onSelectJob(e.target.value)}
          required
          className="input-field appearance-none cursor-pointer pr-10"
        >
          <option value="" disabled>Pilih posisi...</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>{job.title} — {job.company}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-ink-muted" />
        </div>
      </div>

      {selectedJobData && (
        <div className="mt-8 pt-8 border-t border-hairline animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-wrap gap-4 mb-4">
            {[selectedJobData.type, selectedJobData.department, selectedJobData.location].map((tag, idx) => (
              <span key={idx} className="text-[14px] text-ink-muted bg-surface-1 px-3 py-1">{tag}</span>
            ))}
          </div>

          <h3 className="text-[32px] font-light text-ink mb-2">{selectedJobData.title}</h3>
          <p className="text-[16px] text-ink-muted mb-8">{selectedJobData.company}</p>
          <p className="text-[16px] text-ink leading-[1.5] mb-8 max-w-3xl whitespace-pre-wrap">
            {selectedJobData.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {selectedJobData.requirements.map((req, idx) => (
              <span key={idx} className="text-[14px] border border-hairline text-ink bg-surface-1 px-3 py-1">
                {req}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
