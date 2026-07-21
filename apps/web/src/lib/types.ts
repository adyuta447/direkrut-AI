export type UserRole = "candidate" | "hrd";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  department: string;
  requirements: string[];
  detailedQualifications: string[];
  salaryRange: string;
  industry: string;
  questions: string[];
  posted: string;
  applicantCount: number;
  status?: "active" | "inactive" | "review" | "draft";
  timeline?: { from: string; to: string };
}

/** Potongan profil asli kandidat (diisi kandidat di halaman profilnya),
 * dikirim backend di listing/detail lamaran buat dashboard HRD. */
export interface CandidateProfileSummary {
  location?: string;
  gender?: string;
  age?: number;
  headline?: string;
  phone?: string;
  email?: string;
  experience?: { role?: string; company?: string; startDate?: string; endDate?: string }[];
  education?: { school?: string; degree?: string; startYear?: string; endYear?: string }[];
}

export interface Application {
  id: string;
  applicantId: string;
  applicantName: string;
  jobId: string;
  jobTitle: string;
  cvFile?: File | null;
  resumeLink?: string;
  cvSummary?: string;
  validationStatus: "pending" | "in-progress" | "completed";
  validationResponses?: ValidationResponse[];
  recommendationScore?: number;
  status: "submitted" | "under-review" | "interview" | "rejected";
  appliedDate: string;
  cvViewed?: boolean;
  authenticityScore?: {
    authentic: number;
    generic: number;
    aiGenerated: number;
  };
  email?: string;
  phone?: string;
  category?: "fresh-graduate" | "professional";
  candidateProfile?: CandidateProfileSummary;
}

export interface ValidationResponse {
  question: string;
  answer: string;
}

export interface CandidateDetail extends Application {
  email: string;
  phone?: string;
  crossRoleRecommendations?: string[];
  gapAnalysis?: string;
  growthProjection?: string;
}
