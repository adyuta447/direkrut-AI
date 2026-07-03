import Link from "next/link";
import { UtilityBar } from "../../molecules/shared/UtilityBar";
import { NavLinks } from "../../molecules/shared/NavLinks";

interface SiteHeaderProps {
  contactLabel: string;
  logoHref?: string;
  jobsLabel: string;
  otherLabels: [string, string, string, string];
  jobsActive?: boolean;
  registerLabel: string;
}

export function SiteHeader({
  contactLabel,
  logoHref,
  jobsLabel,
  otherLabels,
  jobsActive,
  registerLabel,
}: SiteHeaderProps) {
  return (
    <>
      <UtilityBar contactLabel={contactLabel} />
      <nav className="border-b border-hairline bg-canvas">
        <div className="max-w-[1584px] mx-auto px-6 lg:px-10 h-16 flex justify-between items-center">
          <div className="flex items-center gap-8">
            {logoHref ? (
              <Link
                href={logoHref}
                className="text-[20px] font-semibold tracking-tight text-ink hover:text-ink transition-none uppercase"
              >
                Direkrut AI
              </Link>
            ) : (
              <span className="text-[20px] font-semibold tracking-tight uppercase">
                Direkrut AI
              </span>
            )}
            <NavLinks jobsLabel={jobsLabel} otherLabels={otherLabels} jobsActive={jobsActive} />
          </div>

          <div className="flex items-center gap-6">
            <Link href="/auth" className="text-[14px] font-normal hover:text-primary transition-none">
              Masuk
            </Link>
            <Link href="/auth" className="btn-primary">
              {registerLabel}
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
