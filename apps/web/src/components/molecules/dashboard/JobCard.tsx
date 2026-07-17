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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ConfirmDialog } from "@/components/molecules/dashboard/ConfirmDialog"
import { NoticeDialog } from "@/components/molecules/dashboard/NoticeDialog"

interface Job {
  id: string
  title: string
  department: string
  status: string
  description: string
  location: string
  type: string
  timeline?: { from: string; to: string }
}

interface JobCardProps {
  job: Job
  onEdit: (job: Job) => void
}

export function JobCard({ job, onEdit }: JobCardProps) {
  const { updateJob } = useDashboard()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const handleToggleStatus = (checked: boolean) => {
    updateJob(job.id, { status: checked ? "active" : "inactive" })
  }

  return (
    <Card className="flex flex-col relative">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl line-clamp-1" title={job.title}>
              {job.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-2">
              <IconBriefcase className="size-3.5" />
              {job.department}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">
              {job.status === "active" ? "Aktif" : "Nonaktif"}
            </span>
            <Switch
              checked={job.status === "active"}
              onCheckedChange={handleToggleStatus}
              className="data-[state=checked]:bg-success"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
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
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t pt-4 gap-4 bg-muted/20">
        <Button
          className="w-full sm:w-auto"
          variant="default"
          render={<Link href={`/hrd/jobs/${job.id}/candidates`} />}
        >
          Cek Kandidat
        </Button>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button variant="outline" size="icon" onClick={() => onEdit(job)}>
            <IconEdit className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setConfirmDelete(true)}
          >
            <IconTrash className="size-4" />
          </Button>
          <ConfirmDialog
            open={confirmDelete}
            onOpenChange={setConfirmDelete}
            title="Yakin mau hapus lowongan ini?"
            description={`Lowongan "${job.title}" bakal hilang permanen. Nggak bisa di-undo lho.`}
            confirmLabel="Ya, Hapus"
            onConfirm={() => setNotice("Lowongan udah dihapus")}
          />
          <NoticeDialog message={notice} onClose={() => setNotice(null)} />
        </div>
      </CardFooter>
    </Card>
  )
}
