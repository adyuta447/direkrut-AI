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
  displayContent?: string
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
  const chatSessionId = `session-${currentUser?.id || "anon"}`

  // Konteks faktual kandidat: nama + posisi + hasil screening (skor, skill,
  // ringkasan CV) + transkrip wawancara AI (tanya-jawab + feedback + skor).
  // Tanpa ini AI cuma tau NAMA doang, jadi jawabannya ngawang. Di-fetch
  // async begitu candidateId ada, disuntik jadi blok fakta di depan pertanyaan.
  const [candidateContext, setCandidateContext] = React.useState<string | null>(null)

  React.useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- konteks di-fetch async dari candidateId; reset sinkron pas gak ada kandidat */
    if (!candidateId || !applications) {
      setCandidateContext(null)
      return
    }
    const candidate = applications.find((a) => a.id === candidateId)
    if (!candidate) {
      setCandidateContext(null)
      return
    }
    let cancelled = false
    ;(async () => {
      const [screening, interview] = await Promise.all([
        aiService.getScreeningResult(candidateId).catch(() => null),
        aiService.getInterviewResult(candidateId).catch(() => null),
      ])
      if (cancelled) return

      const parts: string[] = [
        `Nama kandidat: ${candidate.applicantName}`,
        `Posisi dilamar: ${candidate.jobTitle || "-"}`,
        `Status lamaran: ${candidate.status}`,
      ]
      if (screening) {
        parts.push(`Skor kecocokan CV (screening AI): ${Math.round(screening.overallScore)}%`)
        if (screening.workExperienceYears != null) parts.push(`Estimasi pengalaman kerja: ${screening.workExperienceYears} tahun`)
        if (screening.skills.length) parts.push(`Skill terdeteksi dari CV: ${screening.skills.join(", ")}`)
        if (screening.cvSummary) parts.push(`Ringkasan CV: ${screening.cvSummary}`)
        if (screening.matchedEvidence?.length) parts.push(`Bukti kecocokan: ${screening.matchedEvidence.join("; ")}`)
      } else {
        parts.push("CV kandidat ini BELUM discreen AI (belum ada skor/ringkasan).")
      }
      if (interview && interview.items.length) {
        if (interview.recommendationScore != null) parts.push(`Skor rekomendasi wawancara AI: ${Math.round(interview.recommendationScore)}`)
        parts.push(`Jumlah pelanggaran integritas saat wawancara: ${interview.proctoringFlags.length}`)
        const transcript = interview.items
          .map((it, i) => `Q${i + 1}: ${it.question}\nJawaban: ${it.answer || "(kosong)"}${it.aiFeedback ? `\nCatatan AI: ${it.aiFeedback}` : ""}`)
          .join("\n\n")
        parts.push(`Transkrip wawancara AI:\n${transcript}`)
      } else {
        parts.push("Kandidat ini BELUM menyelesaikan wawancara AI.")
      }

      setCandidateContext(
        "[DATA KANDIDAT — pakai HANYA fakta di bawah ini buat jawab, jangan mengarang di luar data ini]\n" +
          parts.join("\n") +
          "\n[AKHIR DATA KANDIDAT]\n\nPertanyaan HRD: "
      )
    })()
    return () => {
      cancelled = true
    }
    /* eslint-enable react-hooks/set-state-in-effect */
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
          chatSessionId,
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
    [chatSessionId]
  )

  // Seed welcome message sekali aja pas mount.
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
  }, [])

  // Auto-submit pertanyaan awal (dari tombol "Tanya AI" di detail kandidat).
  // Kalau ada candidateId, TUNGGU dulu sampai candidateContext ke-fetch biar
  // pertanyaan pertama beneran bawa data kandidat (bukan ngawang).
  useEffect(() => {
    if (!initialQuery || hasAutoSubmitted.current) return
    const waitingForContext = Boolean(candidateId) && candidateContext === null
    if (waitingForContext) return

    hasAutoSubmitted.current = true
    const fullContent = candidateContext ? `${candidateContext}${initialQuery}` : initialQuery
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: fullContent,
      // Di UI cuma tampilin pertanyaan aslinya, sembunyiin blok data kandidat.
      displayContent: initialQuery,
      timestamp: new Date(),
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- auto-submit pertanyaan awal dari deep-link, sekali jalan (di-guard hasAutoSubmitted)
    setMessages((prev) => {
      const updated = [...prev, userMsg]
      sendToAI(updated)
      return updated
    })
  }, [initialQuery, candidateId, candidateContext, sendToAI])

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
