import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";
import { Job } from "@/lib/types";

interface FeaturedJobCardProps {
  job: Job;
}

export function FeaturedJobCard({ job }: FeaturedJobCardProps) {
  return (
    <Link
      href="/jobs"
      className="bg-canvas rounded-3xl border border-transparent p-8 cursor-pointer hover:border-primary group block transition-none"
    >
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-[22px] font-semibold text-ink leading-[1.33]">{job.title}</h3>
          <p className="text-[14px] text-ink-muted mt-1">{job.company} · {job.location}</p>
        </div>
        <ArrowUpRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-none flex-shrink-0" />
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-[13px] rounded-full bg-surface-1 px-3 py-1.5 text-ink">{job.type}</span>
        {job.salaryRange && (
          <span className="text-[13px] rounded-full bg-surface-1 px-3 py-1.5 text-primary font-medium">
            {job.salaryRange}
          </span>
        )}
        <span className="flex items-center gap-1.5 text-[13px] text-ink-muted">
          <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
          {job.applicantCount} pelamar
        </span>
        <span className="text-[13px] text-ink-muted ml-auto">{job.posted}</span>
      </div>
    </Link>
  );
}
