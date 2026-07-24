"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Timer, ArrowRightIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useApplyFlowContext } from "@/lib/applications/ApplyFlowContext"

export default function WrittenTestPage({ params }: { params: Promise<{ jobId: string }> }) {
  const unwrappedParams = React.use(params)
  const router = useRouter()
  const { job } = useApplyFlowContext()
  
  const [timeLeft, setTimeLeft] = React.useState(5 * 60) // 5 minutes
  const [answer, setAnswer] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  React.useEffect(() => {
    // Start camera
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
      .catch(console.error)

    // Timer countdown
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          handleSubmit() // Auto submit when time is up
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(interval)
      // Stop camera
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate submitting test...
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // Move to interview
    router.push(`/candidate/apply/${unwrappedParams.jobId}/interview`)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  if (!job) return null

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 pb-8 space-y-8 relative">
      <Card className="border-t-4 border-t-primary shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Tes Tertulis Singkat</CardTitle>
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full font-mono font-medium text-primary">
            <Timer className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="bg-surface-1 p-4 rounded-xl border border-hairline">
            <h3 className="font-semibold text-lg mb-2">Pertanyaan:</h3>
            <p className="text-ink-muted">
              Jelaskan alasan utama kamu melamar posisi <strong>{job.title}</strong> di <strong>{job.company}</strong>, 
              serta apa kontribusi terbesar yang bisa kamu berikan di bulan pertama jika diterima?
            </p>
          </div>

          <Textarea 
            placeholder="Tuliskan jawabanmu di sini..."
            className="min-h-[250px] resize-y p-4 text-base"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isSubmitting}
          />
        </CardContent>
        <CardFooter className="flex justify-end border-t bg-muted/20 p-6">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || answer.trim().length < 10}
            size="lg"
          >
            {isSubmitting ? "Menyimpan..." : "Selesai & Lanjut Wawancara"}
            {!isSubmitting && <ArrowRightIcon className="ml-2 size-4" />}
          </Button>
        </CardFooter>
      </Card>

      {/* Floating Camera View */}
      <div className="fixed bottom-6 right-6 w-48 h-36 bg-black rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 z-50">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover mirror"
        />
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/50 px-2 py-0.5 rounded text-[10px] text-white">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          REC
        </div>
      </div>
    </div>
  )
}
