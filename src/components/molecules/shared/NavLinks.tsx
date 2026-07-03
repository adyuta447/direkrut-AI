"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";

interface NavLinksProps {
  jobsLabel: string;
  otherLabels: [string, string, string, string];
  jobsActive?: boolean;
}

interface NavItem {
  label: string;
  href?: string;
}

export function NavLinks({ jobsLabel, otherLabels, jobsActive }: NavLinksProps) {
  const pathname = usePathname();
  const isJobsActive = jobsActive ?? pathname?.startsWith("/jobs") ?? false;

  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const items: NavItem[] = [
    { label: jobsLabel, href: "/jobs" },
    ...otherLabels.map((label) => ({ label })),
  ];

  const getActiveEl = useCallback(
    () => containerRef.current?.querySelector<HTMLElement>("[data-active='true']") ?? null,
    []
  );

  const moveIndicator = useCallback((target: HTMLElement | null, animate = true) => {
    const indicator = indicatorRef.current;
    if (!indicator) return;

    if (!target) {
      gsap.to(indicator, {
        opacity: 0,
        duration: animate ? 0.25 : 0,
        ease: "power2.out",
        overwrite: true,
      });
      return;
    }

    gsap.to(indicator, {
      x: target.offsetLeft,
      width: target.offsetWidth,
      opacity: 1,
      duration: animate ? 0.45 : 0,
      ease: "power3.out",
      overwrite: true,
    });
  }, []);

  useEffect(() => {
    moveIndicator(getActiveEl(), false);
    // Ukur ulang setelah web font selesai dimuat agar posisi tidak meleset
    document.fonts?.ready.then(() => moveIndicator(getActiveEl(), false));

    const onResize = () => moveIndicator(getActiveEl(), false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [getActiveEl, moveIndicator, isJobsActive]);

  return (
    <div
      ref={containerRef}
      className="relative hidden lg:flex items-stretch h-full -ml-3 group/nav"
      onMouseLeave={() => moveIndicator(getActiveEl())}
    >
      {items.map((item, i) => {
        const active = i === 0 && isJobsActive;
        const itemClass =
          "relative flex items-center px-3 text-[14px] text-ink outline-none " +
          "transition-opacity duration-300 group-hover/nav:opacity-40 hover:!opacity-100 focus-visible:!opacity-100";
        const label = (
          <span className="grid">
            {/* Ghost bold: reserve lebar teks semibold agar tidak ada layout shift */}
            <span aria-hidden="true" className="col-start-1 row-start-1 font-semibold invisible">
              {item.label}
            </span>
            <span
              className={`col-start-1 row-start-1 ${active ? "font-semibold" : "font-normal"}`}
            >
              {item.label}
            </span>
          </span>
        );

        return item.href ? (
          <Link
            key={item.label}
            href={item.href}
            data-active={active}
            aria-current={active ? "page" : undefined}
            className={itemClass}
            onMouseEnter={(e) => moveIndicator(e.currentTarget)}
            onFocus={(e) => moveIndicator(e.currentTarget)}
          >
            {label}
          </Link>
        ) : (
          <button
            key={item.label}
            type="button"
            data-active={false}
            className={itemClass}
            onMouseEnter={(e) => moveIndicator(e.currentTarget)}
            onFocus={(e) => moveIndicator(e.currentTarget)}
          >
            {label}
          </button>
        );
      })}

      <span
        ref={indicatorRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-0 bg-primary opacity-0"
      />
    </div>
  );
}
