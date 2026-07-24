"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useDashboard } from "@/context/DashboardContext"
import { getApplicationById } from "@/services/applicationService"
import { getExtendedData } from "@/lib/dashboard/extended-data"
import { getScreeningResult, getInterviewResult, type ScreeningResult, type InterviewResult } from "@/services/aiService"
import { CandidateDetailFullView } from "@/components/organisms/dashboard/CandidateDetailFullView"
import type { Application } from "@/lib/types"

export default function CandidateDetailPage() {
  const params = useParams<{ id: string }>()
  const { applications } = useDashboard()
  const [screening, setScreening] = React.useState<ScreeningResult | null>(null)
  const [interview, setInterview] = React.useState<InterviewResult | null>(null)

  const [rawCandidate, setRawCandidate] = React.useState<Application | null | undefined>(() =>
    applications.find((app) => app.id === params.id)
  )

  React.useEffect(() => {
    let cancelled = false
    getApplicationById(params.id).then((fetched) => {
      if (!cancelled && fetched) setRawCandidate(fetched)
    })
    return () => { cancelled = true }
  }, [params.id])

  // Load screening and interview results
  React.useEffect(() => {
    let cancelled = false
    Promise.all([
      getScreeningResult(params.id).catch(() => null),
      getInterviewResult(params.id).catch(() => null),
    ]).then(([scr, intr]) => {
      if (!cancelled) {
        setScreening(scr)
        setInterview(intr)
      }
    })
    return () => { cancelled = true }
  }, [params.id])

  const [isScreening, setIsScreening] = React.useState(false)

  const candidate = rawCandidate
    ? { ...rawCandidate, ...getExtendedData(rawCandidate) }
    : null

  if (!candidate) {
    return (
      <div className="flex flex-1 items-center justify-center h-full min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <p className="text-slate-500 font-medium">Kandidatnya nggak ketemu nih.</p>
          <Button render={<Link href="/hrd" />} variant="outline">Balik ke Dashboard</Button>
        </div>
      </div>
    )
  }

  const handleRunScreening = async () => {
    setIsScreening(true)
    try {
      // POST /v1/applications/{id}/screening to trigger manual AI screening
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/v1/applications/${params.id}/screening`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('direkrut_token')}`
        }
      })
      if (result.ok) {
        const data = await result.json()
        setScreening(data)
        window.location.reload()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsScreening(false)
    }
  }

  return (
    <CandidateDetailFullView
      candidate={candidate}
      screening={screening}
      interview={interview}
      resumeUrl={candidate.resumeLink}
      onRunScreening={handleRunScreening}
      isScreening={isScreening}
    />
  )
}
