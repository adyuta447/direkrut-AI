"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircleIcon, PlayCircleIcon, ArrowLeftIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useApplyFlowContext } from "@/lib/applications/ApplyFlowContext"
import { ApplyStepIndicator } from "@/components/molecules/dashboard/ApplyStepIndicator"

export default function SubmittedStepPage({ params }: { params: Promise<{ jobId: string }> }) {
  const unwrappedParams = React.use(params)
  const router = useRouter()
  const { job } = useApplyFlowContext()

  if (!job) return null

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 pb-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ApplyStepIndicator step={4} />

      <Card className="text-center py-10 border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircleIcon className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Lamaran Terkirim!</CardTitle>
          <CardDescription className="text-base mt-2">
            Status lamaranmu saat ini disimpan sebagai <strong>Draft</strong>. 
            Kamu bisa mengedit kembali sebelum lanjut ke tahap tes tertulis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-ink-muted">
            Langkah selanjutnya adalah <strong>Persiapan Wawancara AI & Tes Tertulis</strong>. 
            Apakah kamu siap?
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Button variant="outline" size="lg" onClick={() => router.push(`/candidate/apply/${unwrappedParams.jobId}/personal`)}>
            <ArrowLeftIcon className="mr-2 size-4" /> Edit Formulir
          </Button>
          <Button size="lg" onClick={() => router.push(`/candidate/apply/${unwrappedParams.jobId}/prep`)}>
            <PlayCircleIcon className="mr-2 size-4" /> Mulai Persiapan
          </Button>
        </CardFooter>
      </Card>
      
      <div className="text-center">
        <Button variant="link" render={<Link href="/candidate" />}>
          Kembali ke Dashboard
        </Button>
      </div>
    </div>
  )
}
