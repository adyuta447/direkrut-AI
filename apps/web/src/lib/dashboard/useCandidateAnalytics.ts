import type { Application } from "@/lib/types";

export interface AnalyticsDatum {
  name: string;
  value?: number;
  count?: number;
  color?: string;
  fill?: string;
}

/** Ngolah daftar lamaran satu lowongan jadi tiga breakdown chart (status,
 * skor rekomendasi AI, tingkat pengalaman) -- murni derived data, gak ada
 * JSX di sini. */
export function useCandidateAnalytics(jobApplications: Application[]) {
  const statusCounts = { interview: 0, interview_completed: 0, accepted: 0, "under-review": 0, rejected: 0 };
  jobApplications.forEach((app) => {
    if (statusCounts[app.status as keyof typeof statusCounts] !== undefined) {
      statusCounts[app.status as keyof typeof statusCounts]++;
    }
  });
  const statusData: AnalyticsDatum[] = [
    { name: "Wawancara", value: statusCounts.interview, color: "var(--info)" },
    { name: "Wawancara Selesai", value: statusCounts.interview_completed, color: "var(--status-pending)" },
    { name: "Diterima", value: statusCounts.accepted, color: "var(--success)" },
    { name: "Administrasi", value: statusCounts["under-review"], color: "var(--warning)" },
    { name: "Ditolak", value: statusCounts.rejected, color: "var(--destructive)" },
  ].filter((d) => (d.value ?? 0) > 0);

  const scoreCounts = { "Sangat Disarankan": 0, Disarankan: 0, Kurang: 0 };
  jobApplications.forEach((app) => {
    const score = app.recommendationScore || 0;
    if (score >= 75) scoreCounts["Sangat Disarankan"]++;
    else if (score >= 55) scoreCounts["Disarankan"]++;
    else scoreCounts["Kurang"]++;
  });
  const scoreData: AnalyticsDatum[] = [
    { name: "Sangat Disarankan", count: scoreCounts["Sangat Disarankan"], fill: "var(--success)" },
    { name: "Disarankan", count: scoreCounts["Disarankan"], fill: "var(--warning)" },
    { name: "Kurang", count: scoreCounts["Kurang"], fill: "var(--destructive)" },
  ].filter((d) => (d.count ?? 0) > 0);

  // Breakdown pengalaman dari jumlah entri kerja ASLI di profil kandidat
  // (bukan lagi angka sintetis dari hash nama).
  const expCounts = { "Fresh Graduate": 0, "1-2 Pengalaman": 0, "3+ Pengalaman": 0 };
  jobApplications.forEach((app) => {
    const n = app.candidateProfile?.experience?.length ?? 0;
    if (n === 0) expCounts["Fresh Graduate"]++;
    else if (n <= 2) expCounts["1-2 Pengalaman"]++;
    else expCounts["3+ Pengalaman"]++;
  });
  const expData: AnalyticsDatum[] = [
    { name: "Fresh Graduate", count: expCounts["Fresh Graduate"], fill: "var(--chart-1)" },
    { name: "1-2 Pengalaman", count: expCounts["1-2 Pengalaman"], fill: "var(--chart-3)" },
    { name: "3+ Pengalaman", count: expCounts["3+ Pengalaman"], fill: "var(--chart-5)" },
  ].filter((d) => (d.count ?? 0) > 0);

  return { statusData, scoreData, expData };
}
