import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { getScoreLevel, getStatusMeta } from "@/lib/dashboard/status";

/** Badge status lamaran -- icon + label, tidak pernah warna saja. */
export function StatusBadge({ status }: { status: string }) {
  const meta = getStatusMeta(status);
  const Icon = status === "under-review" ? IconLoader : IconCircleCheckFilled;
  return (
    <Badge variant={meta.variant} className="gap-1 px-1.5 py-0.5 whitespace-nowrap">
      <Icon
        className="size-3"
        style={
          status === "under-review"
            ? { color: meta.color }
            : { fill: meta.color }
        }
      />
      {meta.label}
    </Badge>
  );
}

/** Badge level skor rekomendasi AI. */
export function ScoreBadge({ score }: { score?: number }) {
  if (!score) return <span className="text-muted-foreground">—</span>;
  const level = getScoreLevel(score);
  return <Badge variant={level.variant}>{level.label}</Badge>;
}
