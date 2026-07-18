import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const CHART_TOOLTIP_STYLE = {
  borderRadius: "8px",
  border: "1px solid var(--border)",
  backgroundColor: "var(--background)",
  color: "var(--foreground)",
} as const;

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
    <div
      className={cn(
        "flex flex-col rounded-3xl border border-hairline bg-canvas p-6 shadow-none",
        className
      )}
    >
      <h3 className="text-[20px] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 mb-4 text-[14px] text-ink-muted">{description}</p>
      )}
      <div className="min-h-[220px] w-full flex-1">{children}</div>
    </div>
  );
}
