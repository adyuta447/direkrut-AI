import type { ComponentType, ReactNode } from "react"

interface DetailSectionProps {
  title: string
  icon?: ComponentType<{ className?: string }>
  action?: ReactNode
  children: ReactNode
}

/** Wrapper judul + konten yang konsisten buat tiap bagian di kartu detail
 * kandidat (Skor Kecocokan, Bukti Kecocokan, Skill, Ringkasan CV, dst) --
 * satu pola dipakai berulang biar HRD gampang ngenalin struktur halaman
 * begitu hafal satu bagian. */
export function DetailSection({ title, icon: Icon, action, children }: DetailSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h4 className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink">
          {Icon && <Icon className="size-5 text-primary" />}
          {title}
        </h4>
        {action}
      </div>
      {children}
    </div>
  )
}
