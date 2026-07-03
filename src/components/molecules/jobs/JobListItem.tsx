import { Job } from "../../../types";

interface JobListItemProps {
  job: Job;
  isActive: boolean;
  onSelect: () => void;
}

export function JobListItem({ job, isActive, onSelect }: JobListItemProps) {
  return (
    <div
      onClick={onSelect}
      className={`p-6 cursor-pointer border transition-none flex flex-col gap-2 ${
        isActive
          ? "bg-surface-1 border-primary"
          : "bg-canvas border-hairline hover:bg-surface-1 hover:border-ink-muted"
      }`}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-[18px] font-normal leading-[1.33] text-ink">{job.title}</h3>
        <span className="text-[12px] text-ink-muted whitespace-nowrap ml-4">{job.posted}</span>
      </div>
      <p className="text-[14px] text-ink">{job.company}</p>
      <p className="text-[12px] text-ink-muted">{job.location}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        <span className="text-[12px] bg-surface-2 px-2 py-1 text-ink-muted">{job.type}</span>
        <span className="text-[12px] bg-surface-2 px-2 py-1 text-ink-muted">{job.industry}</span>
        {job.salaryRange && (
          <span className="text-[12px] bg-[#e5f6ff] text-primary px-2 py-1">{job.salaryRange}</span>
        )}
      </div>
    </div>
  );
}
