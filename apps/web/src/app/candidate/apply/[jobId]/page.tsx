"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeftIcon, ArrowRightIcon, BriefcaseIcon, CheckCircleIcon,
  FileTextIcon, SendIcon, VideoIcon,
} from "lucide-react"
import { useDashboard } from "@/context/DashboardContext"
import { useApp } from "@/context/AppContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplyStep1 } from "@/components/molecules/dashboard/ApplyStep1"
import { ApplyStep2 } from "@/components/molecules/dashboard/ApplyStep2"

const STEP_LABELS = ["Data Diri", "Unggah CV", "Tinjauan"]
const STEP_TITLES = ["Informasi Pribadi", "Dokumen Resume / CV", "Tinjauan Akhir"]
const STEP_DESCS = [
  "Pastikan datanya sesuai sama identitas kamu ya.",
  "Format yang diterima: PDF, DOCX maksimal 5MB.",
  "Cek sekali lagi sebelum lamaranmu meluncur.",
]

export default function ApplyJobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const unwrappedParams = React.use(params)
  const { jobs, addApplication, isProfileComplete } = useDashboard()
  const { currentUser } = useApp()
  const router = useRouter()

  const job = jobs.find((j) => j.id === unwrappedParams.jobId)
  const [step, setStep] = React.useState(1)
  const [formData, setFormData] = React.useState({
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    phone: "",
    linkedin: "",
    portfolio: "",
  })
  const [file, setFile] = React.useState<File | null>(null)
  const [isParsing, setIsParsing] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (isProfileComplete && step === 1) setStep(3)
  }, [isProfileComplete, step])

  if (!job) return <div className="p-8 text-center">Pekerjaan tidak ditemukan</div>

  const handleNext = () => { if (step < 3) setStep(step + 1) }
  const handleBack = () => { if (step > 1) setStep(step - 1); else router.back() }

  const handleUpload = () => {
    setIsParsing(true)
    setTimeout(() => {
      setFile(new File([""], "CV_Kandidat.pdf", { type: "application/pdf" }))
      setIsParsing(false)
    }, 1500)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      addApplication({
        id: `APP-${Math.floor(Math.random() * 10000)}`,
        applicantId: "user-1",
        applicantName: formData.name,
        jobId: job.id,
        jobTitle: job.title,
        status: "under-review",
        appliedDate: new Date().toISOString().split("T")[0],
        validationStatus: "completed",
        recommendationScore: 88,
        email: formData.email,
        phone: formData.phone,
      })
      setIsSubmitting(false)
      setStep(4)
    }, 1500)
  }

  if (step === 4) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-12 w-full flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto animate-in zoom-in spin-in-12 duration-700">
            <CheckCircleIcon className="size-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Lamaran Terkirim!</h2>
            <p className="text-muted-foreground">Lamaranmu udah terkirim buat posisi <strong>{job.title}</strong> di <strong>{job.company}</strong>.</p>
          </div>
          <div className="rounded-2xl border p-6 text-left space-y-4 mt-8">
            <div className="flex items-center gap-3 text-primary">
              <VideoIcon className="size-6" />
              <h3 className="font-semibold text-lg">Tahap Selanjutnya: Wawancara AI</h3>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Tahap awalnya wawancara video sama AI. Cari tempat yang terang dan tenang ya.
            </p>
            <Button className="w-full gap-2 font-semibold text-base py-6" onClick={() => router.push(`/interview/${job.id}`)}>
              Mulai Wawancara AI Sekarang <ArrowRightIcon className="size-5" />
            </Button>
          </div>
          <Button variant="ghost" className="w-full mt-4" onClick={() => router.push("/candidate")}>Kembali ke Beranda</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-6 w-full max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <BriefcaseIcon className="size-4" />
          <span className="text-sm font-medium">{job.company}</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Melamar untuk {job.title}</h2>
        <div className="flex items-center gap-4 mt-3">
          <Badge variant="secondary" className="font-normal">{job.location}</Badge>
          <Badge variant="secondary" className="font-normal">{job.type}</Badge>
          <Badge variant="outline" className="font-normal border-primary/30 text-primary bg-primary/5">{job.salaryRange}</Badge>
        </div>
      </div>

      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }} />
        </div>
        {STEP_LABELS.map((label, idx) => {
          const num = idx + 1
          const isActive = step === num
          const isPast = step > num
          return (
            <div key={num} className="relative flex flex-col items-center gap-2 bg-background px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isActive ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : isPast ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {isPast ? <CheckCircleIcon className="size-4" /> : num}
              </div>
              <span className={`text-xs font-medium absolute -bottom-6 whitespace-nowrap ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
            </div>
          )
        })}
      </div>

      <div className="pt-8">
        <Card>
          <CardHeader>
            <CardTitle>{STEP_TITLES[step - 1]}</CardTitle>
            <CardDescription>{STEP_DESCS[step - 1]}</CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && <ApplyStep1 formData={formData} onChange={(p) => setFormData({ ...formData, ...p })} />}
            {step === 2 && <ApplyStep2 file={file} isParsing={isParsing} jobTitle={job.title} onUpload={handleUpload} onRemove={() => setFile(null)} />}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {isProfileComplete && (
                  <div className="rounded-2xl border p-4 flex items-start gap-3 mb-6 text-primary">
                    <CheckCircleIcon className="size-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Data Diambil dari Profil Kamu</p>
                      <p className="text-xs opacity-90 mt-1">Profilmu udah lengkap, jadi tinggal tinjau sebentar terus kirim deh.</p>
                    </div>
                  </div>
                )}
                <div className="bg-muted p-6 rounded-xl space-y-6">
                  <h3 className="font-semibold text-lg border-b pb-2">Tinjauan Lamaran</h3>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div className="text-muted-foreground">Posisi:</div>
                    <div className="font-medium text-right">{job.title} di {job.company}</div>
                    <div className="text-muted-foreground">Nama Lengkap:</div>
                    <div className="font-medium text-right">{formData.name}</div>
                    <div className="text-muted-foreground">Email:</div>
                    <div className="font-medium text-right">{formData.email}</div>
                    <div className="text-muted-foreground">Dokumen CV:</div>
                    <div className="font-medium text-right flex items-center justify-end gap-1">
                      <FileTextIcon className="size-4" /> Profil & CV Tersimpan
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center px-4">
                  Dengan menekan tombol kirim, kamu menyetujui bahwa semua data yang kamu isi benar dan siap diproses sistem Direkrut AI.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/20 p-6">
            <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
              <ArrowLeftIcon className="mr-2 size-4" /> {step === 1 ? "Batal" : "Kembali"}
            </Button>
            {step < 3 ? (
              <Button onClick={handleNext}>Selanjutnya <ArrowRightIcon className="ml-2 size-4" /></Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" /> Memproses...</>
                ) : (
                  <><SendIcon className="mr-2 size-4" /> Kirim Lamaran</>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
