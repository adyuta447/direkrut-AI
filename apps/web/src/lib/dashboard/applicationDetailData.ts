import { getExtendedData } from "@/lib/dashboard/extended-data";
import type { Application, Job } from "@/lib/types";

/** Semua data turunan buat halaman detail lamaran kandidat: funnel lamaran
 * posisi ini, distribusi posisi lain di perusahaan yang sama, dan
 * langkah-langkah timeline berdasarkan status lamaran. Murni kalkulasi, gak
 * ada JSX. Transkrip wawancara AI diambil terpisah lewat aiService.getInterviewResult
 * (butuh fetch async, gak cocok di helper sinkron ini). */
export function getApplicationDetailData(application: Application, job: Job, applications: Application[], jobs: Job[]) {
  const ext = getExtendedData(application);
  const isFreshGrad = ext.category === "fresh-graduate";
  const jobApplications = applications.filter((a) => a.jobId === application.jobId);
  const companyJobs = jobs.filter((j) => j.company === job.company);
  const jobRejected = jobApplications.filter((a) => a.status === "rejected").length;
  const jobInterviewed = jobApplications.filter((a) => a.status === "interview").length;

  const applicationFlowData = [
    { name: "Terkirim", value: jobApplications.length, fill: "var(--chart-1)" },
    { name: "Administrasi", value: jobApplications.filter((a) => a.status === "under-review").length, fill: "var(--warning)" },
    { name: "Wawancara", value: jobInterviewed, fill: "var(--info)" },
    { name: "Ditolak", value: jobRejected, fill: "var(--destructive)" },
  ];

  const positionDistribution = companyJobs.slice(0, 6).map((j) => ({
    name: j.title.length > 20 ? j.title.substring(0, 18) + "…" : j.title,
    value: applications.filter((a) => a.jobId === j.id).length,
  }));

  const timelineSteps = [
    { label: "Lamaran Dikirim", date: application.appliedDate, done: true, active: false, description: `Lamaranmu buat posisi ${job.title} udah masuk sistem.` },
    { label: "Wawancara AI", date: application.status !== "submitted" ? "Selesai" : "Menunggu", done: application.status !== "submitted", active: false, description: "Sesi tanya-jawab bareng AI Direkrut." },
    { label: "Administrasi HRD", date: application.status === "under-review" ? "Sedang berlangsung" : application.status === "interview" || application.status === "rejected" ? "Selesai" : "Menunggu", done: application.status === "interview" || application.status === "rejected", active: application.status === "under-review", description: "Tim HRD lagi ngecek hasil wawancara kamu." },
    { label: application.status === "rejected" ? "Lamaran Ditolak" : "Keputusan Final", date: application.status === "rejected" ? "Selesai" : "Menunggu", done: application.status === "rejected", active: application.status === "interview", description: application.status === "rejected" ? "Makasih udah melamar. Tetap semangat, ya!" : "Nunggu keputusan akhir dari tim HRD." },
  ];

  return { ext, isFreshGrad, jobApplications, companyJobs, applicationFlowData, positionDistribution, timelineSteps };
}
