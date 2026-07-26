"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useDashboard } from "@/context/DashboardContext"
import { getMyProfile, uploadCV } from "@/services/candidateService"
import type { Job } from "@/lib/types"

export function useApplyFlow(job: Job | undefined) {
  const router = useRouter()
  const { applyToJob, isProfileComplete, currentUser } = useDashboard()

  const [step, setStep] = React.useState(isProfileComplete ? 3 : 1)
  const [formData, setFormData] = React.useState({
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    phone: "",
    linkedin: "",
    portfolio: "",
  })
  const [hasCv, setHasCv] = React.useState(false)
  const [isLoadingCv, setIsLoadingCv] = React.useState(true)
  const [isUploadingCv, setIsUploadingCv] = React.useState(false)
  const [cvUploadError, setCvUploadError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    getMyProfile().then((profile) => {
      if (!cancelled) {
        const has = Boolean(profile?.cvFileUrl)
        setHasCv(has)
        setIsLoadingCv(false)
        if (isProfileComplete && !has) {
          setStep(2) // paksa ke langkah upload CV meskipun profil lengkap
        }
      }
    })
    return () => {
      cancelled = true
    }
  }, [isProfileComplete])

  const handleUploadCv = async (file: File) => {
    setIsUploadingCv(true)
    setCvUploadError(null)
    const objectKey = await uploadCV(file)
    setIsUploadingCv(false)
    if (objectKey) {
      setHasCv(true)
    } else {
      setCvUploadError("Gagal upload CV. Coba lagi ya.")
    }
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }
  const handleBack = () => {
    if (step > 1) setStep(step - 1)
    else router.back()
  }

  const handleSubmit = async () => {
    if (!job) return
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await applyToJob(job.id)
      setStep(4)
    } catch (err) {
      // Termasuk kasus lowongan udah dinonaktifin/dihapus HRD sesaat sebelum
      // kandidat submit -- backend nolak (404/409), pesannya ditampilin apa
      // adanya di sini, BUKAN dianggap sukses (lihat applicationService.submitApplication).
      setSubmitError(err instanceof Error ? err.message : "Gagal ngirim lamaran, coba lagi ya")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    step,
    formData,
    onFormDataChange: (partial: Partial<typeof formData>) => setFormData((prev) => ({ ...prev, ...partial })),
    hasCv,
    isLoadingCv,
    isUploadingCv,
    cvUploadError,
    isSubmitting,
    submitError,
    isProfileComplete,
    handleNext,
    handleBack,
    handleUploadCv,
    handleSubmit,
  }
}
