import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Gaya tooltip Recharts standar (sebelumnya di-copy-paste ~10x). */
export const CHART_TOOLTIP_STYLE = {
  borderRadius: "8px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--background)",
  color: "var(--foreground)",
} as const;

/** Kartu chart standar: judul + deskripsi + area chart min 220px. */
export function ChartCard({
  title,
  description,
  children,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col rounded-xl border bg-background p-6", className)}>
      <h3 className="text-center text-base font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 mb-4 text-center text-xs text-muted-foreground">
          {description}
        </p>
      )}
      <div className="min-h-[220px] w-full flex-1">{children}</div>
    </div>
  );
}
