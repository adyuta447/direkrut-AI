import type { CandidateProfileSummary } from "@/lib/types"

export interface Candidate {
  id: string
  applicantName: string
  jobTitle: string
  resumeLink?: string
  recommendationScore?: number
  interviewScore?: number
  interviewStatus?: string
  status: string
  appliedDate: string
  jobId: string
  candidateProfile?: CandidateProfileSummary
  email?: string
  phone?: string
  category?: string
  aiCategory?: string // Kategori hasil screening AI ("Sangat Sesuai", "Sesuai", dll)
}
