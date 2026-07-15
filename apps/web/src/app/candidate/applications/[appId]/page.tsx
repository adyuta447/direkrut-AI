"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import {
  IconBriefcase,
  IconBuilding,
  IconMapPin,
  IconCalendar,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDashboard } from "@/context/DashboardContext"
import { BackButton } from "@/components/molecules/dashboard/BackButton"
import { StatusBadge } from "@/components/molecules/dashboard/StatusBadge"
import { ChartCard, CHART_TOOLTIP_STYLE } from "@/components/molecules/dashboard/ChartCard"
import { ChatBubble } from "@/components/molecules/dashboard/ChatBubble"
import { getExtendedData } from "@/lib/dashboard/extended-data"
import { CheckCircleIcon, ClockIcon, MessageSquareIcon } from "lucide-react"

const STATUS_HELPER: Record<string, string> = {
  submitted: "Lamaranmu udah meluncur. Tunggu kabar selanjutnya ya!",
  "under-review": "Lagi dicek tim HRD. Sabar dikit, biasanya nggak lama kok.",
  interview: "Kamu lolos ke wawancara! Gas, siapin dirimu.",
  rejected: "Kali ini belum jodoh. Masih banyak posisi lain yang nunggu kamu.",
}

export default function ApplicationDetailPage() {
  const params = useParams<{ appId: string }>()
  const { applications, jobs } = useDashboard()

  const application = applications.find(a => a.id === params.appId)
  const job = application ? jobs.find(j => j.id === application.jobId) : null

  if (!application || !job) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <IconBriefcase className="size-12 text-muted-foreground opacity-40" />
          <p className="text-muted-foreground">Lamarannya nggak ketemu nih.</p>
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

  const applicationFlowData = [
    { name: "Terkirim", value: jobApplications.length, fill: "var(--chart-1)" },
    { name: "Administrasi", value: jobApplications.filter(a => a.status === "under-review").length, fill: "var(--warning)" },
    { name: "Wawancara", value: jobInterviewed, fill: "var(--info)" },
    { name: "Ditolak", value: jobRejected, fill: "var(--destructive)" },
  ]

  const positionDistribution = companyJobs.slice(0, 6).map(j => ({
    name: j.title.length > 20 ? j.title.substring(0, 18) + "…" : j.title,
    value: applications.filter(a => a.jobId === j.id).length,
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
      active: false,
      description: `Lamaranmu buat posisi ${job.title} udah masuk sistem.`,
    },
    {
      label: "Wawancara AI",
      date: application.status !== "submitted" ? "Selesai" : "Menunggu",
      done: application.status !== "submitted",
      active: false,
      description: "Sesi tanya-jawab bareng AI Direkrut.",
    },
    {
      label: "Administrasi HRD",
      date: application.status === "under-review" ? "Sedang berlangsung" : application.status === "interview" || application.status === "rejected" ? "Selesai" : "Menunggu",
      done: application.status === "interview" || application.status === "rejected",
      active: application.status === "under-review",
      description: "Tim HRD lagi ngecek hasil wawancara kamu.",
    },
    {
      label: application.status === "rejected" ? "Lamaran Ditolak" : "Keputusan Final",
      date: application.status === "rejected" ? "Selesai" : "Menunggu",
      done: application.status === "rejected",
      active: application.status === "interview",
      description: application.status === "rejected"
        ? "Makasih udah melamar. Tetap semangat, ya!"
        : "Nunggu keputusan akhir dari tim HRD.",
    },
  ]

  const doneSteps = timelineSteps.filter(s => s.done).length
  const currentStep = Math.min(doneSteps + 1, timelineSteps.length)
  const progressPct = (doneSteps / timelineSteps.length) * 100

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8 @container/main">
      <BackButton href="/candidate/applications" label="Kembali ke Riwayat Lamaran" />

      {/* Hero */}
      <section className="rounded-4xl border bg-card p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-accent-strong">
              Lamaran Kamu
            </p>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{job.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
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
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline">{job.type}</Badge>
              <Badge variant="secondary">
                {isFreshGrad ? "Fresh Graduate Welcome" : "Professional"}
              </Badge>
            </div>
          </div>

          {/* Panel status */}
          <div className="flex flex-col justify-center gap-3 rounded-2xl border bg-background p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status Sekarang
              </span>
              <StatusBadge status={application.status} />
            </div>
            <div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${application.status === "rejected" ? "bg-destructive" : "bg-primary"}`}
                  style={{ width: `${Math.max(progressPct, 8)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Tahap {currentStep} dari {timelineSteps.length}
              </p>
            </div>
            <p className="text-sm font-medium">{STATUS_HELPER[application.status] ?? STATUS_HELPER.submitted}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-6 text-sm text-muted-foreground lg:grid-cols-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Industri</span>
            <span>{job.industry || "Teknologi"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Departemen</span>
            <span>{job.department || "Engineering"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Gaji</span>
            <span>{job.salaryRange || "Kompetitif"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Total Kandidat</span>
            <span className="flex items-center gap-1">
              <IconUsers className="size-3.5" />
              {jobApplications.length} orang
            </span>
          </div>
        </div>
      </section>

      <Tabs defaultValue="perjalanan" className="w-full">
        <TabsList>
          <TabsTrigger value="perjalanan">Perjalanan</TabsTrigger>
          <TabsTrigger value="transkrip">Transkrip AI</TabsTrigger>
          <TabsTrigger value="posisi">Detail Posisi</TabsTrigger>
          <TabsTrigger value="statistik">Statistik</TabsTrigger>
        </TabsList>

        <TabsContent value="perjalanan" className="space-y-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold leading-[1.1] tracking-[-0.02em] md:text-2xl">
                <ClockIcon className="size-5 text-primary" />
                Perjalanan Lamaran
              </CardTitle>
              <CardDescription>Tiap tahap kepantau transparan, nggak ada yang disembunyiin.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {timelineSteps.map((step, i) => (
                  <div key={i} className="relative flex gap-5 pb-8 last:pb-0">
                    {i < timelineSteps.length - 1 && (
                      <div
                        className={`absolute left-4 top-9 bottom-0 w-px -translate-x-1/2 ${step.done ? "bg-primary/40" : "bg-border"}`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full ${
                        step.done
                          ? "bg-primary text-primary-foreground"
                          : step.active
                          ? "bg-brand-accent text-white ring-4 ring-brand-accent/15"
                          : "border bg-background text-muted-foreground"
                      }`}
                    >
                      {step.done ? <CheckCircleIcon className="size-4" /> : <ClockIcon className="size-4" />}
                    </div>

                    <div className="flex-1 pt-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h4 className={`text-sm font-semibold ${step.active ? "text-primary" : ""}`}>
                          {step.label}
                          {step.active && (
                            <Badge className="ml-2 border-transparent bg-brand-accent text-white">
                              Sekarang
                            </Badge>
                          )}
                        </h4>
                        <span className="text-xs text-muted-foreground">{step.date}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {(application.status === "under-review" || application.status === "interview") && (
                <div className="mt-8 space-y-4">
                  <h4 className="flex items-center gap-2 text-lg font-bold tracking-[-0.02em] md:text-xl">
                    <MessageSquareIcon className="size-5 text-primary" />
                    Umpan Balik Wawancara AI
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-4xl bg-primary p-6 text-white md:p-8">
                      <p className="mb-3 flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.22em] text-white/60">
                        <CheckCircleIcon className="size-4" />
                        Hasil Analisis AI
                      </p>
                      <h5 className="mb-3 text-xl font-bold leading-[1.1] tracking-[-0.02em] md:text-2xl">
                        Kekuatan Kamu
                      </h5>
                      <p className="text-[15px] leading-relaxed text-white/90">
                        Pemahamanmu soal peran yang dilamar dalem banget. Cara komunikasimu selama sesi
                        wawancara jelas dan terstruktur — penjelasan pengalamanmu meyakinkan.
                      </p>
                    </div>
                    <div className="rounded-4xl bg-brand-accent p-6 text-white md:p-8">
                      <p className="mb-3 flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.22em] text-white/70">
                        <ClockIcon className="size-4" />
                        Ruang Bertumbuh
                      </p>
                      <h5 className="mb-3 text-xl font-bold leading-[1.1] tracking-[-0.02em] md:text-2xl">
                        Yang Bisa Ditingkatin
                      </h5>
                      <p className="text-[15px] leading-relaxed text-white/90">
                        Coba perkuat jawaban dengan contoh nyata yang lebih spesifik dan terukur. Beberapa
                        jawaban masih terlalu umum, belum kelihatan dampak konkretnya.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transkrip" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold leading-[1.1] tracking-[-0.02em] md:text-2xl">Transkrip Wawancara AI</CardTitle>
              <CardDescription>
                Rekaman lengkap sesi tanya-jawabmu sama AI Direkrut — biar semuanya transparan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {transcriptData.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <MessageSquareIcon className="mx-auto mb-3 size-10 opacity-30" />
                  <p>Sesi wawancaranya belum mulai.</p>
                </div>
              ) : (
                transcriptData.map((item, i) => (
                  <div key={i} className="space-y-3">
                    <ChatBubble from="ai" className="max-w-[85%]">
                      <p className="mb-1 text-xs font-medium text-muted-foreground">AI Interviewer</p>
                      <p>{item.question}</p>
                    </ChatBubble>
                    <ChatBubble from="user" className="max-w-[85%]">
                      <p className="mb-1 text-xs font-medium opacity-70">Kamu</p>
                      <p>{item.answer}</p>
                    </ChatBubble>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posisi" className="space-y-6 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold leading-[1.1] tracking-[-0.02em] md:text-2xl">Deskripsi Pekerjaan</CardTitle>
              <CardDescription>{job.title} di {job.company}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {job.description || `Kami mencari individu yang berdedikasi dan kompeten untuk bergabung sebagai ${job.title} di ${job.company}. Posisi ini memerlukan kemampuan analitis yang kuat, keterampilan komunikasi yang baik, dan kemampuan bekerja dalam tim yang dinamis.`}
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 rounded-2xl border p-4">
                  <h4 className="flex items-center gap-2 text-sm font-semibold">
                    <IconUsers className="size-4 text-primary" />
                    Terbuka untuk
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(isFreshGrad || !application.category) && (
                      <Badge variant="secondary">Fresh Graduate</Badge>
                    )}
                    <Badge variant="secondary">Professional</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {job.requirements?.[0] || "Terbuka untuk semua jenjang karir yang memenuhi kualifikasi"}
                  </p>
                </div>

                <div className="space-y-2 rounded-2xl border p-4">
                  <h4 className="flex items-center gap-2 text-sm font-semibold">
                    <IconBriefcase className="size-4 text-primary" />
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
              <CardTitle className="text-xl font-bold leading-[1.1] tracking-[-0.02em] md:text-2xl">Persyaratan & Kualifikasi</CardTitle>
              <CardDescription>Yang perlu kamu punya buat posisi ini.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Persyaratan Utama</h4>
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
                        <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {job.detailedQualifications && job.detailedQualifications.length > 0 && (
                  <div>
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kualifikasi Tambahan</h4>
                    <ul className="space-y-2">
                      {job.detailedQualifications.map((q, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-primary" />
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
                <CardTitle className="text-xl font-bold leading-[1.1] tracking-[-0.02em] md:text-2xl">Posisi Lain di {job.company}</CardTitle>
                <CardDescription>Siapa tau ada yang lebih cocok buat kamu.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {companyJobs.filter(j => j.id !== job.id).slice(0, 4).map(j => (
                    <div key={j.id} className="rounded-2xl border p-4 transition-colors hover:border-primary/50">
                      <div className="text-sm font-semibold">{j.title}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{j.type}</span>
                        <span>·</span>
                        <span>{j.location}</span>
                      </div>
                      <div className="mt-2">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-primary hover:text-primary" render={<Link href="/candidate/jobs" />}>
                          Lihat Lowongan
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="statistik" className="py-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ChartCard
              title="Funnel Lamaran Posisi Ini"
              description={`Dari ${jobApplications.length} kandidat yang melamar ${job.title}`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationFlowData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {applicationFlowData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title={`Posisi Lain di ${job.company}`}
              description="Jumlah pelamar per posisi yang lagi buka"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={positionDistribution}
                  layout="vertical"
                  margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                  <XAxis type="number" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" fontSize={10} tickLine={false} axisLine={false} width={100} />
                  <RechartsTooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="value" fill="var(--chart-1)" radius={[0, 4, 4, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
