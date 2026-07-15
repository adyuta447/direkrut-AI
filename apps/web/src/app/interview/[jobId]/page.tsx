"use client"

import * as React from "react"
import { useDashboard } from "@/context/DashboardContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CameraIcon, MicIcon, MonitorIcon, AlertTriangleIcon, 
  CheckCircleIcon, ShieldCheckIcon, ClockIcon, ArrowRightIcon,
  InfoIcon, SparklesIcon, MessageSquareIcon
} from "lucide-react"

type InterviewState = "setup" | "interview" | "feedback"

export default function InterviewPage({ params }: { params: Promise<{ jobId: string }> }) {
  const unwrappedParams = React.use(params)
  const { jobs } = useDashboard()
  const router = useRouter()
  const job = jobs.find(j => j.id === unwrappedParams.jobId)

  const [interviewState, setInterviewState] = React.useState<InterviewState>("setup")
  const [hasAgreed, setHasAgreed] = React.useState(false)
  const [warningCount, setWarningCount] = React.useState(0)
  const [showWarningModal, setShowWarningModal] = React.useState(false)

  const [exchangeIndex, setExchangeIndex] = React.useState(0)
  const [isAiSpeaking, setIsAiSpeaking] = React.useState(true)
  const [isAiProcessing, setIsAiProcessing] = React.useState(false)
  const [timeLeft, setTimeLeft] = React.useState(120)

  const conversationFlow = [
    {
      ai: "Halo! Selamat datang di sesi wawancara. Silakan perkenalkan diri Anda dan jelaskan proyek paling menantang yang pernah Anda kerjakan."
    },
    {
      ai: "Menarik sekali. Dari proyek tersebut, Anda menyebutkan penggunaan microservices. Bagaimana strategi Anda dalam menangani komunikasi antar service jika salah satunya mengalami down?"
    },
    {
      ai: "Pendekatan yang sangat logis. Terakhir, ceritakan pengalaman Anda saat harus bekerja sama dengan anggota tim yang memiliki perbedaan pendapat teknis yang tajam dengan Anda."
    }
  ]

  const totalExchanges = conversationFlow.length

  const handleFinishSpeaking = React.useCallback(() => {
    if (exchangeIndex >= totalExchanges - 1) {

      setIsAiProcessing(true)
      setTimeout(() => {
        setInterviewState("feedback")
      }, 2000)
    } else {
      setIsAiProcessing(true)
      setTimeout(() => {
        setIsAiProcessing(false)
        setExchangeIndex(prev => prev + 1)
      }, 3000)
    }
  }, [exchangeIndex, totalExchanges])

  React.useEffect(() => {
    if (interviewState !== "interview") return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarningCount(prev => prev + 1)
        setShowWarningModal(true)
      }
    }

    const handleBlur = () => {
      setWarningCount(prev => prev + 1)
      setShowWarningModal(true)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleBlur)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleBlur)
    }
  }, [interviewState])

  React.useEffect(() => {
    if (interviewState !== "interview" || isAiSpeaking) return
    if (timeLeft <= 0) {
      handleFinishSpeaking()
      return
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [interviewState, isAiSpeaking, timeLeft])

  React.useEffect(() => {
    if (interviewState !== "interview" || isAiProcessing) return
    setIsAiSpeaking(true)
    const timer = setTimeout(() => {
      setIsAiSpeaking(false)
      setTimeLeft(120)
    }, 5000)
    return () => clearTimeout(timer)
  }, [interviewState, exchangeIndex, isAiProcessing])

  if (!job) return <div className="flex h-screen items-center justify-center">Pekerjaan tidak ditemukan.</div>

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const renderSetup = () => (
    <div className="flex flex-col h-screen max-w-5xl mx-auto p-6 md:p-12 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Persiapan Wawancara AI</h1>
        <p className="text-muted-foreground mt-2">Posisi: {job.title} di {job.company}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 flex-1">
        <div className="space-y-6">
          <div className="bg-muted aspect-video rounded-2xl overflow-hidden relative border border-border">
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-black/90">
              <CameraIcon className="size-12 mb-2 opacity-50" />
              <p>Preview Kamera Anda</p>
            </div>
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs">
              <MicIcon className="size-3 text-success" /> Audio Terdeteksi
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-4">
            <ShieldCheckIcon className="size-6 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-primary">Integritas & Privasi</h4>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Sistem akan menggunakan kamera dan mikrofon Anda selama sesi berlangsung. AI akan mengambil tangkapan layar (capture) secara acak untuk memverifikasi identitas Anda sesuai kebijakan perusahaan.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex-1 space-y-6">
            <h3 className="text-xl font-bold">Aturan Wawancara</h3>
            
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <CheckCircleIcon className="size-5 text-success shrink-0 mt-0.5" />
                <p className="text-sm">Pastikan Anda berada di ruangan yang tenang dan memiliki pencahayaan yang baik.</p>
              </li>
              <li className="flex gap-3 items-start">
                <MonitorIcon className="size-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm">Anda wajib membagikan layar (Share Screen) jika diminta oleh sistem.</p>
              </li>
              <li className="flex gap-3 items-start">
                <AlertTriangleIcon className="size-5 text-warning shrink-0 mt-0.5" />
                <p className="text-sm"><strong>DILARANG</strong> membuka tab atau aplikasi lain. Sistem proctoring kami akan mencatat peringatan (warning) jika Anda meninggalkan halaman ini.</p>
              </li>
            </ul>

            <div className="pt-6 mt-6 border-t">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-primary text-primary focus:ring-primary"
                    checked={hasAgreed}
                    onChange={(e) => setHasAgreed(e.target.checked)}
                  />
                </div>
                <span className="text-sm select-none group-hover:text-foreground text-muted-foreground transition-colors">
                  Saya telah membaca dan menyetujui semua aturan di atas. Saya siap mengikuti wawancara dengan jujur.
                </span>
              </label>
            </div>
          </div>

          <Button 
            size="lg" 
            className="w-full mt-8 py-6 text-base font-bold shadow-lg"
            disabled={!hasAgreed}
            onClick={() => setInterviewState("interview")}
          >
            Mulai Wawancara Sekarang
          </Button>
        </div>
      </div>
    </div>
  )

  const renderInterview = () => {
    return (
      <div className="flex flex-col h-screen bg-black text-white relative animate-in zoom-in-95 duration-700">

        {showWarningModal && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-black/90 border border-destructive/50 p-8 rounded-2xl max-w-md text-center space-y-6">
              <div className="w-16 h-16 bg-destructive/20 text-destructive rounded-full flex items-center justify-center mx-auto">
                <AlertTriangleIcon className="size-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Peringatan Integritas!</h2>
                <p className="text-white/60 mt-2">Sistem mendeteksi Anda meninggalkan layar wawancara atau membuka aplikasi lain. Peringatan ke-{warningCount}.</p>
              </div>
              <Button variant="destructive" className="w-full" onClick={() => setShowWarningModal(false)}>
                Saya Mengerti, Lanjutkan
              </Button>
            </div>
          </div>
        )}

        <div className="absolute top-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-white border-white/20 bg-black/40 backdrop-blur-md px-3 py-1.5">
              Diskusi Bagian {exchangeIndex + 1} / {totalExchanges}
            </Badge>
            {isAiProcessing ? (
              <span className="flex items-center gap-2 text-primary font-medium text-sm animate-pulse">
                <SparklesIcon className="size-4" /> AI sedang memproses & merumuskan balasan...
              </span>
            ) : isAiSpeaking ? (
              <span className="flex items-center gap-2 text-primary font-medium text-sm animate-pulse">
                <MessageSquareIcon className="size-4" /> AI sedang berbicara...
              </span>
            ) : (
              <span className="flex items-center gap-2 text-success font-medium text-sm animate-pulse">
                <MicIcon className="size-4" /> Giliran Anda berbicara...
              </span>
            )}
          </div>
          
          <div className={`font-mono text-xl font-bold tabular-nums px-4 py-2 rounded-lg backdrop-blur-md border ${timeLeft < 30 ? 'bg-destructive/20 text-destructive border-destructive/50' : 'bg-white/10 text-white border-white/20'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`flex size-40 items-center justify-center rounded-full bg-primary/20 ring-8 ring-primary/10 transition-all duration-1000 ${isAiSpeaking && !isAiProcessing ? "scale-100 opacity-100" : "scale-90 opacity-50"}`}
            >
              <SparklesIcon className="size-16 text-primary" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>

          <div className="absolute bottom-32 w-full max-w-4xl mx-auto px-6 text-center z-10">
            {isAiProcessing ? (
               <p className="text-xl italic text-muted-foreground">Mendengarkan jawaban Anda...</p>
            ) : (
              <div className="space-y-4">
                {exchangeIndex > 0 && isAiSpeaking && (
                  <p className="text-sm font-medium text-success opacity-80 uppercase tracking-widest">
                    AI Follow-Up
                  </p>
                )}
                <p className="text-2xl md:text-3xl font-medium leading-relaxed tracking-wide text-white drop-shadow-lg shadow-black">
                  "{conversationFlow[exchangeIndex].ai}"
                </p>
              </div>
            )}
          </div>

          <div className={`absolute bottom-8 right-8 w-48 md:w-64 aspect-video bg-black/90 rounded-xl overflow-hidden border-2 shadow-2xl transition-all duration-500 ${isAiSpeaking || isAiProcessing ? 'border-white/20 scale-95' : 'border-success scale-100'}`}>
            
            <div className="flex h-full w-full items-center justify-center bg-black/80 text-2xl font-bold text-white/70">
              Anda
            </div>
            {!isAiSpeaking && (
               <div className="absolute top-2 right-2 bg-success text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                 <div className="size-1.5 bg-white rounded-full"></div> Rec
               </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 w-full p-6 flex justify-center items-center z-10 bg-gradient-to-t from-black/90 to-transparent">
          {!isAiSpeaking && !isAiProcessing && (
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-white/90 rounded-full px-8 font-semibold shadow-2xl"
              onClick={handleFinishSpeaking}
            >
              Selesai Menjawab & Analisis <ArrowRightIcon className="ml-2 size-4" />
            </Button>
          )}
        </div>

      </div>
    )
  }

  const renderFeedback = () => (
    <div className="min-h-screen bg-muted/30 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
        
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircleIcon className="size-10" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Wawancara Selesai!</h1>
          <p className="text-muted-foreground text-lg">Terima kasih telah menyelesaikan tahap wawancara AI.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          <Card className="border-primary/20 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <SparklesIcon className="size-6 text-primary" />
                <h3 className="font-semibold text-xl">Feedback Singkat AI</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-success/10 p-4 rounded-xl text-success text-sm leading-relaxed border border-success/20">
                  <strong>Poin Positif:</strong> Kepercayaan diri dan intonasi suara Anda sangat baik. Anda merespons pertanyaan studi kasus dengan terstruktur, menunjukkan kemampuan pemecahan masalah yang matang.
                </div>
                
                <div className="bg-info/10 p-4 rounded-xl text-info text-sm leading-relaxed border border-info/20">
                  <strong>Saran Pengembangan:</strong> Saat menjelaskan transisi karir, Anda bisa lebih memfokuskan pada *transferable skills* (keahlian yang bisa dibawa) ke peran baru ini agar semakin meyakinkan HRD.
                </div>

                <p className="text-xs text-muted-foreground italic mt-4">
                  *Catatan: Feedback ini bersifat membangun untuk pengembangan diri Anda dan tidak menampilkan skor akhir. Keputusan akhir mutlak berada di tangan tim HRD perusahaan.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-xl border-b pb-4 mb-6 flex items-center gap-2">
                <InfoIcon className="size-5 text-muted-foreground" /> Status Lamaran Anda
              </h3>

              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-success before:via-muted before:to-muted">

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <CheckCircleIcon className="size-4" />
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border bg-card shadow-sm">
                    <h4 className="font-semibold text-sm">Lamaran Dikirim</h4>
                    <p className="text-xs text-muted-foreground mt-1">CV dan profil berhasil masuk ke sistem.</p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <CheckCircleIcon className="size-4" />
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border bg-card shadow-sm">
                    <h4 className="font-semibold text-sm">Wawancara AI</h4>
                    <p className="text-xs text-muted-foreground mt-1">Selesai dianalisis oleh AI.</p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground ring-4 ring-primary/20 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <ClockIcon className="size-4 animate-pulse" />
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-primary bg-primary/5 shadow-sm">
                    <h4 className="font-semibold text-sm text-primary">Analisis HRD</h4>
                    <p className="text-xs text-foreground/80 mt-1">Sedang ditinjau oleh tim rekruter perusahaan.</p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted border-2 text-muted-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border bg-muted/30 opacity-70">
                    <h4 className="font-semibold text-sm text-muted-foreground">Pengumuman</h4>
                    <p className="text-xs text-muted-foreground mt-1">Menunggu hasil peninjauan.</p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center pt-8">
          <Button size="lg" variant="outline" onClick={() => router.push("/candidate")}>
            Kembali ke Beranda Dashboard
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {interviewState === "setup" && renderSetup()}
      {interviewState === "interview" && renderInterview()}
      {interviewState === "feedback" && renderFeedback()}
    </>
  )
}
