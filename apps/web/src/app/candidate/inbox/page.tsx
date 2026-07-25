"use client"

import * as React from "react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { InboxSidebar } from "@/components/molecules/dashboard/InboxSidebar"
import { InboxMessageView } from "@/components/molecules/dashboard/InboxMessageView"
import { listNotifications, markAsRead } from "@/services/notificationService"

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
}

function toMessage(n: Awaited<ReturnType<typeof listNotifications>>[number]): Message {
  return {
    id: n.id,
    company: "Direkrut AI",
    subject: n.title,
    snippet: n.body.length > 140 ? n.body.slice(0, 140) + "…" : n.body,
    date: formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: id }),
    read: n.isRead,
    starred: false,
    content: n.body,
    type: "update",
  }
}

export default function CandidateInboxPage() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [selectedMessageId, setSelectedMessageId] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    listNotifications().then((items) => {
      if (cancelled) return
      const mapped = items.map(toMessage)
      setMessages(mapped)
      setSelectedMessageId((prev) => prev ?? mapped[0]?.id ?? null)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const selectedMessage = messages.find((m) => m.id === selectedMessageId)

  const handleSelect = (msgId: string) => {
    setMessages((msgs) => msgs.map((m) => (m.id === msgId ? { ...m, read: true } : m)))
    setSelectedMessageId(msgId)
    void markAsRead(msgId)
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden animate-in fade-in duration-500">
      <div className="flex-1 flex overflow-hidden">
        <InboxSidebar
          messages={messages}
          selectedMessageId={selectedMessageId}
          onSelect={handleSelect}
        />
        <InboxMessageView
          message={selectedMessage}
          onBack={() => setSelectedMessageId(null)}
          viewer="candidate"
          onConfirm={async () => {
            try {
              // Panggil endpoint backend untuk konfirmasi kehadiran
              const token = localStorage.getItem("token")
              await fetch("http://localhost:8080/v1/candidates/me/confirm-interview", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                }
              })
            } catch (err) {
              console.error(err)
            }
          }}
        />
      </div>
    </div>
  )
}
