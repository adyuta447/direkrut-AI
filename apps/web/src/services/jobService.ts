import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import type { Job } from "../lib/types";
import { apiFetch, isApiConfigured } from "./apiClient";


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
  // Field terstruktur baru
  requiredSkills?: string[];
  preferredSkills?: string[];
  keyResponsibilities?: string;
  minExperienceYears?: number;
  educationRequirement?: string;
  candidateType?: string;
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

// ponytail: tipe pekerjaan custom (form "Lainnya...") gak punya padanan di
// enum employmentType backend -- default ke full-time. Upgrade: backend
// terima free-text employmentType kalau tipe custom jadi kebutuhan nyata.
const LABEL_TO_EMPLOYMENT_TYPE: Record<string, string> = {
  "Penuh Waktu": "full-time",
  "Paruh Waktu": "part-time",
  Kontrak: "contract",
  Magang: "internship",
};

const STATUS_FROM_API: Record<string, NonNullable<Job["status"]>> = {
  published: "active",
  draft: "draft",
  closed: "inactive",
};

// "review" gak ada padanan di backend (cuma draft/published/closed) --
// diperlakukan sebagai draft, paling deket secara makna (belum tayang).
const STATUS_TO_API: Record<NonNullable<Job["status"]>, string> = {
  active: "published",
  draft: "draft",
  inactive: "closed",
  review: "draft",
};

function formatSalaryRange(min?: number, max?: number): string {
  const fmt = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `Mulai ${fmt(min)}`;
  if (max) return `Sampai ${fmt(max)}`;
  return "Nego";
}

// ponytail: parsing best-effort dari string bebas ("Rp 5.000.000 - Rp
// 10.000.000") ke dua angka -- bukan currency parser beneran. Kalau gagal
// (mis. "Nego"), salaryMin/Max dikirim undefined (opsional di backend).
// Upgrade: ganti form salaryRange jadi dua input number salaryMin/salaryMax.
function parseSalaryRange(range: string): { salaryMin?: number; salaryMax?: number } {
  const numbers = range.match(/[\d.,]+/g)?.map((n) => parseInt(n.replace(/[.,]/g, ""), 10)).filter((n) => !isNaN(n) && n > 0);
  if (!numbers || numbers.length === 0) return {};
  if (numbers.length === 1) return { salaryMin: numbers[0] };
  return { salaryMin: numbers[0], salaryMax: numbers[1] };
}

interface JobWriteRequestBody {
  title: string;
  description: string;
  requirements: string;
  location: string;
  employmentType: string;
  salaryMin?: number;
  salaryMax?: number;
  status: string;
  // Field terstruktur
  requiredSkills?: string[];
  preferredSkills?: string[];
  keyResponsibilities?: string;
  minExperienceYears?: number;
  educationRequirement?: string;
  candidateType?: string;
}

function buildJobWriteRequest(job: Omit<Job, "id" | "applicantCount">): JobWriteRequestBody {
  return {
    title: job.title,
    description: job.description,
    requirements: job.requirements.join("\n"),
    location: job.location,
    employmentType: LABEL_TO_EMPLOYMENT_TYPE[job.type] ?? "full-time",
    ...parseSalaryRange(job.salaryRange),
    status: STATUS_TO_API[job.status ?? "draft"],
    // Pass the structured fields back to API
    requiredSkills: job.requiredSkills ?? [],
    preferredSkills: job.preferredSkills ?? [],
    keyResponsibilities: job.keyResponsibilities ?? "",
    minExperienceYears: job.minExperienceYears ?? 0,
    educationRequirement: job.educationRequirement ?? "",
    candidateType: job.candidateType ?? "any",
  };
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
    // Map the new fields
    requiredSkills: apiJob.requiredSkills ?? [],
    preferredSkills: apiJob.preferredSkills ?? [],
    keyResponsibilities: apiJob.keyResponsibilities ?? "",
    minExperienceYears: apiJob.minExperienceYears ?? 0,
    educationRequirement: apiJob.educationRequirement ?? "",
    candidateType: (apiJob.candidateType as Job["candidateType"]) ?? "any",
  };
}

export async function listJobs(): Promise<Job[]> {
  if (isApiConfigured) {
    try {
      const data = await apiFetch<ApiJobListResponse>("/v1/jobs?limit=50");
      return data.items.map(mapApiJobToJob);
    } catch (err) {
      console.error("[jobService] gagal ambil daftar lowongan dari API:", err);
    }
  }
  return [];
}

export async function getJobById(id: string): Promise<Job | null> {
  if (isApiConfigured) {
    try {
      const apiJob = await apiFetch<ApiJob>(`/v1/jobs/${id}`);
      return mapApiJobToJob(apiJob);
    } catch (err) {
      console.error("[jobService] gagal ambil detail lowongan dari API:", err);
    }
  }
  return null;
}

export async function createJob(job: Omit<Job, "id" | "applicantCount">): Promise<Job> {
  if (isApiConfigured) {
    try {
      const apiJob = await apiFetch<ApiJob>("/v1/jobs", {
        method: "POST",
        body: JSON.stringify(buildJobWriteRequest(job)),
      });
      return mapApiJobToJob(apiJob);
    } catch (err) {
      console.error("[jobService] gagal buat lowongan lewat API, fallback ke mock:", err);
    }
  }
  return { ...job, id: `job-${Date.now()}`, applicantCount: 0 };
}

export async function updateJob(id: string, job: Omit<Job, "id" | "applicantCount">): Promise<Job> {
  if (isApiConfigured) {
    try {
      const apiJob = await apiFetch<ApiJob>(`/v1/jobs/${id}`, {
        method: "PUT",
        body: JSON.stringify(buildJobWriteRequest(job)),
      });
      return mapApiJobToJob(apiJob);
    } catch (err) {
      console.error("[jobService] gagal update lowongan lewat API, fallback ke mock:", err);
    }
  }
  return { ...job, id, applicantCount: 0 };
}

export async function deleteJob(id: string): Promise<void> {
  if (isApiConfigured) {
    try {
      await apiFetch<void>(`/v1/jobs/${id}`, { method: "DELETE" });
      return;
    } catch (err) {
      console.error("[jobService] gagal hapus lowongan lewat API, cuma dihapus di state lokal:", err);
    }
  }
}

// --- API Scoring Weights ---
import { ScoringWeightConfig } from "../lib/types";

export async function getCompanyScoringWeights(): Promise<ScoringWeightConfig> {
  return apiFetch<ScoringWeightConfig>("/v1/companies/me/scoring-weights");
}

export async function updateCompanyScoringWeights(weights: Omit<ScoringWeightConfig, "isCustom" | "defaultProfessional" | "defaultFreshGraduate">): Promise<void> {
  return apiFetch<void>("/v1/companies/me/scoring-weights", {
    method: "PUT",
    body: JSON.stringify(weights),
  });
}

export async function getJobScoringWeights(jobId: string): Promise<ScoringWeightConfig> {
  return apiFetch<ScoringWeightConfig>(`/v1/jobs/${jobId}/scoring-weights`);
}

export async function updateJobScoringWeights(jobId: string, weights: Omit<ScoringWeightConfig, "isCustom" | "defaultProfessional" | "defaultFreshGraduate">): Promise<void> {
  return apiFetch<void>(`/v1/jobs/${jobId}/scoring-weights`, {
    method: "PUT",
    body: JSON.stringify(weights),
  });
}
