"use client"

import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { Suspense, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { IconBuildingSkyscraper, IconChevronDown, IconPlus } from "@tabler/icons-react"
import { useDashboard } from "@/context/DashboardContext"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobCard } from "@/components/molecules/dashboard/JobCard"
import { JobFormFields, parseJobFormValues } from "@/components/molecules/dashboard/JobFormFields"
import { NoticeDialog } from "@/components/molecules/dashboard/NoticeDialog"
import { SearchInput } from "@/components/molecules/dashboard/SearchInput"

const NOTICE_COPY: Record<string, string> = {
  created: "Lowongan baru udah gas tayang",
  draft: "Draft tersimpan, lanjutin kapan aja",
}

const BANDS = ["bg-primary", "bg-success", "bg-brand-accent-strong", "bg-info", "bg-warning"]

function JobsNoticeFromUrl() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    const key = searchParams.get("notice")
    if (key && NOTICE_COPY[key]) {
      setNotice(NOTICE_COPY[key])
      router.replace("/hrd/jobs")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return <NoticeDialog message={notice} onClose={() => setNotice(null)} />
}

/** Satu divisi = satu folder yang bisa dibuka-tutup, biar HRD lihat struktur
    tim dulu sebelum tenggelam di daftar lowongan yang panjang. */
function DepartmentJobGroup({
  name,
  jobsInGroup,
  band,
  isOpen,
  onToggle,
  onEdit,
}: {
  name: string
  jobsInGroup: any[]
  band: string
  isOpen: boolean
  onToggle: () => void
  onEdit: (job: any) => void
}) {
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

export default function JobManagementPage() {
  const { jobs, departments, updateJob } = useDashboard()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [notice, setNotice] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set())

  const term = searchTerm.trim().toLowerCase()

  const statusFiltered = jobs.filter((job: any) =>
    activeTab === "all" ? true : job.status === activeTab
  )
  const searchFiltered = statusFiltered.filter(
    (job: any) =>
      !term ||
      job.title.toLowerCase().includes(term) ||
      job.department.toLowerCase().includes(term)
  )

  const groupedByDept = useMemo(() => {
    const deptNames = new Set(departments.map((d) => d.name))
    const groups = departments.map((d) => ({
      id: d.id,
      name: d.name,
      jobsInGroup: searchFiltered.filter((j: any) => j.department === d.name),
    }))
    const orphanJobs = searchFiltered.filter((j: any) => !deptNames.has(j.department))
    if (orphanJobs.length > 0) {
      groups.push({ id: "__other", name: "Lainnya", jobsInGroup: orphanJobs })
    }
    return term ? groups.filter((g) => g.jobsInGroup.length > 0) : groups
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departments, searchFiltered, term])

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleOpenEdit = (job: any) => {
    setSelectedJob(job)
    setIsSheetOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedJob) return
    const formData = new FormData(e.currentTarget)
    updateJob(selectedJob.id, parseJobFormValues(formData))
    setIsSheetOpen(false)
    setNotice("Perubahan berhasil disimpan")
  }

  const tabCounts = (status: string) =>
    status === "all" ? jobs.length : jobs.filter((j: any) => j.status === status).length

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

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto border-hairline p-0">
          <form onSubmit={handleEditSubmit} className="flex min-h-full flex-col">
            <SheetHeader className="gap-1 bg-primary px-6 py-6 text-white">
              <SheetTitle className="text-[22px] font-bold text-white">Edit Lowongan</SheetTitle>
              <SheetDescription className="text-white/80">
                Ubah yang perlu, sisanya biar tetap sama.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 p-6">
              <JobFormFields selectedJob={selectedJob} />
            </div>
            <div className="flex justify-end gap-3 border-t border-hairline p-6">
              <SheetClose render={<Button type="button" variant="outline" className="border-hairline" />}>
                Batal
              </SheetClose>
              <Button type="submit">Simpan Perubahan</Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <div className="max-w-md">
        <SearchInput
          className="rounded-full border-hairline bg-canvas h-12"
          placeholder="Cari judul lowongan atau departemen..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      <Tabs value={activeTab} onValueChange={(val) => val && setActiveTab(val)} className="w-full">
        <TabsList className="mb-2 hidden sm:flex w-max **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1">
          {["all", "active", "inactive", "review", "draft"].map((status) => (
            <TabsTrigger key={status} value={status}>
              {status === "all" ? "Semua" : status === "active" ? "Aktif" : status === "inactive" ? "Tidak Aktif" : status === "review" ? "Direview" : "Draft"}
              {" "}<Badge variant="secondary" className="ml-2">{tabCounts(status)}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="sm:hidden mb-2">
          <Select value={activeTab} onValueChange={(val) => val && setActiveTab(val)}>
            <SelectTrigger><SelectValue placeholder="Pilih Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Lowongan</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Tidak Aktif</SelectItem>
              <SelectItem value="review">Direview</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-6 pt-4">
          {groupedByDept.map((group) => (
            <DepartmentJobGroup
              key={group.id}
              name={group.name}
              jobsInGroup={group.jobsInGroup}
              band={BANDS[departments.findIndex((d) => d.id === group.id) % BANDS.length] ?? BANDS[0]}
              isOpen={term.length > 0 || openGroups.has(group.id)}
              onToggle={() => toggleGroup(group.id)}
              onEdit={handleOpenEdit}
            />
          ))}
          {groupedByDept.length === 0 && (
            <div className="col-span-full flex flex-col items-center rounded-2xl bg-surface-1 py-12 px-6 text-center">
              <Image
                src="/dashboard/add_file.svg"
                alt=""
                width={200}
                height={150}
                unoptimized
                className="pointer-events-none mb-5 h-28 w-auto select-none"
              />
              <p className="text-[17px] font-semibold text-ink">Belum ada lowongan yang cocok</p>
              <p className="mt-1 text-sm text-ink-muted">Coba ganti kata kunci atau tab status-nya.</p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}
