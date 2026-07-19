import { apiFetch, isApiConfigured } from "./apiClient";

export type CompanyDocType = "aktaPendirian" | "nib" | "npwp" | "suratKuasa";

interface UploadURLResponse {
  uploadUrl: string;
  objectKey: string;
}

/**
 * Upload satu dokumen legalitas perusahaan (Akta Pendirian, NIB, NPWP, atau
 * Surat Kuasa) langsung ke object storage lewat presigned URL -- api-go
 * gak pernah nampung file bytes-nya sendiri, sama kayak upload CV kandidat.
 * Balikin object key kalau sukses, null kalau gagal (best-effort, dipanggil
 * setelah registrasi HRD berhasil).
 */
export async function uploadCompanyDocument(docType: CompanyDocType, file: File): Promise<string | null> {
  if (!isApiConfigured) return null;
  try {
    const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
    const { uploadUrl, objectKey } = await apiFetch<UploadURLResponse>(
      "/v1/companies/me/documents/upload-url",
      { method: "POST", body: JSON.stringify({ docType, ext }) },
    );

    const res = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type || "application/octet-stream" },
    });
    if (!res.ok) {
      console.error(`[companyService] upload ${docType} gagal, status ${res.status}:`, await res.text().catch(() => ""));
      return null;
    }
    return objectKey;
  } catch (err) {
    console.error(`[companyService] gagal upload dokumen ${docType}:`, err);
    return null;
  }
}

export async function saveCompanyDocumentKeys(keys: {
  aktaPendirianKey?: string;
  nibKey?: string;
  npwpKey?: string;
  suratKuasaKey?: string;
}): Promise<boolean> {
  if (!isApiConfigured) return false;
  try {
    await apiFetch("/v1/companies/me/documents", {
      method: "PATCH",
      body: JSON.stringify(keys),
    });
    return true;
  } catch (err) {
    console.error("[companyService] gagal simpan dokumen perusahaan:", err);
    return false;
  }
}
