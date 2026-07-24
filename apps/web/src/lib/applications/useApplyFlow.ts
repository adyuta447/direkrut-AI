"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useDashboard } from "@/context/DashboardContext"
import { getMyProfile, uploadCV } from "@/services/candidateService"
import type { Job } from "@/lib/types"

/** State & handler buat alur 3-langkah lamar kerja kandidat (data diri ->
 * upload/cek CV -> tinjauan -> submit). Submit beneran manggil applyToJob
 * dari DashboardContext (real API + fallback), bukan lagi fabrikasi lokal.
 * CV bisa diupload langsung di sini (dikirim ke HRD & dipakai buat AI
 * screening) -- gak wajib pindah ke halaman profil dulu, walaupun secara
 * teknis tetap kesimpen di CV kandidat yang sama (satu CV per kandidat,
 * dipakai lintas lamaran). */
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
  const [hasCv, setHasCv] = React.useState(false)
  const [isLoadingCv, setIsLoadingCv] = React.useState(true)
  const [isUploadingCv, setIsUploadingCv] = React.useState(false)
  const [cvUploadError, setCvUploadError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

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
  }, [])

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
    hasCv,
    isLoadingCv,
    isUploadingCv,
    cvUploadError,
    isSubmitting,
    isProfileComplete,
    handleNext,
    handleBack,
    handleUploadCv,
    handleSubmit,
  }
}
