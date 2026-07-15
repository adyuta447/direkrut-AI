"use client"

import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import * as React from "react"
import { useState } from "react"
import { 
  IconPlus, 
  IconMapPin, 
  IconEdit, 
  IconTrash, 
  IconBriefcase 
} from "@tabler/icons-react"
import { useDashboard } from "@/context/DashboardContext"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { format } from "date-fns"

export default function JobManagementPage() {
  const { jobs, updateJob } = useDashboard()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")

  const filteredJobs = jobs.filter((job: any) => {
    if (activeTab === "all") return true;
    return job.status === activeTab;
  });

  const handleToggleStatus = (jobId: string, checked: boolean) => {
    updateJob(jobId, { status: checked ? "active" : "inactive" })
  }

  const handleOpenEdit = (job: any) => {
    setSelectedJob(job)
    setIsSheetOpen(true)
  }

  const handleOpenAdd = () => {
    setSelectedJob(null)
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setIsSheetOpen(false)
    setIsDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-8 @container/main w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          className="flex-1"
          title="Manajemen Lowongan"
          description="Kelola posisi dan lowongan pekerjaan yang terbuka di perusahaan Anda."
        />

        <Button onClick={handleOpenAdd}>
          <IconPlus className="size-4 mr-2" />
          Lowongan Baru
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="flex flex-col">
              <DialogHeader>
                <DialogTitle>Tambah Lowongan Baru</DialogTitle>
                <DialogDescription>
                  Isi detail pekerjaan baru di bawah ini.
                </DialogDescription>
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
                <SheetDescription>
                  Ubah detail pekerjaan di bawah ini. Pastikan kualifikasi ditulis dengan jelas.
                </SheetDescription>
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
      </div>

      <Tabs value={activeTab} onValueChange={(val) => val && setActiveTab(val)} className="w-full">
        <TabsList className="mb-6 hidden sm:flex w-max **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1">
          <TabsTrigger value="all">
            Semua <Badge variant="secondary" className="ml-2">{jobs.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active">
            Aktif <Badge variant="secondary" className="ml-2">{jobs.filter((j: any) => j.status === "active").length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Tidak Aktif <Badge variant="secondary" className="ml-2">{jobs.filter((j: any) => j.status === "inactive").length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="review">
            Direview <Badge variant="secondary" className="ml-2">{jobs.filter((j: any) => j.status === "review").length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="draft">
            Draft <Badge variant="secondary" className="ml-2">{jobs.filter((j: any) => j.status === "draft").length}</Badge>
          </TabsTrigger>
        </TabsList>
        <div className="sm:hidden mb-6">
          <Select value={activeTab} onValueChange={(val) => val && setActiveTab(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
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
            <Card key={job.id} className="flex flex-col relative">
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
                  <span className="text-xs font-semibold text-muted-foreground uppercase">{job.status === 'active' ? 'Aktif' : 'Nonaktif'}</span>
                  <Switch 
                    checked={job.status === "active"} 
                    onCheckedChange={(c) => handleToggleStatus(job.id, c)}
                    className="data-[state=checked]:bg-success"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {job.description}
              </p>
              
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
              <Button className="w-full sm:w-auto" variant="default" render={<Link href={`/hrd/jobs/${job.id}/candidates`} />}>
                Lihat Detail Kandidat
            </Button>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <Button variant="outline" size="icon" onClick={() => handleOpenEdit(job)}>
                  <IconEdit className="size-4" />
                </Button>
                <Dialog>
                  <DialogTrigger render={<Button variant="outline" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" />}>
                      <IconTrash className="size-4" />
                    </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Hapus Lowongan</DialogTitle>
                      <DialogDescription>
                        Apakah Anda yakin ingin menghapus lowongan <span className="font-semibold text-foreground">"{job.title}"</span>? Tindakan ini tidak dapat dibatalkan.
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
        ))}
        {filteredJobs.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
            Tidak ada lowongan dengan status ini.
          </div>
        )}
        </div>
      </Tabs>
    </div>
  )
}

function JobFormFields({ selectedJob }: { selectedJob: any }) {
  const initialDept = selectedJob?.department || ""
  const initialType = selectedJob?.type || ""
  
  const knownDepts = ["Engineering", "Design", "Marketing", "HR"]
  const isInitialDeptCustom = initialDept && !knownDepts.some(d => d.toLowerCase() === initialDept.toLowerCase())
  
  const knownTypes = ["Penuh Waktu", "Paruh Waktu", "Kontrak"]
  const isInitialTypeCustom = initialType && !knownTypes.includes(initialType)

  const matchedDept = knownDepts.find(d => d.toLowerCase() === initialDept.toLowerCase())
  const [deptMode, setDeptMode] = useState(isInitialDeptCustom ? "Lainnya" : (matchedDept || ""))
  const [customDept, setCustomDept] = useState(isInitialDeptCustom ? initialDept : "")

  const [typeMode, setTypeMode] = useState(isInitialTypeCustom ? "Lainnya" : (initialType || ""))
  const [customType, setCustomType] = useState(isInitialTypeCustom ? initialType : "")

  const [hasTimeline, setHasTimeline] = useState(!!selectedJob?.timeline)
  const initialStartDate = selectedJob?.timeline?.from ? new Date(selectedJob.timeline.from).toISOString().split('T')[0] : ""
  const initialEndDate = selectedJob?.timeline?.to ? new Date(selectedJob.timeline.to).toISOString().split('T')[0] : ""

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="title">Judul Pekerjaan</Label>
        <Input 
          id="title" 
          placeholder="Contoh: Software Engineer" 
          defaultValue={selectedJob?.title || ""} 
          required 
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <div className="space-y-2">
          <Label>Departemen</Label>
          <Select value={deptMode} onValueChange={(val: any) => val && setDeptMode(val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Lainnya">Lainnya...</SelectItem>
            </SelectContent>
          </Select>
          {deptMode === "Lainnya" && (
            <Input 
              placeholder="Tuliskan nama departemen..." 
              value={customDept}
              onChange={(e) => setCustomDept(e.target.value)}
              className="mt-2"
              required 
            />
          )}
        </div>
        <div className="space-y-2">
          <Label>Tipe Pekerjaan</Label>
          <Select value={typeMode} onValueChange={setTypeMode}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Penuh Waktu">Penuh Waktu</SelectItem>
              <SelectItem value="Paruh Waktu">Paruh Waktu</SelectItem>
              <SelectItem value="Kontrak">Kontrak</SelectItem>
              <SelectItem value="Lainnya">Lainnya...</SelectItem>
            </SelectContent>
          </Select>
          {typeMode === "Lainnya" && (
            <Input 
              placeholder="Tuliskan tipe pekerjaan..." 
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              className="mt-2"
              required 
            />
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="salaryRange">Rentang Gaji (Opsional)</Label>
        <Input 
          id="salaryRange" 
          placeholder="Contoh: Rp 5.000.000 - Rp 10.000.000" 
          defaultValue={selectedJob?.salaryRange || ""} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Lokasi</Label>
        <Input 
          id="location" 
          placeholder="Contoh: Jakarta (Hybrid)" 
          defaultValue={selectedJob?.location || ""} 
          required 
        />
      </div>
      <div className="border-t pt-4 mt-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Label className="text-base font-semibold">Batas Waktu (Timeline)</Label>
            <p className="text-sm text-muted-foreground">Aktifkan jika lowongan memiliki batas waktu (misal: Magang)</p>
          </div>
          <Switch checked={hasTimeline} onCheckedChange={setHasTimeline} />
        </div>
        
        {hasTimeline && (
          <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border border-border">
            <div className="space-y-2">
              <Label htmlFor="date-from">Tanggal Mulai</Label>
              <Input type="date" id="date-from" required defaultValue={initialStartDate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to">Tanggal Berakhir</Label>
              <Input type="date" id="date-to" required defaultValue={initialEndDate} />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 pt-2 border-t mt-2">
        <Label htmlFor="description">Deskripsi Pekerjaan</Label>
        <Textarea 
          id="description" 
          placeholder="Jelaskan peran dan tanggung jawab..." 
          className="min-h-[100px]" 
          defaultValue={selectedJob?.description || ""} 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="requirements">Kualifikasi Utama</Label>
        <Textarea 
          id="requirements" 
          placeholder="Tuliskan kualifikasi (pisahkan dengan baris baru)" 
          className="min-h-[100px]"
          defaultValue={selectedJob?.requirements?.join('\n') || ""}
        />
      </div>
    </div>
  )
}
