"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { IconBriefcase, IconChartPie, IconChevronDown, IconChevronUp } from "@tabler/icons-react"
import { useDashboard } from "@/context/DashboardContext"
import { DataTable } from "@/components/organisms/dashboard/CandidateDataTable"
import { getExtendedData } from "@/lib/dashboard/extended-data"
import { BackButton } from "@/components/molecules/dashboard/BackButton"
import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { ChartCard, CHART_TOOLTIP_STYLE } from "@/components/molecules/dashboard/ChartCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

export default function JobCandidatesPage() {
  const params = useParams()
  const jobId = params.id as string
  const [showChart, setShowChart] = useState(false)

  const { jobs, applications } = useDashboard()
  const job = jobs.find(j => j.id === jobId)
  const jobApplications = applications.filter(app => app.jobId === jobId)

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-xl font-bold">Lowongannya nggak ketemu nih</h2>
        <Button render={<Link href="/hrd/jobs" />}>Balik ke Daftar Lowongan</Button>
      </div>
    )
  }

  const statusCounts = { interview: 0, "under-review": 0, rejected: 0 }
  jobApplications.forEach(app => {
    if (statusCounts[app.status as keyof typeof statusCounts] !== undefined) {
      statusCounts[app.status as keyof typeof statusCounts]++
    }
  })
  const statusData = [
    { name: "Wawancara", value: statusCounts.interview, color: "var(--info)" },
    { name: "Administrasi", value: statusCounts["under-review"], color: "var(--warning)" },
    { name: "Ditolak", value: statusCounts.rejected, color: "var(--destructive)" },
  ].filter(d => d.value > 0)

  const scoreCounts = { "Sangat Disarankan": 0, "Disarankan": 0, "Kurang": 0 }
  jobApplications.forEach(app => {
    const score = app.recommendationScore || 0;
    if (score >= 75) scoreCounts["Sangat Disarankan"]++;
    else if (score >= 55) scoreCounts["Disarankan"]++;
    else scoreCounts["Kurang"]++;
  })
  const scoreData = [
    { name: "Sangat Disarankan", count: scoreCounts["Sangat Disarankan"], fill: "var(--success)" },
    { name: "Disarankan", count: scoreCounts["Disarankan"], fill: "var(--warning)" },
    { name: "Kurang", count: scoreCounts["Kurang"], fill: "var(--destructive)" },
  ].filter(d => d.count > 0)

  const expCounts = { "Fresh Graduate": 0, "1-3 Tahun": 0, ">3 Tahun": 0 }
  jobApplications.forEach(app => {
    const ext = getExtendedData(app.applicantName);
    const expStr = ext.experience;
    if (expStr === "Fresh Graduate") expCounts["Fresh Graduate"]++;
    else if (expStr.includes("thn")) {
      const years = parseInt(expStr.split("thn")[0].trim());
      if (years >= 3) expCounts[">3 Tahun"]++;
      else expCounts["1-3 Tahun"]++;
    } else {
      expCounts["Fresh Graduate"]++;
    }
  })
  const expData = [
    { name: "Fresh Graduate", count: expCounts["Fresh Graduate"], fill: "var(--chart-1)" },
    { name: "1-3 Tahun", count: expCounts["1-3 Tahun"], fill: "var(--chart-3)" },
    { name: ">3 Tahun", count: expCounts[">3 Tahun"], fill: "var(--chart-5)" },
  ].filter(d => d.count > 0)

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8 @container/main w-full">
      <div className="flex flex-col gap-4">
        <BackButton href="/hrd/jobs" label="Kembali ke Manajemen Lowongan" />

        <PageHeader
          title={`Kandidat untuk ${job.title}`}
          description={
            <span className="flex items-center gap-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <IconBriefcase className="size-3.5" />
                {job.department}
              </Badge>
              {jobApplications.length} Kandidat
            </span>
          }
          action={
            jobApplications.length > 0 && (
              <Button variant="outline" onClick={() => setShowChart(!showChart)}>
                <IconChartPie className="size-4 mr-2 text-primary" />
                {showChart ? "Tutup Analisis" : "Lihat Analisis"}
                {showChart ? <IconChevronUp className="size-4 ml-2" /> : <IconChevronDown className="size-4 ml-2" />}
              </Button>
            )
          }
        />
      </div>

      {showChart && jobApplications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 fade-in duration-300">
          <ChartCard title="Status Kandidat" description="Sebaran status tahapan kandidat">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value: any) => [`${value} Kandidat`, "Jumlah"]}
                  contentStyle={CHART_TOOLTIP_STYLE}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Skor Rekomendasi AI" description="Kelayakan berdasarkan analisis profil">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{ fill: "var(--muted)" }} contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Tingkat Pengalaman" description="Lama pengalaman kerja kandidat">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip cursor={{ fill: "var(--muted)" }} contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      <div className="bg-background rounded-xl border pt-4 pb-2">
        <DataTable data={jobApplications} />
      </div>
    </div>
  )
}
