"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, LogOut, Menu } from "lucide-react";
import { UtilityBar } from "../../molecules/shared/UtilityBar";
import { NavLinks } from "../../molecules/shared/NavLinks";
import { MobileMenu } from "./MobileMenu";
import { useDashboard } from "@/context/DashboardContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SiteHeaderProps {
  contactLabel?: string;
  registerLabel?: string;
}

export function SiteHeader({
  contactLabel = "Ngobrol sama Kami",
  registerLabel = "Gabung Sekarang",
}: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { currentUser, logout } = useDashboard();
  const dashboardUrl = currentUser?.role === "hrd" ? "/hrd" : "/candidate";
  const initials =
    currentUser?.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsProfileMenuOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isProfileMenuOpen]);

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
              <Image
                src="/logo/Direkrut%20AI_WhiteMode.png"
                className="h-7 w-auto"
                width={137}
                height={28}
                alt="Direkrut AI Logo"
              />
            </Link>
            <NavLinks />
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-6">
              {currentUser ? (
                <div ref={profileMenuRef} className="relative">
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isProfileMenuOpen}
                    aria-controls="desktop-profile-menu"
                    aria-label={`Buka menu profil ${currentUser.name}`}
                    className="rounded-full outline-none ring-offset-2 ring-offset-canvas hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={() => setIsProfileMenuOpen((open) => !open)}
                  >
                    <Avatar size="lg">
                      <AvatarFallback className="bg-primary font-bold text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>

                  {isProfileMenuOpen && (
                    <div
                      id="desktop-profile-menu"
                      role="menu"
                      className="absolute right-0 top-full z-[70] mt-2 w-64 overflow-hidden rounded-xl border border-hairline bg-canvas p-1.5 text-ink"
                    >
                      <div className="px-3 py-2">
                        <span className="block truncate text-sm font-semibold">
                          {currentUser.name}
                        </span>
                        <span className="mt-0.5 block truncate text-xs font-normal text-ink-muted">
                          {currentUser.email}
                        </span>
                      </div>
                      <div className="my-1.5 h-px bg-hairline" />
                      <Link
                        href={dashboardUrl}
                        role="menuitem"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface-1 focus-visible:bg-surface-1 focus-visible:outline-none"
                      >
                        <LayoutDashboard className="size-4" />
                        Ke Dashboard
                      </Link>
                      <div className="my-1.5 h-px bg-hairline" />
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-destructive/10 focus-visible:bg-destructive/10 focus-visible:outline-none"
                      >
                        <LogOut className="size-4" />
                        Keluar
                      </button>
                    </div>
                  )}
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
