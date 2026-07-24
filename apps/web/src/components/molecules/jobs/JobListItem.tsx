import { Job } from "@/lib/types";

interface JobListItemProps {
  job: Job;
  isActive: boolean;
  onSelect: () => void;
}

export function JobListItem({ job, isActive, onSelect }: JobListItemProps) {
  const logoUrl = job.id.charCodeAt(0) % 2 === 0 
    ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0BN_ZUkZz-mOnQwcZk28BfvRgxDZAi_zb0ORSodt9GKLdJculJM9kezM&s=10"
    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq3LQL2zAX0klKle21pMdjN86d9IIitbtYSayhxb9Jry0xTujdGNDx8eg&s=10";

  return (
    <div
      onClick={onSelect}
      className={`p-5 rounded-3xl cursor-pointer border transition-none flex flex-col gap-3 ${
        isActive
          ? "bg-canvas border-primary"
          : "bg-canvas border-hairline hover:border-ink-muted"
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-start gap-3 flex-1">
          <img 
            src={logoUrl} 
            alt={`${job.company} logo`} 
            className="w-12 h-12 rounded-lg object-contain bg-white border border-hairline p-1.5 shrink-0"
          />
          <div>
            <h3 className="text-[17px] font-semibold leading-tight text-ink">{job.title}</h3>
            <p className="text-[14px] text-ink mt-1">{job.company}</p>
            <p className="text-[13px] text-ink-muted mt-0.5">{job.location}</p>
          </div>
        </div>
        <span className="text-[12px] text-ink-muted whitespace-nowrap shrink-0 pt-1">{job.posted}</span>
      </div>
      <div className="flex flex-wrap gap-2 mt-1">
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
