"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { IconFileText, IconCheck, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DecisionDialog } from "@/components/organisms/dashboard/DecisionDialog"
import { useDashboard } from "@/context/DashboardContext"
import { BackButton } from "@/components/molecules/dashboard/BackButton"
import { getExtendedData } from "@/lib/dashboard/extended-data"
import { CandidateContactGrid } from "@/components/molecules/dashboard/CandidateContactGrid"
import { CandidateCharts } from "@/components/molecules/dashboard/CandidateCharts"
import { CandidateDetailAnalysis } from "@/components/molecules/dashboard/CandidateDetailAnalysis"
import { CandidateDetailCV } from "@/components/molecules/dashboard/CandidateDetailCV"

export default function CandidateDetailPage() {
  const params = useParams<{ id: string }>()
  const { applications } = useDashboard()
  const [showChart, setShowChart] = React.useState(false)
  const [expandedCards, setExpandedCards] = React.useState<Record<string, boolean>>({})

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const rawCandidate = applications.find((app) => app.id === params.id)
  const candidate = rawCandidate
    ? { ...rawCandidate, ...getExtendedData(rawCandidate.id) }
    : null

  if (!candidate) {
    return (
      <div className="flex flex-1 items-center justify-center h-full min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground">Kandidat tidak ditemukan.</p>
          <Button render={<Link href="/hrd" />} variant="outline">Kembali ke Dashboard</Button>
        </div>
      </div>
    )
  }

  const baseScore = candidate.recommendationScore || 0
  const isFreshGrad = candidate.category === "fresh-graduate"

  const chartData = {
    radar: [
      { parameter: "Pemahaman Konsep", score: Math.min(100, baseScore + 5) },
      { parameter: "Kualitas Kode", score: Math.max(0, baseScore - 10) },
      { parameter: "Komunikasi Teknis", score: Math.min(100, baseScore + 2) },
      { parameter: isFreshGrad ? "Pemahaman Akademis" : "Desain Sistem", score: Math.max(0, baseScore - 5) },
      { parameter: "Kesesuaian Industri", score: baseScore },
    ],
    softSkill: [
      { name: "Komunikasi", score: Math.min(100, baseScore + 10), fill: "var(--chart-1)" },
      { name: "Kerja Sama Tim", score: Math.min(100, baseScore + 5), fill: "var(--chart-2)" },
      { name: "Adaptabilitas", score: Math.max(0, baseScore - 5), fill: "var(--chart-3)" },
      { name: "Kepemimpinan", score: Math.max(0, baseScore - 15), fill: "var(--chart-4)" },
      { name: "Inisiatif", score: baseScore, fill: "var(--chart-5)" },
    ],
    weight: isFreshGrad
      ? [{ name: "Wawancara", value: 40, fill: "var(--chart-1)" }, { name: "Magang & Proyek", value: 35, fill: "var(--chart-3)" }, { name: "Pendidikan Akademik", value: 25, fill: "var(--chart-5)" }]
      : [{ name: "Wawancara", value: 40, fill: "var(--chart-1)" }, { name: "Pengalaman Kerja", value: 50, fill: "var(--chart-3)" }, { name: "Pendidikan & Sertifikasi", value: 10, fill: "var(--chart-5)" }],
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8 @container/main">
      <BackButton href="/hrd" label="Kembali ke Manajemen Kandidat" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">{candidate.applicantName}</h1>
            <Badge variant={candidate.status === "interview" ? "default" : candidate.status === "rejected" ? "destructive" : "secondary"} className="capitalize">
              {candidate.status === "under-review" ? "Administrasi" : candidate.status}
            </Badge>
            <Badge variant="outline" className={isFreshGrad ? "text-info border-info/30 bg-info/10" : "text-primary border-primary/30 bg-primary/10"}>
              {isFreshGrad ? "Fresh Graduate" : "Professional"}
            </Badge>
            {candidate.isJobHopper && (
              <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">⚠️ Indikasi Job Hopping</Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground font-medium">{candidate.jobTitle}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          {candidate.resumeLink && (
            <Button variant="outline" render={<a href={candidate.resumeLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2" />}>
              <IconFileText className="size-4 shrink-0" /><span className="truncate">Lihat CV</span>
            </Button>
          )}
          <DecisionDialog candidate={candidate} decision="invite"
            trigger={<Button className="bg-success hover:bg-success/90 text-white flex items-center justify-center gap-2"><IconCheck className="size-4 shrink-0" /><span className="truncate">Undang Wawancara</span></Button>}
          />
          <DecisionDialog candidate={candidate} decision="reject"
            trigger={<Button variant="destructive" className="flex items-center justify-center gap-2"><IconX className="size-4 shrink-0" /><span className="truncate">Tolak Lamaran</span></Button>}
          />
        </div>
      </div>

      <CandidateContactGrid candidate={candidate} showChart={showChart} onToggleChart={() => setShowChart(!showChart)} />
      {showChart && <CandidateCharts weightData={chartData.weight} radarData={chartData.radar} softSkillData={chartData.softSkill} />}

      <div className="mt-4">
        <Tabs defaultValue="analisis" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none pb-0 h-auto bg-transparent">
            {["analisis", "transkrip", "ringkasan"].map((tab) => (
              <TabsTrigger key={tab} value={tab} className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3">
                {tab === "analisis" ? "Detail Analisis & Bukti AI" : tab === "transkrip" ? "Log Wawancara AI" : "Ringkasan CV"}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="analisis" className="py-6 space-y-6">
            <CandidateDetailAnalysis candidate={candidate} baseScore={baseScore} isFreshGrad={isFreshGrad} expandedCards={expandedCards} onToggleCard={toggleCard} />
          </TabsContent>
          <TabsContent value="transkrip" className="py-6">
            <CandidateDetailCV candidate={candidate} />
          </TabsContent>
          <TabsContent value="ringkasan" className="py-6">
            <CandidateDetailCV candidate={candidate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
