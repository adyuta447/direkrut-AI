"use client"

import * as React from "react"
import { ApplyFlowProvider } from "@/lib/applications/ApplyFlowContext"

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
      {children}
    </ApplyFlowProvider>
  )
}
