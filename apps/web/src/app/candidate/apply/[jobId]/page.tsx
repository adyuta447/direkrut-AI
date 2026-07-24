"use client"

import * as React from "react"
import { ArrowLeftIcon, ArrowRightIcon, BriefcaseIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ApplyStep1 } from "@/components/molecules/dashboard/ApplyStep1"
import { ApplyStep2 } from "@/components/molecules/dashboard/ApplyStep2"
import { ApplyStep3Review } from "@/components/molecules/dashboard/ApplyStep3Review"
import { ApplyStepIndicator } from "@/components/molecules/dashboard/ApplyStepIndicator"
import { ApplyFlowProvider, useApplyFlowContext } from "@/lib/applications/ApplyFlowContext"

function ApplyFlowContent({ jobId }: { jobId: string }) {
  const router = useRouter()
  const [step, setStep] = React.useState<1 | 2 | 3>(1)
  
  const { 
    job, formData, onFormDataChange, 
    hasCv, isUploadingCv, cvUploadError, handleUploadCv,
    isSubmitting, handleSubmit, isProfileComplete
  } = useApplyFlowContext()

  const handleFinalSubmit = async () => {
    await handleSubmit()
    router.push(`/interview/${jobId}`)
  }

  if (!job) return <div className="flex h-screen items-center justify-center">Memuat...</div>

  const renderHeader = () => (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 pt-6 mb-8">
      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <BriefcaseIcon className="size-4" />
        <span className="text-sm font-medium">{job.company}</span>
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Melamar untuk {job.title}</h2>
      <div className="flex items-center gap-4 mt-3">
        <Badge variant="secondary" className="font-normal">{job.location}</Badge>
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 pb-12">
      {renderHeader()}

      {step === 1 && (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
          <ApplyStepIndicator step={1} />
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pribadi</CardTitle>
              <CardDescription>Pastikan datanya sesuai sama identitas kamu ya.</CardDescription>
            </CardHeader>
            <CardContent>
              <ApplyStep1 formData={formData} onChange={onFormDataChange} />
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="ghost" onClick={() => router.back()}>
                Batal
              </Button>
              <Button onClick={() => setStep(2)}>
                Lanjut <ArrowRightIcon className="ml-2 size-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
          <ApplyStepIndicator step={2} />
          <Card>
            <CardHeader>
              <CardTitle>Unggah CV</CardTitle>
              <CardDescription>Upload CV terbaikmu biar peluang keterima makin gede.</CardDescription>
            </CardHeader>
            <CardContent>
              <ApplyStep2
                hasCv={hasCv}
                isUploading={isUploadingCv}
                uploadError={cvUploadError}
                onUpload={handleUploadCv}
              />
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeftIcon className="mr-2 size-4" /> Kembali
              </Button>
              <Button onClick={() => setStep(3)} disabled={!hasCv}>
                Lanjut <ArrowRightIcon className="ml-2 size-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
          <ApplyStepIndicator step={3} />
          <Card>
            <CardHeader>
              <CardTitle>Tinjauan Akhir</CardTitle>
              <CardDescription>Cek sekali lagi lamaranmu sebelum dikirim.</CardDescription>
            </CardHeader>
            <CardContent>
              <ApplyStep3Review formData={formData} job={job} isProfileComplete={isProfileComplete} />
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="ghost" onClick={() => setStep(2)}>
                <ArrowLeftIcon className="mr-2 size-4" /> Kembali
              </Button>
              <Button onClick={handleFinalSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Mengirim..." : "Kirim Lamaran & Wawancara AI"} <ArrowRightIcon className="ml-2 size-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

export default function ApplyPage({ params }: { params: Promise<{ jobId: string }> }) {
  const unwrappedParams = React.use(params)
  return (
    <ApplyFlowProvider jobId={unwrappedParams.jobId}>
      <ApplyFlowContent jobId={unwrappedParams.jobId} />
    </ApplyFlowProvider>
  )
}
