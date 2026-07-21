"use client"

import * as React from "react"
import { useDashboard } from "@/context/DashboardContext"
import { useRouter } from "next/navigation"
import {
  generatePreScreenQuestions,
  submitPreScreen,
  generateInterviewQuestions,
  getAudioUploadUrl,
  proctorCheck,
  transcribeAnswer,
  finalizeInterview,
  type FinalizeInterviewResult,
} from "@/services/aiService"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TypingDots } from "@/components/atoms/shared/TypingDots"
import {
  CameraIcon, MicIcon, AlertTriangleIcon,
  CheckCircleIcon, ShieldCheckIcon, ClockIcon, ArrowRightIcon,
  InfoIcon, SparklesIcon, MessageSquareIcon, VideoOffIcon, XCircleIcon,
} from "lucide-react"

type InterviewState = "setup" | "prescreen" | "interview" | "finalizing" | "feedback"

const PROCTOR_INTERVAL_MS = 20000
const ANSWER_WINDOW_SECONDS = 120

function captureFrameBase64(video: HTMLVideoElement): string | null {
  if (!video.videoWidth || !video.videoHeight) return null
  const canvas = document.createElement("canvas")
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  ctx.drawImage(video, 0, 0)
  return canvas.toDataURL("image/jpeg", 0.7).split(",")[1] ?? null
}

const MAX_AI_SPEAKING_MS = 9000

/** Level volume mic real-time (0-1) lewat Web Audio API AnalyserNode --
 * dipakai buat kasih sinyal visual "mic kedengeran" pas kandidat ngomong,
 * biar gak nebak-nebak apakah rekamannya beneran nangkep suara atau nggak. */
function useAudioLevel(stream: MediaStream | null, active: boolean): number {
  const [level, setLevel] = React.useState(0)

  React.useEffect(() => {
    if (!stream || !active || stream.getAudioTracks().length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resets meter when recording stops/becomes inactive
      setLevel(0)
      return
    }

    const audioContext = new AudioContext()
    const source = audioContext.createMediaStreamSource(new MediaStream(stream.getAudioTracks()))
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.6
    source.connect(analyser)
    const data = new Uint8Array(analyser.frequencyBinCount)

    let raf = 0
    const tick = () => {
      analyser.getByteFrequencyData(data)
      let sum = 0
      for (let i = 0; i < data.length; i++) sum += data[i]
      setLevel(Math.min(1, sum / data.length / 128))
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      source.disconnect()
      void audioContext.close()
    }
  }, [stream, active])

  return level
}

