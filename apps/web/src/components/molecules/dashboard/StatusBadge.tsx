import { IconCalendarEventFilled, IconCircleCheckFilled, IconCircleXFilled, IconLoader, IconTrophyFilled } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { getScoreLevel, getStatusMeta } from "@/lib/dashboard/status";

const STATUS_ICON: Record<string, typeof IconCircleCheckFilled> = {
  submitted: IconCircleCheckFilled,
  "under-review": IconLoader,
  interview: IconCalendarEventFilled,
  interview_completed: IconLoader,
  accepted: IconTrophyFilled,
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

/** Badge level skor rekomendasi AI -- solid dengan angka. */
export function ScoreBadge({ score }: { score?: number }) {
  if (!score && score !== 0) return <span className="text-muted-foreground text-xs">Belum discreen</span>;
  const pct = Math.round(score);
  const color = pct >= 75 ? "text-emerald-600" : pct >= 50 ? "text-amber-500" : "text-rose-500";
  const bg = pct >= 75 ? "bg-emerald-50 border-emerald-200" : pct >= 50 ? "bg-amber-50 border-amber-200" : "bg-rose-50 border-rose-200";
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${bg} ${color}`}>
      <div className="relative w-3.5 h-3.5">
        <svg viewBox="0 0 14 14" className="w-full h-full -rotate-90">
          <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
          <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="2"
            strokeDasharray={`${2 * Math.PI * 5}`}
            strokeDashoffset={`${2 * Math.PI * 5 * (1 - pct / 100)}`}
            strokeLinecap="round" />
        </svg>
      </div>
      {pct}%
    </div>
  );
}
