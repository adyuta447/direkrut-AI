import Link from "next/link";
import { Job } from "../../../types";

interface JobDetailHeaderProps {
  job: Job;
}

export function JobDetailHeader({ job }: JobDetailHeaderProps) {
  return (
    <div className="p-8 border-b border-hairline bg-surface-1">
      <h2 className="text-[32px] font-light leading-[1.25] mb-2 text-ink">{job.title}</h2>
      <p className="text-[18px] font-normal mb-1 text-ink">{job.company}</p>
      <p className="text-[14px] text-ink-muted mb-4">{job.location} • {job.industry}</p>

      <div className="flex flex-wrap gap-4 mb-6">
        <span className="text-[14px] font-semibold text-ink">{job.salaryRange}</span>
        <span className="text-[14px] text-ink-muted">• {job.type}</span>
        <span className="text-[14px] text-ink-muted">• {job.applicantCount} pelamar</span>
      </div>

      <Link href="/auth" className="btn-primary inline-block">
        Lamar Sekarang
      </Link>
    </div>
  );
}
