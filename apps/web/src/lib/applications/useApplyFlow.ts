"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useDashboard } from "@/context/DashboardContext"
import type { Job } from "@/lib/types"

/** State & handler buat alur 3-langkah lamar kerja kandidat (data diri ->
 * upload CV -> tinjauan -> submit). Submit beneran manggil applyToJob dari
 * DashboardContext (real API + fallback), bukan lagi fabrikasi lokal. */
export function useApplyFlow(job: Job | undefined) {
  const router = useRouter()
  const { applyToJob, isProfileComplete, currentUser } = useDashboard()

  // Profil lengkap -> lompat ke tinjauan, gak perlu isi ulang data diri/CV.
  const [step, setStep] = React.useState(isProfileComplete ? 3 : 1)
  const [formData, setFormData] = React.useState({
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    phone: "",
    linkedin: "",
    portfolio: "",
  })
  const [file, setFile] = React.useState<File | null>(null)
  const [isParsing, setIsParsing] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }
  const handleBack = () => {
    if (step > 1) setStep(step - 1)
    else router.back()
  }

  const handleUpload = () => {
    setIsParsing(true)
    setTimeout(() => {
      setFile(new File([""], "CV_Kandidat.pdf", { type: "application/pdf" }))
      setIsParsing(false)
    }, 1500)
  }

  const handleSubmit = async () => {
    if (!job) return
    setIsSubmitting(true)
    try {
      await applyToJob(job.id)
      setStep(4)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    step,
    formData,
    onFormDataChange: (partial: Partial<typeof formData>) => setFormData((prev) => ({ ...prev, ...partial })),
    file,
    isParsing,
    isSubmitting,
    isProfileComplete,
    handleNext,
    handleBack,
    handleUpload,
    handleRemoveFile: () => setFile(null),
    handleSubmit,
  }
}
