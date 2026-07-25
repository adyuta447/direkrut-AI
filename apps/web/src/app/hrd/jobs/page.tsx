"use client"

import { Suspense, useState, type DragEvent } from "react"
import Link from "next/link"
import { IconArrowsMove, IconPlus } from "@tabler/icons-react"
import { toast } from "sonner"
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
import { useDesktopDrag } from "@/hooks/use-desktop-drag"
import { useJobManagementFilters } from "@/lib/jobs/useJobManagementFilters"
import type { Job } from "@/lib/types"

export default function JobManagementPage() {
  const { myJobs, departments, updateJob } = useDashboard()
  const { searchTerm, setSearchTerm, activeTab, setActiveTab, groupedByDept, toggleGroup, openGroup, isGroupOpen, tabCounts } =
    useJobManagementFilters(myJobs, departments)
  const isDesktopDragEnabled = useDesktopDrag()

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [draggedJobID, setDraggedJobID] = useState<string | null>(null)
  const [dropTargetID, setDropTargetID] = useState<string | null>(null)
  const [movingJobID, setMovingJobID] = useState<string | null>(null)

  const handleOpenEdit = (job: Job) => {
    setSelectedJob(job)
    setIsSheetOpen(true)
  }

  const clearDragState = () => {
    setDraggedJobID(null)
    setDropTargetID(null)
  }

  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    job: Job,
  ) => {
    if (!isDesktopDragEnabled || movingJobID) {
      event.preventDefault()
      return
    }
    const target = event.target as HTMLElement
    if (target.closest("button, a, input, textarea, select")) {
      event.preventDefault()
      return
    }
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", job.id)
    setDraggedJobID(job.id)
  }

  const handleDragOver = (
    event: DragEvent<HTMLDivElement>,
    groupID: string,
    departmentName: string,
  ) => {
    const draggedJob = myJobs.find((job) => job.id === draggedJobID)
    const canDrop =
      isDesktopDragEnabled &&
      departmentName !== "Lainnya" &&
      draggedJob?.department !== departmentName
    if (!canDrop) return
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
    setDropTargetID(groupID)
  }

  const handleDragLeave = (
    event: DragEvent<HTMLDivElement>,
    groupID: string,
  ) => {
    const nextTarget = event.relatedTarget
    if (
      nextTarget instanceof Node &&
      event.currentTarget.contains(nextTarget)
    ) {
      return
    }
    setDropTargetID((current) => (current === groupID ? null : current))
  }

  const handleDrop = async (
    event: DragEvent<HTMLDivElement>,
    groupID: string,
    departmentName: string,
  ) => {
    event.preventDefault()
    const jobID = draggedJobID || event.dataTransfer.getData("text/plain")
    const job = myJobs.find((item) => item.id === jobID)
    clearDragState()
    if (
      !isDesktopDragEnabled ||
      !job ||
      departmentName === "Lainnya" ||
      job.department === departmentName
    ) {
      return
    }

    openGroup(groupID)
    setMovingJobID(job.id)
    try {
      await updateJob(job.id, { department: departmentName })
      toast.success(`"${job.title}" dipindahkan ke ${departmentName}`)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal memindahkan lowongan. Coba lagi ya.",
      )
    } finally {
      setMovingJobID(null)
    }
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
        onSaveError={setNotice}
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

      {isDesktopDragEnabled ? (
        <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-ink-muted">
          <IconArrowsMove className="size-5 shrink-0 text-primary" />
          Tarik kartu lowongan ke departemen lain untuk memindahkannya.
        </div>
      ) : null}

      <div className="flex flex-col gap-6 pt-4">
        {groupedByDept.map((group) => (
          <DepartmentJobGroup
            key={group.id}
            name={group.name}
            jobsInGroup={group.jobsInGroup}
            isOpen={isGroupOpen(group.id)}
            onToggle={() => toggleGroup(group.id)}
            onEdit={handleOpenEdit}
            dragEnabled={isDesktopDragEnabled}
            draggedJobID={draggedJobID}
            movingJobID={movingJobID}
            isDropTarget={dropTargetID === group.id}
            canReceiveDrop={group.name !== "Lainnya"}
            onJobDragStart={handleDragStart}
            onJobDragEnd={clearDragState}
            onDragOver={(event) =>
              handleDragOver(event, group.id, group.name)
            }
            onDragLeave={(event) => handleDragLeave(event, group.id)}
            onDrop={(event) => handleDrop(event, group.id, group.name)}
          />
        ))}
        {groupedByDept.length === 0 && <HrdJobsEmptyState />}
      </div>
    </div>
  )
}
