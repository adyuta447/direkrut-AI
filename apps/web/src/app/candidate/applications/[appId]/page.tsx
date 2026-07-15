"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  IconChevronLeft,
  IconBriefcase,
  IconBuilding,
  IconMapPin,
  IconCalendar,
  IconExternalLink,
  IconUsers,
} from "@tabler/icons-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Cell,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDashboard } from "@/components/dashboard-provider"
import { getExtendedData } from "@/components/data-table"
import { CheckCircleIcon, ClockIcon, MessageSquareIcon } from "lucide-react"

export default function ApplicationDetailPage() {
  const params = useParams<{ appId: string }>()
  const { applications, jobs } = useDashboard()
  const [showChart, setShowChart] = React.useState(false)

  const application = applications.find(a => a.id === params.appId)
  const job = application ? jobs.find(j => j.id === application.jobId) : null

  if (!application || !job) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <IconBriefcase className="size-12 text-muted-foreground opacity-40" />
          <p className="text-muted-foreground">Lamaran tidak ditemukan.</p>
          <Button render={<Link href="/candidate/applications" />} variant="outline">
            Kembali ke Riwayat Lamaran
          </Button>
        </div>
      </div>
    )
  }

  const ext = getExtendedData(application.applicantName)
  const isFreshGrad = application.category === "fresh-graduate" || ext.category === "fresh-graduate"

  const jobApplications = applications.filter(a => a.jobId === application.jobId)
  const jobInterviewed = jobApplications.filter(a => a.status === "interview").length
  const jobRejected = jobApplications.filter(a => a.status === "rejected").length

  const companyJobs = jobs.filter(j => j.company === job.company)

  function getStatusBadge(status: string) {
    if (status === "interview") return <Badge variant="default">Wawancara AI</Badge>
    if (status === "under-review") return <Badge variant="secondary">Administrasi</Badge>
    if (status === "rejected") return <Badge variant="destructive">Ditolak</Badge>
    return <Badge variant="outline">Terkirim</Badge>
  }

  const applicationFlowData = [
    { name: "Terkirim", value: jobApplications.length, fill: "var(--chart-1)" },
    { name: "Direview", value: jobApplications.filter(a => a.status === "under-review").length, fill: "var(--chart-2)" },
    { name: "Wawancara", value: jobInterviewed, fill: "var(--chart-3)" },
    { name: "Ditolak", value: jobRejected, fill: "var(--chart-4)" },
  ]

  const positionDistribution = companyJobs.slice(0, 6).map((j, i) => ({
    name: j.title.length > 20 ? j.title.substring(0, 18) + "…" : j.title,
    value: applications.filter(a => a.jobId === j.id).length,
    fill: `var(--chart-${(i % 5) + 1})`,
  }))

  const transcriptData = application.validationResponses || [
    { question: "Ceritakan tentang pengalaman Anda yang paling relevan dengan posisi ini.", answer: "Saya memiliki pengalaman selama 3 tahun dalam bidang yang relevan. Saya pernah mengelola beberapa proyek skala menengah dan berhasil menyelesaikannya tepat waktu dengan kualitas yang baik." },
    { question: "Bagaimana Anda menangani tekanan dan deadline yang ketat?", answer: "Saya menggunakan metode prioritisasi dengan membagi tugas berdasarkan urgensi dan dampaknya. Komunikasi yang aktif dengan tim juga sangat membantu dalam situasi tersebut." },
    { question: "Apa yang Anda ketahui tentang perusahaan kami?", answer: "Saya telah mempelajari profil perusahaan dan sangat tertarik dengan visi dan misi yang diusung. Rekam jejak perusahaan dalam industri ini sangat mengesankan." },
  ]

  const timelineSteps = [
    {
      label: "Lamaran Dikirim",
      date: application.appliedDate,
      done: true,
      description: "Berhasil melamar untuk posisi " + job.title,
    },
    {
      label: "Wawancara AI",
      date: application.status !== "submitted" ? "Selesai" : "Menunggu",
      done: application.status !== "submitted",
      active: false,
      description: "Sesi wawancara dengan sistem AI Direkrut AI",
    },
    {
      label: "Direview HRD",
      date: application.status === "under-review" || application.status === "interview" || application.status === "rejected" ? "Sedang berlangsung" : "Menunggu",
      done: application.status === "interview" || application.status === "rejected",
      active: application.status === "under-review",
      description: "Tim HRD sedang mengevaluasi hasil wawancara",
    },
    {
      label: application.status === "rejected" ? "Lamaran Ditolak" : "Keputusan Final",
      date: application.status === "rejected" ? "Selesai" : "Menunggu",
      done: application.status === "rejected",
      active: application.status === "interview",
      description: application.status === "rejected"
        ? "Terima kasih atas lamaran Anda. Tetap semangat!"
        : "Menunggu keputusan dari tim HRD perusahaan",
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8 @container/main">

      <div>
        <Button
          render={<Link href="/candidate/applications" className="flex items-center gap-1" />}
          variant="ghost"
          className="pl-0 hover:bg-transparent hover:text-primary"
        >
          <IconChevronLeft className="size-4 shrink-0" />
          <span>Kembali ke Riwayat Lamaran</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
            {getStatusBadge(application.status)}
            {isFreshGrad ? (
              <Badge variant="outline" className="text-blue-600 border-blue-600/30 bg-blue-50 dark:bg-blue-900/20">
                Fresh Graduate Welcome
              </Badge>
            ) : (
              <Badge variant="outline" className="text-violet-600 border-violet-600/30 bg-violet-50 dark:bg-violet-900/20">
                Professional
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-base mt-1">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              <IconBuilding className="size-4" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <IconMapPin className="size-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <IconCalendar className="size-4" />
              Melamar {application.appliedDate}
            </span>
            <Badge variant="outline">{job.type}</Badge>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <Button variant="outline" className="gap-2" render={<a href="#" target="_blank" />}>
            <IconExternalLink className="size-4" />
            Website Perusahaan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6 text-sm text-muted-foreground border-t pt-6">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground text-xs uppercase tracking-wider">Industri</span>
          <span>{job.industry || "Teknologi"}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground text-xs uppercase tracking-wider">Departemen</span>
          <span>{job.department || "Engineering"}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground text-xs uppercase tracking-wider">Gaji</span>
          <span>{job.salaryRange || "Kompetitif"}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground text-xs uppercase tracking-wider">Total Pelamar</span>
          <span className="flex items-center gap-1">
            <IconUsers className="size-3.5" />
            {jobApplications.length} orang
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => setShowChart(!showChart)}
          className="rounded-full shadow-sm"
        >
          {showChart ? "Sembunyikan Analisis Perusahaan" : "Lihat Analisis Perusahaan & Posisi"}
        </Button>
      </div>

      {showChart && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 fade-in duration-300">

          <div className="bg-background rounded-xl border p-4 sm:p-6 shadow-sm">
            <h3 className="font-semibold mb-1 text-sm">Funnel Lamaran Posisi Ini</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Dari {jobApplications.length} pelamar untuk <strong>{job.title}</strong>
            </p>
            <div className="w-full h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationFlowData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {applicationFlowData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-background rounded-xl border p-4 sm:p-6 shadow-sm">
            <h3 className="font-semibold mb-1 text-sm">Posisi Lain di {job.company}</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Jumlah pelamar per posisi yang tersedia
            </p>
            <div className="w-full h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={positionDistribution}
                  layout="vertical"
                  margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                  <XAxis type="number" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" fontSize={10} tickLine={false} axisLine={false} width={100} />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--background)",
                      color: "var(--foreground)",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
                    {positionDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      <div className="mt-2">
        <Tabs defaultValue="lamaran" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none pb-0 h-auto bg-transparent">
            <TabsTrigger
              value="lamaran"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3"
            >
              Perjalanan Lamaran
            </TabsTrigger>
            <TabsTrigger
              value="transkrip"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3"
            >
              Transkrip Wawancara AI
            </TabsTrigger>
            <TabsTrigger
              value="posisi"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3"
            >
              Detail Posisi & Persyaratan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lamaran" className="py-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClockIcon className="size-5 text-primary" />
                  Perjalanan & Status Lamaran
                </CardTitle>
                <CardDescription>
                  Pantau setiap tahap perjalanan lamaran Anda secara transparan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-0">
                  {timelineSteps.map((step, i) => (
                    <div key={i} className="relative flex gap-6 pb-8 last:pb-0">
                      
                      {i < timelineSteps.length - 1 && (
                        <div className={`absolute left-4 top-8 bottom-0 w-0.5 ${step.done ? "bg-emerald-500" : "bg-border"}`} />
                      )}
                      
                      <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                        step.done
                          ? "bg-emerald-500 text-white shadow"
                          : step.active
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20 shadow"
                          : "border-2 border-muted-foreground/30 bg-background"
                      }`}>
                        {step.done ? (
                          <CheckCircleIcon className="size-4" />
                        ) : (
                          <ClockIcon className="size-4 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className={`flex-1 p-4 rounded-xl border mt-0.5 ${
                        step.active
                          ? "border-primary bg-primary/5"
                          : step.done
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : "border-border bg-muted/20"
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-semibold text-sm ${step.active ? "text-primary" : ""}`}>
                            {step.label}
                          </h4>
                          <span className="text-xs text-muted-foreground">{step.date}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {(application.status === "under-review" || application.status === "interview") && (
                  <div className="mt-8 space-y-4">
                    <h4 className="font-semibold text-base flex items-center gap-2">
                      <MessageSquareIcon className="size-5 text-emerald-600" />
                      Umpan Balik Wawancara AI
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-emerald-500/10 p-5 rounded-xl border border-emerald-500/20 space-y-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                          <MessageSquareIcon className="size-20 text-emerald-500" />
                        </div>
                        <h5 className="font-medium text-emerald-800 dark:text-emerald-300 text-sm">Kekuatan Utama:</h5>
                        <p className="text-sm leading-relaxed text-emerald-800 dark:text-emerald-300 relative z-10">
                          Anda menunjukkan pemahaman yang mendalam terhadap peran yang dilamar. Cara komunikasi Anda selama sesi wawancara sangat jelas dan terstruktur. Penjelasan tentang pengalaman relevan sangat meyakinkan.
                        </p>
                      </div>
                      <div className="bg-amber-500/10 p-5 rounded-xl border border-amber-500/20 space-y-3">
                        <h5 className="font-medium text-amber-800 dark:text-amber-300 text-sm">Area yang Dapat Dikembangkan:</h5>
                        <p className="text-sm leading-relaxed text-amber-800/80 dark:text-amber-300/80">
                          Pertimbangkan untuk memperkuat jawaban dengan contoh nyata yang lebih spesifik dan terukur. Beberapa jawaban masih terlalu umum dan belum menunjukkan dampak konkret dari tindakan Anda.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transkrip" className="py-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transkrip Wawancara AI</CardTitle>
                <CardDescription>
                  Rekaman lengkap sesi tanya-jawab dengan sistem AI Direkrut AI — untuk transparansi Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {transcriptData.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquareIcon className="size-10 mx-auto mb-3 opacity-30" />
                    <p>Sesi wawancara belum dilakukan.</p>
                  </div>
                ) : (
                  transcriptData.map((item, i) => (
                    <div key={i} className="space-y-3">
                      
                      <div className="flex justify-start">
                        <div className="max-w-[85%] bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                          <p className="text-xs text-muted-foreground font-medium mb-1">AI Interviewer</p>
                          <p className="text-sm">{item.question}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <div className="max-w-[85%] bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-4 py-3">
                          <p className="text-xs opacity-70 font-medium mb-1">Anda</p>
                          <p className="text-sm">{item.answer}</p>
                        </div>
                      </div>
                      {i < transcriptData.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posisi" className="py-6 space-y-6">
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Deskripsi Pekerjaan</CardTitle>
                <CardDescription>{job.title} di {job.company}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm max-w-none text-foreground">
                  <p className="leading-relaxed text-muted-foreground">
                    {job.description || `Kami mencari individu yang berdedikasi dan kompeten untuk bergabung sebagai ${job.title} di ${job.company}. Posisi ini memerlukan kemampuan analitis yang kuat, keterampilan komunikasi yang baik, dan kemampuan bekerja dalam tim yang dinamis.`}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="border rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <IconUsers className="size-4 text-blue-500" />
                      Terbuka untuk
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(isFreshGrad || !application.category) && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600/30 bg-blue-50 dark:bg-blue-900/20">
                          Fresh Graduate
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-violet-600 border-violet-600/30 bg-violet-50 dark:bg-violet-900/20">
                        Professional
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {job.requirements?.[0] || "Terbuka untuk semua jenjang karir yang memenuhi kualifikasi"}
                    </p>
                  </div>

                  <div className="border rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <IconBriefcase className="size-4 text-emerald-500" />
                      Detail Posisi
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tipe Pekerjaan</span>
                        <span className="font-medium">{job.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lokasi</span>
                        <span className="font-medium">{job.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Kisaran Gaji</span>
                        <span className="font-medium">{job.salaryRange || "Kompetitif"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Persyaratan & Kualifikasi</CardTitle>
                <CardDescription>Hal-hal yang dibutuhkan untuk posisi ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider">Persyaratan Utama</h4>
                    <ul className="space-y-2">
                      {(job.requirements && job.requirements.length > 0
                        ? job.requirements
                        : [
                            "Memiliki kemampuan analitis dan komunikasi yang baik",
                            "Mampu bekerja secara mandiri maupun dalam tim",
                            "Familiar dengan tools dan teknologi yang relevan",
                            "Memiliki sikap profesional dan etika kerja yang tinggi",
                          ]
                      ).map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircleIcon className="size-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {job.detailedQualifications && job.detailedQualifications.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wider">Kualifikasi Tambahan</h4>
                      <ul className="space-y-2">
                        {job.detailedQualifications.map((q, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircleIcon className="size-4 text-blue-500 mt-0.5 shrink-0" />
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {companyJobs.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Posisi Lain di {job.company}</CardTitle>
                  <CardDescription>Lowongan lain yang sedang terbuka</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {companyJobs.filter(j => j.id !== job.id).slice(0, 4).map(j => (
                      <div key={j.id} className="border rounded-xl p-3 hover:border-primary/50 transition-colors">
                        <div className="font-semibold text-sm">{j.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                          <span>{j.type}</span>
                          <span>·</span>
                          <span>{j.location}</span>
                        </div>
                        <div className="mt-2">
                          <Button size="sm" variant="ghost" className="h-7 text-xs px-2" render={<Link href={`/candidate/jobs`} />}>
                            Lihat Lowongan
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-center py-4">
              <Button variant="outline" className="gap-2" render={<a href="#" target="_blank" />}>
                <IconExternalLink className="size-4" />
                Kunjungi Website {job.company}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
