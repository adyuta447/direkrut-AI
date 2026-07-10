import type { Job } from "../types";
import { mockJobs } from "../mock";
import { apiFetch, isApiConfigured } from "./apiClient";

/**
 * Layer data buat lowongan. Sekarang masih baca dari mock, tapi bentuk
 * fungsinya udah async — jadi pas apps/api-go siap, tinggal isi cabang
 * isApiConfigured tanpa ubah kode yang manggil service ini.
 */

export async function listJobs(): Promise<Job[]> {
  if (isApiConfigured) {
    return apiFetch<Job[]>("/v1/jobs");
  }
  return mockJobs;
}

export async function getJobById(id: string): Promise<Job | null> {
  if (isApiConfigured) {
    return apiFetch<Job>(`/v1/jobs/${id}`);
  }
  return mockJobs.find((job) => job.id === id) ?? null;
}

export async function createJob(job: Omit<Job, "id" | "applicantCount">): Promise<Job> {
  if (isApiConfigured) {
    return apiFetch<Job>("/v1/jobs", {
      method: "POST",
      body: JSON.stringify(job),
    });
  }
  return { ...job, id: `job-${Date.now()}`, applicantCount: 0 };
}
