"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Job } from "@/lib/types";
import { FeaturedJobCard } from "../../molecules/landing/FeaturedJobCard";
import { TiltCard } from "../../atoms/shared/TiltCard";

interface FeaturedJobsSectionProps {
  jobs: Job[];
}

export function FeaturedJobsSection({ jobs }: FeaturedJobsSectionProps) {
  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(jobs.map((job) => job.industry))).slice(0, 5)],
    [jobs]
  );
  const [activeCategory, setActiveCategory] = useState("Semua");

  const featuredJobs = jobs
    .filter((job) => activeCategory === "Semua" || job.industry === activeCategory)
    .slice(0, 4);

  return (
    <section className="px-6 lg:px-10 max-w-[1584px] mx-auto pb-24">
      <div className="bg-surface-1 rounded-[32px] p-8 lg:p-16" data-reveal>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <p className="flex items-center gap-3 text-[12px] font-medium text-ink-muted uppercase tracking-[0.2em] mb-6">
              Lowongan Pilihan
            </p>
            <h2 className="text-[clamp(36px,4.5vw,60px)] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
              Lowongan yang lagi buka
            </h2>
          </div>
          <Link
            href="/jobs"
            className="flex items-center gap-2 text-primary font-normal text-[14px] hover:underline flex-shrink-0"
          >
            Lihat semua posisi
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-[13px] font-normal border transition-none ${
                activeCategory === category
                  ? "bg-primary border-primary text-white"
                  : "bg-canvas border-hairline text-ink-muted hover:border-primary hover:text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {featuredJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {featuredJobs.map((job) => (
              <TiltCard key={job.id} maxTilt={4}>
                <FeaturedJobCard job={job} />
              </TiltCard>
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-ink-muted py-8">
            Belum ada lowongan di kategori ini. Cek lagi nanti ya.
          </p>
        )}
      </div>
    </section>
  );
}
