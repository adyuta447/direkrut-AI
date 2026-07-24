"use client"

import { IconArrowRight, IconInfoCircle } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { StatusBadge } from "@/components/molecules/dashboard/StatusBadge"

export interface StatusLegendItem {
  status: string
  meaning: string
}

const CANDIDATE_FLOW: StatusLegendItem[] = [
  { status: "submitted", meaning: "Lamaranmu masuk -- CV kamu lagi discreen AI." },
  { status: "under-review", meaning: "Tim HRD lagi meninjau hasil screening & wawancaramu." },
  { status: "interview", meaning: "Selamat! Kamu diundang wawancara lanjutan bareng tim perusahaan." },
  { status: "rejected", meaning: "Belum lolos kali ini -- cek email, ada feedback pengembangan buat kamu." },
]

const HRD_FLOW: StatusLegendItem[] = [
  { status: "submitted", meaning: "Kandidat baru melamar -- CV otomatis discreen AI." },
  { status: "under-review", meaning: "Lagi ditinjau HRD (skor AI + hasil wawancara AI jadi bahan pertimbangan)." },
  { status: "interview", meaning: "Diundang wawancara lanjutan bareng tim (HR/teknis/user)." },
  { status: "rejected", meaning: "Ditolak -- kandidat otomatis dapet email pemberitahuan & feedback." },
]

const FOOTNOTE: Record<"candidate" | "hrd", string> = {
  candidate: "AI cuma bantu screening awal -- keputusan akhir selalu di tangan tim HRD perusahaan.",
  hrd: "AI cuma bantu screening & kasih evidence -- keputusan pindah status sepenuhnya di tangan HRD.",
}

/** Legend alur status lamaran (state machine) -- dipasang di header dashboard
 * (sebelah lonceng notifikasi) biar bisa diakses dari halaman mana pun, satu
 * komponen dipakai HRD & kandidat, cuma beda wording lewat prop `role`. */
export function StatusLegendPopover({ role }: { role: "candidate" | "hrd" }) {
  const items = role === "hrd" ? HRD_FLOW : CANDIDATE_FLOW

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline" size="icon" className="size-9 rounded-full border-hairline" />}
        aria-label="Alur Status"
        title="Alur Status"
      >
        <IconInfoCircle className="size-4" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-bold text-foreground">Alur Status Lamaran</p>
          <div className="mt-2.5 flex items-center gap-1 flex-wrap">
            {items.slice(0, 3).map((s, i) => (
              <span key={s.status} className="flex items-center gap-1">
                {i > 0 && <IconArrowRight className="size-3.5 text-muted-foreground" />}
                <StatusBadge status={s.status} />
              </span>
            ))}
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {items.map((s) => (
            <div key={s.status} className="flex items-start gap-2 border-b border-border px-4 py-3 last:border-b-0">
              <span className="shrink-0 mt-0.5"><StatusBadge status={s.status} /></span>
              <span className="text-xs text-muted-foreground">{s.meaning}</span>
            </div>
          ))}
        </div>
        <p className="px-4 py-3 text-xs text-muted-foreground">{FOOTNOTE[role]}</p>
      </PopoverContent>
    </Popover>
  )
}
