import Link from "next/link";

interface NavLinksProps {
  jobsLabel: string;
  otherLabels: [string, string, string, string];
  jobsActive?: boolean;
}

export function NavLinks({ jobsLabel, otherLabels, jobsActive }: NavLinksProps) {
  return (
    <div className="hidden lg:flex items-center gap-6">
      <Link
        href="/jobs"
        className={
          jobsActive
            ? "text-[14px] text-ink hover:text-primary transition-none font-semibold border-b-2 border-primary h-16"
            : "text-[14px] font-normal text-ink hover:text-primary transition-none"
        }
      >
        {jobsLabel}
      </Link>
      {otherLabels.map((label) => (
        <button
          key={label}
          className="text-[14px] font-normal text-ink hover:text-primary transition-none"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
