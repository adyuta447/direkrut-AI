import { JobFormState } from "./useJobManagement";

export function validateJobForm(form: JobFormState): Partial<Record<keyof JobFormState, string>> {
  const errors: Partial<Record<keyof JobFormState, string>> = {};
  if (!form.title.trim()) errors.title = "Judul lowongan wajib diisi.";
  if (!form.department.trim()) errors.department = "Departemen wajib diisi.";
  if (!form.description.trim()) errors.description = "Deskripsi pekerjaan wajib diisi.";
  if (!form.qualificationsText.trim()) errors.qualificationsText = "Kualifikasi (administratif) wajib diisi.";
  if (!form.requirementsText.trim()) errors.requirementsText = "Keahlian yang dibutuhkan wajib diisi.";
  return errors;
}
