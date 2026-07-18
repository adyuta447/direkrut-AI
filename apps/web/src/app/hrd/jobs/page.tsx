"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"
import { useDashboard } from "@/context/DashboardContext"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { NoticeDialog } from "@/components/molecules/dashboard/NoticeDialog"
import { SearchInput } from "@/components/molecules/dashboard/SearchInput"
import { JobsNoticeFromUrl } from "@/components/molecules/dashboard/JobsNoticeFromUrl"
import { JobStatusTabs } from "@/components/molecules/dashboard/JobStatusTabs"
import { HrdJobsEmptyState } from "@/components/molecules/dashboard/HrdJobsEmptyState"
import { DepartmentJobGroup } from "@/components/organisms/dashboard/DepartmentJobGroup"
import { EditJobSheet } from "@/components/organisms/dashboard/EditJobSheet"
import { useJobManagementFilters } from "@/lib/jobs/useJobManagementFilters"
import type { Job } from "@/lib/types"

const BANDS = ["bg-primary", "bg-success", "bg-brand-accent-strong", "bg-info", "bg-warning"]

export default function JobManagementPage() {
  const { jobs, departments } = useDashboard()
  const { searchTerm, setSearchTerm, activeTab, setActiveTab, groupedByDept, toggleGroup, isGroupOpen, tabCounts } =
    useJobManagementFilters(jobs, departments)

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const handleOpenEdit = (job: Job) => {
    setSelectedJob(job)
    setIsSheetOpen(true)
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 @container/main w-full">
      <Suspense fallback={null}>
        <JobsNoticeFromUrl />
      </Suspense>
      <NoticeDialog message={notice} onClose={() => setNotice(null)} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          size="lg"
          className="flex-1"
          title="Manajemen Lowongan"
          description="Semua posisi yang lagi kamu buka, atur dari sini."
        />
        <Button className="h-11 px-6 text-base" render={<Link href="/hrd/jobs/new" />}>
          <IconPlus className="size-4 mr-2" /> Lowongan Baru
        </Button>
      </div>

      <EditJobSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        selectedJob={selectedJob}
        onSaved={() => setNotice("Perubahan berhasil disimpan")}
      />

      <div className="max-w-md">
        <SearchInput
          className="rounded-full border-hairline bg-canvas h-12"
          placeholder="Cari judul lowongan atau departemen..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      <JobStatusTabs activeTab={activeTab} onChange={setActiveTab} tabCounts={tabCounts} />

      <div className="flex flex-col gap-6 pt-4">
        {groupedByDept.map((group) => (
          <DepartmentJobGroup
            key={group.id}
            name={group.name}
            jobsInGroup={group.jobsInGroup}
            band={BANDS[departments.findIndex((d) => d.id === group.id) % BANDS.length] ?? BANDS[0]}
            isOpen={isGroupOpen(group.id)}
            onToggle={() => toggleGroup(group.id)}
            onEdit={handleOpenEdit}
          />
        ))}
        {groupedByDept.length === 0 && <HrdJobsEmptyState />}
      </div>
    </div>
  )
}
