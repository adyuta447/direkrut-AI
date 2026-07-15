"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { 
  IconChevronLeft, 
  IconFileText, 
  IconCheck, 
  IconX, 
  IconVideo,
  IconBriefcase,
  IconSchool,
  IconBrandLinkedin,
  IconChevronDown,
  IconChevronUp,
  IconSparkles
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { DecisionDialog } from "@/components/decision-dialog"

import { useApp } from "@/components/providers/app-provider"
import { ChartBarComparison } from "@/components/chart-bar-comparison"
import { getExtendedData } from "@/components/data-table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts"

export default function CandidateDetailPage() {
  const params = useParams<{ id: string }>()
  const { applications } = useApp()
  const [showChart, setShowChart] = React.useState(false)
  const [expandedCards, setExpandedCards] = React.useState<Record<string, boolean>>({})

  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const rawCandidate = applications.find(app => app.id === params.id)
  const candidate = rawCandidate ? { ...rawCandidate, ...getExtendedData(rawCandidate.id) } : null

  if (!candidate) {
    return (
      <div className="flex flex-1 items-center justify-center h-full min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground">Kandidat tidak ditemukan atau sedang memuat...</p>
          <Button render={<Link href="/hrd" />} variant="outline">Kembali ke Dashboard</Button>
        </div>
      </div>
    )
  }

  const baseScore = candidate.recommendationScore || 0
  const isFreshGrad = candidate.category === "fresh-graduate"

  const radarData = [
    { parameter: "Pemahaman Konsep", score: Math.min(100, baseScore + 5) },
    { parameter: "Kualitas Kode", score: Math.max(0, baseScore - 10) },
    { parameter: "Komunikasi Teknis", score: Math.min(100, baseScore + 2) },
    { parameter: isFreshGrad ? "Pemahaman Akademis" : "Desain Sistem", score: Math.max(0, baseScore - 5) },
    { parameter: "Kesesuaian Industri", score: baseScore },
  ]

  const averageScore = 75

  const softSkillData = [
    { name: "Komunikasi", score: Math.min(100, baseScore + 10), fill: "#3b82f6" },
    { name: "Kerja Sama Tim", score: Math.min(100, baseScore + 5), fill: "#10b981" },
    { name: "Adaptabilitas", score: Math.max(0, baseScore - 5), fill: "#f59e0b" },
    { name: "Kepemimpinan", score: Math.max(0, baseScore - 15), fill: "#8b5cf6" },
    { name: "Inisiatif", score: baseScore, fill: "#ec4899" },
  ]

  const weightData = isFreshGrad ? [
    { name: "Wawancara", value: 40, fill: "#3b82f6" },
    { name: "Magang & Proyek", value: 35, fill: "#10b981" },
    { name: "Pendidikan Akademik", value: 25, fill: "#f59e0b" },
  ] : [
    { name: "Wawancara", value: 40, fill: "#3b82f6" },
    { name: "Pengalaman Kerja", value: 50, fill: "#10b981" },
    { name: "Pendidikan & Sertifikasi", value: 10, fill: "#f59e0b" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8 @container/main">
      
      <div>
        <Button render={<Link href="/hrd" className="flex flex-row items-center gap-1" />} variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary">
            <IconChevronLeft className="size-4 shrink-0" />
            <span>Kembali ke Manajemen Pelamar</span>
          </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">{candidate.applicantName}</h1>
            <Badge variant={candidate.status === 'interview' ? 'default' : candidate.status === 'rejected' ? 'destructive' : 'secondary'} className="capitalize">
              {candidate.status === 'under-review' ? 'Administrasi' : candidate.status}
            </Badge>
            <Badge variant="outline" className={isFreshGrad ? "text-blue-600 border-blue-600/30 bg-blue-50 dark:bg-blue-900/20" : "text-violet-600 border-violet-600/30 bg-violet-50 dark:bg-violet-900/20"}>
              {isFreshGrad ? "Fresh Graduate" : "Professional"}
            </Badge>
            {candidate.isJobHopper && (
              <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">
                ⚠️ Indikasi Job Hopping
              </Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground font-medium">{candidate.jobTitle}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          {candidate.resumeLink && (
            <Button variant="outline" render={<a href="#" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2" />}>
              <a href={candidate.resumeLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                <IconFileText className="size-4 shrink-0" /> 
                <span className="truncate">Lihat CV</span>
              </a>
            </Button>
          )}
          <Button variant="outline" className="text-[#0a66c2] border-[#0a66c2]/30 hover:bg-[#0a66c2]/10 hover:text-[#0a66c2]" render={
            <a href="#" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2" />
          }>
              <IconBrandLinkedin className="size-4 shrink-0" />
              <span className="truncate">LinkedIn</span>
            </Button>
          <DecisionDialog 
            candidate={candidate} 
            decision="invite" 
            trigger={
              <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2">
                <IconCheck className="size-4 shrink-0" /> 
                <span className="truncate">Undang Wawancara</span>
              </Button>
            } 
          />
          <DecisionDialog 
            candidate={candidate} 
            decision="reject" 
            trigger={
              <Button variant="destructive" className="flex items-center justify-center gap-2">
                <IconX className="size-4 shrink-0" /> 
                <span className="truncate">Tolak Lamaran</span>
              </Button>
            } 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6 text-sm text-muted-foreground mt-2 border-t pt-6">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground">Nomor WA</span> 
          <span>{candidate.phone || '+62 812-XXXX-XXXX'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground">Email</span> 
          <span className="truncate">{candidate.applicantName.toLowerCase().replace(/\s/g, '')}@email.com</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground">Domisili</span> 
          <span className="truncate">{candidate.domicile || 'Jakarta Selatan'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground">Pengalaman</span> 
          <span>{candidate.experience || '3 Tahun'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground">Posisi Terakhir</span> 
          <span className="truncate">{candidate.lastPosition || 'Staff'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground">Pendidikan</span> 
          <span className="truncate">{candidate.education || 'S1 Sistem Informasi'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground">Tanggal Melamar</span> 
          <span>{candidate.appliedDate}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => setShowChart(!showChart)}
          className="rounded-full shadow-sm"
        >
          {showChart ? "Sembunyikan Analisis" : "Lihat Analisis Kandidat"}
        </Button>
      </div>

      {showChart && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 fade-in duration-300">
          
          <div className="bg-background rounded-xl border p-4 sm:p-6 flex flex-col items-center justify-center shadow-sm">
            <h3 className="font-semibold mb-1 text-center text-sm sm:text-base">Pembobotan Skor AI</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground text-center mb-4">Formula kalkulasi nilai</p>
            <div className="w-full h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={weightData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {weightData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: any) => [`${value}%`, "Bobot"]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {weightData.map((d, i) => (
                <div key={i} className="flex items-center gap-1 text-[10px]">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }}></div>
                  <span>{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-background rounded-xl border p-4 sm:p-6 flex flex-col items-center justify-center shadow-sm">
            <h3 className="font-semibold mb-1 text-center text-sm sm:text-base">Peta Kompetensi Inti</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground text-center mb-4">Radar chart kemampuan teknis</p>
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="70%">
                  <PolarGrid />
                  <PolarAngleAxis dataKey="parameter" tick={{ fill: "currentColor", fontSize: 10 }} />
                  <Radar name="Skor" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} dot={{ r: 3, fillOpacity: 1 }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-background rounded-xl border p-4 sm:p-6 flex flex-col items-center justify-center shadow-sm">
            <h3 className="font-semibold mb-1 text-center text-sm sm:text-base">Soft Skills & Culture Fit</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground text-center mb-4">Penilaian aspek non-teknis</p>
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={softSkillData} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                  <XAxis type="number" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" fontSize={10} tickLine={false} axisLine={false} width={85} />
                  <RechartsTooltip 
                    cursor={{ fill: 'var(--muted)' }}
                    contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                    formatter={(value: any) => [`${value} / 100`, "Skor"]}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <Tabs defaultValue="analisis" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none pb-0 h-auto bg-transparent">
            <TabsTrigger 
              value="analisis" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3"
            >
              Detail Analisis & Bukti AI
            </TabsTrigger>
            <TabsTrigger 
              value="transkrip" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3"
            >
              Log Wawancara AI
            </TabsTrigger>
            <TabsTrigger 
              value="ringkasan" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3"
            >
              Ringkasan CV
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analisis" className="py-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Korelasi CV dan Wawancara</CardTitle>
                <CardDescription>Bagaimana AI menyimpulkan nilai untuk {candidate.applicantName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">

                <div className="space-y-2 pb-4">
                  <h4 className="font-semibold text-base text-primary">Transparansi Penilaian (Explainable AI)</h4>
                  <p className="text-sm text-muted-foreground mb-4">Metodologi dan pembobotan yang digunakan AI untuk menghasilkan skor akhir {baseScore}% untuk kandidat ini.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div 
                      className="border rounded-lg p-4 bg-background shadow-sm relative overflow-hidden cursor-pointer transition-all hover:border-blue-500/50"
                      onClick={() => toggleCard('wawancara')}
                    >
                      <div className="absolute top-0 right-0 p-2 opacity-5">
                        <IconVideo className="size-16" />
                      </div>
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-bold text-3xl text-blue-500">40%</div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 relative z-10">
                          {expandedCards['wawancara'] ? <IconChevronUp className="h-4 w-4" /> : <IconChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                      <h5 className="font-semibold text-sm mb-1">Performa Wawancara</h5>
                      <p className="text-xs text-muted-foreground relative z-10">Analisis semantik dari jawaban teknis dan soft skill selama wawancara asinkron.</p>
                      
                      {expandedCards['wawancara'] && (
                        <div className="mt-3 pt-3 border-t animate-in fade-in slide-in-from-top-2 text-xs space-y-2 relative z-10">
                          <div className="flex justify-between"><span className="text-muted-foreground">Kesesuaian Jawaban Teknis</span><span className="font-medium text-blue-600">15%</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Pemecahan Masalah (Studi Kasus)</span><span className="font-medium text-blue-600">15%</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Kejelasan Komunikasi</span><span className="font-medium text-blue-600">10%</span></div>
                        </div>
                      )}
                    </div>

                    <div 
                      className="border rounded-lg p-4 bg-background shadow-sm relative overflow-hidden cursor-pointer transition-all hover:border-emerald-500/50"
                      onClick={() => toggleCard('pengalaman')}
                    >
                      <div className="absolute top-0 right-0 p-2 opacity-5">
                        <IconBriefcase className="size-16" />
                      </div>
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-bold text-3xl text-emerald-500">{isFreshGrad ? "35%" : "50%"}</div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 relative z-10">
                          {expandedCards['pengalaman'] ? <IconChevronUp className="h-4 w-4" /> : <IconChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                      <h5 className="font-semibold text-sm mb-1">{isFreshGrad ? "Magang & Proyek" : "Relevansi Pengalaman"}</h5>
                      <p className="text-xs text-muted-foreground relative z-10">
                        {isFreshGrad ? "Relevansi pengalaman magang, organisasi, dan proyek perkuliahan." : "Kecocokan kata kunci, level, dan durasi pengalaman kerja nyata di CV."}
                      </p>
                      
                      {expandedCards['pengalaman'] && (
                        <div className="mt-3 pt-3 border-t animate-in fade-in slide-in-from-top-2 text-xs space-y-2 relative z-10">
                          {isFreshGrad ? (
                            <>
                              <div className="flex justify-between"><span className="text-muted-foreground">Kesesuaian Bidang Magang</span><span className="font-medium text-emerald-600">15%</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Proyek Relevan</span><span className="font-medium text-emerald-600">15%</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Aktif Berorganisasi</span><span className="font-medium text-emerald-600">5%</span></div>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between"><span className="text-muted-foreground">Kesamaan Role Sebelumnya</span><span className="font-medium text-emerald-600">20%</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Jenjang Posisi (Senioritas)</span><span className="font-medium text-emerald-600">15%</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Durasi Masa Kerja Terkait</span><span className="font-medium text-emerald-600">15%</span></div>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div 
                      className="border rounded-lg p-4 bg-background shadow-sm relative overflow-hidden cursor-pointer transition-all hover:border-amber-500/50"
                      onClick={() => toggleCard('akademik')}
                    >
                      <div className="absolute top-0 right-0 p-2 opacity-5">
                        <IconSchool className="size-16" />
                      </div>
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-bold text-3xl text-amber-500">{isFreshGrad ? "25%" : "10%"}</div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 relative z-10">
                          {expandedCards['akademik'] ? <IconChevronUp className="h-4 w-4" /> : <IconChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                      <h5 className="font-semibold text-sm mb-1">{isFreshGrad ? "Pendidikan Akademik" : "Pendidikan & Sertifikasi"}</h5>
                      <p className="text-xs text-muted-foreground relative z-10">
                        {isFreshGrad ? "Kesesuaian jurusan, IPK, dan prestasi akademik lainnya." : "Validasi gelar dan sertifikasi profesional untuk role ini."}
                      </p>
                      
                      {expandedCards['akademik'] && (
                        <div className="mt-3 pt-3 border-t animate-in fade-in slide-in-from-top-2 text-xs space-y-2 relative z-10">
                          {isFreshGrad ? (
                            <>
                              <div className="flex justify-between"><span className="text-muted-foreground">Kesesuaian Jurusan/Fakultas</span><span className="font-medium text-amber-600">15%</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">IPK Akademik</span><span className="font-medium text-amber-600">10%</span></div>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between"><span className="text-muted-foreground">Sertifikasi Profesional (Mis. PMP)</span><span className="font-medium text-amber-600">5%</span></div>
                              <div className="flex justify-between"><span className="text-muted-foreground">Kesesuaian Gelar/Fakultas</span><span className="font-medium text-amber-600">5%</span></div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconBriefcase className="size-5 text-primary" />
                    <h4 className="font-semibold text-base">Relevansi Pengalaman (Tinggi)</h4>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg border">
                    <p className="text-sm italic text-muted-foreground mb-2">Kutipan dari CV kandidat:</p>
                    <p className="text-sm leading-relaxed">
                      "Bertanggung jawab penuh atas <mark className="bg-yellow-200 dark:bg-yellow-900 px-1 rounded font-medium">strategi manajemen di 3 proyek berskala nasional</mark> yang menghasilkan peningkatan efisiensi sebesar 20% dalam waktu 6 bulan."
                    </p>
                    <div className="mt-3 text-xs text-primary bg-primary/10 w-fit px-2 py-1 rounded">
                      Analisis AI: Disebutkan 3x di CV terkait pengalaman langsung pada proyek serupa.
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconSchool className="size-5 text-primary" />
                    <h4 className="font-semibold text-base">Pendidikan & Sertifikasi (Menengah)</h4>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg border">
                    <p className="text-sm italic text-muted-foreground mb-2">Kutipan dari CV kandidat:</p>
                    <p className="text-sm leading-relaxed">
                      "Sarjana Ilmu Komputer, Universitas XYZ. Aktif dalam organisasi kemahasiswaan."
                    </p>
                    <div className="mt-3 text-xs text-amber-600 bg-amber-500/10 w-fit px-2 py-1 rounded">
                      Analisis AI: Memiliki gelar yang relevan, namun <mark className="bg-amber-200 dark:bg-amber-900 px-1 rounded">sertifikasi spesifik profesional tidak ditemukan</mark>.
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary mb-1">Kesimpulan Akhir AI</h4>
                  <p className="text-sm text-foreground mb-4">
                    Kandidat ini menunjukkan korelasi yang sangat kuat antara apa yang ditulis di CV dengan jawaban saat wawancara teknis. Probabilitas kecocokan sangat tinggi ({baseScore}%). Secara teknis dan pengalaman sangat memenuhi syarat. Namun, perhatikan bahwa kandidat belum memiliki sertifikasi profesional teruji di bidang manajemen. Secara keseluruhan, sangat direkomendasikan untuk tahap selanjutnya.
                  </p>
                </div>
                
                <div className="mt-8 mb-4 border-t border-primary/10 pt-6">
                  <h4 className="font-semibold text-primary mb-1 flex items-center gap-2">
                    <IconSparkles className="size-4" />
                    Asisten AI Interaktif
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Ajukan pertanyaan spesifik tentang profil, pengalaman, atau hasil wawancara kandidat ini kepada Asisten AI.
                  </p>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const q = formData.get('q');
                    if (q) {
                      localStorage.setItem('pendingAiQuery', JSON.stringify({ q, candidate: candidate.id }));
                      window.open('/hrd/ai-assistant', '_blank');
                    }
                  }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <IconSparkles className="size-5 text-primary" />
                    </div>
                    <Input 
                      name="q"
                      placeholder={`Tanya AI lebih dalam tentang ${candidate.applicantName}...`}
                      className="pl-12 pr-4 py-6 bg-primary/5 border-primary/20 rounded-xl focus-visible:ring-primary/50 text-sm shadow-sm"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm h-auto py-3 px-6 sm:w-auto w-full"
                  >
                    Tanya AI
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transkrip" className="py-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Tangkapan Layar & Transkrip Wawancara AI</CardTitle>
                    <CardDescription>Sesi evaluasi asinkron yang telah dilakukan oleh kandidat</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <IconVideo className="size-4 mr-2" /> Putar Ulang Rekaman
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="aspect-video w-full max-w-2xl bg-muted rounded-lg border flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <span className="text-white text-sm font-medium">12:04 / 15:30</span>
                  </div>
                  <IconVideo className="size-12 text-muted-foreground/50" />
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold border-b pb-2">Transkrip Tanya Jawab (Otomatis)</h4>
                  
                  <div className="space-y-4 bg-muted/30 p-4 rounded-xl border max-h-[400px] overflow-y-auto">
                    
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-xs font-semibold text-primary px-2">AI Interviewer</span>
                      <div className="bg-background border p-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                        <p className="text-sm">Halo {candidate.applicantName}, mari kita mulai. Bisa ceritakan pengalaman terbesar Anda di bidang ini?</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-xs font-semibold text-muted-foreground px-2">{candidate.applicantName}</span>
                      <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm text-right">
                        <p className="text-sm">Tentu. Saya telah bekerja di bidang ini selama lebih dari 3 tahun, fokus utamanya pada analisis dan manajemen di perusahaan sebelumnya. Pencapaian terbesar saya adalah berhasil meningkatkan efisiensi operasional tim sebesar 20% dalam waktu kurang dari 6 bulan.</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-xs font-semibold text-primary px-2">AI Interviewer</span>
                      <div className="bg-background border p-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                        <p className="text-sm">Itu adalah pencapaian yang luar biasa. Tantangan tersulit apa yang pernah Anda hadapi saat memimpin inisiatif peningkatan efisiensi tersebut?</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-xs font-semibold text-muted-foreground px-2">{candidate.applicantName}</span>
                      <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm text-right">
                        <p className="text-sm">Tantangan terbesarnya adalah koordinasi lintas departemen. Banyak departemen yang merasa terganggu dengan perubahan alur kerja. Saya menyelesaikannya dengan menerapkan metode agile dan mengadakan sesi daily standup agar komunikasi tetap transparan dan semua orang merasa didengar.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ringkasan" className="py-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Portofolio & Riwayat Kandidat</CardTitle>
                <CardDescription>Berdasarkan ekstraksi CV dan Dokumen yang diunggah</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h4 className="font-semibold border-b pb-2 mb-4 text-primary">Ringkasan Pengalaman Kerja (Ekstraksi AI)</h4>
                  <p className="text-sm leading-relaxed p-4 bg-primary/5 border border-primary/20 rounded-lg italic text-foreground/90">
                    "{candidate.experienceSummary}"
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold border-b pb-2 mb-4 text-primary">Profil Singkat</h4>
                  <p className="text-sm leading-relaxed">
                    Kandidat memiliki profil dasar yang sesuai dengan kualifikasi awal <strong>{candidate.jobTitle}</strong>. 
                    Keahlian utama meliputi Analisis Data, Manajemen Tim, dan Pemecahan Masalah Kritis. 
                    Sangat direkomendasikan untuk menempuh tahap selanjutnya berdasarkan kecocokan pola karier.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold border-b pb-2 mb-4 text-primary">Pengalaman Kerja</h4>
                  <div className="relative border-l-2 border-muted ml-3 space-y-6">
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-background"></div>
                      <h5 className="font-semibold">{candidate.lastPosition || 'Staff Senior'}</h5>
                      <p className="text-sm text-muted-foreground">Perusahaan Tech XYZ • Jan 2021 - Sekarang (2 Tahun 8 Bulan)</p>
                      <p className="text-sm mt-2">Memimpin tim beranggotakan 5 orang dan berhasil menaikkan metrik kesuksesan proyek hingga 20%. Bertanggung jawab penuh pada operasional harian.</p>
                    </div>
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-muted-foreground rounded-full -left-[7px] top-1.5 ring-4 ring-background"></div>
                      <h5 className="font-semibold">Junior Staff</h5>
                      <p className="text-sm text-muted-foreground">Startup Kreatif Nusantara • Mei 2019 - Des 2020 (1 Tahun 7 Bulan)</p>
                      <p className="text-sm mt-2">Membantu administrasi proyek dan pengolahan data pelanggan secara reguler.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold border-b pb-2 mb-4 text-primary">Riwayat Pendidikan</h4>
                  <div className="relative border-l-2 border-muted ml-3 space-y-6">
                    <div className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-background"></div>
                      <h5 className="font-semibold">{candidate.education || 'S1 Sistem Informasi'}</h5>
                      <p className="text-sm text-muted-foreground">Universitas Teknologi Jakarta • 2015 - 2019</p>
                      <p className="text-sm mt-2">IPK: 3.75 / 4.0. Lulus dengan predikat Cum Laude. Aktif di BEM Fakultas.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold border-b pb-2 mb-4 text-primary">Sertifikasi</h4>
                    <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                      <li>Sertifikasi Manajemen Proyek Profesional (PMP) - 2022</li>
                      <li>Google Data Analytics Certificate - 2021</li>
                      <li>AWS Certified Cloud Practitioner - 2020</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold border-b pb-2 mb-4 text-primary">Pencapaian & Prestasi</h4>
                    <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                      <li>Karyawan Terbaik (Employee of the Year) - 2022</li>
                      <li>Juara 1 Lomba Analisis Data Tingkat Nasional - 2019</li>
                    </ul>
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
