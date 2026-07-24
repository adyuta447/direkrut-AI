"use client"

import { useRouter } from "next/navigation"
import { BackButton } from "@/components/molecules/dashboard/BackButton"
import { Button } from "@/components/ui/button"
import { JobFormFields, parseJobFormValues } from "@/components/molecules/dashboard/JobFormFields"
import { NewJobHero } from "@/components/molecules/dashboard/NewJobHero"
import { JobFormProgressCard } from "@/components/molecules/dashboard/JobFormProgressCard"
import { DraftInfoCard } from "@/components/molecules/dashboard/DraftInfoCard"
import { useJobFormProgress } from "@/lib/jobs/useJobFormProgress"
import { useDashboard } from "@/context/DashboardContext"
import { NoticeDialog } from "@/components/molecules/dashboard/NoticeDialog"
import { useState } from "react"

export default function NewJobPage() {
  const router = useRouter()
  const { addJob } = useDashboard()
  const { fields, filledFields, progress, handleFormInput } = useJobFormProgress()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
    const formData = new FormData(e.currentTarget, submitter ?? undefined)
    const intent = formData.get("intent") as string
    const status = intent === "draft" ? "draft" : "active"
    const values = parseJobFormValues(formData)

    try {
      await addJob({
        id: crypto.randomUUID(),
        company: "Perusahaan Kami",
        detailedQualifications: values.requirements,
        industry: values.department,
        questions: [],
        posted: new Date().toISOString(),
        applicantCount: 0,
        status,
        ...values,
      })
      router.push(`/hrd/jobs?notice=${status === "draft" ? "draft" : "created"}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal buat lowongan, coba lagi ya")
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-4 lg:p-8">
      <NoticeDialog message={error} image="/status/warning.svg" onClose={() => setError(null)} />
      <BackButton href="/hrd/jobs" label="Kembali ke Manajemen Lowongan" />

      <NewJobHero />

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <form onSubmit={handleSubmit} onInput={handleFormInput} className="lg:flex-2">
          <div className="rounded-3xl border border-hairline bg-canvas p-6 sm:p-8">
            <JobFormFields selectedJob={null} />
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="submit"
              name="intent"
              value="draft"
              formNoValidate
              variant="outline"
              className="h-12 border-hairline px-6 text-base"
            >
              Simpan sebagai Draft
            </Button>
            <Button type="submit" name="intent" value="publish" className="h-12 px-8 text-base">
              Publikasikan Lowongan
            </Button>
          </div>
        </form>

        <div className="w-full lg:flex-1">
          <div className="flex flex-col gap-6 lg:sticky lg:top-6">
            <JobFormProgressCard progress={progress} fields={fields} filledFields={filledFields} />
            <DraftInfoCard />
          </div>
        </div>
      </div>
    </div>
  )
}
