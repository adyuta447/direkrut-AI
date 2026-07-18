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
  /** Kelas bg solid + teks putih, dipakai StatusBadge (bukan tint pucat). */
  solidClass: string;
}

/** Sumber tunggal label + gaya status lamaran (glossary copywriting). */
export const STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  submitted: { label: "Terkirim", variant: "outline", color: "var(--muted-foreground)", solidClass: "bg-muted-foreground" },
  "under-review": { label: "Administrasi", variant: "secondary", color: "var(--warning)", solidClass: "bg-[color-mix(in_oklch,var(--warning),black_15%)]" },
  interview: { label: "Wawancara", variant: "default", color: "var(--info)", solidClass: "bg-info" },
  rejected: { label: "Ditolak", variant: "outline", color: "var(--destructive)", solidClass: "bg-destructive" },
};

export function getStatusMeta(status: string): StatusMeta {
  return STATUS_META[status as ApplicationStatus] ?? STATUS_META.submitted;
}

export interface ScoreLevel {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  color: string;
  /** Kelas bg solid + teks putih, dipakai ScoreBadge (bukan tint pucat). */
  solidClass: string;
}

/** Skor rekomendasi AI -> level (cutoff 75/55, sebelumnya terduplikasi 3x). */
export function getScoreLevel(score?: number): ScoreLevel {
  if (!score) return { label: "—", variant: "outline", color: "var(--muted-foreground)", solidClass: "bg-muted-foreground" };
  if (score >= 75) return { label: "Memenuhi Syarat", variant: "default", color: "var(--success)", solidClass: "bg-success" };
  if (score >= 55) return { label: "Perlu Dikembangkan", variant: "secondary", color: "var(--warning)", solidClass: "bg-[color-mix(in_oklch,var(--warning),black_15%)]" };
  return { label: "Tidak Sesuai", variant: "destructive", color: "var(--destructive)", solidClass: "bg-destructive" };
}
