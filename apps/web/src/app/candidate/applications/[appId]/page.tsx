"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { IconBriefcase } from "@tabler/icons-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDashboard } from "@/context/DashboardContext"
import { getApplicationById } from "@/services/applicationService"
import { getJobById } from "@/services/jobService"
import { getInterviewResult, type InterviewResult } from "@/services/aiService"
import { BackButton } from "@/components/molecules/dashboard/BackButton"
import { NotFoundCard } from "@/components/molecules/dashboard/NotFoundCard"
import { AppDetailHero } from "@/components/molecules/dashboard/AppDetailHero"
import { AppDetailTimeline } from "@/components/molecules/dashboard/AppDetailTimeline"
import { AppDetailJobInfo } from "@/components/molecules/dashboard/AppDetailJobInfo"
import { ApplicationTranscriptTab } from "@/components/organisms/dashboard/ApplicationTranscriptTab"
import { getApplicationDetailData } from "@/lib/dashboard/applicationDetailData"
import type { Application, Job } from "@/lib/types"

const STATUS_HELPER: Record<string, string> = {
  submitted: "Lamaranmu udah meluncur. Tunggu kabar selanjutnya ya!",
  "under-review": "Lagi dicek tim HRD. Sabar dikit, biasanya nggak lama kok.",
  interview: "Kamu lolos ke wawancara! Gas, siapin dirimu.",
  rejected: "Kali ini belum jodoh. Masih banyak posisi lain yang nunggu kamu.",
}

export default function ApplicationDetailPage() {
  const params = useParams<{ appId: string }>()
  const { applications, jobs } = useDashboard()

  // Diambil langsung by-id (bukan cuma applications.find/jobs.find dari
  // context) -- context butuh waktu buat fetch data asli pas mount + list
  // lowongan di-cache 60 detik, jadi deep-link langsung ke sini gak boleh
  // nunjukin "nggak ketemu" prematur.
  const [application, setApplication] = useState<Application | null | undefined>(() =>
    applications.find((a) => a.id === params.appId)
  )
  useEffect(() => {
    let cancelled = false
    getApplicationById(params.appId).then((fetched) => {
      if (!cancelled && fetched) setApplication(fetched)
    })
    return () => {
      cancelled = true
    }
  }, [params.appId])

  const [job, setJob] = useState<Job | null | undefined>(() =>
    application ? jobs.find((j) => j.id === application.jobId) : null
  )
  useEffect(() => {
    if (!application?.jobId) return
    let cancelled = false
    getJobById(application.jobId).then((fetched) => {
      if (!cancelled) setJob(fetched)
    })
    return () => {
      cancelled = true
    }
  }, [application?.jobId])

  const [interview, setInterview] = useState<InterviewResult | null>(null)
  const [isLoadingInterview, setIsLoadingInterview] = useState(true)
  useEffect(() => {
    if (!application?.id) return
    let cancelled = false
    getInterviewResult(application.id)
      .then((result) => {
        if (!cancelled) setInterview(result)
      })
      .finally(() => {
        if (!cancelled) setIsLoadingInterview(false)
      })
    return () => {
      cancelled = true
    }
  }, [application?.id])

  if (!application || !job) {
    return (
      <NotFoundCard
        title="Lamarannya nggak ketemu nih."
        backHref="/candidate/applications"
        backLabel="Kembali ke Riwayat Lamaran"
        icon={IconBriefcase}
        variant="muted"
      />
    )
  }

  const { isFreshGrad, jobApplications, companyJobs, timelineSteps } =
    getApplicationDetailData(application, job, applications, jobs)

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
        </TabsList>

        <TabsContent value="perjalanan" className="space-y-6 py-4">
          <AppDetailTimeline
            timelineSteps={timelineSteps}
            showFeedback={application.status === "under-review" || application.status === "interview"}
          />
        </TabsContent>

        <TabsContent value="transkrip" className="space-y-4 py-4">
          <ApplicationTranscriptTab
            transcriptData={interview?.items.map((it) => ({ question: it.question, answer: it.answer, aiFeedback: it.aiFeedback })) ?? []}
            isLoading={isLoadingInterview}
            recommendationScore={interview?.recommendationScore}
          />
        </TabsContent>

        <TabsContent value="posisi" className="space-y-6 py-4">
          <AppDetailJobInfo job={job} companyJobs={companyJobs} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
