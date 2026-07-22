import type { Application, CandidateProfileSummary } from "../lib/types";
import { apiFetch, isApiConfigured } from "./apiClient";

interface ApiApplication {
  id: string;
  jobId: string;
  jobTitle?: string;
  companyName?: string;
  candidateId: string;
  candidateName?: string;
  status: string;
  appliedAt: string;
  updatedAt: string;
  recommendationScore?: number;
  candidateProfile?: CandidateProfileSummary;
}

interface ApiApplicationListResponse {
  items: ApiApplication[];
}

function mapApiApplicationToApplication(a: ApiApplication): Application {
  return {
    id: a.id,
    applicantId: a.candidateId,
    applicantName: a.candidateName || "Kandidat",
    jobId: a.jobId,
    jobTitle: a.jobTitle || "",
    validationStatus: "pending",
    status: (a.status as Application["status"]) || "submitted",
    appliedDate: a.appliedAt,
    recommendationScore: a.recommendationScore,
    candidateProfile: a.candidateProfile,
    email: a.candidateProfile?.email,
    phone: a.candidateProfile?.phone,
    category: a.candidateProfile ? ((a.candidateProfile.experience?.length ?? 0) > 0 ? "professional" : "fresh-graduate") : undefined,
  };
}

export async function listApplications(): Promise<Application[]> {
  if (isApiConfigured) {
    try {
      const data = await apiFetch<ApiApplicationListResponse>("/v1/applications");
      return data.items.map(mapApiApplicationToApplication);
    } catch (err) {
      console.error("[applicationService] gagal ambil daftar lamaran dari API:", err);
    }
  }
  return [];
}

export async function listApplicationsForJob(jobId: string): Promise<Application[]> {
  if (isApiConfigured) {
    try {
      const data = await apiFetch<ApiApplicationListResponse>(`/v1/applications?jobId=${jobId}`);
      return data.items.map(mapApiApplicationToApplication);
    } catch (err) {
      console.error("[applicationService] gagal ambil lamaran per lowongan dari API:", err);
    }
  }
  return [];
}

export async function getApplicationById(id: string): Promise<Application | null> {
  if (isApiConfigured) {
    try {
      const apiApp = await apiFetch<ApiApplication>(`/v1/applications/${id}`);
      return mapApiApplicationToApplication(apiApp);
    } catch (err) {
      console.error("[applicationService] gagal ambil detail lamaran dari API:", err);
    }
  }
  return null;
}

export interface SentDecision {
  id: string;
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  toStatus: string;
  note?: string;
  createdAt: string;
}

/** Riwayat keputusan HRD ke kandidat (undang wawancara/tolak/dst) -- data
 * asli dari status history, buat halaman Kotak Masuk HRD. */
export async function listSentDecisions(): Promise<SentDecision[]> {
  if (!isApiConfigured) return [];
  try {
    const data = await apiFetch<{ items: SentDecision[] }>("/v1/applications/sent-decisions");
    return data.items;
  } catch (err) {
    console.error("[applicationService] gagal ambil riwayat keputusan HRD:", err);
    return [];
  }
}

export async function submitApplication(jobId: string): Promise<Application | null> {
  if (isApiConfigured) {
    try {
      const apiApp = await apiFetch<ApiApplication>("/v1/applications", {
        method: "POST",
        body: JSON.stringify({ jobId }),
      });
      return mapApiApplicationToApplication(apiApp);
    } catch (err) {
      console.error("[applicationService] gagal submit lamaran lewat API, fallback ke mock lokal:", err);
    }
  }
  return null;
}

export async function updateApplicationStatus(
  id: string,
  status: Application["status"],
  note?: string,
  email?: { subject: string; body: string }
): Promise<Application | null> {
  if (isApiConfigured) {
    try {
      const apiApp = await apiFetch<ApiApplication>(`/v1/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
          note,
          ...(email ? { emailSubject: email.subject, emailBody: email.body } : {}),
        }),
      });
      return mapApiApplicationToApplication(apiApp);
    } catch (err) {
      console.error("[applicationService] gagal update status lamaran lewat API, fallback ke mock lokal:", err);
    }
  }
  return null;
}
