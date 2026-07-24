"use client"

import { StatusLegendPopover, type StatusLegendItem } from "@/components/molecules/dashboard/StatusLegendPopover"
import { SearchInput } from "@/components/molecules/dashboard/SearchInput"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Application } from "@/lib/types"

const CANDIDATE_STATUS_FLOW: StatusLegendItem[] = [
  { status: "submitted", meaning: "Lamaran terkirim. Menunggu proses screening awal." },
  { status: "under-review", meaning: "CV Anda sedang ditinjau secara mendalam oleh sistem dan HRD." },
  { status: "interview", meaning: "Anda diundang! Segera selesaikan Wawancara AI." },
  { status: "rejected", meaning: "Maaf, kualifikasi Anda belum sesuai. Terus kembangkan diri!" },
]

interface CandidateAppTableToolbarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  applications: Application[]
}

export function CandidateAppTableToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  applications
}: CandidateAppTableToolbarProps) {
  const statusCount = (s: string) => applications.filter(a => a.status === s).length;
  
  const TABS = [
    { id: "all", label: "Semua", count: applications.length },
    { id: "submitted", label: "Terkirim", count: statusCount("submitted") },
    { id: "under-review", label: "Administrasi", count: statusCount("under-review") },
    { id: "interview", label: "Wawancara", count: statusCount("interview") },
    { id: "rejected", label: "Ditolak", count: statusCount("rejected") },
  ];

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-[-0.02em] md:text-2xl">Lamaran Saya</h2>
        <StatusLegendPopover
          items={CANDIDATE_STATUS_FLOW}
          footnote="Pantau terus status ini. Keputusan akhir ada pada tim HRD masing-masing perusahaan."
        />
      </div>

      <div className="flex flex-col @4xl/main:flex-row gap-4 items-start @4xl/main:items-center w-full">
        <div className="w-full @4xl/main:flex-1 @4xl/main:max-w-xs">
          <SearchInput
            className="rounded-full border-hairline bg-canvas w-full"
            placeholder="Cari posisi atau perusahaan..."
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>

        <div className="w-full @4xl/main:w-auto flex-none overflow-x-auto pb-1 @4xl/main:pb-0">
          <Label htmlFor="status-filter" className="sr-only">
            Filter Status
          </Label>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger
              id="status-filter"
              className="w-full sm:w-[180px] rounded-full border-hairline bg-canvas @4xl/main:hidden"
            >
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="submitted">Terkirim</SelectItem>
              <SelectItem value="under-review">Dalam Peninjauan</SelectItem>
              <SelectItem value="interview">Wawancara</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
            </SelectContent>
          </Select>

          {/* Desktop Pills */}
          <div className="hidden h-9 w-full justify-start rounded-full border border-hairline bg-canvas p-1 @4xl/main:flex">
            {TABS.map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onStatusFilterChange(tab.id)}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium transition-all ${
                    isActive 
                      ? "bg-primary text-white" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  <Badge variant="secondary" className={`ml-2 rounded-full px-1.5 ${isActive ? 'bg-white/25 text-white' : 'bg-surface-2'}`}>
                    {tab.count}
                  </Badge>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
