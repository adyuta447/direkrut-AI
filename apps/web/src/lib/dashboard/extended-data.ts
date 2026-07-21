import type { CandidateProfileSummary } from "@/lib/types";

/** Bentuk minimum yang dibutuhin adapter -- Application maupun Candidate
 * (tipe baris tabel) dua-duanya memenuhi ini. */
interface HasCandidateProfile {
  appliedDate: string;
  candidateProfile?: CandidateProfileSummary;
}

/**
 * Adapter profil kandidat buat dashboard HRD -- SEMUA nilai diturunkan dari
 * data profil asli yang diisi kandidat (Application.candidateProfile, dikirim
 * backend), bukan lagi data sintetis dari hash nama. Field yang kandidatnya
 * belum isi ditampilin "—" apa adanya -- lebih jujur kosong daripada karangan.
 */
export interface ExtendedCandidateData {
  domicile: string;
  experience: string;
  lastPosition: string;
  education: string;
  gender: string;
  category: "fresh-graduate" | "professional";
  isJobHopper: boolean;
  waitingDays: number;
}

const EMPTY = "—";

/** Selisih hari sejak tanggal melamar -- dipakai stat card "nunggu > 7 hari". */
export function daysSinceApplied(appliedDate: string): number {
  const applied = new Date(appliedDate).getTime();
  if (isNaN(applied)) return 0;
  return Math.max(0, Math.floor((Date.now() - applied) / 86_400_000));
}

export function getExtendedData(app: HasCandidateProfile): ExtendedCandidateData {
  const p = app.candidateProfile;
  const experiences = p?.experience ?? [];
  const educations = p?.education ?? [];
  const latestExp = experiences[0];
  const latestEdu = educations[0];

  const experience =
    experiences.length === 0
      ? "Fresh Graduate"
      : `${experiences.length} pengalaman kerja`;

  const lastPosition = latestExp?.role
    ? latestExp.company
      ? `${latestExp.role} · ${latestExp.company}`
      : latestExp.role
    : (p?.headline ?? EMPTY);

  const education = latestEdu
    ? [latestEdu.degree, latestEdu.school, [latestEdu.startYear, latestEdu.endYear].filter(Boolean).join(" - ")]
        .filter(Boolean)
        .join("\n")
    : EMPTY;

  return {
    domicile: p?.location || EMPTY,
    experience,
    lastPosition: lastPosition || EMPTY,
    education,
    gender: p?.gender || EMPTY,
    category: experiences.length > 0 ? "professional" : "fresh-graduate",
    // Sinyal sederhana dari data asli: banyak entri kerja = sering pindah.
    isJobHopper: experiences.length >= 4,
    waitingDays: daysSinceApplied(app.appliedDate),
  };
}
