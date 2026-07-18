"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { IconBriefcase } from "@tabler/icons-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDashboard } from "@/context/DashboardContext"
import { BackButton } from "@/components/molecules/dashboard/BackButton"
import { ChartCard, CHART_TOOLTIP_STYLE } from "@/components/molecules/dashboard/ChartCard"
import { ChatBubble } from "@/components/molecules/dashboard/ChatBubble"
import { AppDetailHero } from "@/components/molecules/dashboard/AppDetailHero"
import { AppDetailTimeline } from "@/components/molecules/dashboard/AppDetailTimeline"
import { AppDetailJobInfo } from "@/components/molecules/dashboard/AppDetailJobInfo"
import { getExtendedData } from "@/lib/dashboard/extended-data"
import { MessageSquareIcon } from "lucide-react"

const STATUS_HELPER: Record<string, string> = {
  submitted: "Lamaranmu udah meluncur. Tunggu kabar selanjutnya ya!",
  "under-review": "Lagi dicek tim HRD. Sabar dikit, biasanya nggak lama kok.",
  interview: "Kamu lolos ke wawancara! Gas, siapin dirimu.",
  rejected: "Kali ini belum jodoh. Masih banyak posisi lain yang nunggu kamu.",
}

export default function ApplicationDetailPage() {
  const params = useParams<{ appId: string }>()
  const { applications, jobs } = useDashboard()

  const application = applications.find((a) => a.id === params.appId)
  const job = application ? jobs.find((j) => j.id === application.jobId) : null

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
  const jobApplications = applications.filter((a) => a.jobId === application.jobId)
  const companyJobs = jobs.filter((j) => j.company === job.company)
  const jobRejected = jobApplications.filter((a) => a.status === "rejected").length
  const jobInterviewed = jobApplications.filter((a) => a.status === "interview").length

  const applicationFlowData = [
    { name: "Terkirim", value: jobApplications.length, fill: "var(--chart-1)" },
    { name: "Administrasi", value: jobApplications.filter((a) => a.status === "under-review").length, fill: "var(--warning)" },
    { name: "Wawancara", value: jobInterviewed, fill: "var(--info)" },
    { name: "Ditolak", value: jobRejected, fill: "var(--destructive)" },
  ]

  const positionDistribution = companyJobs.slice(0, 6).map((j) => ({
    name: j.title.length > 20 ? j.title.substring(0, 18) + "…" : j.title,
    value: applications.filter((a) => a.jobId === j.id).length,
  }))

  const transcriptData = application.validationResponses || [
    { question: "Ceritakan tentang pengalaman Anda yang paling relevan dengan posisi ini.", answer: "Saya memiliki pengalaman selama 3 tahun dalam bidang yang relevan." },
    { question: "Bagaimana Anda menangani tekanan dan deadline yang ketat?", answer: "Saya menggunakan metode prioritisasi dengan membagi tugas berdasarkan urgensi dan dampaknya." },
  ]

  const timelineSteps = [
    { label: "Lamaran Dikirim", date: application.appliedDate, done: true, active: false, description: `Lamaranmu buat posisi ${job.title} udah masuk sistem.` },
    { label: "Wawancara AI", date: application.status !== "submitted" ? "Selesai" : "Menunggu", done: application.status !== "submitted", active: false, description: "Sesi tanya-jawab bareng AI Direkrut." },
    { label: "Administrasi HRD", date: application.status === "under-review" ? "Sedang berlangsung" : application.status === "interview" || application.status === "rejected" ? "Selesai" : "Menunggu", done: application.status === "interview" || application.status === "rejected", active: application.status === "under-review", description: "Tim HRD lagi ngecek hasil wawancara kamu." },
    { label: application.status === "rejected" ? "Lamaran Ditolak" : "Keputusan Final", date: application.status === "rejected" ? "Selesai" : "Menunggu", done: application.status === "rejected", active: application.status === "interview", description: application.status === "rejected" ? "Makasih udah melamar. Tetap semangat, ya!" : "Nunggu keputusan akhir dari tim HRD." },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8 @container/main">
      <BackButton href="/candidate/applications" label="Kembali ke Riwayat Lamaran" />

      <AppDetailHero
        job={{ ...job, _applicationCount: jobApplications.length }}
        application={application}
        isFreshGrad={isFreshGrad}
        timelineSteps={timelineSteps}
        statusHelper={STATUS_HELPER}
      />

      <Tabs defaultValue="perjalanan" className="w-full">
        <TabsList>
          <TabsTrigger value="perjalanan">Perjalanan</TabsTrigger>
          <TabsTrigger value="transkrip">Transkrip AI</TabsTrigger>
          <TabsTrigger value="posisi">Detail Posisi</TabsTrigger>
          <TabsTrigger value="statistik">Statistik</TabsTrigger>
        </TabsList>

        <TabsContent value="perjalanan" className="space-y-6 py-4">
          <AppDetailTimeline
            timelineSteps={timelineSteps}
            showFeedback={application.status === "under-review" || application.status === "interview"}
          />
        </TabsContent>

        <TabsContent value="transkrip" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold leading-[1.1] tracking-[-0.02em] md:text-2xl">Transkrip Wawancara AI</CardTitle>
              <CardDescription>Rekaman lengkap sesi tanya-jawabmu sama AI Direkrut.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {transcriptData.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <MessageSquareIcon className="mx-auto mb-3 size-10 opacity-30" />
                  <p>Sesi wawancaranya belum mulai.</p>
                </div>
              ) : (
                transcriptData.map((item: any, i: number) => (
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
          <AppDetailJobInfo
            job={job}
            isFreshGrad={isFreshGrad}
            hasCategory={!!application.category}
            companyJobs={companyJobs}
          />
        </TabsContent>

        <TabsContent value="statistik" className="py-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <ChartCard title="Funnel Lamaran Posisi Ini" description={`Dari ${jobApplications.length} kandidat yang melamar ${job.title}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationFlowData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {applicationFlowData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title={`Posisi Lain di ${job.company}`} description="Jumlah pelamar per posisi yang lagi buka">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={positionDistribution} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
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
