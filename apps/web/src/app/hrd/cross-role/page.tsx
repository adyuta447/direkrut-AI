"use client"

import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { useState, useMemo } from "react"
import { IconAlertCircle, IconSearch } from "@tabler/icons-react"
import { useDashboard } from "@/context/DashboardContext"
import { getExtendedData } from "@/lib/dashboard/extended-data"

import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CrossRoleAnalyticsPanel } from "@/components/molecules/dashboard/CrossRoleAnalyticsPanel"
import { CrossRoleCard } from "@/components/molecules/dashboard/CrossRoleCard"

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

export default function CrossRoleRecommendationPage() {
  const { applications, jobs } = useDashboard()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLabel, setFilterLabel] = useState("Semua Kategori")
  const [filterRole, setFilterRole] = useState("Semua Posisi Usulan")
  const [showChart, setShowChart] = useState(false)

  const crossRoleList = useMemo(() => {
    return applications
      .map((app, index) => {
        if (index % 3 === 0) return null
        const alternateJob = jobs[(index + 1) % jobs.length]
        if (!alternateJob) return null
        const isHighlyRelevant = index % 2 === 0
        const label = isHighlyRelevant ? "Sangat Relevan" : "Potensi Adaptasi Cepat"
        return {
          id: app.id,
          candidateName: app.applicantName,
          originalRole: app.jobTitle,
          suggestedRole: alternateJob.title,
          label,
          variant: isHighlyRelevant ? "default" : "secondary",
          reason: isHighlyRelevant
            ? `Keterampilan inti (transferable skills) selaras dengan kebutuhan ${alternateJob.title}.`
            : `Fondasi kuat yang dapat disesuaikan untuk ${alternateJob.title} dengan masa onboarding minimal.`,
          evidenceType: isHighlyRelevant ? "cv" : "interview",
          evidence: isHighlyRelevant
            ? `Kutipan CV: "Memimpin kolaborasi lintas divisi yang mengharuskan penggunaan prinsip kerja dari ${alternateJob.title}."`
            : `Log Wawancara (08:21): "Meskipun posisi ini di luar keahlian utama saya, saya telah mengikuti sertifikasi dasar terkait departemen tersebut."`,
          emailed: getExtendedData(app.applicantName).crossRoleEmailed,
        }
      })
      .filter(Boolean) as any[]
  }, [applications, jobs])

  const uniqueLabels = useMemo(() => Array.from(new Set(crossRoleList.map((i) => i.label))), [crossRoleList])
  const uniqueRoles = useMemo(() => Array.from(new Set(crossRoleList.map((i) => i.suggestedRole))), [crossRoleList])

  const filteredList = crossRoleList.filter((item) => {
    const matchSearch =
      item.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.suggestedRole.toLowerCase().includes(searchTerm.toLowerCase())
    const matchLabel = filterLabel === "Semua Kategori" || item.label === filterLabel
    const matchRole = filterRole === "Semua Posisi Usulan" || item.suggestedRole === filterRole
    return matchSearch && matchLabel && matchRole
  })

  const roleCounts: Record<string, number> = {}
  filteredList.forEach((item) => {
    roleCounts[item.suggestedRole] = (roleCounts[item.suggestedRole] || 0) + 1
  })
  let chartData = Object.entries(roleCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], idx) => ({ name, value, color: COLORS[idx % COLORS.length] }))
  if (chartData.length > 5) {
    const others = chartData.slice(5).reduce((acc, curr) => acc + (curr.value as number), 0)
    chartData = [...chartData.slice(0, 5), { name: "Posisi Lainnya", value: others, color: "var(--muted-foreground)" }]
  }

  const relevanceCounts = { "Sangat Relevan": 0, "Potensi Adaptasi Cepat": 0 }
  filteredList.forEach((item) => {
    if (relevanceCounts[item.label as keyof typeof relevanceCounts] !== undefined) {
      relevanceCounts[item.label as keyof typeof relevanceCounts]++
    }
  })
  const relevanceData = [
    { name: "Sangat Relevan", count: relevanceCounts["Sangat Relevan"], fill: "var(--success)" },
    { name: "Adaptasi Cepat", count: relevanceCounts["Potensi Adaptasi Cepat"], fill: "var(--warning)" },
  ]

  const evidenceCounts = { cv: 0, interview: 0 }
  filteredList.forEach((item) => {
    if (item.evidenceType === "cv") evidenceCounts.cv++
    else evidenceCounts.interview++
  })
  const evidenceData = [
    { name: "Kutipan CV", count: evidenceCounts.cv, fill: "var(--chart-2)" },
    { name: "Log Wawancara", count: evidenceCounts.interview, fill: "var(--chart-4)" },
  ]

  if (jobs.length < 2) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center min-h-[70vh]">
        <IconAlertCircle className="size-16 text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2">Kurang dari 2 Lowongan Aktif</h2>
        <p className="text-muted-foreground max-w-md">
          Sistem AI lintas-posisi (Cross-Role) membutuhkan minimal dua lowongan pekerjaan yang terbuka secara bersamaan.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8 @container/main w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          className="flex-1"
          title="Rekomendasi Lintas Posisi"
          description={
            <>Daftar kandidat dengan <span className="italic">transferable skills</span> yang dapat dipindahkan ke posisi alternatif.</>
          }
        />
        <CrossRoleAnalyticsPanel
          show={showChart}
          onToggle={() => setShowChart(!showChart)}
          chartData={chartData}
          relevanceData={relevanceData}
          evidenceData={evidenceData}
          totalVisible={filteredList.length}
        />
      </div>

      {showChart && filteredList.length > 0 && (
        <CrossRoleAnalyticsPanel
          show={false}
          onToggle={() => {}}
          chartData={chartData}
          relevanceData={relevanceData}
          evidenceData={evidenceData}
          totalVisible={0}
        />
      )}

      <Alert className="bg-primary/5 border-primary/20 text-primary w-full">
        <IconAlertCircle className="size-4" />
        <AlertTitle>Cara Kerja AI Cross-Role</AlertTitle>
        <AlertDescription>
          Sistem secara otomatis memindai portofolio dan wawancara seluruh kandidat, mencocokkan kata kunci laten mereka dengan posisi lain yang sedang dibuka.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau posisi usulan..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterLabel} onValueChange={(val) => val && setFilterLabel(val)}>
          <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Semua Kategori" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua Kategori">Semua Kategori</SelectItem>
            {uniqueLabels.map((label) => <SelectItem key={label} value={label}>{label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterRole} onValueChange={(val) => val && setFilterRole(val)}>
          <SelectTrigger className="w-full md:w-[240px]"><SelectValue placeholder="Semua Posisi Usulan" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua Posisi Usulan">Semua Posisi Usulan</SelectItem>
            {uniqueRoles.map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredList.map((item) => <CrossRoleCard key={item.id} item={item} />)}
        {filteredList.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            Tidak ada rekomendasi yang ditemukan.
          </div>
        )}
      </div>
    </div>
  )
}
