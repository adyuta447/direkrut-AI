import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";

export interface CompanySummary {
  name: string;
  jobCount: number;
  industries: string[];
  locations: string[];
}

interface CompanyCardProps {
  company: CompanySummary;
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter((word) => /^[A-Za-z]/.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link
      href={`/jobs?q=${encodeURIComponent(company.name)}`}
      className="rounded-3xl border border-hairline p-8 cursor-pointer hover:border-primary group block transition-none bg-canvas"
    >
      <div className="flex justify-between items-start mb-8">
        <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-1 text-primary text-[18px] font-semibold">
          {initialsOf(company.name)}
        </span>
        <ArrowUpRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-none" />
      </div>

      <h3 className="text-[22px] font-semibold text-ink leading-[1.3] mb-1">{company.name}</h3>
      <p className="flex items-center gap-1.5 text-[13px] text-ink-muted mb-6">
        <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
        {company.locations.slice(0, 3).join(", ")}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {company.industries.slice(0, 2).map((industry) => (
          <span key={industry} className="text-[12px] rounded-full bg-surface-1 px-3 py-1.5 text-ink-muted">
            {industry}
          </span>
        ))}
        <span className="text-[13px] text-primary font-medium ml-auto">
          {company.jobCount} lowongan aktif
        </span>
      </div>
    </Link>
  );
}
