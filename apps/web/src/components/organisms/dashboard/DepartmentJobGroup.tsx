"use client"

import { IconBuildingSkyscraper, IconChevronDown } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { JobCard } from "@/components/molecules/dashboard/JobCard"
import type { Job } from "@/lib/types"

interface DepartmentJobGroupProps {
  name: string
  jobsInGroup: Job[]
  band: string
  isOpen: boolean
  onToggle: () => void
  onEdit: (job: Job) => void
}

/** Satu divisi = satu folder yang bisa dibuka-tutup, biar HRD lihat struktur
    tim dulu sebelum tenggelam di daftar lowongan yang panjang. */
export function DepartmentJobGroup({ name, jobsInGroup, band, isOpen, onToggle, onEdit }: DepartmentJobGroupProps) {
  return (
    <div className="rounded-3xl border border-hairline bg-canvas overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(band, "flex w-full items-center justify-between gap-4 p-6 text-left text-white")}
      >
        <div className="flex items-center gap-4 min-w-0">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/15">
            <IconBuildingSkyscraper className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-xl font-bold sm:text-2xl">{name}</h3>
            <p className="text-sm text-white/80">{jobsInGroup.length} lowongan</p>
          </div>
        </div>
        <IconChevronDown className={cn("size-6 shrink-0 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
          {jobsInGroup.map((job) => (
            <JobCard key={job.id} job={job} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  )
}
