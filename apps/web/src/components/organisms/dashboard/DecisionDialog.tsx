"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Calendar, Clock, AlertCircle, Send, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Candidate } from "@/components/organisms/dashboard/CandidateDataTable"
import { useDashboard } from "@/context/DashboardContext"
import { toast } from "sonner"

interface DecisionDialogProps {
  candidate: Candidate
  decision: "invite" | "reject"
  trigger?: React.ReactNode
}

export function DecisionDialog({ candidate, decision, trigger }: DecisionDialogProps) {
  const { updateApplication } = useDashboard()
  const [open, setOpen] = useState(false)

  const getPersonalFeedback = () => {
    const score = candidate.recommendationScore || 0
    const title = (candidate.jobTitle || "").toLowerCase()

    let areaKembangkan = ""
    if (title.includes("marketing")) {
      areaKembangkan = "manajemen kampanye tingkat lanjut, analitik pemasaran berbasis data (Google Analytics/Meta Ads), dan kemampuan copywriting B2B"
    } else if (title.includes("design") || title.includes("ui") || title.includes("ux")) {
      areaKembangkan = "riset pengguna yang lebih mendalam, kemampuan prototipe tingkat lanjut (Figma Advanced), dan kolaborasi lintas-fungsi dengan tim engineering"
    } else if (title.includes("developer") || title.includes("engineer") || title.includes("backend") || title.includes("frontend")) {
      areaKembangkan = "penguasaan arsitektur sistem skala besar, pengujian otomatis (unit & integration testing), dan praktik DevOps/CI-CD"
    } else if (title.includes("keuangan") || title.includes("finance") || title.includes("akuntansi")) {
      areaKembangkan = "analisis laporan keuangan lanjutan, penguasaan ERP (SAP/Oracle), dan manajemen risiko keuangan"
    } else {
      areaKembangkan = "pengalaman langsung di lapangan yang lebih relevan, kemampuan analitis, dan rekam jejak proyek yang terdokumentasi dengan baik"
    }

    const scoreLabel = score >= 75 ? "Memenuhi Syarat" : score >= 55 ? "Perlu Dikembangkan" : "Tidak Sesuai"

    return `Kepada ${candidate.applicantName},

Terima kasih telah meluangkan waktu dan kepercayaan Anda untuk melamar posisi ${candidate.jobTitle} di perusahaan kami.

Setelah melalui evaluasi yang cermat terhadap profil keahlian dan rekaman wawancara Anda, kami telah memutuskan untuk melanjutkan proses dengan kandidat lain yang kualifikasinya lebih dekat dengan kebutuhan spesifik posisi ini saat ini.

Profil Keahlian Anda berdasarkan evaluasi AI: ${scoreLabel}

Area yang direkomendasikan untuk terus dikembangkan: ${areaKembangkan}.

Kami percaya bahwa dengan pengembangan di area tersebut, Anda akan menjadi kandidat yang sangat kompetitif di masa mendatang. Jangan ragu untuk melamar kembali pada posisi-posisi yang sesuai dengan perkembangan Anda.

Tetap semangat dan terus berkembang. Kami mendukung perjalanan karir Anda.

Hormat kami,
Tim Rekrutmen`
  }

  const defaultInviteSubject = `Undangan Wawancara — ${candidate.jobTitle}`
  const defaultRejectSubject = `Pembaruan Status Lamaran — ${candidate.jobTitle}`
  const defaultInviteBody = `Kepada ${candidate.applicantName},\n\nKami dengan senang hati memberitahukan bahwa lamaran Anda untuk posisi ${candidate.jobTitle} telah ditinjau dan kami ingin mengundang Anda untuk mengikuti sesi wawancara.\n\nMohon informasikan ketersediaan waktu Anda dalam minggu ini.\n\nKami menantikan pertemuan dengan Anda.\n\nHormat kami,\nTim HRD`

  const [emailSubject, setEmailSubject] = useState(
    decision === "invite" ? defaultInviteSubject : defaultRejectSubject
  )
  const [emailBody, setEmailBody] = useState(
    decision === "invite" ? defaultInviteBody : getPersonalFeedback()
  )
  const [interviewDate, setInterviewDate] = useState("")
  const [interviewTime, setInterviewTime] = useState("")
  const [interviewType, setInterviewType] = useState<"Wawancara Teknis" | "Wawancara HRD">("Wawancara HRD")
  const [isSending, setIsSending] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    if (open) {
      setEmailSubject(decision === "invite" ? defaultInviteSubject : defaultRejectSubject)
      setEmailBody(decision === "invite" ? defaultInviteBody : getPersonalFeedback())
      setShowConfirmation(false)
      setIsSending(false)
    }
  }, [open, decision, candidate])

  const handleSend = () => {
    if (decision === "invite" && (!interviewDate || !interviewTime)) {
      toast.error("Harap isi tanggal dan waktu wawancara.")
      return
    }

    setIsSending(true)

    setTimeout(() => {
      updateApplication(candidate.id, {
        status: decision === "invite" ? "interview" : "rejected"
      })
      
      setIsSending(false)
      setShowConfirmation(true)

      setTimeout(() => {
        setOpen(false)
      }, 2500)
    }, 1500)
  }

  const scoreInfo = React.useMemo(() => {
    const score = candidate.recommendationScore || 0;
    if (score >= 75) return { label: 'Memenuhi Syarat', variant: 'default' as const, color: 'text-success bg-success/10' }
    if (score >= 55) return { label: 'Perlu Dikembangkan', variant: 'secondary' as const, color: 'text-warning bg-warning/10' }
    return { label: 'Tidak Sesuai', variant: 'destructive' as const, color: 'text-destructive bg-destructive/10' }
  }, [candidate.recommendationScore])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger ? (trigger as React.ReactElement) : <Button variant={decision === "invite" ? "default" : "destructive"}>
        {decision === "invite" ? "Jadwalkan Wawancara" : "Tolak Kandidat"}
      </Button>} />
      
      <DialogContent className="sm:max-w-[900px] gap-0 p-0 overflow-hidden">
        {showConfirmation ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <DialogTitle className="text-2xl mb-2">Notifikasi Terkirim</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              {candidate.applicantName} telah menerima pemberitahuan melalui email.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader className="p-6 pb-4 border-b">
              <DialogTitle className="text-xl">
                {decision === "invite" ? "Undang ke Wawancara" : "Tolak Lamaran"}
              </DialogTitle>
              <DialogDescription>
                {decision === "invite"
                  ? "Siapkan dan kirimkan undangan wawancara kepada kandidat."
                  : "Kirimkan pemberitahuan penolakan yang bermartabat dan berbasis data profil kandidat."}
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-6">
              {decision === "reject" && (
                <Alert className="bg-warning/5 border-warning/20">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <AlertTitle className="text-warning font-semibold">Feedback Bermartabat</AlertTitle>
                  <AlertDescription className="text-warning/90 mt-1">
                    Email penolakan ini telah diisi secara otomatis oleh AI berdasarkan profil keahlian dan hasil wawancara kandidat, sehingga bersifat personal dan berbasis data — bukan pemberitahuan generik.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                
                <div className="space-y-6">
                  
                  <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kandidat</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {candidate.applicantName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{candidate.applicantName}</p>
                        <p className="text-xs text-muted-foreground">{candidate.jobTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-xs font-medium text-muted-foreground uppercase">Kecocokan AI</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-md ${scoreInfo.color}`}>
                        {scoreInfo.label} ({candidate.recommendationScore}%)
                      </span>
                    </div>
                  </div>

                  {decision === "invite" && (
                    <div className="border rounded-lg p-4 space-y-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Detail Wawancara</h4>
                      
                      <div className="space-y-2">
                        <Label>Jenis Wawancara</Label>
                        <Select value={interviewType} onValueChange={(val: any) => val && setInterviewType(val)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Pilih Jenis" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Wawancara HRD">Wawancara HRD</SelectItem>
                            <SelectItem value="Wawancara Teknis">Wawancara Teknis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Tanggal</Label>
                          <Input 
                            type="date" 
                            value={interviewDate} 
                            onChange={(e) => setInterviewDate(e.target.value)} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Waktu</Label>
                          <Input 
                            type="time" 
                            value={interviewTime} 
                            onChange={(e) => setInterviewTime(e.target.value)} 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pratinjau Email</h4>
                    <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                      <AlertCircle className="w-3 h-3" />
                      Dikirim via Direkrut AI (Reply-to HRD)
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Subjek</Label>
                    <Input 
                      value={emailSubject} 
                      onChange={(e) => setEmailSubject(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Pesan</Label>
                    <Textarea 
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="min-h-[250px] resize-y"
                    />
                  </div>

                  {decision === "invite" && interviewDate && interviewTime && (
                    <div className="bg-muted/50 p-3 rounded-md text-xs space-y-1 mt-2">
                      <p className="font-semibold mb-2">Ringkasan Undangan:</p>
                      <p><span className="text-muted-foreground">Jenis:</span> {interviewType}</p>
                      <p><span className="text-muted-foreground">Tanggal:</span> {new Date(interviewDate).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p><span className="text-muted-foreground">Waktu:</span> {interviewTime} WIB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="p-4 border-t bg-muted/10">
              <DialogClose render={<Button variant="outline" disabled={isSending}>Batal</Button>} />
              <Button 
                onClick={handleSend} 
                disabled={isSending}
                variant={decision === "invite" ? "default" : "destructive"}
                className="gap-2 min-w-[120px]"
              >
                {isSending ? (
                  <>Mengirim...</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {decision === "invite" ? "Kirim Undangan" : "Kirim Penolakan"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
