import { Edit3, MapPin } from "lucide-react";
import { Job } from "../../../types";

interface JobListItemProps {
  job: Job;
  onEdit: (job: Job) => void;
}

export function JobListItem({ job, onEdit }: JobListItemProps) {
  return (
    <div className="flex items-start justify-between p-6 border border-hairline hover:bg-surface-1 transition-none">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-[12px] font-semibold uppercase bg-surface-1 border border-hairline text-ink px-2 py-1">
            {job.department}
          </span>
          <span className="text-[12px] font-semibold uppercase bg-surface-1 border border-hairline text-ink px-2 py-1">
            {job.type}
          </span>
        </div>
        <h4 className="text-[20px] font-normal text-ink mb-1">{job.title}</h4>
        <p className="text-[14px] text-ink-muted flex items-center gap-2 mb-4">
          {job.company}
          <span>·</span>
          <MapPin className="w-4 h-4" />
          {job.location}
        </p>
        <p className="text-[14px] text-ink leading-[1.5] mb-4">{job.description}</p>
        <div className="space-y-2">
          <p className="text-[12px] font-semibold uppercase text-ink-muted">Keahlian yang Dibutuhkan</p>
          <div className="flex flex-wrap gap-2">
            {job.requirements.map((req, idx) => (
              <span key={idx} className="text-[12px] bg-canvas border border-hairline text-ink-muted px-2 py-1">
                {req}
              </span>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={() => onEdit(job)}
        className="flex items-center gap-2 text-[14px] font-semibold text-primary hover:underline transition-none ml-6 flex-shrink-0"
      >
        <Edit3 className="w-4 h-4" />
        Edit
      </button>
    </div>
  );
}
