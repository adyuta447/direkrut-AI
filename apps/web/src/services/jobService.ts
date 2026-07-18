import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import type { Job } from "../lib/types";
import { mockJobs } from "../lib/mockData";
import { apiFetch, isApiConfigured } from "./apiClient";

/**
 * Layer data buat lowongan. listJobs/getJobById baca dari apps/api-go
 * beneran kalau NEXT_PUBLIC_API_BASE_URL diset (lihat mapApiJobToJob buat
 * adapter bentuk response Go -> tipe Job di FE, dua-duanya beda bentuk).
 * createJob TETAP di atas mock -- apps/web belum punya alur login yang
 * beneran ngobrol ke backend, jadi lowongan baru dari dashboard HRD masih
 * disimpan lokal aja buat sekarang.
 *
 * Setiap panggilan API di sini dibungkus try/catch yang fallback ke mock:
 * kalau backend lagi mati atau errornya apa pun, halaman tetap jalan
 * dengan data mock daripada nge-crash.
 */

interface ApiJob {
  id: string;
  companyId: string;
  companyName?: string;
  companyIndustry?: string;
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  employmentType: string;
  salaryMin?: number;
  salaryMax?: number;
  status: string;
  publishedAt?: string;
  createdAt: string;
}

interface ApiJobListResponse {
  items: ApiJob[];
  nextCursor?: string;
}

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  "full-time": "Penuh Waktu",
  "part-time": "Paruh Waktu",
  contract: "Kontrak",
  internship: "Magang",
};

const STATUS_FROM_API: Record<string, NonNullable<Job["status"]>> = {
  published: "active",
  draft: "draft",
  closed: "inactive",
};

function formatSalaryRange(min?: number, max?: number): string {
  const fmt = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `Mulai ${fmt(min)}`;
  if (max) return `Sampai ${fmt(max)}`;
  return "Nego";
}

/** Adapter: bentuk response apps/api-go (companyId, employmentType,
 * salaryMin/Max, dst) beda total sama tipe Job di FE (company, type,
 * salaryRange, dst) -- mapping eksplisit di sini, bukan cast diam-diam. */
function mapApiJobToJob(apiJob: ApiJob): Job {
  const requirementsList = (apiJob.requirements ?? "")
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);

  return {
    id: apiJob.id,
    title: apiJob.title,
    company: apiJob.companyName || "Perusahaan",
    location: apiJob.location || "-",
    type: EMPLOYMENT_TYPE_LABELS[apiJob.employmentType] ?? apiJob.employmentType,
    description: apiJob.description,
    department: apiJob.companyIndustry || "Umum",
    requirements: requirementsList,
    detailedQualifications: requirementsList,
    salaryRange: formatSalaryRange(apiJob.salaryMin, apiJob.salaryMax),
    industry: apiJob.companyIndustry || "Umum",
    questions: [],
    posted: formatDistanceToNow(new Date(apiJob.publishedAt ?? apiJob.createdAt), {
      addSuffix: true,
      locale: id,
    }),
    applicantCount: 0,
    status: STATUS_FROM_API[apiJob.status] ?? "active",
  };
}

export async function listJobs(): Promise<Job[]> {
  if (isApiConfigured) {
    try {
      const data = await apiFetch<ApiJobListResponse>("/v1/jobs?limit=50");
      return data.items.map(mapApiJobToJob);
    } catch (err) {
      console.error("[jobService] gagal ambil daftar lowongan dari API, fallback ke mock:", err);
    }
  }
  return mockJobs;
}

export async function getJobById(id: string): Promise<Job | null> {
  if (isApiConfigured) {
    try {
      const apiJob = await apiFetch<ApiJob>(`/v1/jobs/${id}`);
      return mapApiJobToJob(apiJob);
    } catch (err) {
      console.error("[jobService] gagal ambil detail lowongan dari API, fallback ke mock:", err);
    }
  }
  return mockJobs.find((job) => job.id === id) ?? null;
}

export async function createJob(job: Omit<Job, "id" | "applicantCount">): Promise<Job> {
  if (isApiConfigured) {
    try {
      return await apiFetch<Job>("/v1/jobs", {
        method: "POST",
        body: JSON.stringify(job),
      });
    } catch (err) {
      console.error("[jobService] gagal buat lowongan lewat API (belum ada alur login asli), fallback ke mock:", err);
    }
  }
  return { ...job, id: `job-${Date.now()}`, applicantCount: 0 };
}
