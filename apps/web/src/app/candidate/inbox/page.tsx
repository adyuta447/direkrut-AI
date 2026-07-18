"use client"

import * as React from "react"
import { InboxSidebar } from "@/components/molecules/dashboard/InboxSidebar"
import { InboxMessageView } from "@/components/molecules/dashboard/InboxMessageView"

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

const MOCK_MESSAGES: Message[] = [
  {
    id: "msg-1",
    company: "TechNova Solutions",
    subject: "Undangan Wawancara Teknis - Frontend Developer",
    snippet: "Selamat! Profil dan hasil wawancara AI Anda sangat mengesankan tim kami...",
    date: "Hari ini, 09:42",
    read: false,
    starred: true,
    type: "invitation",
    content: `Halo Kandidat,\n\nSelamat! Kami telah meninjau profil, CV, dan hasil wawancara AI awal Anda. Tim engineering kami sangat terkesan dengan pendekatan Anda terhadap studi kasus yang diberikan.\n\nKami ingin mengundang Anda untuk mengikuti tahap Wawancara Teknis secara langsung (online) dengan Lead Frontend Engineer kami.\n\nJadwal: Kamis, 18 Juli 2026, Pukul 14:00 WIB\nPlatform: Google Meet (Tautan terlampir)\n\nHarap balas email ini untuk mengonfirmasi kehadiran Anda.\n\nSalam hangat,\nTim Rekrutmen TechNova Solutions`,
  },
  {
    id: "msg-2",
    company: "DataCorp Indonesia",
    subject: "Surat Penawaran - Data Analyst",
    snippet: "Kami dengan senang hati menawarkan posisi Data Analyst kepada Anda...",
    date: "Kemarin",
    read: true,
    starred: true,
    type: "offer",
    content: `Halo Kandidat,\n\nBerdasarkan seluruh rangkaian proses seleksi yang telah Anda lalui, kami dengan senang hati menawarkan Anda posisi sebagai Data Analyst di DataCorp Indonesia.\n\nTerlampir adalah dokumen Surat Penawaran (offering letter) resmi.\n\nSilakan pelajari dan berikan tanda tangan Anda paling lambat tanggal 17 Juli 2026.\n\nSalam,\nHR Manager\nDataCorp Indonesia`,
  },
  {
    id: "msg-3",
    company: "Nexus Creative",
    subject: "Pembaruan Status Lamaran - UI/UX Designer",
    snippet: "Terima kasih atas waktu yang Anda luangkan. Saat ini kami belum dapat melanjutkan...",
    date: "10 Jul",
    read: true,
    starred: false,
    type: "rejection",
    content: `Halo Kandidat,\n\nTerima kasih banyak atas ketertarikan Anda untuk bergabung sebagai UI/UX Designer di Nexus Creative.\n\nSaat ini persaingan sangat ketat dan dengan menyesal kami sampaikan bahwa kami memutuskan untuk melanjutkan dengan kandidat lain.\n\nSemoga sukses selalu.\n\nSalam,\nTim Rekrutmen\nNexus Creative`,
  },
]

export default function CandidateInboxPage() {
  const [messages, setMessages] = React.useState<Message[]>(MOCK_MESSAGES)
  const [selectedMessageId, setSelectedMessageId] = React.useState<string | null>(
    MOCK_MESSAGES[0].id
  )

  const selectedMessage = messages.find((m) => m.id === selectedMessageId)

  const handleSelect = (id: string) => {
    setMessages((msgs) => msgs.map((m) => (m.id === id ? { ...m, read: true } : m)))
    setSelectedMessageId(id)
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
        />
      </div>
    </div>
  )
}
