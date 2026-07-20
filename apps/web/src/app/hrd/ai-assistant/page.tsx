"use client"

import * as React from "react"
import { useState, useRef, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useDashboard } from "@/context/DashboardContext"
import { AIAssistantHeader } from "@/components/molecules/dashboard/AIAssistantHeader"
import { AIAssistantMessages } from "@/components/molecules/dashboard/AIAssistantMessages"
import { AIAssistantInput } from "@/components/molecules/dashboard/AIAssistantInput"
import * as aiService from "@/services/aiService"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

function AIAssistantChat() {
  const { currentUser, applications } = useDashboard()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasAutoSubmitted = useRef(false)
  const abortRef = useRef<AbortController | null>(null)

  const searchParams = useSearchParams()
  const [initialContext, setInitialContext] = useState<{ q: string; candidate: string } | null>(
    null
  )

  useEffect(() => {
    try {
      const pending = localStorage.getItem("pendingAiQuery")
      if (pending) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is client-only, must read post-hydration to avoid SSR mismatch
        setInitialContext(JSON.parse(pending))
        localStorage.removeItem("pendingAiQuery")
      }
    } catch {
      // ignore malformed pendingAiQuery
    }
  }, [])

  const initialQuery = initialContext?.q || searchParams.get("q")
  const candidateId = initialContext?.candidate || searchParams.get("candidate")

  const candidateContext = React.useMemo(() => {
    if (!candidateId || !applications) return null
    const candidate = applications.find((a) => a.id === candidateId)
    return candidate ? `[Konteks Kandidat: ${candidate.applicantName}] ` : null
  }, [candidateId, applications])

  // Kirim pesan ke AI dan handle streaming response
  const sendToAI = useCallback(
    async (allMessages: Message[]) => {
      setIsTyping(true)

      // Buat placeholder message buat assistant
      const assistantMsgId = (Date.now() + 1).toString()
      setMessages((prev) => [
        ...prev,
        { id: assistantMsgId, role: "assistant", content: "", timestamp: new Date() },
      ])

      // Abort request sebelumnya kalau ada
      if (abortRef.current) {
        abortRef.current.abort()
      }
      abortRef.current = new AbortController()

      // Konversi messages ke format yang diharapkan AI service
      const chatMessages: aiService.ChatMessage[] = allMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }))

      try {
        await aiService.streamChat(
          `session-${currentUser?.id || "anon"}`,
          chatMessages,
          (chunk) => {
            if (chunk.error) {
              // Tampilkan error di chat
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, content: `⚠️ ${chunk.error}` }
                    : m
                )
              )
              setIsTyping(false)
              return
            }

            if (chunk.content) {
              // Append content ke message yang sedang di-stream
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, content: m.content + chunk.content }
                    : m
                )
              )
            }

            if (chunk.done) {
              setIsTyping(false)
            }
          },
          abortRef.current.signal,
        )
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: "⚠️ Gagal terhubung ke AI. Coba lagi nanti." }
                : m
            )
          )
        }
        setIsTyping(false)
      }
    },
    [currentUser?.id]
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- seeds the welcome message post-hydration to keep SSR/client output matching
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Halo! Aku Asisten AI kamu. Ada yang bisa dibantu soal rekrutmen, analisis pelamar, atau jadwal wawancara?",
        timestamp: new Date(),
      },
    ])

    if (initialQuery && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true
      const fullContent = candidateContext ? `${candidateContext}${initialQuery}` : initialQuery
      setTimeout(() => {
        const userMsg: Message = {
          id: Date.now().toString(),
          role: "user",
          content: fullContent,
          timestamp: new Date(),
        }
        setMessages((prev) => {
          const updated = [...prev, userMsg]
          // Trigger AI setelah state update
          sendToAI(updated)
          return updated
        })
      }, 500)
    }
  }, [initialQuery, candidateContext, sendToAI])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort()
      }
    }
  }, [])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isTyping) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setInputValue("")
    setMessages((prev) => {
      const updated = [...prev, userMsg]
      sendToAI(updated)
      return updated
    })
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-5rem)] w-full relative overflow-hidden bg-background rounded-xl">
      <AIAssistantHeader />
      <AIAssistantMessages
        messages={messages}
        isTyping={isTyping}
        currentUserName={currentUser?.name}
        scrollRef={scrollRef}
      />
      <AIAssistantInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSendMessage}
      />
    </div>
  )
}

export default function AIAssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100dvh-4rem)] items-center justify-center">
          Lagi manggil Asisten AI...
        </div>
      }
    >
      <AIAssistantChat />
    </Suspense>
  )
}
