import type { ComponentType } from "react"

interface InfoBannerProps {
  icon: ComponentType<{ className?: string }>
  title: string
  description: React.ReactNode
}

/** Panel info flat -- border-hairline, satu warna aksen (icon), tanpa
 * tint/gradient. Dipakai buat penjelasan "cara kerja fitur X" yang
 * konsisten sama gaya kartu landing page (FeaturedJobCard dkk). */
export function InfoBanner({ icon: Icon, title, description }: InfoBannerProps) {
  return (
    <div className="rounded-3xl border border-hairline bg-canvas p-6 md:p-7">
      <div className="flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
          <Icon className="size-5" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold tracking-tight text-ink">{title}</h3>
          <div className="text-base leading-relaxed text-ink-muted">{description}</div>
        </div>
      </div>
    </div>
  )
}
