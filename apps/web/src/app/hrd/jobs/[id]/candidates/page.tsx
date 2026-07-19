"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { IconBriefcase, IconChartPie, IconChevronDown, IconChevronUp } from "@tabler/icons-react"
import { useDashboard } from "@/context/DashboardContext"
import { listApplicationsForJob } from "@/services/applicationService"
import { getJobById } from "@/services/jobService"
import { DataTable } from "@/components/organisms/dashboard/CandidateDataTable"
import { CandidateAnalyticsCharts } from "@/components/organisms/dashboard/CandidateAnalyticsCharts"
import { useCandidateAnalytics } from "@/lib/dashboard/useCandidateAnalytics"
import { BackButton } from "@/components/molecules/dashboard/BackButton"
import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { NotFoundCard } from "@/components/molecules/dashboard/NotFoundCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Application, Job } from "@/lib/types"

export default function JobCandidatesPage() {
  const params = useParams()
  const jobId = params.id as string
  const [showChart, setShowChart] = useState(false)

  const { jobs, applications } = useDashboard()
  const [job, setJob] = useState<Job | null | undefined>(() => jobs.find((j) => j.id === jobId))
  useEffect(() => {
    let cancelled = false
    getJobById(jobId).then((fetched) => {
      if (!cancelled) setJob(fetched)
    })
    return () => {
      cancelled = true
    }
  }, [jobId])
  const [jobApplications, setJobApplications] = useState<Application[]>(() =>
    applications.filter((app) => app.jobId === jobId)
  )
  useEffect(() => {
    let cancelled = false
    listApplicationsForJob(jobId).then((fetched) => {
      if (!cancelled) setJobApplications(fetched)
    })
    return () => {
      cancelled = true
    }
  }, [jobId])
  const { statusData, scoreData, expData } = useCandidateAnalytics(jobApplications)

  if (!job) {
    return (
      <NotFoundCard
        title="Lowongannya nggak ketemu nih"
        backHref="/hrd/jobs"
        backLabel="Balik ke Daftar Lowongan"
      />
    )
  }

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
        <CandidateAnalyticsCharts statusData={statusData} scoreData={scoreData} expData={expData} />
      )}

      <div className="bg-background rounded-xl border pt-4 pb-2">
        <DataTable data={jobApplications} />
      </div>
    </div>
  )
}
