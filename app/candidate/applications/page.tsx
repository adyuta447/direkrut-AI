"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useApp } from "@/components/providers/app-provider"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  IconSearch,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react"
import { CheckCircle2Icon, CircleIcon } from "lucide-react"
import type { Application, Job } from "@/lib/types"

const dummyLogo = "https://media.wired.com/photos/5926ffe47034dc5f91bed4e8/3:2/w_2560%2Cc_limit/google-logo.jpg"

function getStageIndex(status: string) {
  if (status === "submitted") return 0
  if (status === "under-review") return 1
  if (status === "interview") return 2
  if (status === "rejected") return 3
  return 0
}

function getStageName(status: string) {
  if (status === "submitted") return "Terkirim"
  if (status === "under-review") return "Seleksi Administratif"
  if (status === "interview") return "Wawancara AI"
  if (status === "rejected") return "Keputusan Akhir"
  return "Terkirim"
}

function getStatusText(status: string) {
  if (status === "submitted") return "Lamaran Diterima"
  if (status === "under-review") return "Sedang Diproses"
  if (status === "interview") return "Menunggu Wawancara"
  if (status === "rejected") return "Lowongan Telah Ditutup / Ditolak"
  return "Menunggu"
}

function ApplicationCard({ app, job }: { app: Application; job: Job }) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const currentStageIndex = getStageIndex(app.status)
  
  const steps = [
    { title: "Terkirim", index: 0 },
    { title: "Seleksi Administratif", index: 1 },
    { title: "Wawancara AI", index: 2 },
    { title: "Keputusan Akhir", index: 3 },
  ]

  return (
    <Card className="overflow-hidden bg-background">
      <CardContent className="p-0">
        <div className="p-4 sm:p-6 pb-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-start">

            <div className="shrink-0 rounded-lg overflow-hidden border bg-white flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20">
              
              <img src={dummyLogo} alt="Company Logo" className="object-cover w-full h-full" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg sm:text-xl text-foreground truncate">
                {job.title}
              </h3>
              <p className="text-primary font-medium text-sm sm:text-base">
                {job.company} - {job.location}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Tanggal Lamar</p>
                  <p className="font-medium">{app.appliedDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Kegiatan</p>
                  <p className="font-medium uppercase tracking-wider text-xs mt-1.5">DIREKRUT AI</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Tahap Rekrutmen</p>
                  <p className="font-medium">{getStageName(app.status)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Status</p>
                  <p className="font-medium">{getStatusText(app.status)}</p>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col justify-between items-end gap-3 mt-4 sm:mt-0">
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 font-semibold"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Sembunyikan" : "Tampilkan"}
              </Button>
              <Button
                size="sm"
                className="w-full sm:w-auto"
                render={<Link href={`/candidate/applications/${app.id}`} />}
              >
                Detail
              </Button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t bg-muted/10 p-4 sm:p-6 animate-in slide-in-from-top-2 fade-in duration-200">
            
            <div className="relative max-w-4xl mx-auto py-8">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0"></div>

              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
                style={{ width: `${(currentStageIndex / (steps.length - 1)) * 100}%` }}
              ></div>

              <div className="relative z-10 flex justify-between items-center w-full">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStageIndex
                  const isCurrent = idx === currentStageIndex
                  
                  return (
                    <div key={idx} className="flex flex-col items-center justify-center relative w-1/4">
                      
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-4 border-background transition-colors ${
                        isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                      } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}>
                        {isCompleted && <div className="w-2 h-2 rounded-full bg-background" />}
                      </div>

                      <div className="absolute top-8 w-max text-center flex flex-col items-center">
                        <span className={`text-xs font-medium ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.title}
                        </span>
                        {isCurrent && app.status === "rejected" && (
                          <Badge variant="destructive" className="mt-1 text-[10px] h-5 px-1.5 py-0">Ditolak</Badge>
                        )}
                        {isCurrent && app.status !== "rejected" && (
                          <span className="text-[10px] text-muted-foreground mt-0.5">{app.appliedDate}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-12 bg-background border rounded-lg p-4 text-sm text-muted-foreground">
              {app.status === "submitted" && (
                "Lamaran Anda telah kami terima dan akan segera direview oleh tim rekrutmen. Pantau terus status lamaran Anda secara berkala."
              )}
              {app.status === "under-review" && (
                "Profil dan lamaran Anda saat ini sedang dalam tahap seleksi administratif oleh tim HRD. Jika lolos, Anda akan diundang ke tahap Wawancara AI."
              )}
              {app.status === "interview" && (
                "Selamat! Anda lolos ke tahap Wawancara AI. Silakan periksa email Anda atau buka halaman detail lamaran untuk memulai sesi wawancara."
              )}
              {app.status === "rejected" && (
                "Sehubungan dengan telah ditutupnya lowongan atau hasil evaluasi, maka proses rekrutmen Anda tidak dapat kami lanjutkan. Terima kasih banyak atas waktu dan energi yang Anda luangkan. Sampai berjumpa di kesempatan berikutnya."
              )}
            </div>
            
            <div className="mt-4 text-xs text-muted-foreground">
              Belum mendapatkan update informasi? <a href="#" className="font-medium text-primary hover:underline">Hubungi tim perekrut</a> atau kunjungi <a href="#" className="font-medium text-primary hover:underline">FAQ</a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function CandidateApplicationsCardsPage() {
  const { applications, jobs } = useApp()
  const [activeTab, setActiveTab] = React.useState("Semua Tahapan")
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredApps = React.useMemo(() => {
    let filtered = [...applications]

    if (activeTab === "Seleksi Administratif") {
      filtered = filtered.filter(a => a.status === "under-review")
    } else if (activeTab === "Wawancara AI") {
      filtered = filtered.filter(a => a.status === "interview")
    } else if (activeTab === "Selesai / Ditolak") {
      filtered = filtered.filter(a => a.status === "rejected")
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(a => {
        const job = jobs.find(j => j.id === a.jobId)
        if (!job) return false
        return job.title.toLowerCase().includes(q) || job.company.toLowerCase().includes(q)
      })
    }

    return filtered
  }, [applications, jobs, activeTab, searchQuery])

  const countReview = applications.filter(a => a.status === "under-review").length
  const countInterview = applications.filter(a => a.status === "interview").length
  const countRejected = applications.filter(a => a.status === "rejected").length

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Daftar Riwayat Lamaran</h1>
            <p className="text-muted-foreground mt-1 text-sm">Pantau dan kelola seluruh lamaran pekerjaan Anda.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-4 p-4 border rounded-xl bg-background/50 backdrop-blur-sm">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                placeholder="Temukan Posisi atau Perusahaan..."
                className="pl-9 bg-background"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <Select value={activeTab} onValueChange={(val) => val && setActiveTab(val)}>
                <SelectTrigger className="w-full md:w-[240px] bg-background">
                  <SelectValue placeholder="Semua Tahapan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Semua Tahapan">Semua Tahapan</SelectItem>
                  <SelectItem value="Seleksi Administratif">Seleksi Administratif</SelectItem>
                  <SelectItem value="Wawancara AI">Wawancara AI</SelectItem>
                  <SelectItem value="Selesai / Ditolak">Selesai / Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-2">
            {filteredApps.length > 0 ? (
              filteredApps.map(app => {
                const job = jobs.find(j => j.id === app.jobId)
                if (!job) return null
                return <ApplicationCard key={app.id} app={app} job={job} />
              })
            ) : (
              <div className="text-center p-12 border rounded-xl bg-muted/20">
                <p className="text-muted-foreground">Tidak ada lamaran yang sesuai dengan pencarian Anda.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
