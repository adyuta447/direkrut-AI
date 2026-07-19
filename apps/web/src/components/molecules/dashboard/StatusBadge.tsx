import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { getScoreLevel, getStatusMeta } from "@/lib/dashboard/status";

/** Badge status lamaran -- solid, icon + label, tidak pernah warna saja. */
export function StatusBadge({ status }: { status: string }) {
  const meta = getStatusMeta(status);
  const Icon = status === "under-review" ? IconLoader : IconCircleCheckFilled;
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
