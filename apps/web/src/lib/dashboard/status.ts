export type ApplicationStatus =
  | "submitted"
  | "under-review"
  | "interview"
  | "rejected";

export interface StatusMeta {
  label: string;
  /** Varian Badge shadcn */
  variant: "default" | "secondary" | "outline" | "destructive";
  /** Warna icon/mark; token dari globals.css */
  color: string;
}

/** Sumber tunggal label + gaya status lamaran (glossary copywriting). */
export const STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  submitted: { label: "Terkirim", variant: "outline", color: "var(--muted-foreground)" },
  "under-review": { label: "Administrasi", variant: "secondary", color: "var(--warning)" },
  interview: { label: "Wawancara", variant: "default", color: "var(--info)" },
  rejected: { label: "Ditolak", variant: "outline", color: "var(--destructive)" },
};

export function getStatusMeta(status: string): StatusMeta {
  return STATUS_META[status as ApplicationStatus] ?? STATUS_META.submitted;
}

export interface ScoreLevel {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  color: string;
}

/** Skor rekomendasi AI -> level (cutoff 75/55, sebelumnya terduplikasi 3x). */
export function getScoreLevel(score?: number): ScoreLevel {
  if (!score) return { label: "—", variant: "outline", color: "var(--muted-foreground)" };
  if (score >= 75) return { label: "Memenuhi Syarat", variant: "default", color: "var(--success)" };
  if (score >= 55) return { label: "Perlu Dikembangkan", variant: "secondary", color: "var(--warning)" };
  return { label: "Tidak Sesuai", variant: "destructive", color: "var(--destructive)" };
}
