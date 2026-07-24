import { getExtendedData } from "@/lib/dashboard/extended-data";
import type { Application, Job } from "@/lib/types";

/** Semua data turunan buat halaman detail lamaran kandidat: jumlah pelamar
 * lowongan ini (buat kartu "Total Kandidat"), lowongan lain di perusahaan
 * yang sama, dan langkah-langkah timeline berdasarkan status lamaran. Murni
 * kalkulasi, gak ada JSX. Transkrip wawancara AI diambil terpisah lewat
 * aiService.getInterviewResult (butuh fetch async, gak cocok di helper
 * sinkron ini). */
export function getApplicationDetailData(application: Application, job: Job, applications: Application[], jobs: Job[]) {
  const ext = getExtendedData(application);
  const isFreshGrad = ext.category === "fresh-graduate";
  const jobApplications = applications.filter((a) => a.jobId === application.jobId);
  const companyJobs = jobs.filter((j) => j.company === job.company);

  // Ditolak bisa kejadian dari tahap manapun -- jadi "Administrasi"/"Wawancara
  // Teknis" dianggap "selesai" begitu status udah lewat tahap itu ATAU
  // berakhir ditolak, biar timeline-nya gak nyangkut di tengah pas ditolak.
  const isRejected = application.status === "rejected";
  const isAccepted = application.status === "accepted";
  const passedAdmin = ["interview", "interview_completed", "accepted", "rejected"].includes(application.status);
  const passedInterview = ["interview_completed", "accepted", "rejected"].includes(application.status);
  const decided = isAccepted || isRejected;
  const scheduledLabel = application.interviewScheduledAt
    ? new Date(application.interviewScheduledAt).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })
    : undefined;

  const timelineSteps = [
    { label: "Lamaran Dikirim", date: application.appliedDate, done: true, active: false, description: `Lamaranmu buat posisi ${job.title} udah masuk sistem.` },
    { label: "Wawancara AI", date: application.status !== "submitted" ? "Selesai" : "Menunggu", done: application.status !== "submitted", active: false, description: "Sesi tanya-jawab bareng AI Direkrut." },
    {
      label: "Administrasi HRD",
      date: passedAdmin ? "Selesai" : application.status === "under-review" ? "Sedang berlangsung" : "Menunggu",
      done: passedAdmin,
      active: application.status === "under-review",
      description: "Tim HRD lagi ngecek hasil wawancara kamu.",
    },
    {
      label: "Wawancara Teknis",
      date: passedInterview ? "Selesai" : scheduledLabel ?? (application.status === "interview" ? "Terjadwal, tunggu detailnya" : "Menunggu"),
      done: passedInterview,
      active: application.status === "interview",
      description: scheduledLabel
        ? `Jadwal wawancara teknismu: ${scheduledLabel}.`
        : "Sesi wawancara sama tim HRD/teknis.",
    },
    {
      label: isRejected ? "Lamaran Ditolak" : isAccepted ? "Kamu Diterima!" : "Keputusan Final",
      date: decided ? "Selesai" : "Menunggu",
      done: decided,
      active: application.status === "interview_completed",
      description: isRejected
        ? "Makasih udah melamar. Tetap semangat, ya!"
        : isAccepted
          ? "Selamat! Tim HRD bakal hubungin kamu buat langkah selanjutnya."
          : "Nunggu keputusan akhir dari tim HRD.",
    },
  ];

  return { ext, isFreshGrad, jobApplications, companyJobs, timelineSteps };
}
