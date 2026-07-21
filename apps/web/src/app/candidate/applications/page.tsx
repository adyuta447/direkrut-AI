"use client"

import * as React from "react"
import { useDashboard } from "@/context/DashboardContext"
import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { SearchInput } from "@/components/molecules/dashboard/SearchInput"
import { EmptyState } from "@/components/molecules/dashboard/EmptyState"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"
import {
  ApplicationCard,
} from "@/components/molecules/dashboard/ApplicationCard"
import {
  ApplicationStageFilter,
  STAGE_FILTERS,
} from "@/components/molecules/dashboard/ApplicationStageFilter"
import { StatusLegendPopover, type StatusLegendItem } from "@/components/molecules/dashboard/StatusLegendPopover"

// Wording dari sudut pandang kandidat -- state machine yang sama dengan
// legend di dashboard HRD, biar dua sisi baca alur yang konsisten.
const CANDIDATE_STATUS_FLOW: StatusLegendItem[] = [
  { status: "submitted", meaning: "Lamaranmu masuk -- CV kamu lagi discreen AI." },
  { status: "under-review", meaning: "Tim HRD lagi meninjau hasil screening & wawancaramu." },
  { status: "interview", meaning: "Selamat! Kamu diundang wawancara lanjutan bareng tim perusahaan." },
  { status: "rejected", meaning: "Belum lolos kali ini -- cek email, ada feedback pengembangan buat kamu." },
]

export default function CandidateApplicationsPage() {
  const { myApplications, jobs } = useDashboard()
  const [activeFilter, setActiveFilter] = React.useState(STAGE_FILTERS[0].label)
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredApps = React.useMemo(() => {
    const stage = STAGE_FILTERS.find((f) => f.label === activeFilter) ?? STAGE_FILTERS[0]
    let filtered = myApplications.filter(stage.match)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter((a) => {
        const job = jobs.find((j) => j.id === a.jobId)
        if (!job) return false
        return (
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q)
        )
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
            <div className="flex w-full items-center gap-2 md:w-auto">
              <div className="w-full md:w-80">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Cari posisi atau perusahaan..."
                />
              </div>
              <StatusLegendPopover
                items={CANDIDATE_STATUS_FLOW}
                footnote="AI cuma bantu screening awal -- keputusan akhir selalu di tangan tim HRD perusahaan."
              />
            </div>
          }
        />

        <ApplicationStageFilter
          applications={myApplications}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className="flex flex-col gap-4">
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => {
              const job = jobs.find((j) => j.id === app.jobId)
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
