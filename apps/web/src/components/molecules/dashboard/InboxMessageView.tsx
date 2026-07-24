"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MailIcon,
  StarIcon,
  ReplyIcon,
  Building2Icon,
  PaperclipIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
} from "lucide-react"

type Message = {
  id: string
  company: string
  subject: string
  snippet: string
  date: string
  read: boolean
  starred: boolean
  content: string
  type: "invitation" | "offer" | "rejection" | "update"
  /** Opsional -- kalau ada, render tombol "Lihat Kandidat" (dipakai sisi HRD). */
  href?: string
}

interface InboxMessageViewProps {
  message: Message | undefined
  onBack: () => void
}

function getTypeBadge(type: string) {
  switch (type) {
    case "invitation":
      return <Badge className="border-transparent bg-status-positive text-white">Undangan</Badge>
    case "offer":
      return <Badge className="border-transparent bg-status-positive text-white">Penerimaan</Badge>
    case "rejection":
      return <Badge className="border-transparent bg-destructive text-white">Pemberitahuan</Badge>
    default:
      return <Badge className="border-transparent bg-badge-neutral text-white">Info</Badge>
  }
}

export function InboxMessageView({ message, onBack }: InboxMessageViewProps) {
  if (!message) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center text-muted-foreground">
        <MailIcon className="size-16 opacity-20 mb-4" />
        <p>Pilih pesan buat dibaca</p>
      </div>
    )
  }

  return (
    <div className={`flex-1 min-h-0 flex flex-col bg-background ${!message ? "hidden md:flex" : "flex"}`}>
      <div className="md:hidden p-2 border-b flex items-center bg-muted/20">
        <Button variant="ghost" size="sm" onClick={onBack}>
          &larr; Kembali
        </Button>
      </div>

      <div className="p-6 border-b shrink-0 bg-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold tracking-tight">{message.subject}</h2>
              {getTypeBadge(message.type)}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Building2Icon className="size-5" />
              </div>
              <div>
                <div className="font-semibold text-foreground">
                  Tim Rekrutmen {message.company}
                </div>
                <div className="text-xs">
                  no-reply@{message.company.toLowerCase().replace(/\s/g, "")}.com
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground whitespace-nowrap pt-1 flex items-center gap-2">
            {message.date}
            {message.href && (
              <Button variant="outline" size="sm" className="gap-1.5 rounded-full" render={<Link href={message.href} />}>
                <ExternalLinkIcon className="size-3.5" /> Lihat Kandidat
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-warning">
              <StarIcon className={`size-5 ${message.starred ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-8">
          <div className="prose prose-sm dark:prose-invert max-w-none text-base leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>

          {message.type === "offer" && (
            <div className="mt-8 p-4 border rounded-xl flex items-center gap-4 bg-muted/30 max-w-md">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <PaperclipIcon className="size-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Offering_Letter_DataCorp.pdf</p>
                <p className="text-xs text-muted-foreground">1.2 MB</p>
              </div>
              <Button variant="outline" size="sm">Unduh</Button>
            </div>
          )}

          {message.type === "invitation" && (
            <div className="mt-12 flex items-center gap-3">
              <Button className="gap-2">
                <CheckCircleIcon className="size-4" /> Konfirmasi Kehadiran
              </Button>
              <Button variant="outline" className="gap-2">
                <ReplyIcon className="size-4" /> Balas Pesan
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
