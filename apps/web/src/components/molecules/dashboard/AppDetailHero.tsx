import { IconBuilding, IconMapPin, IconCalendar, IconUsers } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/molecules/dashboard/StatusBadge"
import { cn } from "@/lib/utils"

interface TimelineStep {
  label: string
  date: string
  done: boolean
  active: boolean
  description: string
}

interface AppDetailHeroProps {
  job: any
  application: any
  isFreshGrad: boolean
  timelineSteps: TimelineStep[]
  statusHelper: Record<string, string>
}

function StatusPanel({ application, timelineSteps, statusHelper }: {
  application: any
  timelineSteps: TimelineStep[]
  statusHelper: Record<string, string>
}) {
  const doneSteps = timelineSteps.filter((s) => s.done).length
  const currentStep = Math.min(doneSteps + 1, timelineSteps.length)
  const progressPct = (doneSteps / timelineSteps.length) * 100

  return (
    <div className="flex flex-col justify-center gap-3 rounded-2xl border bg-background p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status Sekarang</span>
        <StatusBadge status={application.status} />
      </div>
      <div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", application.status === "rejected" ? "bg-destructive" : "bg-primary")}
            style={{ width: `${Math.max(progressPct, 8)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Tahap {currentStep} dari {timelineSteps.length}</p>
      </div>
      <p className="text-sm font-medium">{statusHelper[application.status] ?? statusHelper.submitted}</p>
    </div>
  )
}

export function AppDetailHero({ job, application, isFreshGrad, timelineSteps, statusHelper }: AppDetailHeroProps) {
  return (
    <section className="rounded-4xl border bg-card p-6 md:p-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-accent-strong">Lamaran Kamu</p>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{job.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              <IconBuilding className="size-4" /> {job.company}
            </span>
            <span className="flex items-center gap-1">
              <IconMapPin className="size-4" /> {job.location}
            </span>
            <span className="flex items-center gap-1">
              <IconCalendar className="size-4" /> Melamar {application.appliedDate}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline">{job.type}</Badge>
            <Badge variant="secondary">{isFreshGrad ? "Fresh Graduate Welcome" : "Professional"}</Badge>
          </div>
        </div>
        <StatusPanel application={application} timelineSteps={timelineSteps} statusHelper={statusHelper} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-6 text-sm text-muted-foreground lg:grid-cols-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Industri</span>
          <span>{job.industry || "Teknologi"}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Departemen</span>
          <span>{job.department || "Engineering"}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Gaji</span>
          <span>{job.salaryRange || "Kompetitif"}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Total Kandidat</span>
          <span className="flex items-center gap-1">
            <IconUsers className="size-3.5" />
            {job._applicationCount || 0} orang
          </span>
        </div>
      </div>
    </section>
  )
}
