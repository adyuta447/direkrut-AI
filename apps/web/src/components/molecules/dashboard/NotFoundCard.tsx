import Link from "next/link"
import type { ComponentType } from "react"
import { Button } from "@/components/ui/button"

interface NotFoundCardProps {
  title: string
  backHref: string
  backLabel: string
  icon?: ComponentType<{ className?: string }>
  variant?: "heading" | "muted"
}

/** Fallback generik dipakai di halaman detail dashboard mana pun (lowongan,
 * kandidat, lamaran) pas ID di URL gak ketemu di data. `variant="muted"`
 * buat gaya ikon besar + teks abu-abu, `"heading"` (default) buat judul
 * tegas ala not-found halaman. */
export function NotFoundCard({ title, backHref, backLabel, icon: Icon, variant = "heading" }: NotFoundCardProps) {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4 text-center">
        {Icon && <Icon className="size-12 text-muted-foreground opacity-40" />}
        {variant === "heading" ? (
          <h2 className="text-xl font-bold">{title}</h2>
        ) : (
          <p className="text-muted-foreground">{title}</p>
        )}
        <Button render={<Link href={backHref} />} variant={variant === "muted" ? "outline" : "default"}>
          {backLabel}
        </Button>
      </div>
    </div>
  )
}
