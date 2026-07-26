"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useDashboard } from "@/context/DashboardContext"
import { getMyProfile, uploadCV, type CandidateProfile } from "@/services/candidateService"
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
  
  const [fullProfile, setFullProfile] = React.useState<CandidateProfile | null>(null)
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
        setFullProfile(profile)
        // override form data from real profile
        const updates: Partial<FormData> = {}
        if (profile?.name) updates.name = profile.name
        if (profile?.phone) updates.phone = profile.phone
        
        if (profile?.links && profile.links.length > 0) {
          const linkedin = profile.links.find(l => l.platform.toLowerCase() === "linkedin" || l.platform.toLowerCase().includes("linked"))
          if (linkedin) updates.linkedin = linkedin.url
          
          const portfolio = profile.links.find(l => l.platform.toLowerCase() === "portfolio" || l.platform.toLowerCase() === "github" || l.platform.toLowerCase() === "website" || l.platform.toLowerCase() === "other")
          if (portfolio) updates.portfolio = portfolio.url
        }

        if (Object.keys(updates).length > 0) {
          setFormData((prev) => ({ ...prev, ...updates }))
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
      // Update candidate profile first with the form data if fullProfile is available
      if (fullProfile) {
        import("@/services/candidateService").then(async ({ updateMyProfile }) => {
          const newLinks = [...(fullProfile.links || [])]
          
          // Update or add linkedin
          if (formData.linkedin) {
            const lIdx = newLinks.findIndex(l => l.platform.toLowerCase() === "linkedin" || l.platform.toLowerCase().includes("linked"))
            if (lIdx >= 0) newLinks[lIdx].url = formData.linkedin
            else newLinks.push({ id: `link-${Date.now()}`, platform: "LinkedIn", url: formData.linkedin, status: "saved" })
          }
          
          // Update or add portfolio
          if (formData.portfolio) {
            const pIdx = newLinks.findIndex(l => l.platform.toLowerCase() === "portfolio" || l.platform.toLowerCase() === "github" || l.platform.toLowerCase() === "website" || l.platform.toLowerCase() === "other")
            if (pIdx >= 0) newLinks[pIdx].url = formData.portfolio
            else newLinks.push({ id: `link-${Date.now()+1}`, platform: "Portfolio", url: formData.portfolio, status: "saved" })
          }

          const updatedProfile = {
            ...fullProfile,
            name: formData.name,
            phone: formData.phone,
            links: newLinks
          }
          await updateMyProfile(updatedProfile)
        })
      }
      
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
