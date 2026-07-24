import { ReactNode } from "react";
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  badge,
  footer,
  footerDetail,
  image,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  badge?: ReactNode;
  footer?: ReactNode;
  footerDetail?: ReactNode;
  image?: string;
  className?: string;
}) {
  return (
    <Card className={cn("@container/card relative", className)}>
      <CardHeader>
        {badge && <div className="flex">{badge}</div>}
        <CardDescription className="text-xs font-semibold uppercase tracking-wider">
          {label}
        </CardDescription>
        <CardTitle className="text-3xl font-bold tracking-[-0.02em] tabular-nums @[250px]/card:text-4xl">
          {value}
        </CardTitle>
      </CardHeader>
      {image && (
        <Image
          src={image}
          alt=""
          width={112}
          height={112}
          unoptimized
          className="pointer-events-none absolute top-1/2 right-4 h-14 w-auto max-w-28 -translate-y-1/2 select-none @[250px]/card:h-16"
        />
      )}
      {(footer || footerDetail) && (
        <CardFooter
          className={cn("flex-col items-start gap-1.5 text-sm", image && "pr-28")}
        >
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

export function StatCardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {children}
    </div>
  );
}
