import { MessageSquareIcon, SparklesIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatBubble } from "@/components/molecules/dashboard/ChatBubble"
import { TypingDots } from "@/components/atoms/shared/TypingDots"

interface TranscriptItem {
  question: string
  answer: string
  aiFeedback?: string
}

interface ApplicationTranscriptTabProps {
  transcriptData: TranscriptItem[]
  isLoading?: boolean
  recommendationScore?: number | null
}

export function ApplicationTranscriptTab({ transcriptData, isLoading, recommendationScore }: ApplicationTranscriptTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold leading-[1.1] tracking-[-0.02em] md:text-2xl">Transkrip Wawancara AI</CardTitle>
        <CardDescription>Rekaman lengkap sesi tanya-jawabmu sama AI Direkrut.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center gap-3 py-8 justify-center text-muted-foreground">
            <TypingDots /> Ngecek transkrip wawancara...
          </div>
        ) : transcriptData.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <MessageSquareIcon className="mx-auto mb-3 size-10 opacity-30" />
            <p>Sesi wawancaranya belum mulai.</p>
          </div>
        ) : (
          <>
            {recommendationScore != null && (
              <div className="rounded-2xl border bg-muted/30 px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium">Skor Rekomendasi AI</span>
                <span className="text-xl font-bold text-primary tabular-nums">{Math.round(recommendationScore)}</span>
              </div>
            )}
            {transcriptData.map((item, i) => (
              <div key={i} className="space-y-3">
                <ChatBubble from="ai" className="max-w-[85%]">
                  <p className="mb-1 text-xs font-medium text-muted-foreground">AI Interviewer</p>
                  <p>{item.question}</p>
                </ChatBubble>
                <ChatBubble from="user" className="max-w-[85%]">
                  <p className="mb-1 text-xs font-medium opacity-70">Kamu</p>
                  <p>{item.answer}</p>
                </ChatBubble>
                {item.aiFeedback && (
                  <div className="ml-2 flex gap-2 max-w-[85%] rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
                    <SparklesIcon className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{item.aiFeedback}</span>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  )
}
