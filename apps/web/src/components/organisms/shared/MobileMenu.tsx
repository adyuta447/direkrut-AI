"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, ArrowRight, Briefcase, Building2, BookOpen, Tag, Sparkles, LucideIcon } from "lucide-react";
import gsap from "gsap";
import { NAV_ITEMS } from "../../../lib/shared/navItems";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  registerLabel: string;
  contactLabel: string;
}

const NAV_META: Record<string, { icon: LucideIcon; sub: string }> = {
  "Cari Kerja": { icon: Briefcase, sub: "Jelajahi semua lowongan aktif" },
  "Intip Perusahaan": { icon: Building2, sub: "Kenalan sama mitra kami" },
  "Tips Karier": { icon: BookOpen, sub: "Panduan biar makin siap" },
  "Tentang Kami": { icon: Sparkles, sub: "Kenalan sama tim kami" },
  Harga: { icon: Tag, sub: "Mulai gratis, upgrade kapan aja" },
};

export function MobileMenu({ isOpen, onClose, registerLabel, contactLabel }: MobileMenuProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panelRef.current || !itemsRef.current) return;

    const links = itemsRef.current.querySelectorAll(".mobile-nav-item");
    const tl = gsap.timeline();

    if (isOpen) {
      document.body.style.overflow = "hidden";
      tl.fromTo(
        panelRef.current,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.5, ease: "power3.inOut" }
      ).fromTo(
        links,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.06 },
        "-=0.15"
      );
    } else {
      document.body.style.overflow = "";
      gsap.set(panelRef.current, { clipPath: "inset(0 0 100% 0)" });
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className={`fixed inset-0 z-[60] bg-canvas lg:hidden ${
        isOpen ? "" : "pointer-events-none"
      }`}
      style={{ clipPath: "inset(0 0 100% 0)" }}
      aria-hidden={!isOpen}
    >
      <div className="flex flex-col h-full">
        <div className="h-8 shrink-0 bg-surface-1" />

        <div className="h-16 shrink-0 border-b border-hairline px-5 flex items-center justify-between">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <Image src="/logo/Direkrut%20AI_WhiteMode.png" className="block dark:hidden h-7 w-auto" width={137} height={28} alt="Direkrut AI Logo" />
            <Image src="/logo/Direkrut%20AI_DarkMode.png" className="hidden dark:block h-7 w-auto" width={137} height={28} alt="Direkrut AI Logo" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-1 text-ink"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div ref={itemsRef} className="flex-1 overflow-y-auto px-5 pt-6 pb-6 flex flex-col">
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const active = Boolean(item.href && pathname?.startsWith(item.href));
              const meta = NAV_META[item.label];
              const Icon = meta?.icon ?? Briefcase;

              const content = (
                <>
                  <span
                    className={`flex items-center justify-center w-11 h-11 rounded-2xl flex-shrink-0 ${
                      active ? "bg-primary text-white" : "bg-canvas text-primary"
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </span>
                  <span className="flex-1 min-w-0 text-left">
                    <span className={`block text-[16px] font-medium ${active ? "text-primary" : "text-ink"}`}>
                      {item.label}
                    </span>
                    <span className="block text-[12px] text-ink-muted mt-0.5">{meta?.sub}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink-muted flex-shrink-0" strokeWidth={1.5} />
                </>
              );

              return (
                <div key={item.label} className="mobile-nav-item opacity-0">
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-4 rounded-3xl p-4 transition-none ${
                        active ? "bg-canvas border border-primary" : "bg-surface-1"
                      }`}
                    >
                      {content}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="flex items-center gap-4 rounded-3xl p-4 bg-surface-1 w-full transition-none"
                    >
                      {content}
                    </button>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="mobile-nav-item opacity-0 mt-auto pt-6">
            <div className="rounded-3xl bg-surface-1 p-5">
              <p className="text-[15px] font-medium text-ink mb-1">Baru di Direkrut AI?</p>
              <p className="text-[13px] text-ink-muted leading-[1.5] mb-4">
                Bikin akun gratis, upload CV, dan biarkan AI nyariin lowongan yang pas buat kamu.
              </p>
              <Link
                href="/auth/register"
                onClick={onClose}
                className="btn-primary block w-full text-center mb-2"
              >
                {registerLabel}
              </Link>
              <Link
                href="/auth/login"
                onClick={onClose}
                className="block w-full text-center text-[14px] font-normal text-ink bg-canvas rounded-full py-3"
              >
                Masuk
              </Link>
            </div>

            <div className="flex items-center justify-between mt-5 px-1 text-[13px] text-ink-muted">
              <span>Butuh Bantuan?</span>
              <span>{contactLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
