"use client"

import { useState } from "react"
import Link from "next/link"
import {
  IconCheck, IconSparkles, IconFileText,
  IconVideo, IconExternalLink, IconSend,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogClose, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { NoticeDialog } from "@/components/molecules/dashboard/NoticeDialog"

interface CrossRoleItem {
  id: string
  candidateName: string
  originalRole: string
  suggestedRole: string
  label: string
  variant: string
  reason: string
  evidenceType: string
  evidence: string
  emailed: boolean
}

const SOLID_BADGE = "border-white/40 bg-white/15 text-white"

export function CrossRoleCard({ item }: { item: CrossRoleItem }) {
  const [notice, setNotice] = useState<string | null>(null)
  const isHighlyRelevant = item.label === "Sangat Relevan"
  const bandColor = isHighlyRelevant ? "bg-primary" : "bg-brand-accent-strong"
  const suggestedRoleColor = isHighlyRelevant ? "text-primary" : "text-brand-accent-strong"
  const bandRing = isHighlyRelevant ? "ring-primary" : "ring-brand-accent-strong"

  return (
    <Card className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 overflow-hidden pt-0 flex flex-col">
      <div className={`${bandColor} p-4`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/hrd/candidates/${item.id}`} className="hover:underline text-white">
              <h3 className="font-semibold text-lg">{item.candidateName}</h3>
            </Link>
            {item.emailed && (
              <Badge variant="outline" className={SOLID_BADGE}>
                Email Terkirim
              </Badge>
            )}
          </div>
          <Badge variant="outline" className={`${SOLID_BADGE} whitespace-nowrap shrink-0`}>{item.label}</Badge>
        </div>

        <div className="relative mt-4 grid grid-cols-2 gap-4">
          <div className="min-w-0 rounded-xl bg-white/10 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Posisi Dilamar</p>
            <p className="truncate text-sm text-white/75 line-through">{item.originalRole}</p>
          </div>
          <div className="min-w-0 rounded-xl bg-white px-3 py-2">
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${suggestedRoleColor} opacity-70`}>Rekomendasi AI</p>
            <p className={`truncate text-sm font-semibold ${suggestedRoleColor}`}>{item.suggestedRole}</p>
          </div>
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-0 w-12 -translate-x-1/2 -translate-y-1/2 border-t-2 border-dashed border-white/40" />
          <div className={`absolute left-1/2 top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white ring-4 ${bandRing}`}>
            <IconSparkles className={`size-4 ${suggestedRoleColor}`} />
          </div>
        </div>
      </div>

      <CardContent className="p-5 flex-1 space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-1 text-ink">Analisis AI</h4>
          <p className="text-sm text-ink-muted leading-relaxed">{item.reason}</p>
        </div>
        <div className="bg-surface-1 rounded-2xl border border-hairline p-4">
          <div className="flex items-center gap-2 mb-2">
            {item.evidenceType === "cv"
              ? <IconFileText className="size-4 text-primary" />
              : <IconVideo className="size-4 text-primary" />}
            <h5 className="text-xs font-semibold text-primary uppercase tracking-wider">Bukti Pendukung</h5>
          </div>
          <p className="text-sm italic text-ink/80 leading-relaxed">{item.evidence}</p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
        <Button variant="outline" className="w-full border-hairline" render={<Link href={`/hrd/candidates/${item.id}`} />}>
          <IconExternalLink className="size-4 mr-2" />
          <span className="truncate">Detail Kandidat</span>
        </Button>
        <Dialog>
          <DialogTrigger render={<Button className="w-full flex flex-row items-center justify-center gap-2" />}>
            <IconCheck className="size-4 shrink-0" />
            <span className="truncate">Tawarkan Posisi</span>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Validasi &amp; Kirim Penawaran</DialogTitle>
              <DialogDescription>
                Cek draft-nya, terus kirim ke{" "}
                <span className="font-semibold text-foreground">{item.candidateName}</span> buat
                nawarin posisi{" "}
                <span className="font-semibold text-foreground">{item.suggestedRole}</span>.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label>Subjek Email</Label>
                <Input defaultValue={`Peluang Karir: Posisi ${item.suggestedRole} di Perusahaan Kami`} />
              </div>
              <div className="space-y-2">
                <Label>Pesan Email</Label>
                <Textarea
                  className="min-h-[150px]"
                  defaultValue={`Halo ${item.candidateName},\n\nBerdasarkan profil dan hasil analisis seleksi Anda, kami melihat potensi besar yang sangat relevan untuk posisi ${item.suggestedRole}. Kami ingin berdiskusi lebih lanjut apakah Anda tertarik untuk menjajaki peluang ini.\n\nMohon konfirmasikan ketertarikan Anda dengan membalas email ini.`}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
              <DialogClose
                render={<Button onClick={() => setNotice("Email penawaran udah terkirim!")} />}
              >
                <IconSend className="size-4 mr-2" /> Kirim Email
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <NoticeDialog message={notice} onClose={() => setNotice(null)} />
      </CardFooter>
    </Card>
  )
}
