"use client"

import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { useState } from "react"
import { IconPlus } from "@tabler/icons-react"
import { useDashboard } from "@/context/DashboardContext"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobCard } from "@/components/molecules/dashboard/JobCard"
import { JobFormFields } from "@/components/molecules/dashboard/JobFormFields"
import { NoticeDialog } from "@/components/molecules/dashboard/NoticeDialog"

export default function JobManagementPage() {
  const { jobs } = useDashboard()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [notice, setNotice] = useState<string | null>(null)

  const filteredJobs = jobs.filter((job: any) =>
    activeTab === "all" ? true : job.status === activeTab
  )

  const handleOpenEdit = (job: any) => {
    setSelectedJob(job)
    setIsSheetOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const isEdit = isSheetOpen
    setIsSheetOpen(false)
    setIsDialogOpen(false)
    setNotice(isEdit ? "Perubahan berhasil disimpan" : "Lowongan baru udah gas tayang")
  }

  const tabCounts = (status: string) =>
    status === "all" ? jobs.length : jobs.filter((j: any) => j.status === status).length

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 @container/main w-full">
      <NoticeDialog message={notice} onClose={() => setNotice(null)} />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          className="flex-1"
          title="Manajemen Lowongan"
          description="Semua posisi yang lagi kamu buka, atur dari sini."
        />
        <Button onClick={() => { setSelectedJob(null); setIsDialogOpen(true) }}>
          <IconPlus className="size-4 mr-2" /> Lowongan Baru
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <DialogHeader>
              <DialogTitle>Buka Lowongan Baru</DialogTitle>
              <DialogDescription>Isi detailnya, tinggal gas.</DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <JobFormFields selectedJob={selectedJob} />
            </div>
            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" />}>Batal</DialogClose>
              <Button type="submit">Tambah Lowongan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex flex-col min-h-full p-6">
            <SheetHeader className="px-0 pt-0 pb-4">
              <SheetTitle>Edit Lowongan</SheetTitle>
              <SheetDescription>Ubah yang perlu, sisanya biar tetap sama.</SheetDescription>
            </SheetHeader>
            <div className="flex-1 py-4 space-y-6">
              <JobFormFields selectedJob={selectedJob} />
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-4 pb-4 border-t">
              <SheetClose render={<Button type="button" variant="outline" />}>Batal</SheetClose>
              <Button type="submit">Simpan Perubahan</Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <Tabs value={activeTab} onValueChange={(val) => val && setActiveTab(val)} className="w-full">
        <TabsList className="mb-6 hidden sm:flex w-max **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1">
          {["all", "active", "inactive", "review", "draft"].map((status) => (
            <TabsTrigger key={status} value={status}>
              {status === "all" ? "Semua" : status === "active" ? "Aktif" : status === "inactive" ? "Tidak Aktif" : status === "review" ? "Direview" : "Draft"}
              {" "}<Badge variant="secondary" className="ml-2">{tabCounts(status)}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="sm:hidden mb-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job: any) => (
            <JobCard key={job.id} job={job} onEdit={handleOpenEdit} />
          ))}
          {filteredJobs.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
              Belum ada lowongan buat status ini.
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}
