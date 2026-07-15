import { ReactNode } from "react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Kartu statistik dashboard (dipakai HRD & kandidat). */
export function StatCard({
  label,
  value,
  badge,
  footer,
  footerDetail,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  badge?: ReactNode;
  footer?: ReactNode;
  footerDetail?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("@container/card", className)}>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        {badge && <CardAction>{badge}</CardAction>}
      </CardHeader>
      {(footer || footerDetail) && (
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {footer && (
            <div className="line-clamp-1 flex gap-2 font-medium">{footer}</div>
          )}
          {footerDetail && (
            <div className="text-muted-foreground">{footerDetail}</div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

/** Grid pembungkus deretan StatCard dengan gradient shadcn bawaan. */
export function StatCardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {children}
    </div>
  );
}
