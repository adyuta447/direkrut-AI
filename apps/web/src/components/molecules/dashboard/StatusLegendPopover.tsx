"use client"

import { IconArrowRight, IconInfoCircle } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { StatusBadge } from "@/components/molecules/dashboard/StatusBadge"

/** Legend alur status lamaran (state machine) -- saran review: pengguna baru
 * harus langsung paham posisi kandidat & langkah berikutnya tanpa nebak.
 * Satu komponen dipakai dua sisi (HRD & kandidat), cuma beda wording. */
export interface StatusLegendItem {
  status: string
  meaning: string
}

export function StatusLegendPopover({ items, footnote }: { items: StatusLegendItem[]; footnote: string }) {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" size="sm" className="rounded-full border-hairline" />}>
        <IconInfoCircle className="size-4 mr-1.5 text-primary" /> Alur Status
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 space-y-3">
        <p className="text-sm font-semibold">Alur status lamaran</p>
        <div className="flex items-center gap-1 flex-wrap">
          {items.slice(0, 3).map((s, i) => (
            <span key={s.status} className="flex items-center gap-1">
              {i > 0 && <IconArrowRight className="size-3.5 text-muted-foreground" />}
              <StatusBadge status={s.status} />
            </span>
          ))}
        </div>
        <ul className="space-y-2">
          {items.map((s) => (
            <li key={s.status} className="flex items-start gap-2 text-sm">
              <span className="shrink-0 mt-0.5"><StatusBadge status={s.status} /></span>
              <span className="text-muted-foreground">{s.meaning}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground border-t border-hairline pt-2">{footnote}</p>
      </PopoverContent>
    </Popover>
  )
}
