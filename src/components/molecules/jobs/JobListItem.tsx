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
      className={`p-6 rounded-3xl cursor-pointer border transition-none flex flex-col gap-2 ${
        isActive
          ? "bg-canvas border-primary"
          : "bg-canvas border-hairline hover:border-ink-muted"
      }`}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-[18px] font-normal leading-[1.33] text-ink">{job.title}</h3>
        <span className="text-[12px] text-ink-muted whitespace-nowrap ml-4">{job.posted}</span>
      </div>
      <p className="text-[14px] text-ink">{job.company}</p>
      <p className="text-[13px] text-ink-muted">{job.location}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        <span className="text-[12px] rounded-full bg-surface-1 px-3 py-1.5 text-ink">{job.type}</span>
        <span className="text-[12px] rounded-full bg-surface-1 px-3 py-1.5 text-ink-muted">{job.industry}</span>
        {job.salaryRange && (
          <span className="text-[12px] rounded-full bg-surface-1 px-3 py-1.5 text-primary font-medium">
            {job.salaryRange}
          </span>
        )}
      </div>
    </div>
  );
}
