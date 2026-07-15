"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { 
  SearchIcon, MailIcon, StarIcon, ArchiveIcon, 
  Trash2Icon, ReplyIcon, Building2Icon, PaperclipIcon, CheckCircleIcon
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
}

const mockMessages: Message[] = [
  {
    id: "msg-1",
    company: "TechNova Solutions",
    subject: "Undangan Wawancara Teknis - Frontend Developer",
    snippet: "Selamat! Profil dan hasil wawancara AI Anda sangat mengesankan tim kami...",
    date: "Hari ini, 09:42",
    read: false,
    starred: true,
    type: "invitation",
    content: `Halo Kandidat,

Selamat! Kami telah meninjau profil, CV, dan hasil wawancara AI awal Anda. Tim engineering kami sangat terkesan dengan pendekatan Anda terhadap studi kasus yang diberikan.

Kami ingin mengundang Anda untuk mengikuti tahap Wawancara Teknis secara langsung (online) dengan Lead Frontend Engineer kami. 

Jadwal: Kamis, 18 Juli 2026, Pukul 14:00 WIB
Platform: Google Meet (Tautan terlampir)

Harap balas email ini untuk mengonfirmasi kehadiran Anda. Terima kasih dan kami menantikan diskusi yang menarik dengan Anda!

Salam hangat,
Tim Rekrutmen TechNova Solutions`
  },
  {
    id: "msg-2",
    company: "DataCorp Indonesia",
    subject: "Offering Letter - Data Analyst",
    snippet: "Kami dengan senang hati menawarkan posisi Data Analyst kepada Anda...",
    date: "Kemarin",
    read: true,
    starred: true,
    type: "offer",
    content: `Halo Kandidat,

Berdasarkan seluruh rangkaian proses seleksi yang telah Anda lalui, kami dengan senang hati menawarkan Anda posisi sebagai Data Analyst di DataCorp Indonesia.

Terlampir adalah dokumen Offering Letter resmi yang memuat rincian kompensasi, benefit, dan tanggal efektif mulai bekerja. 

Silakan pelajari dokumen tersebut dan berikan tanda tangan Anda paling lambat tanggal 17 Juli 2026 jika Anda menerima tawaran ini.

Selamat bergabung dan mari tumbuh bersama DataCorp!

Salam,
HR Manager
DataCorp Indonesia`
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
    content: `Halo Kandidat,

Terima kasih banyak atas ketertarikan Anda untuk bergabung sebagai UI/UX Designer di Nexus Creative dan atas waktu yang Anda luangkan untuk mengikuti Wawancara AI kami.

Saat ini persaingan sangat ketat dan dengan menyesal kami sampaikan bahwa kami memutuskan untuk melanjutkan dengan kandidat lain yang lebih sesuai dengan kebutuhan spesifik kami saat ini.

Keputusan ini tidak mengurangi kualitas profil Anda. Kami akan menyimpan CV Anda di database kami dan akan menghubungi Anda jika ada posisi yang lebih sesuai di masa depan.

Semoga sukses selalu untuk perjalanan karir Anda selanjutnya.

Salam,
Tim Rekrutmen
Nexus Creative`
  }
]

export default function CandidateInboxPage() {
  const [messages, setMessages] = React.useState<Message[]>(mockMessages)
  const [selectedMessageId, setSelectedMessageId] = React.useState<string | null>(mockMessages[0].id)
  const [searchQuery, setSearchQuery] = React.useState("")

  const selectedMessage = messages.find(m => m.id === selectedMessageId)

  const handleMarkAsRead = (id: string) => {
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, read: true } : m))
    setSelectedMessageId(id)
  }

  const getTypeBadge = (type: string) => {
    switch(type) {
      case 'invitation': return <Badge className="bg-blue-500 hover:bg-blue-600">Undangan</Badge>
      case 'offer': return <Badge className="bg-emerald-500 hover:bg-emerald-600">Penerimaan</Badge>
      case 'rejection': return <Badge variant="secondary" className="text-muted-foreground">Pemberitahuan</Badge>
      default: return <Badge variant="outline">Info</Badge>
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden animate-in fade-in duration-500">

      <div className="h-14 border-b flex items-center justify-between px-4 shrink-0 bg-muted/20">
        <div className="flex items-center gap-4 w-full max-w-md">
          <div className="relative w-full">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search"
              placeholder="Cari email dari perusahaan..."
              className="pl-8 bg-background h-9 text-sm w-full focus-visible:ring-1"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-1 hidden md:flex">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><ArchiveIcon className="size-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Trash2Icon className="size-4" /></Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        <div className={`w-full md:w-[350px] lg:w-[400px] border-r flex flex-col ${selectedMessageId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b bg-muted/10 shrink-0">
            <h2 className="font-semibold flex items-center gap-2">
              <MailIcon className="size-4" /> Kotak Masuk 
              <Badge variant="secondary" className="ml-auto rounded-full font-mono">{messages.filter(m => !m.read).length}</Badge>
            </h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {messages.filter(m => m.company.toLowerCase().includes(searchQuery.toLowerCase()) || m.subject.toLowerCase().includes(searchQuery.toLowerCase())).map(msg => (
                <button
                  key={msg.id}
                  onClick={() => handleMarkAsRead(msg.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors border ${selectedMessageId === msg.id ? 'bg-primary/10 border-primary/20' : 'bg-transparent border-transparent hover:bg-muted'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-sm ${!msg.read ? 'text-foreground' : 'text-muted-foreground'}`}>{msg.company}</span>
                      {!msg.read && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{msg.date}</span>
                  </div>
                  <div className={`text-sm mb-1 line-clamp-1 ${!msg.read ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {msg.subject}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {msg.snippet}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className={`flex-1 flex flex-col bg-background ${!selectedMessageId ? 'hidden md:flex' : 'flex'}`}>
          {selectedMessage ? (
            <>
              
              <div className="md:hidden p-2 border-b flex items-center bg-muted/20">
                <Button variant="ghost" size="sm" onClick={() => setSelectedMessageId(null)}>
                  &larr; Kembali
                </Button>
              </div>

              <div className="p-6 border-b shrink-0 bg-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold tracking-tight">{selectedMessage.subject}</h2>
                      {getTypeBadge(selectedMessage.type)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Building2Icon className="size-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Tim Rekrutmen {selectedMessage.company}</div>
                        <div className="text-xs">no-reply@{selectedMessage.company.toLowerCase().replace(/\s/g, '')}.com</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap pt-1 flex items-center gap-2">
                    {selectedMessage.date}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500">
                      <StarIcon className={`size-5 ${selectedMessage.starred ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-8">
                  <div className="prose prose-sm dark:prose-invert max-w-none text-base leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.content}
                  </div>
                  
                  {selectedMessage.type === 'offer' && (
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

                  {selectedMessage.type === 'invitation' && (
                    <div className="mt-12 flex items-center gap-3">
                      <Button className="gap-2"><CheckCircleIcon className="size-4" /> Konfirmasi Kehadiran</Button>
                      <Button variant="outline" className="gap-2"><ReplyIcon className="size-4" /> Balas Pesan</Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <MailIcon className="size-16 opacity-20 mb-4" />
              <p>Pilih pesan untuk membacanya</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
