"use client"

import * as React from "react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { InboxSidebar } from "@/components/molecules/dashboard/InboxSidebar"
import { InboxMessageView } from "@/components/molecules/dashboard/InboxMessageView"
import { listSentDecisions, type SentDecision } from "@/services/applicationService"

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
  href?: string
}

const SUBJECT: Record<string, string> = {
  interview: "Undangan Wawancara",
  rejected: "Pemberitahuan Hasil Seleksi",
  "under-review": "Lamaran Sedang Ditinjau",
}

const TYPE: Record<string, Message["type"]> = {
  interview: "invitation",
  rejected: "rejection",
  "under-review": "update",
}

function toMessage(d: SentDecision): Message {
  const note = d.note?.trim()
  return {
    id: d.id,
    company: d.candidateName,
    subject: `${SUBJECT[d.toStatus] || "Pemberitahuan"} — ${d.jobTitle}`,
    snippet: note ? (note.length > 140 ? note.slice(0, 140) + "…" : note) : "Belum ada catatan detail yang tersimpan.",
    date: formatDistanceToNow(new Date(d.createdAt), { addSuffix: true, locale: id }),
    read: true,
    starred: false,
    content: note || "Gak ada catatan detail yang tersimpan buat pengiriman ini.",
    type: TYPE[d.toStatus] || "update",
    href: `/hrd/candidates/${d.applicationId}`,
  }
}

export default function InboxPage() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [selectedMessageId, setSelectedMessageId] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    listSentDecisions()
      .then((items) => {
        if (cancelled) return
        const mapped = items.map(toMessage)
        setMessages(mapped)
        setSelectedMessageId((prev) => prev ?? mapped[0]?.id ?? null)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const selectedMessage = messages.find((m) => m.id === selectedMessageId)

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Memuat riwayat...
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1 text-center text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Belum ada keputusan yang dikirim ke kandidat.</p>
        <p>Undang atau tolak kandidat dari halaman detail buat mulai.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden animate-in fade-in duration-500">
      <div className="flex-1 flex overflow-hidden">
        <InboxSidebar
          messages={messages}
          selectedMessageId={selectedMessageId}
          onSelect={setSelectedMessageId}
        />
        <InboxMessageView
          message={selectedMessage}
          onBack={() => setSelectedMessageId(null)}
        />
      </div>
    </div>
  )
}
