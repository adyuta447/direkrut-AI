import { useState } from "react";

const PROGRESS_FIELDS: { key: string; label: string }[] = [
  { key: "title", label: "Judul Pekerjaan" },
  { key: "location", label: "Lokasi" },
  { key: "description", label: "Deskripsi Pekerjaan" },
  { key: "requirements", label: "Kualifikasi Utama" },
];

/** Ngitung berapa persen field wajib form buat-lowongan udah keisi, dibaca
 * langsung dari FormData tiap kali user ngetik (form uncontrolled). */
export function useJobFormProgress() {
  const [filledFields, setFilledFields] = useState<Set<string>>(new Set());

  const handleFormInput = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const next = new Set<string>();
    for (const { key } of PROGRESS_FIELDS) {
      if (((formData.get(key) as string) || "").trim()) next.add(key);
    }
    setFilledFields(next);
  };

  const progress = Math.round((filledFields.size / PROGRESS_FIELDS.length) * 100);

  return { fields: PROGRESS_FIELDS, filledFields, progress, handleFormInput };
}
