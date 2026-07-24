"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useDashboard } from "@/context/DashboardContext"
import { getMyProfile, uploadCV } from "@/services/candidateService"
import { getJobById } from "@/services/jobService"
import type { Job } from "@/lib/types"

interface FormData {
  name: string
  email: string
  phone: string
  linkedin: string
  portfolio: string
}

interface ApplyFlowContextValue {
  job: Job | null | undefined
  formData: FormData
  onFormDataChange: (partial: Partial<FormData>) => void
  hasCv: boolean
  isLoadingCv: boolean
  isUploadingCv: boolean
  cvUploadError: string | null
  isSubmitting: boolean
  isProfileComplete: boolean
  handleUploadCv: (file: File) => Promise<void>
  handleSubmit: () => Promise<void>
}

export const ApplyFlowContext = React.createContext<ApplyFlowContextValue | undefined>(undefined)

export function ApplyFlowProvider({ children, jobId }: { children: React.ReactNode; jobId: string }) {
  const { applyToJob, isProfileComplete, currentUser, jobs } = useDashboard()
  const router = useRouter()

  const [job, setJob] = React.useState<Job | null | undefined>(() =>
    jobs.find((j) => j.id === jobId)
  )

  const [formData, setFormData] = React.useState<FormData>({
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
    getJobById(jobId).then((fetched) => {
      if (!cancelled) setJob(fetched)
    })
    return () => {
      cancelled = true
    }
  }, [jobId])

  React.useEffect(() => {
    let cancelled = false
    getMyProfile().then((profile) => {
      if (!cancelled) {
        // override name from real profile so it's not the email prefix
        if (profile?.name) {
          setFormData((prev) => ({ ...prev, name: profile.name }))
        }
        const has = Boolean(profile?.cvFileUrl)
        setHasCv(has)
        setIsLoadingCv(false)
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

  const handleSubmit = async () => {
    if (!job) return
    setIsSubmitting(true)
    try {
      await applyToJob(job.id)
      router.push(`/candidate/apply/${job.id}/submitted`)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ApplyFlowContext.Provider
      value={{
        job,
        formData,
        onFormDataChange: (partial) => setFormData((prev) => ({ ...prev, ...partial })),
        hasCv,
        isLoadingCv,
        isUploadingCv,
        cvUploadError,
        isSubmitting,
        isProfileComplete,
        handleUploadCv,
        handleSubmit,
      }}
    >
      {children}
    </ApplyFlowContext.Provider>
  )
}

export function useApplyFlowContext() {
  const context = React.useContext(ApplyFlowContext)
  if (context === undefined) {
    throw new Error("useApplyFlowContext must be used within an ApplyFlowProvider")
  }
  return context
}
