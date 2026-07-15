"use client"

import * as React from "react"
import { useState, useRef, useEffect, Suspense } from "react"
import {
  IconSend,
  IconSparkles,
  IconPaperclip,
} from "@tabler/icons-react"
import { useSearchParams } from "next/navigation"
import { useDashboard } from "@/context/DashboardContext"
import { TypingDots } from "@/components/atoms/shared/TypingDots"
import { ChatBubble } from "@/components/molecules/dashboard/ChatBubble"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const INITIAL_MESSAGES: Message[] = []

function AIAssistantChat() {
  const { currentUser } = useDashboard()
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasAutoSubmitted = useRef(false)

  const searchParams = useSearchParams()
  const [initialContext, setInitialContext] = useState<{q: string, candidate: string} | null>(null)
  
  useEffect(() => {
    try {
      const pending = localStorage.getItem('pendingAiQuery')
      if (pending) {
        setInitialContext(JSON.parse(pending))
        localStorage.removeItem('pendingAiQuery')
      }
    } catch (e) {}
  }, [])

  const initialQuery = initialContext?.q || searchParams.get("q")
  const candidateId = initialContext?.candidate || searchParams.get("candidate")

  const { applications } = useDashboard()
  const candidateContext = React.useMemo(() => {
    if (!candidateId || !applications) return null
    const candidate = applications.find(a => a.id === candidateId)
    return candidate ? `[Konteks Kandidat: ${candidate.applicantName}] ` : null
  }, [candidateId, applications])

  useEffect(() => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Halo! Saya Asisten AI Anda. Ada yang bisa saya bantu hari ini terkait perekrutan, analisis pelamar, atau penjadwalan?",
        timestamp: new Date()
      }
    ])

    if (initialQuery && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true
      const fullContent = candidateContext ? `${candidateContext}${initialQuery}` : initialQuery
      
      setTimeout(() => {
        const userMsg: Message = {
          id: Date.now().toString(),
          role: "user",
          content: fullContent,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, userMsg])
        setIsTyping(true)

        setTimeout(() => {
          const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `Berdasarkan ${candidateContext ? "konteks kandidat" : "data"} tersebut, saya melihat bahwa profil relevan dengan posisi. Apakah ada detail spesifik lain yang ingin Anda gali lebih dalam?`,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, aiMsg])
          setIsTyping(false)
        }, 1500)
      }, 500)
    }
  }, [initialQuery, candidateContext])

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Berdasarkan data saat ini, saya melihat ada beberapa kandidat yang sangat cocok untuk posisi Software Engineer. Apakah Anda ingin saya menampilkannya?",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-5rem)] w-full relative overflow-hidden bg-background rounded-xl">
      
      <div className="px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 sticky top-0 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <IconSparkles className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">Asisten AI</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success inline-block"></span>
              Selalu siap membantu
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6 min-h-0">
        <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-4">
          {messages.map((msg) => {
            const isUser = msg.role === "user"
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <Avatar className="w-8 h-8 shrink-0 mt-auto">
                  {isUser ? (
                    <>
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {currentUser?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        <IconSparkles className="size-4" />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>

                <div className={`flex flex-col gap-1 min-w-0 ${isUser ? "items-end" : "items-start"}`}>
                  <span className="text-[10px] text-muted-foreground px-1 shrink-0">
                    {isUser ? "Anda" : "AI"} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <ChatBubble
                    from={isUser ? "user" : "ai"}
                    className="max-w-none animate-in fade-in slide-in-from-bottom-2 break-words break-all whitespace-pre-wrap"
                  >
                    {msg.content}
                  </ChatBubble>
                </div>
              </div>
            )
          })}
          
          {isTyping && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <Avatar className="w-8 h-8 shrink-0 mt-auto">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  <IconSparkles className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1 items-start">
                <div className="px-4 py-3 rounded-2xl bg-muted text-foreground rounded-bl-sm">
                  <div className="flex items-center h-4">
                    <TypingDots />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} className="h-1" />
        </div>
      </ScrollArea>

      <div className="p-4 bg-background border-t">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-end gap-2">
          <div className="relative flex-1">
            <Input 
              placeholder="Tanya AI tentang kandidat, jadwal, atau analisis..."
              className="pl-12 pr-16 py-6 bg-muted/50 border-muted-foreground/20 rounded-full focus-visible:ring-primary/50 text-sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rounded-full"
            >
              <IconPaperclip className="size-5" />
            </Button>
          </div>
          <Button 
            type="submit" 
            size="icon"
            disabled={!inputValue.trim()}
            className="rounded-full w-12 h-12 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-transform active:scale-95"
          >
            <IconSend className="size-5" />
          </Button>
        </form>
        <p className="text-center text-[10px] text-muted-foreground mt-3">
          AI dapat membuat kesalahan. Harap verifikasi keputusan rekrutmen Anda.
        </p>
      </div>
    </div>
  )
}

export default function AIAssistantPage() {
  return (
    <Suspense fallback={<div className="flex h-[calc(100dvh-4rem)] items-center justify-center">Memuat Asisten AI...</div>}>
      <AIAssistantChat />
    </Suspense>
  )
}
