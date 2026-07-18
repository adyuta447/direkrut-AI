import { MessageSquareIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatBubble } from "@/components/molecules/dashboard/ChatBubble"
import type { ValidationResponse } from "@/lib/types"

interface ApplicationTranscriptTabProps {
  transcriptData: ValidationResponse[]
}

export function ApplicationTranscriptTab({ transcriptData }: ApplicationTranscriptTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold leading-[1.1] tracking-[-0.02em] md:text-2xl">Transkrip Wawancara AI</CardTitle>
        <CardDescription>Rekaman lengkap sesi tanya-jawabmu sama AI Direkrut.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {transcriptData.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <MessageSquareIcon className="mx-auto mb-3 size-10 opacity-30" />
            <p>Sesi wawancaranya belum mulai.</p>
          </div>
        ) : (
          transcriptData.map((item, i) => (
            <div key={i} className="space-y-3">
              <ChatBubble from="ai" className="max-w-[85%]">
                <p className="mb-1 text-xs font-medium text-muted-foreground">AI Interviewer</p>
                <p>{item.question}</p>
              </ChatBubble>
              <ChatBubble from="user" className="max-w-[85%]">
                <p className="mb-1 text-xs font-medium opacity-70">Kamu</p>
                <p>{item.answer}</p>
              </ChatBubble>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
