import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Job } from "../../../types";

interface FeaturedJobCardProps {
  job: Job;
}

export function FeaturedJobCard({ job }: FeaturedJobCardProps) {
  return (
    <Link
      href="/jobs"
      className="bg-canvas border border-hairline p-8 cursor-pointer hover:border-primary group block"
    >
      <div className="flex justify-between items-start mb-12">
        <div>
          <h3 className="text-[24px] font-normal text-ink leading-[1.33]">{job.title}</h3>
          <p className="text-[14px] text-ink mt-1">{job.company} — {job.location}</p>
        </div>
        <ArrowUpRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-none" />
      </div>
      <div className="flex items-center gap-4 border-t border-hairline pt-4">
        <span className="text-[14px] text-ink">{job.type}</span>
        <span className="text-[14px] text-ink-muted">{job.posted}</span>
      </div>
    </Link>
  );
}
