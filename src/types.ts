export type UserRole = "applicant" | "hrd";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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
  posted: string;
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
  authenticityScore?: {
    authentic: number;
    generic: number;
    aiGenerated: number;
  };
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
