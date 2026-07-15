"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { IconArrowLeft, IconBriefcase, IconChartPie, IconChevronDown, IconChevronUp } from "@tabler/icons-react"
import { useApp } from "@/components/providers/app-provider"
import { DataTable, getExtendedData } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

export default function JobCandidatesPage() {
  const params = useParams()
  const jobId = params.id as string
  const [showChart, setShowChart] = useState(false)
  
  const { jobs, applications } = useApp()
  const job = jobs.find(j => j.id === jobId)
  const jobApplications = applications.filter(app => app.jobId === jobId)

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-xl font-bold">Lowongan tidak ditemukan</h2>
        <Button render={<Link href="/hrd/jobs" />}>Kembali ke Daftar Lowongan</Button>
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
    { name: "Wawancara", value: statusCounts.interview, color: "#3b82f6" },
    { name: "Administrasi", value: statusCounts["under-review"], color: "#eab308" },
    { name: "Ditolak", value: statusCounts.rejected, color: "#ef4444" },
  ].filter(d => d.value > 0)

  const scoreCounts = { "Sangat Disarankan": 0, "Disarankan": 0, "Kurang": 0 }
  jobApplications.forEach(app => {
    const score = app.recommendationScore || 0;
    if (score >= 75) scoreCounts["Sangat Disarankan"]++;
    else if (score >= 55) scoreCounts["Disarankan"]++;
    else scoreCounts["Kurang"]++;
  })
  const scoreData = [
    { name: "Sangat Disarankan", count: scoreCounts["Sangat Disarankan"], fill: "#10b981" },
    { name: "Disarankan", count: scoreCounts["Disarankan"], fill: "#f59e0b" },
    { name: "Kurang", count: scoreCounts["Kurang"], fill: "#ef4444" },
  ].filter(d => d.count > 0)

  const expCounts = { "Fresh Graduate": 0, "1-3 Tahun": 0, ">3 Tahun": 0 }
  jobApplications.forEach(app => {
    const ext = getExtendedData(app.applicantName);
    const expStr = ext.experience;
    if (expStr === "Fresh Graduate") expCounts["Fresh Graduate"]++;
    else {

      if (expStr.includes("thn")) {
        const years = parseInt(expStr.split("thn")[0].trim());
        if (years >= 3) expCounts[">3 Tahun"]++;
        else expCounts["1-3 Tahun"]++;
      } else {
        expCounts["Fresh Graduate"]++;
      }
    }
  })
  const expData = [
    { name: "Fresh Graduate", count: expCounts["Fresh Graduate"], fill: "#6366f1" },
    { name: "1-3 Tahun", count: expCounts["1-3 Tahun"], fill: "#8b5cf6" },
    { name: ">3 Tahun", count: expCounts[">3 Tahun"], fill: "#d946ef" },
  ].filter(d => d.count > 0)

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8 @container/main w-full">
      <div className="flex flex-col gap-4">
        <Button render={<Link href="/hrd/jobs" className="flex items-center" />} variant="ghost" className="w-fit -ml-4 text-muted-foreground hover:text-foreground">
            <IconArrowLeft className="size-4 mr-2" />
            Kembali ke Manajemen Lowongan
          </Button>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kandidat untuk {job.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <IconBriefcase className="size-3.5" />
                {job.department}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {jobApplications.length} Pelamar
              </span>
            </div>
          </div>
          
          {jobApplications.length > 0 && (
            <Button variant="outline" onClick={() => setShowChart(!showChart)}>
              <IconChartPie className="size-4 mr-2 text-primary" />
              {showChart ? "Tutup Analisis" : "Lihat Analisis"}
              {showChart ? <IconChevronUp className="size-4 ml-2" /> : <IconChevronDown className="size-4 ml-2" />}
            </Button>
          )}
        </div>
      </div>

      {showChart && jobApplications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 fade-in duration-300">

          <div className="bg-background rounded-xl border p-6 flex flex-col">
            <h3 className="font-semibold mb-2 text-center">Status Pelamar</h3>
            <p className="text-xs text-muted-foreground text-center mb-4">Sebaran status tahapan kandidat</p>
            <div className="flex-1 min-h-[220px] w-full">
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
                    formatter={(value: any) => [`${value} Pelamar`, "Jumlah"]}
                    contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-background rounded-xl border p-6 flex flex-col">
            <h3 className="font-semibold mb-2 text-center">Skor Rekomendasi AI</h3>
            <p className="text-xs text-muted-foreground text-center mb-4">Kelayakan berdasarkan analisis profil</p>
            <div className="flex-1 min-h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: 'var(--muted)' }}
                    contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-background rounded-xl border p-6 flex flex-col">
            <h3 className="font-semibold mb-2 text-center">Tingkat Pengalaman</h3>
            <p className="text-xs text-muted-foreground text-center mb-4">Lama pengalaman kerja kandidat</p>
            <div className="flex-1 min-h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: 'var(--muted)' }}
                    contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      <div className="bg-background rounded-xl border pt-4 pb-2">
        <DataTable data={jobApplications} />
      </div>
    </div>
  )
}
