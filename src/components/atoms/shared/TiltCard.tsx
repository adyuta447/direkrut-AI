"use client";

import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

/**
 * Efek 3D tilt ringan mengikuti kursor. Nonaktif otomatis saat
 * prefers-reduced-motion atau di perangkat tanpa pointer halus.
 */
export function TiltCard({ children, className = "", maxTilt = 5 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const setters = useRef<{
    rx: ReturnType<typeof gsap.quickTo>;
    ry: ReturnType<typeof gsap.quickTo>;
  } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const disabled =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (disabled) return;

    gsap.set(el, { transformPerspective: 900 });
    setters.current = {
      rx: gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" }),
      ry: gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" }),
    };

    return () => {
      setters.current = null;
    };
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !setters.current) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setters.current.ry(px * maxTilt * 2);
    setters.current.rx(-py * maxTilt * 2);
  };

  const handleLeave = () => {
    setters.current?.rx(0);
    setters.current?.ry(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
