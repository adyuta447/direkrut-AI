"use client"

import { useState } from "react"
import Link from "next/link"
import {
  IconCheck, IconChevronRight, IconFileText,
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

export function CrossRoleCard({ item }: { item: CrossRoleItem }) {
  const [notice, setNotice] = useState<string | null>(null)

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="bg-muted/50 p-4 border-b flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <Link href={`/hrd/candidates/${item.id}`} className="hover:underline hover:text-primary transition-colors">
              <h3 className="font-semibold text-lg">{item.candidateName}</h3>
            </Link>
            {item.emailed && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Email Terkirim
              </Badge>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <span>Melamar: <span className="line-through">{item.originalRole}</span></span>
            <IconChevronRight className="size-4 mx-2" />
            <span className="font-semibold text-primary">{item.suggestedRole}</span>
          </div>
        </div>
        <Badge variant={item.variant as any} className="whitespace-nowrap">{item.label}</Badge>
      </div>

      <CardContent className="p-5 flex-1 space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-1 text-foreground">Analisis AI</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{item.reason}</p>
        </div>
        <div className="bg-secondary/40 rounded-lg p-3 border border-secondary">
          <div className="flex items-center gap-2 mb-2">
            {item.evidenceType === "cv"
              ? <IconFileText className="size-4 text-primary" />
              : <IconVideo className="size-4 text-primary" />}
            <h5 className="text-xs font-semibold text-primary uppercase tracking-wider">Bukti Pendukung</h5>
          </div>
          <p className="text-sm italic text-foreground/80 leading-relaxed">{item.evidence}</p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
        <Button variant="outline" className="w-full" render={<Link href={`/hrd/candidates/${item.id}`} />}>
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
                Tinjau dan kirim email konfirmasi ke{" "}
                <span className="font-semibold text-foreground">{item.candidateName}</span> terkait
                rekomendasi lintas peran ke posisi{" "}
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
                render={<Button onClick={() => setNotice("Email penawaran terkirim")} />}
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
