"use client"

import * as React from "react"
import { ApplyFlowProvider } from "@/lib/applications/ApplyFlowContext"
import { BriefcaseIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useDashboard } from "@/context/DashboardContext"

export default function ApplyFlowLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ jobId: string }>
}) {
  const unwrappedParams = React.use(params)

  return (
    <ApplyFlowProvider jobId={unwrappedParams.jobId}>
      <ApplyFlowHeader jobId={unwrappedParams.jobId} />
      {children}
    </ApplyFlowProvider>
  )
}

function ApplyFlowHeader({ jobId }: { jobId: string }) {
  const { jobs } = useDashboard()
  const job = jobs.find((j) => j.id === jobId)

  if (!job) return null

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 pt-6 mb-8">
      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <BriefcaseIcon className="size-4" />
        <span className="text-sm font-medium">{job.company}</span>
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Melamar untuk {job.title}</h2>
      <div className="flex items-center gap-4 mt-3">
        <Badge variant="secondary" className="font-normal">{job.location}</Badge>
        <Badge variant="secondary" className="font-normal">{job.type}</Badge>
        <Badge variant="outline" className="font-normal border-primary/30 text-primary bg-primary/5">{job.salaryRange}</Badge>
      </div>
    </div>
  )
}
