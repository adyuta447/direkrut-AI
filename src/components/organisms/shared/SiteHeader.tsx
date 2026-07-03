"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { UtilityBar } from "../../molecules/shared/UtilityBar";
import { NavLinks } from "../../molecules/shared/NavLinks";
import { MobileMenu } from "./MobileMenu";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <UtilityBar contactLabel={contactLabel} />
      <nav
        className={`border-b border-hairline sticky top-0 z-50 transition-[box-shadow,background-color] duration-300 ${
          isScrolled
            ? "bg-canvas supports-[backdrop-filter]:bg-canvas/85 backdrop-blur-xl shadow-[0_12px_32px_-16px_rgba(22,22,22,0.18)]"
            : "bg-canvas shadow-none"
        }`}
      >
        <div
          className={`max-w-[1584px] mx-auto px-6 lg:px-10 flex justify-between items-center transition-[height] duration-300 ease-out ${
            isScrolled ? "h-14" : "h-16"
          }`}
        >
          <div className="flex items-center gap-8 h-full">
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
            <div className="hidden lg:flex items-center gap-6">
              <Link href="/auth" className="text-[14px] font-normal hover:text-primary transition-none">
                Masuk
              </Link>
              <Link href="/auth" className="btn-primary">
                {registerLabel}
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Buka menu"
              className="lg:hidden p-2 -mr-2 text-ink"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        logoHref={logoHref}
        jobsLabel={jobsLabel}
        otherLabels={otherLabels}
        jobsActive={jobsActive}
        registerLabel={registerLabel}
        contactLabel={contactLabel}
      />
    </>
  );
}
