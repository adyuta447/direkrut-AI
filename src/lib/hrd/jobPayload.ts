import { Job } from "../../types";
import { JobFormState } from "./useJobManagement";

// REVISI 6: Pisahkan kualifikasi (admin) dan keahlian (teknis) saat menyusun payload lowongan.
export function buildJobPayload(form: JobFormState, editingId: string | null, existingJob: Job | undefined): Job {
  const requirements = form.requirementsText.split(",").map((r) => r.trim()).filter(Boolean);
  const qualifications = form.qualificationsText.split(",").map((q) => q.trim()).filter(Boolean);

  return {
    id: editingId ?? Date.now().toString(),
    title: form.title.trim(),
    department: form.department.trim(),
    description: form.description.trim(),
    requirements: requirements.length ? requirements : ["Keahlian umum"],
    detailedQualifications: qualifications.length ? qualifications : [],
    location: form.location.trim() || "Jakarta",
    type: form.type.trim() || "Purna Waktu",
    company: form.company.trim() || "Direkrut AI",
    posted: editingId && existingJob ? existingJob.posted : "Hari ini",
    // Kolom berikut belum dikumpulkan oleh form HRD ini — pertahankan nilai lama saat
    // edit, pakai default netral saat membuat lowongan baru.
    salaryRange: editingId && existingJob ? existingJob.salaryRange : "Kompetitif (sesuai negosiasi)",
    industry: editingId && existingJob ? existingJob.industry : form.department.trim() || "Umum",
    questions: editingId && existingJob ? existingJob.questions : [],
    applicantCount: editingId && existingJob ? existingJob.applicantCount : 0,
  };
}
