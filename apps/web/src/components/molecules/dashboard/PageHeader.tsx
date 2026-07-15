import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Header standar halaman dashboard: satu-satunya tempat skala judul
 * halaman didefinisikan (tipografi landing), menggantikan ±15 header
 * hand-rolled dengan ukuran campur-campur.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
  size = "default",
}: {
  /** Micro-label oranye di atas judul (pola eyebrow landing page). */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  /** "lg" untuk halaman utama dasbor (greeting hero). */
  size?: "default" | "lg";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        {eyebrow && (
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-accent-strong">
            {eyebrow}
          </p>
        )}
        <h1
          className={cn(
            "font-bold leading-[1.1] tracking-[-0.02em]",
            size === "lg" ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "text-muted-foreground",
              size === "lg" ? "mt-2 text-base" : "mt-1 text-sm"
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}
