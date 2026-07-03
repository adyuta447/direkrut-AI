import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Job } from "../../../types";
import { FeaturedJobCard } from "../../molecules/landing/FeaturedJobCard";

interface FeaturedJobsSectionProps {
  jobs: Job[];
}

export function FeaturedJobsSection({ jobs }: FeaturedJobsSectionProps) {
  const featuredJobs = jobs.slice(0, 4);

  return (
    <section className="py-24 px-6 lg:px-10 max-w-[1584px] mx-auto bg-surface-1 border-y border-hairline">
      <div className="flex items-end justify-between mb-8">
        <h2 className="text-[42px] font-light leading-[1.2] text-ink">
          Peluang Karir Terkini
        </h2>
        <Link
          href="/jobs"
          className="flex items-center gap-2 text-primary font-normal text-[14px] hover:underline"
        >
          Lihat seluruh posisi
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {featuredJobs.map((job) => (
          <FeaturedJobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}
