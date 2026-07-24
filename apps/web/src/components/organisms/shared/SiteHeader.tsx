"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { UtilityBar } from "../../molecules/shared/UtilityBar";
import { NavLinks } from "../../molecules/shared/NavLinks";
import { MobileMenu } from "./MobileMenu";

import { useDashboard } from "@/context/DashboardContext";

interface SiteHeaderProps {
  contactLabel?: string;
  registerLabel?: string;
}

export function SiteHeader({
  contactLabel = "Ngobrol sama Kami",
  registerLabel = "Gabung Sekarang",
}: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout } = useDashboard();

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
        className={`border-b border-hairline sticky top-0 z-50 transition-[background-color] duration-300 ${
          isScrolled
            ? "bg-canvas supports-[backdrop-filter]:bg-canvas/85 backdrop-blur-xl"
            : "bg-canvas"
        }`}
      >
        <div
          className={`max-w-[1584px] mx-auto px-6 lg:px-10 flex justify-between items-center transition-[height] duration-300 ease-out ${
            isScrolled ? "h-14" : "h-16"
          }`}
        >
          <div className="flex items-center gap-8 h-full">
            <Link
              href="/"
              className="flex items-center hover:opacity-90 transition-opacity"
            >
              <Image src="/logo/Direkrut%20AI_WhiteMode.png" className="block dark:hidden h-7 w-auto" width={137} height={28} alt="Direkrut AI Logo" />
              <Image src="/logo/DirekrutAI_DarkMode.png" className="hidden dark:block h-7 w-auto" width={137} height={28} alt="Direkrut AI Logo" />
            </Link>
            <NavLinks />
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-6">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <Link href={currentUser.role === "hrd" ? "/hrd" : "/candidate"} className="btn-primary font-sans font-bold flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] uppercase">
                      {currentUser.name?.[0] ?? "U"}
                    </div>
                    Ke Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      window.location.href = "/";
                    }}
                    className="text-[14px] font-sans font-bold text-ink-muted hover:text-danger transition-colors px-2"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/auth/login" className="text-[14px] font-sans font-bold hover:text-primary transition-none">
                    Masuk
                  </Link>
                  <Link href="/auth/register" className="btn-primary font-sans font-bold">
                    {registerLabel}
                  </Link>
                </>
              )}
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
        registerLabel={registerLabel}
        contactLabel={contactLabel}
      />
    </>
  );
}
