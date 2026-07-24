"use client"

import * as React from "react"
import { IconSparkles, IconX } from "@tabler/icons-react"
import { useDashboard } from "@/context/DashboardContext"
import { useAIAssistantWidget } from "@/context/AIAssistantWidgetContext"
import { AIAssistantMessages } from "@/components/molecules/dashboard/AIAssistantMessages"
import { AIAssistantInput } from "@/components/molecules/dashboard/AIAssistantInput"
import { Button } from "@/components/ui/button"
import * as aiService from "@/services/aiService"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  displayContent?: string
  timestamp: Date
}

export function FloatingAIAssistant() {
  const { currentUser, applications } = useDashboard()
  const { isOpen, pendingQuery, close, toggle, clearPendingQuery } = useAIAssistantWidget()
  const [messages, setMessages] = React.useState<Message[]>([])
  const [inputValue, setInputValue] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const hasAutoSubmitted = React.useRef(false)
  const abortRef = React.useRef<AbortController | null>(null)

  const chatSessionId = `session-${currentUser?.id || "anon"}`
  const candidateId = pendingQuery?.candidateId ?? null

  // Konteks faktual kandidat (skor screening + transkrip wawancara) -- sama
  // persis dengan yang dipakai halaman lama, cuma sumbernya sekarang dari
  // pendingQuery widget, bukan search params route.
  const [candidateContext, setCandidateContext] = React.useState<string | null>(null)

  React.useEffect(() => {
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
  }, [candidateId, applications])

  const sendToAI = React.useCallback(
    async (allMessages: Message[]) => {
      setIsTyping(true)

      const assistantMsgId = (Date.now() + 1).toString()
      setMessages((prev) => [
        ...prev,
        { id: assistantMsgId, role: "assistant", content: "", timestamp: new Date() },
      ])

      if (abortRef.current) {
        abortRef.current.abort()
      }
      abortRef.current = new AbortController()

      const chatMessages: aiService.ChatMessage[] = allMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }))

      try {
        await aiService.streamChat(
          chatSessionId,
          chatMessages,
          (chunk) => {
            if (chunk.error) {
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantMsgId ? { ...m, content: `⚠️ ${chunk.error}` } : m))
              )
              setIsTyping(false)
              return
            }
            if (chunk.content) {
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantMsgId ? { ...m, content: m.content + chunk.content } : m))
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
              m.id === assistantMsgId ? { ...m, content: "⚠️ Gagal terhubung ke AI. Coba lagi nanti." } : m
            )
          )
        }
        setIsTyping(false)
      }
    },
    [chatSessionId]
  )

  React.useEffect(() => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Halo! Aku Asisten AI kamu. Ada yang bisa dibantu soal rekrutmen, analisis pelamar, atau jadwal wawancara?",
        timestamp: new Date(),
      },
    ])
  }, [])

  // Auto-submit pertanyaan yang "dititipkan" dari halaman lain (mis. tombol
  // Tanya AI di detail kandidat). Kalau ada candidateId, tunggu context-nya
  // kefetch dulu biar jawaban pertama beneran bawa data, bukan ngawang.
  React.useEffect(() => {
    if (!isOpen || !pendingQuery || hasAutoSubmitted.current) return
    const waitingForContext = Boolean(pendingQuery.candidateId) && candidateContext === null
    if (waitingForContext) return

    hasAutoSubmitted.current = true
    const fullContent = candidateContext ? `${candidateContext}${pendingQuery.q}` : pendingQuery.q
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: fullContent,
      displayContent: pendingQuery.q,
      timestamp: new Date(),
    }
    setMessages((prev) => {
      const updated = [...prev, userMsg]
      sendToAI(updated)
      return updated
    })
    clearPendingQuery()
  }, [isOpen, pendingQuery, candidateContext, sendToAI, clearPendingQuery])

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  React.useEffect(() => {
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
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[min(70vh,640px)] w-[min(24rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-3xl border border-hairline bg-background shadow-2xl">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <IconSparkles className="size-5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Asisten AI</h2>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="inline-block size-1.5 rounded-full bg-success" />
                  Standby, siap dipanggil kapan aja
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={close} aria-label="Tutup Asisten AI">
              <IconX className="size-4" />
            </Button>
          </div>
          <AIAssistantMessages
            messages={messages}
            isTyping={isTyping}
            currentUserName={currentUser?.name}
            scrollRef={scrollRef}
          />
          <AIAssistantInput value={inputValue} onChange={setInputValue} onSubmit={handleSendMessage} />
        </div>
      )}

      <Button
        size="icon"
        onClick={toggle}
        aria-label={isOpen ? "Tutup Asisten AI" : "Buka Asisten AI"}
        className="fixed bottom-6 right-6 z-50 size-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
      >
        {isOpen ? <IconX className="size-6" /> : <IconSparkles className="size-6" />}
      </Button>
    </>
  )
}
