"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ApplyStep2 } from "@/components/molecules/dashboard/ApplyStep2"
import { ApplyStepIndicator } from "@/components/molecules/dashboard/ApplyStepIndicator"
import { useApplyFlowContext } from "@/lib/applications/ApplyFlowContext"

export default function ResumeStepPage({ params }: { params: Promise<{ jobId: string }> }) {
  const unwrappedParams = React.use(params)
  const router = useRouter()
  const { job, hasCv, isLoadingCv, isUploadingCv, cvUploadError, handleUploadCv } = useApplyFlowContext()

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 pb-8 space-y-8">
      <ApplyStepIndicator step={2} />

      <Card>
        <CardHeader>
          <CardTitle>Dokumen Resume / CV</CardTitle>
          <CardDescription>Upload CV yang mau kamu kirim buat lamaran ini.</CardDescription>
        </CardHeader>
        <CardContent>
          <ApplyStep2
            hasCv={hasCv}
            isLoadingCv={isLoadingCv}
            isUploadingCv={isUploadingCv}
            cvUploadError={cvUploadError}
            jobTitle={job?.title ?? "Pekerjaan"}
            onUploadCv={handleUploadCv}
          />
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/20 p-6">
          <Button variant="outline" onClick={() => router.push(`/candidate/apply/${unwrappedParams.jobId}/personal`)}>
            <ArrowLeftIcon className="mr-2 size-4" /> Kembali
          </Button>
          <Button 
            onClick={() => router.push(`/candidate/apply/${unwrappedParams.jobId}/review`)}
            disabled={isLoadingCv || isUploadingCv || !hasCv}
          >
            Selanjutnya <ArrowRightIcon className="ml-2 size-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
