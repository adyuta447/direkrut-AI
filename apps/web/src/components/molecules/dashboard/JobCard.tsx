"use client"

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"

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
                Berakhir: {format(new Date(job.timeline.to), "dd MMM yyyy")}
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
          Lihat Detail Kandidat
        </Button>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button variant="outline" size="icon" onClick={() => onEdit(job)}>
            <IconEdit className="size-4" />
          </Button>
          <Dialog>
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                />
              }
            >
              <IconTrash className="size-4" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Hapus Lowongan</DialogTitle>
                <DialogDescription>
                  Apakah Anda yakin ingin menghapus lowongan{" "}
                  <span className="font-semibold text-foreground">&quot;{job.title}&quot;</span>?
                  Tindakan ini tidak dapat dibatalkan.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-end gap-2 mt-4">
                <DialogClose render={<Button type="button" variant="outline" />}>
                  Batal
                </DialogClose>
                <DialogClose render={<Button type="button" variant="destructive" />}>
                  Ya, Hapus
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  )
}
