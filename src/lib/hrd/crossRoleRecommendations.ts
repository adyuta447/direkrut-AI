import { Application, Job } from "../../types";

export interface CrossRoleItem {
  id: string;
  candidateName: string;
  originalRole: string;
  suggestedRole: string;
  label: string;
  labelClass: string;
  reason: string;
  evidence: string;
}

// Generate a deterministic list of candidates with cross-role potential
export function computeCrossRoleList(applications: Application[], jobs: Job[]): CrossRoleItem[] {
  return applications
    .map((app, index) => {
      // Skip every third to simulate not all candidates having cross-role potential
      if (index % 3 === 0) return null;

      const alternateJob = jobs[(index + 1) % jobs.length];

      const isHighlyRelevant = index % 2 === 0;
      const label = isHighlyRelevant ? "Sangat Relevan" : "Potensi Adaptasi Cepat";
      const labelClass = isHighlyRelevant
        ? "text-[#198038] bg-[#defbe6] border-[#198038]"
        : "text-[#f1c21b] bg-[#fcf0d3] border-[#f1c21b]";

      const reason = isHighlyRelevant
        ? `Keterampilan inti (transferable skills) selaras dengan kebutuhan ${alternateJob.title}.`
        : `Fondasi kuat yang dapat disesuaikan untuk ${alternateJob.title} dengan masa onboarding minimal.`;

      const evidence = isHighlyRelevant
        ? `Kutipan CV (Hal 1): "Memimpin kolaborasi lintas divisi yang mengharuskan penggunaan prinsip kerja dari ${alternateJob.title} untuk mencapai target perusahaan."`
        : `Log Wawancara (08:21): "Meskipun posisi ini di luar keahlian utama saya, saya telah mengikuti sertifikasi dasar terkait metrik dan operasional departemen tersebut secara otodidak."`;

      return {
        id: app.id,
        candidateName: app.applicantName,
        originalRole: app.jobTitle,
        suggestedRole: alternateJob.title,
        label,
        labelClass,
        reason,
        evidence,
      };
    })
    .filter((item): item is CrossRoleItem => item !== null);
}
