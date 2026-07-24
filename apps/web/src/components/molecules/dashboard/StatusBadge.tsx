import { IconCalendarEventFilled, IconCircleCheckFilled, IconCircleXFilled, IconLoader } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { getScoreLevel, getStatusMeta } from "@/lib/dashboard/status";

const STATUS_ICON: Record<string, typeof IconCircleCheckFilled> = {
  submitted: IconCircleCheckFilled,
  "under-review": IconLoader,
  interview: IconCalendarEventFilled,
  rejected: IconCircleXFilled,
};

/** Badge status lamaran -- solid, icon + label, tidak pernah warna saja. */
export function StatusBadge({ status }: { status: string }) {
  const meta = getStatusMeta(status);
  const Icon = STATUS_ICON[status] ?? IconCircleCheckFilled;
  return (
    <Badge className={`gap-1 border-transparent px-2 py-0.5 text-white whitespace-nowrap ${meta.solidClass}`}>
      <Icon className="size-3 fill-white" />
      {meta.label}
    </Badge>
  );
}

/** Badge level skor rekomendasi AI -- solid. */
export function ScoreBadge({ score }: { score?: number }) {
  if (!score) return <span className="text-muted-foreground">—</span>;
  const level = getScoreLevel(score);
  return <Badge className={`border-transparent text-white ${level.solidClass}`}>{level.label}</Badge>;
}
