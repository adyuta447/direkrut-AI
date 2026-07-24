import type { Application, Job } from "@/lib/types";

export function getApplicationFlowData(jobApplications: Application[]) {
  return [
    { name: "Terkirim", value: jobApplications.length, fill: "var(--chart-1)" },
    {
      name: "Administrasi",
      value: jobApplications.filter((a) => a.status === "under-review").length,
      fill: "var(--warning)",
    },
    {
      name: "Wawancara",
      value: jobApplications.filter((a) => a.status === "interview").length,
      fill: "var(--info)",
    },
    {
      name: "Ditolak",
      value: jobApplications.filter((a) => a.status === "rejected").length,
      fill: "var(--destructive)",
    },
  ];
}

export function getPositionDistribution(companyJobs: Job[]) {
  return companyJobs.slice(0, 6).map((j) => ({
    name: j.title.length > 20 ? j.title.substring(0, 18) + "…" : j.title,
    value: j.applicantCount,
  }));
}
