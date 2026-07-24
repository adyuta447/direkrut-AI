import { cn } from "@/lib/utils"
import type { Application } from "@/lib/types"

export interface StageFilter {
  label: string
  match: (a: Application) => boolean
}

export const STAGE_FILTERS: StageFilter[] = [
  { label: "Semua Tahapan", match: () => true },
  { label: "Administrasi", match: (a) => a.status === "under-review" },
  { label: "Wawancara Teknis", match: (a) => a.status === "interview" || a.status === "interview_completed" },
  { label: "Selesai / Ditolak", match: (a) => a.status === "accepted" || a.status === "rejected" },
]

interface ApplicationStageFilterProps {
  applications: Application[]
  activeFilter: string
  onFilterChange: (label: string) => void
}

export function ApplicationStageFilter({
  applications,
  activeFilter,
  onFilterChange,
}: ApplicationStageFilterProps) {
  const stageCounts = Object.fromEntries(
    STAGE_FILTERS.map((f) => [f.label, applications.filter(f.match).length])
  )

  return (
    <div className="flex flex-wrap items-center gap-2">
      {STAGE_FILTERS.map((f) => {
        const active = f.label === activeFilter
        return (
          <button
            key={f.label}
            onClick={() => onFilterChange(f.label)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-ink-muted hover:text-foreground",
            )}
          >
            {f.label}
            <span
              className={cn(
                "rounded-full px-1.5 text-[11px] tabular-nums",
                active ? "bg-white/20" : "bg-muted",
              )}
            >
              {stageCounts[f.label]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
