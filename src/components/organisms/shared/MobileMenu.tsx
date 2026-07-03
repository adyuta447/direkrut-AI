"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import gsap from "gsap";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  logoHref?: string;
  jobsLabel: string;
  otherLabels: [string, string, string, string];
  jobsActive?: boolean;
  registerLabel: string;
  contactLabel: string;
}

export function MobileMenu({
  isOpen,
  onClose,
  logoHref,
  jobsLabel,
  otherLabels,
  jobsActive,
  registerLabel,
  contactLabel,
}: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  const items: { label: string; href?: string; active?: boolean }[] = [
    { label: jobsLabel, href: "/jobs", active: jobsActive },
    ...otherLabels.map((label) => ({ label })),
  ];

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

        <div className="h-16 shrink-0 border-b border-hairline px-6 flex items-center justify-between">
          {logoHref ? (
            <Link
              href={logoHref}
              onClick={onClose}
              className="text-[20px] font-semibold tracking-tight text-ink uppercase"
            >
              Direkrut AI
            </Link>
          ) : (
            <span className="text-[20px] font-semibold tracking-tight uppercase">
              Direkrut AI
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="p-2 -mr-2 text-ink"
          >
            <X size={26} strokeWidth={1.5} />
          </button>
        </div>

        <div ref={itemsRef} className="flex-1 overflow-y-auto px-6 pt-8 pb-6 flex flex-col">
          <nav className="flex flex-col gap-1">
            {items.map((item, i) => {
              const content = (
                <span className="flex items-baseline gap-4">
                  <span className="text-[13px] text-ink-muted font-normal tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={
                      item.active
                        ? "text-primary"
                        : "text-ink group-hover:text-primary transition-none"
                    }
                  >
                    {item.label}
                  </span>
                </span>
              );

              return (
                <div
                  key={item.label}
                  className="mobile-nav-item border-b border-hairline py-4 opacity-0"
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-center justify-between text-[9vw] leading-none font-semibold uppercase tracking-tight"
                    >
                      {content}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="group flex items-center justify-between w-full text-left text-[9vw] leading-none font-semibold uppercase tracking-tight"
                    >
                      {content}
                    </button>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="mobile-nav-item opacity-0 mt-auto pt-8 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/auth"
                onClick={onClose}
                className="btn-primary flex-1 text-center"
              >
                {registerLabel}
              </Link>
              <Link
                href="/auth"
                onClick={onClose}
                className="flex-1 text-center text-[14px] font-normal text-ink border border-hairline py-3"
              >
                Masuk
              </Link>
            </div>
            <span className="text-[13px] text-ink-muted">{contactLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
