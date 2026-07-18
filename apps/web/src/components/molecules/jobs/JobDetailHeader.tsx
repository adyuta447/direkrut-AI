import Link from "next/link";
import { Users } from "lucide-react";
import { Job } from "../../../types";

interface JobDetailHeaderProps {
  job: Job;
  /** Tujuan tombol Lamar; default alur publik (register). */
  applyHref?: string;
}

export function JobDetailHeader({ job, applyHref = "/auth/register" }: JobDetailHeaderProps) {
  return (
    <div className="p-8 border-b border-hairline bg-surface-1">
      <h2 className="text-[clamp(28px,3vw,40px)] font-bold leading-[1.15] tracking-[-0.01em] mb-2 text-ink">
        {job.title}
      </h2>
      <p className="text-[17px] font-normal mb-1 text-ink">{job.company}</p>
      <p className="text-[14px] text-ink-muted mb-5">{job.location} • {job.industry}</p>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-[13px] rounded-full bg-canvas px-3 py-1.5 text-primary font-medium">
          {job.salaryRange}
        </span>
        <span className="text-[13px] rounded-full bg-canvas px-3 py-1.5 text-ink">{job.type}</span>
        <span className="flex items-center gap-1.5 text-[13px] rounded-full bg-canvas px-3 py-1.5 text-ink-muted">
          <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
          {job.applicantCount} pelamar
        </span>
      </div>

      <Link href={applyHref} className="btn-primary inline-block">
        Lamar Sekarang
      </Link>
    </div>
  );
}
