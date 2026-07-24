"use client"

import Image from "next/image"
import { IconBuildingSkyscraper, IconChevronDown } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { JobCard } from "@/components/molecules/dashboard/JobCard"
import type { Job } from "@/lib/types"

interface DepartmentJobGroupProps {
  name: string
  jobsInGroup: Job[]
  isOpen: boolean
  onToggle: () => void
  onEdit: (job: Job) => void
}

/** Satu divisi = satu folder yang bisa dibuka-tutup, biar HRD lihat struktur
    tim dulu sebelum tenggelam di daftar lowongan yang panjang. Header selalu
    biru (bg-primary) buat semua divisi -- konsisten, bukan warna-warni per
    departemen. */
export function DepartmentJobGroup({ name, jobsInGroup, isOpen, onToggle, onEdit }: DepartmentJobGroupProps) {
  return (
    <div className="rounded-3xl border border-hairline bg-canvas overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 bg-primary p-6 text-left text-white"
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
        jobsInGroup.length === 0 ? (
          <div className="flex flex-col items-center gap-2 bg-surface-1 px-6 py-12 text-center">
            <Image
              src="/dashboard/add_file.svg"
              alt=""
              width={260}
              height={195}
              unoptimized
              className="pointer-events-none mb-2 h-40 w-auto select-none"
            />
            <p className="text-[15px] font-semibold text-ink">Belum ada lowongan di divisi ini</p>
            <p className="text-sm text-ink-muted">Buat lowongan baru buat mengisi {name}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
            {jobsInGroup.map((job) => (
              <JobCard key={job.id} job={job} onEdit={onEdit} />
            ))}
          </div>
        )
      )}
    </div>
  )
}
