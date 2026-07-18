"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, MailIcon, ArchiveIcon, Trash2Icon } from "lucide-react"

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

interface InboxSidebarProps {
  messages: Message[]
  selectedMessageId: string | null
  onSelect: (id: string) => void
}

export function InboxSidebar({ messages, selectedMessageId, onSelect }: InboxSidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const filtered = messages.filter(
    (m) =>
      m.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={`w-full md:w-[350px] lg:w-[400px] border-r flex flex-col ${selectedMessageId ? "hidden md:flex" : "flex"}`}>
      <div className="h-14 border-b flex items-center justify-between px-4 shrink-0 bg-muted/20">
        <div className="flex items-center gap-4 w-full max-w-md">
          <div className="relative w-full">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari kabar dari perusahaan..."
              className="pl-8 bg-background h-9 text-sm w-full focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <ArchiveIcon className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 border-b bg-muted/10 shrink-0">
        <h2 className="font-semibold flex items-center gap-2">
          <MailIcon className="size-4" /> Kotak Masuk
          <Badge variant="secondary" className="ml-auto rounded-full font-mono">
            {messages.filter((m) => !m.read).length}
          </Badge>
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filtered.map((msg) => (
            <button
              key={msg.id}
              onClick={() => onSelect(msg.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors border ${
                selectedMessageId === msg.id
                  ? "border-primary bg-background"
                  : "bg-transparent border-transparent hover:bg-muted"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-sm ${!msg.read ? "text-foreground" : "text-muted-foreground"}`}>
                    {msg.company}
                  </span>
                  {!msg.read && <span className="w-2 h-2 bg-primary rounded-full" />}
                </div>
                <span className="text-xs text-muted-foreground font-mono">{msg.date}</span>
              </div>
              <div className={`text-sm mb-1 line-clamp-1 ${!msg.read ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {msg.subject}
              </div>
              <div className="text-xs text-muted-foreground line-clamp-2">{msg.snippet}</div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
