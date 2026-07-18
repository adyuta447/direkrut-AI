import { apiFetch, isApiConfigured } from "./apiClient";

export interface ProfileExperience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  status?: "draft" | "saved";
}

export interface ProfileEducation {
  id: string;
  school: string;
  degree: string;
  startYear: string;
  endYear: string;
  status?: "draft" | "saved";
}

export interface ProfileLink {
  id: string;
  platform: string;
  url: string;
  status?: "draft" | "saved";
}

export interface CandidateProfile {
  name: string;
  phone: string;
  location: string;
  age: string;
  gender: string;
  about: string;
  photoUrl?: string;
  coverUrl?: string;
  experience: ProfileExperience[];
  education: ProfileEducation[];
  links: ProfileLink[];
  skills: string[];
}

interface ApiProfile {
  name: string;
  phone?: string;
  location?: string;
  age?: number;
  gender?: string;
  about?: string;
  photoUrl?: string;
  coverUrl?: string;
  experience: Omit<ProfileExperience, "status">[];
  education: Omit<ProfileEducation, "status">[];
  links: Omit<ProfileLink, "status">[];
  skills: string[];
}

function mapApiToProfile(api: ApiProfile): CandidateProfile {
  return {
    name: api.name,
    phone: api.phone ?? "",
    location: api.location ?? "",
    age: api.age != null ? String(api.age) : "",
    gender: api.gender ?? "",
    about: api.about ?? "",
    photoUrl: api.photoUrl || undefined,
    coverUrl: api.coverUrl || undefined,
    experience: api.experience.map((e) => ({ ...e, status: "saved" as const })),
    education: api.education.map((e) => ({ ...e, status: "saved" as const })),
    links: api.links.map((l) => ({ ...l, status: "saved" as const })),
    skills: api.skills,
  };
}

function buildApiPayload(profile: CandidateProfile) {
  return {
    name: profile.name,
    phone: profile.phone,
    location: profile.location,
    age: profile.age.trim() ? parseInt(profile.age, 10) : null,
    gender: profile.gender,
    about: profile.about,
    photoUrl: profile.photoUrl ?? "",
    coverUrl: profile.coverUrl ?? "",
    experience: profile.experience.map(({ id, role, company, startDate, endDate, description }) => ({
      id, role, company, startDate, endDate, description,
    })),
    education: profile.education.map(({ id, school, degree, startYear, endYear }) => ({
      id, school, degree, startYear, endYear,
    })),
    links: profile.links.map(({ id, platform, url }) => ({ id, platform, url })),
    skills: profile.skills,
  };
}

export async function getMyProfile(): Promise<CandidateProfile | null> {
  if (!isApiConfigured) return null;
  try {
    const api = await apiFetch<ApiProfile>("/v1/candidates/me");
    return mapApiToProfile(api);
  } catch (err) {
    console.error("[candidateService] gagal ambil profil dari API:", err);
    return null;
  }
}

export async function updateMyProfile(profile: CandidateProfile): Promise<CandidateProfile | null> {
  if (!isApiConfigured) return null;
  try {
    const api = await apiFetch<ApiProfile>("/v1/candidates/me", {
      method: "PUT",
      body: JSON.stringify(buildApiPayload(profile)),
    });
    return mapApiToProfile(api);
  } catch (err) {
    console.error("[candidateService] gagal simpan profil ke API:", err);
    return null;
  }
}
