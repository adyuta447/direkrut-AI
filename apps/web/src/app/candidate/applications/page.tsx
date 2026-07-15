"use client"

import * as React from "react"
import Link from "next/link"
import { useDashboard } from "@/context/DashboardContext"
import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { SearchInput } from "@/components/molecules/dashboard/SearchInput"
import { StatusBadge } from "@/components/molecules/dashboard/StatusBadge"
import { EmptyState } from "@/components/molecules/dashboard/EmptyState"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, ChevronDownIcon, SearchIcon, InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Application, Job } from "@/lib/types"

const STAGE_FILTERS = [
  { label: "Semua Tahapan", match: () => true },
  { label: "Administrasi", match: (a: Application) => a.status === "under-review" },
  { label: "Wawancara AI", match: (a: Application) => a.status === "interview" },
  { label: "Selesai / Ditolak", match: (a: Application) => a.status === "rejected" },
]

const STAGE_HELPER: Record<string, string> = {
  submitted: "Lamaranmu udah masuk dan bakal segera dicek tim rekrutmen. Pantau terus progresnya di sini ya.",
  "under-review": "Profil kamu lagi dicek tim HRD di tahap administrasi. Kalau lolos, kamu bakal diundang ke Wawancara AI.",
  interview: "Selamat, kamu lolos ke tahap Wawancara AI! 🎉 Cek email atau buka detail lamaran buat mulai sesinya.",
  rejected: "Kali ini belum jodoh — prosesnya nggak bisa kami lanjutkan. Masih banyak posisi lain yang nunggu kamu!",
}

function getStageIndex(status: string) {
  if (status === "submitted") return 0
  if (status === "under-review") return 1
  if (status === "interview") return 2
  if (status === "rejected") return 3
  return 0
}

const STEPS = ["Terkirim", "Administrasi", "Wawancara AI", "Keputusan Akhir"]

function ApplicationCard({ app, job }: { app: Application; job: Job }) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const currentStageIndex = getStageIndex(app.status)

  return (
    <div className="rounded-4xl border bg-card transition-colors hover:border-ink-muted">
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start md:p-7">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-muted text-lg font-bold text-muted-foreground">
          {job.company?.charAt(0) ?? "?"}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <h3 className="text-lg font-bold leading-[1.2] tracking-[-0.01em] md:text-xl">
              {job.title}
            </h3>
            <StatusBadge status={app.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{job.company}</span>
            {" · "}
            {job.location}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-muted px-3 py-1.5 text-[12px]">{job.type}</span>
            <span className="rounded-full bg-muted px-3 py-1.5 text-[12px] text-muted-foreground">
              Melamar {app.appliedDate}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
          <Button
            size="sm"
            render={<Link href={`/candidate/applications/${app.id}`} />}
          >
            Detail
            <ArrowRightIcon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            Progres
            <ChevronDownIcon
              className={cn("size-4 transition-transform", isExpanded && "rotate-180")}
            />
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t p-6 animate-in fade-in slide-in-from-top-2 duration-200 md:p-7">
          <div className="relative mx-auto max-w-3xl pt-2 pb-4">
            <div className="absolute top-[13px] left-[12.5%] right-[12.5%] h-0.5 bg-border" />
            <div
              className="absolute top-[13px] left-[12.5%] h-0.5 bg-primary transition-all duration-500"
              style={{ width: `${(currentStageIndex / (STEPS.length - 1)) * 75}%` }}
            />
            <div className="relative z-10 grid grid-cols-4">
              {STEPS.map((label, idx) => {
                const isCompleted = idx <= currentStageIndex
                const isCurrent = idx === currentStageIndex
                const isRejectedEnd = isCurrent && app.status === "rejected"
                return (
                  <div key={label} className="flex flex-col items-center gap-2 text-center">
                    <div
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full border-4 border-card",
                        isRejectedEnd
                          ? "bg-destructive"
                          : isCompleted
                          ? "bg-primary"
                          : "bg-muted-foreground/30",
                        isCurrent && !isRejectedEnd && "ring-4 ring-brand-accent/30"
                      )}
                    >
                      {isCompleted && <div className="size-2 rounded-full bg-card" />}
                    </div>
                    <span
                      className={cn(
                        "text-xs",
                        isCurrent ? "font-semibold" : "text-muted-foreground"
                      )}
                    >
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
            <InfoIcon className="mt-0.5 size-4 shrink-0 text-primary" />
            {STAGE_HELPER[app.status] ?? STAGE_HELPER.submitted}
          </p>
        </div>
      )}
    </div>
  )
}

export default function CandidateApplicationsPage() {
  const { myApplications, jobs } = useDashboard()
  const [activeFilter, setActiveFilter] = React.useState(STAGE_FILTERS[0].label)
  const [searchQuery, setSearchQuery] = React.useState("")

  const stageCounts = React.useMemo(
    () =>
      Object.fromEntries(
        STAGE_FILTERS.map(f => [f.label, myApplications.filter(f.match).length])
      ),
    [myApplications]
  )

  const filteredApps = React.useMemo(() => {
    const stage = STAGE_FILTERS.find(f => f.label === activeFilter) ?? STAGE_FILTERS[0]
    let filtered = myApplications.filter(stage.match)

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(a => {
        const job = jobs.find(j => j.id === a.jobId)
        if (!job) return false
        return job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q)
      })
    }
    return filtered
  }, [myApplications, jobs, activeFilter, searchQuery])

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6 px-4 py-6 md:py-8 lg:px-6">
        <PageHeader
          eyebrow="Progres Kamu"
          title="Riwayat Lamaran"
          description="Semua lamaranmu kepantau di satu tempat. Nggak perlu bolak-balik cek email."
          action={
            <div className="w-full md:w-80">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Cari posisi atau perusahaan..."
              />
            </div>
          }
        />

        <div className="flex flex-wrap items-center gap-2">
          {STAGE_FILTERS.map(f => {
            const active = f.label === activeFilter
            return (
              <button
                key={f.label}
                onClick={() => setActiveFilter(f.label)}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-ink-muted hover:text-foreground"
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[11px] tabular-nums",
                    active ? "bg-white/20" : "bg-muted"
                  )}
                >
                  {stageCounts[f.label]}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-4">
          {filteredApps.length > 0 ? (
            filteredApps.map(app => {
              const job = jobs.find(j => j.id === app.jobId)
              if (!job) return null
              return <ApplicationCard key={app.id} app={app} job={job} />
            })
          ) : (
            <EmptyState
              icon={SearchIcon}
              title="Nggak ada yang cocok"
              description="Coba kata kunci lain atau ganti filter tahapannya."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setActiveFilter(STAGE_FILTERS[0].label)
                  }}
                >
                  Reset Filter
                </Button>
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
