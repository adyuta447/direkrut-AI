"use client";

import { ReactNode, useEffect, useRef } from "react";

interface FooterRevealBodyProps {
  children: ReactNode;
  className?: string;
}

/**
 * Membungkus seluruh isi halaman kecuali footer. Saat ujung bawah konten
 * menyentuh dasar viewport, konten membeku (sticky dengan top negatif =
 * 100svh - tinggi konten) dan footer meluncur naik menimpanya.
 * Nonaktif otomatis saat prefers-reduced-motion.
 */
export function FooterRevealBody({ children, className = "" }: FooterRevealBodyProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const setTop = () => {
      el.style.top = `calc(100svh - ${el.offsetHeight}px)`;
    };
    setTop();
    const observer = new ResizeObserver(setTop);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`sticky bg-canvas ${className}`}>
      {children}
    </div>
  );
}
