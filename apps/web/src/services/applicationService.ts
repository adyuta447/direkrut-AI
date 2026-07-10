import type { Application } from "../types";
import { mockApplications } from "../mock";
import { apiFetch, isApiConfigured } from "./apiClient";

/**
 * Layer data buat lamaran kandidat. Endpoint validasi & skor kecocokan
 * (recommendationScore, authenticityScore) nantinya dihitung di
 * apps/ai-engine, dikembalikan lewat apps/api-go, lalu dibaca di sini.
 */

export async function listApplications(): Promise<Application[]> {
  if (isApiConfigured) {
    return apiFetch<Application[]>("/v1/applications");
  }
  return mockApplications;
}

export async function getApplicationById(id: string): Promise<Application | null> {
  if (isApiConfigured) {
    return apiFetch<Application>(`/v1/applications/${id}`);
  }
  return mockApplications.find((app) => app.id === id) ?? null;
}

export async function submitApplication(
  application: Omit<Application, "id" | "appliedDate" | "status" | "validationStatus">
): Promise<Application> {
  if (isApiConfigured) {
    return apiFetch<Application>("/v1/applications", {
      method: "POST",
      body: JSON.stringify(application),
    });
  }
  return {
    ...application,
    id: `app-${Date.now()}`,
    appliedDate: new Date().toISOString(),
    status: "submitted",
    validationStatus: "pending",
  };
}
