"use client"

import * as React from "react"
import { ArrowLeftIcon, ArrowRightIcon, BriefcaseIcon, SendIcon } from "lucide-react"
import { useDashboard } from "@/context/DashboardContext"
import { getJobById } from "@/services/jobService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplyStep1 } from "@/components/molecules/dashboard/ApplyStep1"
import { ApplyStep2 } from "@/components/molecules/dashboard/ApplyStep2"
import { ApplyStep3Review } from "@/components/molecules/dashboard/ApplyStep3Review"
import { ApplyStepIndicator } from "@/components/molecules/dashboard/ApplyStepIndicator"
import { ApplySuccessState } from "@/components/organisms/dashboard/ApplySuccessState"
import { useApplyFlow } from "@/lib/applications/useApplyFlow"
import type { Job } from "@/lib/types"

const STEP_TITLES = ["Informasi Pribadi", "Dokumen Resume / CV", "Tinjauan Akhir"]
const STEP_DESCS = [
  "Pastikan datanya sesuai sama identitas kamu ya.",
  "Upload CV yang mau kamu kirim buat lamaran ini.",
  "Cek sekali lagi sebelum lamaranmu meluncur.",
]

export default function ApplyJobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const unwrappedParams = React.use(params)
  const { jobs } = useDashboard()
  // Diambil langsung by-id, bukan jobs.find dari list context -- GET
  // /v1/jobs (list) di-cache 60 detik, jadi lowongan yang baru dibuat HRD
  // bisa "belum kelihatan" di list sesaat. GET /v1/jobs/{id} gak kena
  // masalah itu karena URL-nya unik per lowongan.
  const [job, setJob] = React.useState<Job | null | undefined>(() =>
    jobs.find((j) => j.id === unwrappedParams.jobId)
  )
  React.useEffect(() => {
    let cancelled = false
    getJobById(unwrappedParams.jobId).then((fetched) => {
      if (!cancelled) setJob(fetched)
    })
    return () => {
      cancelled = true
    }
  }, [unwrappedParams.jobId])

  const {
    step, formData, onFormDataChange, hasCv, isLoadingCv, isUploadingCv, cvUploadError, isSubmitting, isProfileComplete,
    handleNext, handleBack, handleUploadCv, handleSubmit,
  } = useApplyFlow(job ?? undefined)

  if (!job) return <div className="p-8 text-center">Pekerjaan tidak ditemukan</div>
  if (step === 4) return <ApplySuccessState job={job} />

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 w-full max-w-5xl mx-auto space-y-6">
      {/* Header flat, solid, border-hairline -- konsisten sama gaya landing page. */}
      <div>
        <div className="flex items-center gap-2 text-ink-muted mb-3">
          <BriefcaseIcon className="size-4" />
          <span className="text-sm font-medium">{job.company}</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">Melamar untuk {job.title}</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-hairline px-3 py-1 text-xs font-semibold text-ink">{job.location}</span>
          <span className="rounded-full border border-hairline px-3 py-1 text-xs font-semibold text-ink">{job.type}</span>
          <span className="rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary">{job.salaryRange}</span>
        </div>
      </div>

      <ApplyStepIndicator step={step} />

      <Card className="rounded-3xl border-hairline shadow-none">
        <CardHeader className="border-b border-hairline pb-5">
          <CardTitle className="text-2xl tracking-tight">{STEP_TITLES[step - 1]}</CardTitle>
          <CardDescription className="text-base">{STEP_DESCS[step - 1]}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {step === 1 && <ApplyStep1 formData={formData} onChange={onFormDataChange} />}
          {step === 2 && (
            <ApplyStep2
              hasCv={hasCv}
              isLoadingCv={isLoadingCv}
              isUploadingCv={isUploadingCv}
              cvUploadError={cvUploadError}
              jobTitle={job.title}
              onUploadCv={handleUploadCv}
            />
          )}
          {step === 3 && (
            <ApplyStep3Review job={job} formData={formData} isProfileComplete={isProfileComplete} />
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-hairline p-6">
          <Button variant="outline" size="lg" className="rounded-full border-hairline" onClick={handleBack} disabled={isSubmitting}>
            <ArrowLeftIcon className="mr-2 size-4" /> {step === 1 ? "Batal" : "Kembali"}
          </Button>
          {step < 3 ? (
            <Button size="lg" className="rounded-full px-7" onClick={handleNext} disabled={step === 2 && (isLoadingCv || isUploadingCv || !hasCv)}>
              Selanjutnya <ArrowRightIcon className="ml-2 size-4" />
            </Button>
          ) : (
            <Button size="lg" className="rounded-full px-7" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> Memproses...</>
              ) : (
                <><SendIcon className="mr-2 size-4" /> Kirim Lamaran</>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
