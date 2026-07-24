"use client"

import { useState } from "react"
import { format } from "date-fns"
import Link from "next/link"
import {
  IconMapPin,
  IconEdit,
  IconTrash,
  IconBriefcase,
} from "@tabler/icons-react"
import { useDashboard } from "@/context/DashboardContext"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ConfirmDialog } from "@/components/molecules/dashboard/ConfirmDialog"
import { NoticeDialog } from "@/components/molecules/dashboard/NoticeDialog"
import { SettingsJobAiScoringSheet } from "@/components/organisms/dashboard/SettingsJobAiScoringSheet"
import type { Job } from "@/lib/types"

interface JobCardProps {
  job: Job
  onEdit: (job: Job) => void
}

const JOB_STATUS_META: Record<string, { label: string; band: string }> = {
  active: { label: "Aktif", band: "bg-success" },
  inactive: { label: "Tidak Aktif", band: "bg-muted-foreground" },
  review: { label: "Direview", band: "bg-[color-mix(in_oklch,var(--warning),black_20%)]" },
  draft: { label: "Draft", band: "bg-info" },
}

export function JobCard({ job, onEdit }: JobCardProps) {
  const { updateJob, deleteJob } = useDashboard()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false)

  const statusMeta = JOB_STATUS_META[job.status ?? "inactive"] ?? JOB_STATUS_META.inactive

  const handleToggleStatus = (checked: boolean) => {
    updateJob(job.id, { status: checked ? "active" : "inactive" })
  }

  return (
    <Card className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 overflow-hidden pt-0 flex flex-col">
      <div className={`${statusMeta.band} p-4`}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-snug text-white line-clamp-2" title={job.title}>
            {job.title}
          </h3>
          <span className="shrink-0 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white whitespace-nowrap">
            {statusMeta.label}
          </span>
        </div>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white">
          <IconBriefcase className="size-3.5 shrink-0" />
          <span className="truncate">{job.department}</span>
        </div>
      </div>

      <CardContent className="flex-1 space-y-4 pt-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <IconMapPin className="size-4 text-primary/70" />
            {job.location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <IconBriefcase className="size-4 text-primary/70" />
            {job.type}
          </div>
          {job.timeline && (
            <div className="flex items-center text-sm text-muted-foreground gap-2 font-medium">
              <span className="bg-warning/10 text-warning px-2 py-0.5 rounded text-xs flex items-center gap-1">
                Tutup {format(new Date(job.timeline.to), "dd MMM yyyy")}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-surface-1 px-4 py-3">
          <span className="text-sm font-medium text-ink">Aktifkan Lowongan</span>
          <Switch
            checked={job.status === "active"}
            onCheckedChange={handleToggleStatus}
            className="data-[state=checked]:bg-success"
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t border-hairline pt-4 gap-4">
        <Button
          className="w-full sm:w-auto"
          variant="default"
          render={<Link href={`/hrd/jobs/${job.id}/candidates`} />}
        >
          Cek Kandidat
        </Button>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button variant="outline" size="icon" className="border-hairline group" onClick={() => setAiSettingsOpen(true)} title="Atur Bobot AI (Khusus Lowongan Ini)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-violet-600 transition-colors group-hover:text-violet-700">
              <path d="M7 11.236v3.764a2 2 0 0 0 2 2h3.764a2 2 0 0 0 1.414-.586l6.236-6.236a2 2 0 0 0 0-2.828l-2.353-2.353a2 2 0 0 0-2.828 0l-6.236 6.236a2 2 0 0 0-.586 1.414" />
              <path d="m14.5 6.5 3 3" />
              <path d="M4.5 19.5 7 17" />
              <path d="m2 22 2.5-2.5" />
              <path d="M8 8v.01" />
              <path d="M16 16v.01" />
            </svg>
          </Button>
          <Button variant="outline" size="icon" className="border-hairline" onClick={() => onEdit(job)} title="Edit Lowongan">
            <IconEdit className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-hairline text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setConfirmDelete(true)}
            title="Hapus Lowongan"
          >
            <IconTrash className="size-4" />
          </Button>
          <SettingsJobAiScoringSheet
            open={aiSettingsOpen}
            onOpenChange={setAiSettingsOpen}
            selectedJob={job}
          />
          <ConfirmDialog
            open={confirmDelete}
            onOpenChange={setConfirmDelete}
            title="Yakin mau hapus lowongan ini?"
            description={`Lowongan "${job.title}" bakal hilang permanen. Nggak bisa di-undo lho.`}
            confirmLabel="Ya, Hapus"
            onConfirm={async () => {
              await deleteJob(job.id)
              setNotice("Lowongan udah dihapus")
            }}
          />
          <NoticeDialog message={notice} onClose={() => setNotice(null)} />
        </div>
      </CardFooter>
    </Card>
  )
}
