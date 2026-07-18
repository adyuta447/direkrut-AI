"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/molecules/dashboard/StatusBadge"
import type { Application, Job } from "@/lib/types"

const STEPS = ["Terkirim", "Administrasi", "Wawancara AI", "Keputusan Akhir"]

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

interface ApplicationCardProps {
  app: Application
  job: Job
}

function ApplicationProgressBar({ app }: { app: Application }) {
  const currentStageIndex = getStageIndex(app.status)
  return (
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
                    isCurrent && !isRejectedEnd && "ring-4 ring-brand-accent/30",
                  )}
                >
                  {isCompleted && <div className="size-2 rounded-full bg-card" />}
                </div>
                <span className={cn("text-xs", isCurrent ? "font-semibold" : "text-muted-foreground")}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
        {STAGE_HELPER[app.status] ?? STAGE_HELPER.submitted}
      </p>
    </div>
  )
}

export function ApplicationCard({ app, job }: ApplicationCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <div className="rounded-4xl border bg-card transition-colors hover:border-ink-muted">
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start md:p-7">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-bold text-muted-foreground">
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

      {isExpanded && <ApplicationProgressBar app={app} />}
    </div>
  )
}
