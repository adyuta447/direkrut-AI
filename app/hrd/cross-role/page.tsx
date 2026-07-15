"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { 
  IconSearch, 
  IconAlertCircle, 
  IconCheck, 
  IconChevronRight, 
  IconFileText, 
  IconVideo,
  IconChartPie,
  IconChevronDown,
  IconChevronUp,
  IconExternalLink
} from "@tabler/icons-react"
import { useApp } from "@/components/providers/app-provider"
import { getExtendedData } from "@/components/data-table"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IconSend } from "@tabler/icons-react"
import Link from "next/link"

export default function CrossRoleRecommendationPage() {
  const { applications, jobs } = useApp()
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
        const variant = isHighlyRelevant ? "default" : "secondary"
        
        const reason = isHighlyRelevant
          ? `Keterampilan inti (transferable skills) selaras dengan kebutuhan ${alternateJob.title}.`
          : `Fondasi kuat yang dapat disesuaikan untuk ${alternateJob.title} dengan masa onboarding minimal.`
          
        const evidenceType = isHighlyRelevant ? "cv" : "interview"
        const evidence = isHighlyRelevant
          ? `Kutipan CV: "Memimpin kolaborasi lintas divisi yang mengharuskan penggunaan prinsip kerja dari ${alternateJob.title}."`
          : `Log Wawancara (08:21): "Meskipun posisi ini di luar keahlian utama saya, saya telah mengikuti sertifikasi dasar terkait departemen tersebut."`

        return {
          id: app.id,
          candidateName: app.applicantName,
          originalRole: app.jobTitle,
          suggestedRole: alternateJob.title,
          label,
          variant,
          reason,
          evidenceType,
          evidence,
          emailed: getExtendedData(app.applicantName).crossRoleEmailed
        }
      })
      .filter(Boolean) as any[]
  }, [applications, jobs])

  const uniqueLabels = useMemo(() => Array.from(new Set(crossRoleList.map(i => i.label))), [crossRoleList])
  const uniqueRoles = useMemo(() => Array.from(new Set(crossRoleList.map(i => i.suggestedRole))), [crossRoleList])

  const filteredList = crossRoleList.filter(item => {
    const matchSearch = item.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) || item.suggestedRole.toLowerCase().includes(searchTerm.toLowerCase())
    const matchLabel = filterLabel === "Semua Kategori" || item.label === filterLabel
    const matchRole = filterRole === "Semua Posisi Usulan" || item.suggestedRole === filterRole
    return matchSearch && matchLabel && matchRole
  })

  const roleCounts: Record<string, number> = {}
  filteredList.forEach(item => {
    roleCounts[item.suggestedRole] = (roleCounts[item.suggestedRole] || 0) + 1
  })
  
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"]
  let chartData = Object.entries(roleCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], idx) => ({
      name,
      value,
      color: COLORS[idx % COLORS.length]
    }))

  if (chartData.length > 5) {
    const top5 = chartData.slice(0, 5)
    const others = chartData.slice(5).reduce((acc, curr) => acc + curr.value, 0)
    chartData = [...top5, { name: "Posisi Lainnya", value: others, color: "#94a3b8" }]
  }

  const relevanceCounts = { "Sangat Relevan": 0, "Potensi Adaptasi Cepat": 0 }
  filteredList.forEach(item => {
    if (relevanceCounts[item.label as keyof typeof relevanceCounts] !== undefined) {
      relevanceCounts[item.label as keyof typeof relevanceCounts]++
    }
  })
  const relevanceData = [
    { name: "Sangat Relevan", count: relevanceCounts["Sangat Relevan"], fill: "#10b981" },
    { name: "Adaptasi Cepat", count: relevanceCounts["Potensi Adaptasi Cepat"], fill: "#f59e0b" },
  ]

  const evidenceCounts = { cv: 0, interview: 0 }
  filteredList.forEach(item => {
    if (item.evidenceType === "cv") evidenceCounts.cv++
    else evidenceCounts.interview++
  })
  const evidenceData = [
    { name: "Kutipan CV", count: evidenceCounts.cv, fill: "#3b82f6" },
    { name: "Log Wawancara", count: evidenceCounts.interview, fill: "#8b5cf6" },
  ]

  if (jobs.length < 2) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center min-h-[70vh]">
        <IconAlertCircle className="size-16 text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-2xl font-bold mb-2">Kurang dari 2 Lowongan Aktif</h2>
        <p className="text-muted-foreground max-w-md">
          Sistem AI lintas-posisi (Cross-Role) membutuhkan minimal dua lowongan pekerjaan yang terbuka secara bersamaan di perusahaan Anda untuk dapat merekomendasikan talenta ke posisi alternatif.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8 @container/main w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Rekomendasi Lintas Posisi</h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Daftar kandidat yang memiliki <span className="italic">transferable skills</span> untuk dipindahkan ke posisi alternatif. 
            Mencegah pembuangan talenta jika kuota peran asal sudah penuh.
          </p>
        </div>
        
        {filteredList.length > 0 && (
          <Button variant="outline" onClick={() => setShowChart(!showChart)}>
            <IconChartPie className="size-4 mr-2 text-primary" />
            {showChart ? "Tutup Analisis" : "Lihat Analisis"}
            {showChart ? <IconChevronUp className="size-4 ml-2" /> : <IconChevronDown className="size-4 ml-2" />}
          </Button>
        )}
      </div>

      {showChart && filteredList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 fade-in duration-300 w-full max-w-6xl mx-auto">

          <div className="bg-background rounded-xl border p-6 flex flex-col items-center justify-center">
            <h3 className="font-semibold mb-2 text-center">Top 5 Posisi Potensial</h3>
            <p className="text-xs text-muted-foreground text-center mb-6">Distribusi berdasarkan peran lintas</p>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: any) => [`${value} Kandidat`, "Jumlah"]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-background rounded-xl border p-6 flex flex-col items-center justify-center">
            <h3 className="font-semibold mb-2 text-center">Tingkat Relevansi</h3>
            <p className="text-xs text-muted-foreground text-center mb-6">Kekuatan profil vs posisi baru</p>
            <div className="flex-1 min-h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={relevanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: 'var(--muted)' }}
                    contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-background rounded-xl border p-6 flex flex-col items-center justify-center">
            <h3 className="font-semibold mb-2 text-center">Sumber Penemuan AI</h3>
            <p className="text-xs text-muted-foreground text-center mb-6">Dari mana asal potensi kandidat?</p>
            <div className="flex-1 min-h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evidenceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: 'var(--muted)' }}
                    contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      <Alert className="bg-primary/5 border-primary/20 text-primary w-full">
        <IconAlertCircle className="size-4" />
        <AlertTitle>Cara Kerja AI Cross-Role</AlertTitle>
        <AlertDescription>
          Sistem secara otomatis memindai portofolio dan wawancara seluruh kandidat, mencocokkan kata kunci laten mereka dengan posisi lain yang sedang dibuka di perusahaan Anda.
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
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua Kategori">Semua Kategori</SelectItem>
            {uniqueLabels.map(label => (
              <SelectItem key={label} value={label}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterRole} onValueChange={(val) => val && setFilterRole(val)}>
          <SelectTrigger className="w-full md:w-[240px]">
            <SelectValue placeholder="Semua Posisi Usulan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Semua Posisi Usulan">Semua Posisi Usulan</SelectItem>
            {uniqueRoles.map(role => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredList.map((item) => (
          <Card key={item.id} className="overflow-hidden flex flex-col">
            <div className="bg-muted/50 p-4 border-b flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/hrd/candidate/${item.id}`} className="hover:underline hover:text-primary transition-colors">
                    <h3 className="font-semibold text-lg">{item.candidateName}</h3>
                  </Link>
                  {item.emailed && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400">
                      Email Terkirim
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <span>Melamar: <span className="line-through">{item.originalRole}</span></span>
                  <IconChevronRight className="size-4 mx-2" />
                  <span className="font-semibold text-primary">{item.suggestedRole}</span>
                </div>
              </div>
              <Badge variant={item.variant as any} className="whitespace-nowrap">
                {item.label}
              </Badge>
            </div>
            
            <CardContent className="p-5 flex-1 space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-1 text-foreground">Analisis AI</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.reason}
                </p>
              </div>

              <div className="bg-secondary/40 rounded-lg p-3 border border-secondary">
                <div className="flex items-center gap-2 mb-2">
                  {item.evidenceType === 'cv' ? (
                    <IconFileText className="size-4 text-primary" />
                  ) : (
                    <IconVideo className="size-4 text-primary" />
                  )}
                  <h5 className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Bukti Pendukung
                  </h5>
                </div>
                <p className="text-sm italic text-foreground/80 leading-relaxed">
                  {item.evidence}
                </p>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full" render={<Link href={`/hrd/candidate/${item.id}`} />}>
                <IconExternalLink className="size-4 mr-2" />
                <span className="truncate">Detail Kandidat</span>
              </Button>
              <Dialog>
                <DialogTrigger render={<Button className="w-full flex flex-row items-center justify-center gap-2" />}>
                    <IconCheck className="size-4 shrink-0" />
                    <span className="truncate">Tawarkan Posisi</span>
                  </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Validasi & Kirim Penawaran</DialogTitle>
                    <DialogDescription>
                      Tinjau dan kirim email konfirmasi ke <span className="font-semibold text-foreground">{item.candidateName}</span> terkait rekomendasi lintas peran ke posisi <span className="font-semibold text-foreground">{item.suggestedRole}</span>.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Subjek Email</Label>
                      <Input defaultValue={`Peluang Karir: Posisi ${item.suggestedRole} di Perusahaan Kami`} />
                    </div>
                    <div className="space-y-2">
                      <Label>Pesan Email</Label>
                      <Textarea 
                        className="min-h-[150px]" 
                        defaultValue={`Halo ${item.candidateName},\n\nBerdasarkan profil dan hasil analisis seleksi Anda, kami melihat potensi besar yang sangat relevan untuk posisi ${item.suggestedRole}. Kami ingin berdiskusi lebih lanjut apakah Anda tertarik untuk menjajaki peluang ini.\n\nMohon konfirmasikan ketertarikan Anda dengan membalas email ini.`}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
                    <DialogClose render={<Button />}>
                        <IconSend className="size-4 mr-2" />
                        Kirim Email
                      </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
        
        {filteredList.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            Tidak ada rekomendasi yang ditemukan.
          </div>
        )}
      </div>
    </div>
  )
}
