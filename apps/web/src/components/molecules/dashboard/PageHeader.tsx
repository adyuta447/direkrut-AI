import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Header standar halaman dashboard: satu-satunya tempat ukuran judul
 * halaman didefinisikan (h1 text-2xl), menggantikan ±15 header hand-rolled
 * dengan ukuran campur-campur.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  /** Micro-label oranye di atas judul (pola eyebrow landing page). */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
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
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}
