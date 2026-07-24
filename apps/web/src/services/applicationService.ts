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
  interviewScheduledAt?: string;
  recommendationScore?: number;
  interviewScore?: number;
  interviewStatus?: string;
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
    interviewScheduledAt: a.interviewScheduledAt,
    recommendationScore: a.recommendationScore,
    interviewScore: a.interviewScore,
    interviewStatus: a.interviewStatus,
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

// Lempar ApiError kalau gagal (mis. lowongan udah ditutup/dihapus, atau udah
// pernah dilamar) -- sebelumnya di-catch-and-fallback ke objek mock lokal,
// jadi kandidat kelihatan "berhasil melamar" (lompat ke layar sukses) padahal
// di server GAGAL, termasuk buat lowongan yang udah dinonaktifin/dihapus HRD.
export async function submitApplication(jobId: string): Promise<Application | null> {
  if (!isApiConfigured) return null;
  const apiApp = await apiFetch<ApiApplication>("/v1/applications", {
    method: "POST",
    body: JSON.stringify({ jobId }),
  });
  return mapApiApplicationToApplication(apiApp);
}

// Lempar ApiError kalau gagal (mis. lamaran udah ditolak & dikunci backend)
// -- pemanggilnya (DecisionDialog) butuh tau itu buat nampilin pesan yang
// benar, bukan optimis nunjukin "terkirim" padahal ditolak backend.
export async function updateApplicationStatus(
  id: string,
  status: Application["status"],
  note?: string,
  email?: { subject: string; body: string },
  interviewScheduledAt?: string
): Promise<Application | null> {
  if (!isApiConfigured) return null;
  const apiApp = await apiFetch<ApiApplication>(`/v1/applications/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
      note,
      ...(email ? { emailSubject: email.subject, emailBody: email.body } : {}),
      ...(interviewScheduledAt ? { interviewScheduledAt } : {}),
    }),
  });
  return mapApiApplicationToApplication(apiApp);
}

// Cuma boleh buat lamaran yang udah final (ditolak / lolos wawancara) --
// backend nolak (409) kalau statusnya masih berjalan, lihat handleDeleteApplication.
export async function deleteApplication(id: string): Promise<void> {
  if (!isApiConfigured) return;
  await apiFetch<void>(`/v1/applications/${id}`, { method: "DELETE" });
}