function AudioLevelMeter({ level, barClassName = "bg-brand-accent" }: { level: number; barClassName?: string }) {
  const bars = [0.2, 0.45, 0.7, 0.45, 0.2]
  return (
    <div className="flex items-end gap-0.5 h-4">
      {bars.map((threshold, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-100 ${level > threshold ? barClassName : "bg-white/20"}`}
          style={{ height: `${8 + threshold * 16}px` }}
        />
      ))}
    </div>
  )
}

/** AI "ngomong" pertanyaan lewat SpeechSynthesis browser (native, gak nambah
 * dependency) -- kalau gak didukung (atau `onend` gak pernah kepanggil,
 * mis. browser tanpa voice yang keinstall), fallback timeout tetap majuin
 * alurnya daripada kandidat nyangkut selamanya di "AI sedang berbicara". */
function speakQuestion(text: string, onDone: () => void): () => void {
  let done = false
  const finish = () => {
    if (done) return
    done = true
    onDone()
  }

  const fallback = setTimeout(finish, MAX_AI_SPEAKING_MS)

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return () => clearTimeout(fallback)
  }
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "id-ID"
  utterance.onend = finish
  utterance.onerror = finish
  window.speechSynthesis.speak(utterance)
  return () => {
    clearTimeout(fallback)
    window.speechSynthesis.cancel()
  }
}

export default function InterviewPage({ params }: { params: Promise<{ jobId: string }> }) {
  const unwrappedParams = React.use(params)
  const { jobs, applications, updateApplication } = useDashboard()
  const router = useRouter()
  const job = jobs.find(j => j.id === unwrappedParams.jobId)
  // Context's `applications` buat role candidate udah di-scope ke kandidat
  // ini doang server-side (lihat GET /v1/applications), jadi cukup match
  // jobId -- gak perlu (dan gak bisa) cocokin ke currentUser.id, soalnya itu
  // user id sedangkan applicantId di sini sebenernya candidate id (beda
  // tabel, beda UUID).
  const application = applications.find((a) => a.jobId === unwrappedParams.jobId)

  const [interviewState, setInterviewState] = React.useState<InterviewState>("setup")
  const [hasAgreed, setHasAgreed] = React.useState(false)
  const [warningCount, setWarningCount] = React.useState(0)
  const [latestWarningReason, setLatestWarningReason] = React.useState("")
  const [showWarningModal, setShowWarningModal] = React.useState(false)

  // --- Kamera & mikrofon wajib buat proctoring, bukan dekorasi ---
  const [mediaStream, setMediaStream] = React.useState<MediaStream | null>(null)
  const [mediaError, setMediaError] = React.useState<string | null>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const requestMedia = React.useCallback(async () => {
    setMediaError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setMediaStream(stream)
    } catch {
      setMediaError("Gagal akses kamera/mikrofon. Interview ini wajib pakai kamera buat verifikasi integritas -- izinkan akses lalu coba lagi.")
    }
  }, [])

  React.useEffect(() => {
    if (videoRef.current && mediaStream) videoRef.current.srcObject = mediaStream
  }, [mediaStream])

  React.useEffect(() => {
    return () => {
      mediaStream?.getTracks().forEach((t) => t.stop())
    }
  }, [mediaStream])

  const raiseWarning = React.useCallback((reason: string) => {
    setWarningCount((c) => c + 1)
    setLatestWarningReason(reason)
    setShowWarningModal(true)
  }, [])

  // --- Pre-screening: 3 pertanyaan singkat sebelum wawancara AI yang lebih
  // mahal -- nyaring pelamar asal apply (lihat gate di backend).
  const [prescreenQuestions, setPrescreenQuestions] = React.useState<string[]>([])
  const [prescreenAnswers, setPrescreenAnswers] = React.useState<string[]>([])
  const [prescreenError, setPrescreenError] = React.useState<string | null>(null)
  const [isSubmittingPrescreen, setIsSubmittingPrescreen] = React.useState(false)
  const [prescreenFailed, setPrescreenFailed] = React.useState(false)

  React.useEffect(() => {
    if (interviewState !== "prescreen" || !application || prescreenQuestions.length > 0 || prescreenError) return
    let cancelled = false
    generatePreScreenQuestions(application.id)
      .then((qs) => {
        if (!cancelled) {
          setPrescreenQuestions(qs)
          setPrescreenAnswers(new Array(qs.length).fill(""))
        }
      })
      .catch(() => { if (!cancelled) setPrescreenError("Gagal menyiapkan pertanyaan screening awal. Coba lagi ya.") })
    return () => { cancelled = true }
  }, [interviewState, application, prescreenQuestions.length, prescreenError])

  const submitPrescreenAnswers = async () => {
    if (!application) return
    setIsSubmittingPrescreen(true)
    setPrescreenError(null)
    try {
      const responses = prescreenQuestions.map((question, i) => ({ question, answer: prescreenAnswers[i] ?? "" }))
      const result = await submitPreScreen(application.id, responses)
      if (result.passed) {
        setInterviewState("interview")
      } else {
        setPrescreenFailed(true)
      }
    } catch {
      setPrescreenError("Gagal ngirim jawaban screening awal. Coba lagi ya.")
    } finally {
      setIsSubmittingPrescreen(false)
    }
  }

  // --- Pertanyaan digenerate AI (bukan hardcoded) ---
  const [questions, setQuestions] = React.useState<string[]>([])
  const [questionsError, setQuestionsError] = React.useState<string | null>(null)
  const [questionIndex, setQuestionIndex] = React.useState(0)
  const [isAiSpeaking, setIsAiSpeaking] = React.useState(true)
  const [isRecording, setIsRecording] = React.useState(false)
  const [isTranscribing, setIsTranscribing] = React.useState(false)
  const [timeLeft, setTimeLeft] = React.useState(ANSWER_WINDOW_SECONDS)

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const audioChunksRef = React.useRef<Blob[]>([])
  const audioLevel = useAudioLevel(mediaStream, isRecording)

  const [finalScore, setFinalScore] = React.useState<FinalizeInterviewResult | null>(null)

  React.useEffect(() => {
    if (interviewState !== "interview" || !application || questions.length > 0 || questionsError) return
    let cancelled = false
    generateInterviewQuestions(application.id)
      .then((qs) => { if (!cancelled) setQuestions(qs) })
      .catch(() => { if (!cancelled) setQuestionsError("Gagal menyiapkan pertanyaan wawancara. Coba lagi ya.") })
    return () => { cancelled = true }
  }, [interviewState, application, questions.length, questionsError])

  const startRecording = React.useCallback(() => {
    if (!mediaStream) return
    const audioOnly = new MediaStream(mediaStream.getAudioTracks())
    const mimeType = typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : ""
    const recorder = mimeType ? new MediaRecorder(audioOnly, { mimeType }) : new MediaRecorder(audioOnly)
    audioChunksRef.current = []
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data)
    }
    recorder.start()
    mediaRecorderRef.current = recorder
    setIsRecording(true)
  }, [mediaStream])

  // Tiap ganti pertanyaan: AI "ngomong" pertanyaannya, abis itu baru giliran
  // kandidat jawab & rekaman mulai.
  React.useEffect(() => {
    if (interviewState !== "interview" || questions.length === 0 || questionIndex >= questions.length) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- (re)starts the AI-speaking phase for each new question
    setIsAiSpeaking(true)
    setTimeLeft(ANSWER_WINDOW_SECONDS)
    const cancelSpeech = speakQuestion(questions[questionIndex], () => {
      setIsAiSpeaking(false)
      startRecording()
    })
    return cancelSpeech
  }, [interviewState, questionIndex, questions, startRecording])

  const stopRecordingAndSubmit = React.useCallback(async () => {
    const recorder = mediaRecorderRef.current
    if (!recorder || recorder.state === "inactive" || !application) return
    setIsRecording(false)

    const blob: Blob = await new Promise((resolve) => {
      recorder.onstop = () => resolve(new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" }))
      recorder.stop()
    })

    setIsTranscribing(true)
    try {
      const { uploadUrl, objectKey } = await getAudioUploadUrl(application.id, questionIndex)
      await fetch(uploadUrl, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": blob.type || "application/octet-stream" },
      })
      await transcribeAnswer(application.id, objectKey, questionIndex, questions[questionIndex])
    } catch (err) {
      console.error("[interview] gagal transkrip jawaban:", err)
    } finally {
      setIsTranscribing(false)
    }

    if (questionIndex >= questions.length - 1) {
      setInterviewState("finalizing")
    } else {
      setQuestionIndex((i) => i + 1)
    }
  }, [application, questionIndex, questions])

  // Auto-stop begitu waktu jawab habis.
  React.useEffect(() => {
    if (interviewState !== "interview" || isAiSpeaking || !isRecording) return
    if (timeLeft <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- countdown timer expiry auto-submits the current answer
      void stopRecordingAndSubmit()
      return
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [interviewState, isAiSpeaking, isRecording, timeLeft, stopRecordingAndSubmit])

  // Proctoring: cek frame kamera tiap 20 detik selama sesi interview
  // berlangsung -- bukan simulasi, ini beneran manggil Gemini vision lewat
  // backend buat deteksi wajah gak ada / lebih dari satu orang / dll.
  React.useEffect(() => {
    if (interviewState !== "interview" || !application) return
    const interval = setInterval(() => {
      const video = videoRef.current
      if (!video) return
      const frame = captureFrameBase64(video)
      if (!frame) return
      proctorCheck(application.id, frame)
        .then((result) => {
          if (result.flagged) raiseWarning(result.reason ?? "Terdeteksi potensi kecurangan lewat kamera")
        })
        .catch((err) => console.error("[interview] proctor-check gagal:", err))
    }, PROCTOR_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [interviewState, application, raiseWarning])

  // Tab-blur / keluar halaman -- sinyal integritas tambahan di luar kamera.
  React.useEffect(() => {
    if (interviewState !== "interview") return
    const handleVisibilityChange = () => {
      if (document.hidden) raiseWarning("Kamu terdeteksi keluar dari halaman wawancara")
    }
    const handleBlur = () => raiseWarning("Kamu terdeteksi berpindah ke jendela/aplikasi lain")

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleBlur)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleBlur)
    }
  }, [interviewState, raiseWarning])

  // Finalisasi: nilai semua jawaban, pindahin status lamaran, lalu pindah ke
  // layar feedback -- satu-satunya titik penyelesaian wawancara nyampe ke
  // backend (bandingannya: dulu cuma flip status doang, sekarang beneran
  // dinilai AI juga).
  React.useEffect(() => {
    if (interviewState !== "finalizing" || !application) return
    let cancelled = false
    finalizeInterview(application.id)
      .then((result) => {
        if (cancelled) return
        setFinalScore(result)
        updateApplication(application.id, { status: "under-review" })
        setInterviewState("feedback")
      })
      .catch((err) => {
        console.error("[interview] gagal finalisasi wawancara:", err)
        if (!cancelled) setInterviewState("feedback")
      })
    return () => { cancelled = true }
  }, [interviewState, application, updateApplication])

  if (!job) return <div className="flex h-screen items-center justify-center">Pekerjaan tidak ditemukan.</div>
  if (!application) {
    return (
      <div className="flex h-screen items-center justify-center text-center px-6">
        <div className="space-y-2">
          <p className="text-lg font-semibold">Lamaran belum ditemukan.</p>
          <p className="text-sm text-muted-foreground">Kirim lamaranmu dulu sebelum mulai wawancara AI.</p>
        </div>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const totalQuestions = questions.length
  const readyToStart = hasAgreed && mediaStream !== null

  const renderSetup = () => (
    <div className="flex flex-col h-screen max-w-5xl mx-auto p-6 md:p-12 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Persiapan Wawancara AI</h1>
        <p className="text-muted-foreground mt-2">Posisi: {job.title} di {job.company}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 flex-1">
        <div className="space-y-6">
          <div className="bg-muted aspect-video rounded-2xl overflow-hidden relative border border-border">
            {mediaStream ? (
              <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-black/90 gap-3 px-6 text-center">
                <CameraIcon className="size-12 opacity-50" />
                <p>{mediaError ? mediaError : "Kamera & mikrofon wajib diaktifkan buat mulai wawancara"}</p>
                <Button size="sm" onClick={requestMedia}>
                  {mediaError ? "Coba Lagi" : "Aktifkan Kamera & Mikrofon"}
                </Button>
              </div>
            )}
            {mediaStream && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs">
                <MicIcon className="size-3 text-success" /> Audio Terdeteksi
              </div>
            )}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-4">
            <ShieldCheckIcon className="size-6 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-primary">Integritas & Privasi</h4>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Kamera kamu wajib nyala selama sesi berlangsung -- sistem bakal ngecek frame kamera secara berkala buat verifikasi cuma kamu sendiri yang ikut wawancara. Jawabanmu direkam lewat mikrofon dan ditranskrip AI.
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
                <CameraIcon className="size-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm">Kamera wajib nyala sepanjang sesi. Pastikan cuma Anda sendiri yang terlihat di frame.</p>
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
            disabled={!readyToStart}
            onClick={() => setInterviewState("prescreen")}
          >
            Mulai Wawancara Sekarang
          </Button>
        </div>
      </div>
    </div>
  )

  const renderLoadingScreen = (title: string) => (
    <div className="flex flex-col h-screen items-center justify-center bg-black text-white gap-4">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/20 ring-8 ring-primary/10 animate-pulse">
        <SparklesIcon className="size-8 text-primary" />
      </div>
      <p className="text-lg font-medium">{title}</p>
    </div>
  )

  const renderPrescreen = () => {
    if (prescreenFailed) {
      return (
        <div className="flex flex-col h-screen items-center justify-center px-6 text-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <XCircleIcon className="size-8 text-muted-foreground" />
          </div>
          <div className="max-w-md space-y-2">
            <h1 className="text-xl font-bold">Screening awal belum lolos ambang minimum</h1>
            <p className="text-muted-foreground">
              Tim HRD tetap akan meninjau lamaranmu secara manual. Ini bukan penolakan otomatis --
              keputusan akhir tetap di tangan HRD.
            </p>
          </div>
          <Button size="lg" onClick={() => router.push("/candidate")}>Kembali ke Beranda Dashboard</Button>
        </div>
      )
    }

    if (prescreenQuestions.length === 0 && !prescreenError) {
      return (
        <div className="flex flex-col h-screen items-center justify-center gap-4">
          <TypingDots />
          <p className="text-muted-foreground">Menyiapkan pertanyaan screening awal...</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col h-screen max-w-2xl mx-auto p-6 md:p-12 animate-in fade-in duration-500 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Screening Awal</h1>
          <p className="text-muted-foreground mt-2">
            Jawab {prescreenQuestions.length} pertanyaan singkat ini dulu sebelum masuk ke wawancara AI.
          </p>
        </div>

        <div className="flex-1 space-y-6">
          {prescreenQuestions.map((question, i) => (
            <div key={i} className="space-y-2">
              <label className="text-sm font-medium">{i + 1}. {question}</label>
              <textarea
                className="w-full rounded-xl border bg-background p-3 text-sm min-h-24 focus:outline-none focus:ring-2 focus:ring-primary"
                value={prescreenAnswers[i] ?? ""}
                onChange={(e) => {
                  const next = [...prescreenAnswers]
                  next[i] = e.target.value
                  setPrescreenAnswers(next)
                }}
                placeholder="Tulis jawabanmu di sini..."
              />
            </div>
          ))}
        </div>

        {prescreenError && <p className="text-sm text-destructive mt-4">{prescreenError}</p>}

        <Button
          size="lg"
          className="w-full mt-8 py-6 text-base font-bold shadow-lg"
          disabled={isSubmittingPrescreen || prescreenAnswers.some((a) => !a.trim())}
          onClick={() => void submitPrescreenAnswers()}
        >
          {isSubmittingPrescreen ? "Mengirim..." : "Kirim & Lanjut ke Wawancara"}
        </Button>
      </div>
    )
  }

  const renderInterview = () => {
    if (questionsError) {
      return (
        <div className="flex flex-col h-screen items-center justify-center bg-black text-white gap-4 px-6 text-center">
          <AlertTriangleIcon className="size-10 text-destructive" />
          <p className="text-lg font-medium">{questionsError}</p>
          <Button onClick={() => setQuestionsError(null)}>Coba Lagi</Button>
        </div>
      )
    }
    if (questions.length === 0) return renderLoadingScreen("AI sedang menyiapkan pertanyaan wawancara...")
    if (isTranscribing) return renderLoadingScreen("Mentranskrip jawabanmu...")

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
                <p className="text-white/60 mt-2">{latestWarningReason}. Peringatan ke-{warningCount}.</p>
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
              Pertanyaan {questionIndex + 1} / {totalQuestions}
            </Badge>
            {isAiSpeaking ? (
              <span className="flex items-center gap-2 text-primary font-medium text-sm animate-pulse">
                <MessageSquareIcon className="size-4" /> AI sedang berbicara...
              </span>
            ) : (
              <span className="flex items-center gap-2 text-success font-medium text-sm">
                <MicIcon className="size-4" /> Giliran Anda berbicara...
                <AudioLevelMeter level={audioLevel} barClassName="bg-success" />
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
              className={`flex size-40 items-center justify-center rounded-full bg-primary/20 ring-8 ring-primary/10 transition-all duration-1000 ${isAiSpeaking ? "scale-100 opacity-100" : "scale-90 opacity-50"}`}
            >
              <SparklesIcon className="size-16 text-primary" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>

          <div className="absolute bottom-32 w-full max-w-4xl mx-auto px-6 text-center z-10">
            <p className="text-2xl md:text-3xl font-medium leading-relaxed tracking-wide text-white drop-shadow-lg shadow-black">
              &ldquo;{questions[questionIndex]}&rdquo;
            </p>
          </div>

          <div className={`absolute bottom-8 right-8 w-48 md:w-64 aspect-video bg-black/90 rounded-xl overflow-hidden border-2 shadow-2xl transition-all duration-500 ${isAiSpeaking ? 'border-white/20 scale-95' : 'border-brand-accent scale-100'}`}>
            {mediaStream ? (
              <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-white/50">
                <VideoOffIcon className="size-8" />
              </div>
            )}
            {isRecording && (
              <>
                <div className="absolute top-2 right-2 bg-brand-accent text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                  <div className="size-1.5 bg-white rounded-full"></div> Rec
                </div>
                <div className="absolute bottom-2 left-2 bg-black/60 rounded-md px-1.5 py-1">
                  <AudioLevelMeter level={audioLevel} />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 w-full p-6 flex justify-center items-center z-10 bg-gradient-to-t from-black/90 to-transparent">
          {isRecording && (
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 rounded-full px-8 font-semibold shadow-2xl"
              onClick={() => void stopRecordingAndSubmit()}
            >
              Selesai Menjawab <ArrowRightIcon className="ml-2 size-4" />
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
          <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto">
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
                <h3 className="font-semibold text-xl">Hasil Wawancara AI</h3>
              </div>

              <div className="space-y-4">
                {finalScore?.recommendationScore != null ? (
                  <div className="rounded-2xl border p-4 flex items-center justify-between">
                    <span className="text-sm font-medium">Skor Rekomendasi AI</span>
                    <span className="text-2xl font-bold text-primary tabular-nums">{Math.round(finalScore.recommendationScore)}</span>
                  </div>
                ) : (
                  <div className="rounded-2xl border p-4 text-sm text-muted-foreground">
                    Jawabanmu udah tersimpan, tim HRD akan meninjau hasilnya.
                  </div>
                )}

                {warningCount > 0 && (
                  <div className="rounded-2xl border border-warning/30 bg-warning/5 p-4 text-sm leading-relaxed flex gap-3">
                    <AlertTriangleIcon className="size-5 text-warning shrink-0 mt-0.5" />
                    <span>Sistem proctoring mencatat {warningCount} peringatan integritas selama sesi ini. Ini akan ditinjau bersama hasil wawancaramu oleh tim HRD.</span>
                  </div>
                )}

                <p className="text-xs text-muted-foreground italic mt-4">
                  *Catatan: Skor ini bersifat rekomendasi buat tim HRD, bukan keputusan final. Keputusan akhir mutlak berada di tangan tim HRD perusahaan.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-xl border-b pb-4 mb-6 flex items-center gap-2">
                <InfoIcon className="size-5 text-muted-foreground" /> Status Lamaran Anda
              </h3>

              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border">

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <CheckCircleIcon className="size-4" />
                  </div>
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border bg-card shadow-sm">
                    <h4 className="font-semibold text-sm">Lamaran Dikirim</h4>
                    <p className="text-xs text-muted-foreground mt-1">CV dan profil berhasil masuk ke sistem.</p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
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
      {interviewState === "prescreen" && renderPrescreen()}
      {interviewState === "interview" && renderInterview()}
      {interviewState === "finalizing" && renderLoadingScreen("Menilai hasil wawancaramu...")}
      {interviewState === "feedback" && renderFeedback()}
    </>
  )
}
