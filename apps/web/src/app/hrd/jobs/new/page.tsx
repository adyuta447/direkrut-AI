"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { IconCircle, IconCircleCheck, IconDeviceFloppy, IconProgress } from "@tabler/icons-react"
import { BackButton } from "@/components/molecules/dashboard/BackButton"
import { Button } from "@/components/ui/button"
import { JobFormFields, parseJobFormValues } from "@/components/molecules/dashboard/JobFormFields"
import { useDashboard } from "@/context/DashboardContext"

const PROGRESS_FIELDS: { key: string; label: string }[] = [
  { key: "title", label: "Judul Pekerjaan" },
  { key: "location", label: "Lokasi" },
  { key: "description", label: "Deskripsi Pekerjaan" },
  { key: "requirements", label: "Kualifikasi Utama" },
]

export default function NewJobPage() {
  const router = useRouter()
  const { addJob } = useDashboard()
  const [filledFields, setFilledFields] = useState<Set<string>>(new Set())

  const handleFormInput = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget)
    const next = new Set<string>()
    for (const { key } of PROGRESS_FIELDS) {
      if (((formData.get(key) as string) || "").trim()) next.add(key)
    }
    setFilledFields(next)
  }

  const progress = Math.round((filledFields.size / PROGRESS_FIELDS.length) * 100)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
    const formData = new FormData(e.currentTarget, submitter ?? undefined)
    const intent = formData.get("intent") as string
    const status = intent === "draft" ? "draft" : "active"
    const values = parseJobFormValues(formData)

    addJob({
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
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-4 lg:p-8">
      <BackButton href="/hrd/jobs" label="Kembali ke Manajemen Lowongan" />

      <div className="relative mt-4 flex flex-col items-center gap-5 overflow-hidden rounded-3xl bg-primary p-8 text-center text-white sm:flex-row sm:text-left">
        <Image
          src="/dashboard/add_file.svg"
          alt=""
          width={220}
          height={165}
          unoptimized
          className="pointer-events-none h-28 w-auto shrink-0 select-none sm:h-32"
        />
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white/70">
            Lowongan Baru
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Buka Posisi Baru</h1>
          <p className="mt-2 text-base text-white/85">
            Isi detailnya di bawah. Belum yakin semua siap? Simpan draft dulu aja, lanjutin kapan pun.
          </p>
        </div>
      </div>

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
            <div className="rounded-3xl bg-brand-accent-strong p-6 text-white">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-[17px] font-semibold">
                  <IconProgress className="size-5" /> Progres Pengisian
                </h3>
                <span className="text-2xl font-bold tabular-nums">{progress}%</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {PROGRESS_FIELDS.map(({ key, label }) => {
                  const done = filledFields.has(key)
                  return (
                    <li key={key} className={`flex items-center gap-2 ${done ? "text-white" : "text-white/60"}`}>
                      {done ? (
                        <IconCircleCheck className="size-4 shrink-0" />
                      ) : (
                        <IconCircle className="size-4 shrink-0" />
                      )}
                      {label}
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="rounded-3xl border border-hairline bg-canvas p-6">
              <div className="flex items-center gap-2 text-ink">
                <IconDeviceFloppy className="size-5 text-primary" />
                <h3 className="text-[17px] font-semibold">Kenapa Ada Draft?</h3>
              </div>
              <p className="mt-2 text-sm text-ink-muted">
                Belum semua data siap? Nggak masalah. Simpan dulu sebagai draft, lowongan nggak akan
                tampil ke pelamar sampai kamu publikasikan sendiri lewat halaman Manajemen Lowongan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
