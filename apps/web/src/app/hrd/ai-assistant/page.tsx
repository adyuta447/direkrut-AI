"use client"

import * as React from "react"
import { useState, useRef, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useDashboard } from "@/context/DashboardContext"
import { AIAssistantHeader } from "@/components/molecules/dashboard/AIAssistantHeader"
import { AIAssistantMessages } from "@/components/molecules/dashboard/AIAssistantMessages"
import { AIAssistantInput } from "@/components/molecules/dashboard/AIAssistantInput"

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

  const searchParams = useSearchParams()
  const [initialContext, setInitialContext] = useState<{ q: string; candidate: string } | null>(
    null
  )

  useEffect(() => {
    try {
      const pending = localStorage.getItem("pendingAiQuery")
      if (pending) {
        setInitialContext(JSON.parse(pending))
        localStorage.removeItem("pendingAiQuery")
      }
    } catch (e) {}
  }, [])

  const initialQuery = initialContext?.q || searchParams.get("q")
  const candidateId = initialContext?.candidate || searchParams.get("candidate")

  const candidateContext = React.useMemo(() => {
    if (!candidateId || !applications) return null
    const candidate = applications.find((a) => a.id === candidateId)
    return candidate ? `[Konteks Kandidat: ${candidate.applicantName}] ` : null
  }, [candidateId, applications])

  const addAiReply = (content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: (Date.now() + 1).toString(), role: "assistant", content, timestamp: new Date() },
    ])
    setIsTyping(false)
  }

  useEffect(() => {
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
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), role: "user", content: fullContent, timestamp: new Date() },
        ])
        setIsTyping(true)
        setTimeout(() => {
          addAiReply(
            `Dari ${candidateContext ? "konteks kandidat" : "data"} itu, profilnya emang relevan sama posisinya. Ada detail lain yang mau digali lebih dalam?`
          )
        }, 1500)
      }, 500)
    }
  }, [initialQuery, candidateContext])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: inputValue, timestamp: new Date() },
    ])
    setInputValue("")
    setIsTyping(true)
    setTimeout(() => {
      addAiReply(
        "Dari data yang ada, ada beberapa kandidat yang cocok banget buat posisi Software Engineer. Mau aku tampilin?"
      )
    }, 1500)
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
