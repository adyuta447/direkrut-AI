"use client"

import * as React from "react"
import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { useDashboard } from "@/context/DashboardContext"
import { Candidate } from "@/components/molecules/dashboard/CandidateTableTypes"
import { NoticeDialog } from "@/components/molecules/dashboard/NoticeDialog"
import { DecisionDialogConfirmation } from "@/components/molecules/dashboard/DecisionDialogConfirmation"
import {
  CandidateInfoPanel,
  InterviewDetailPanel,
  EmailPreviewPanel,
  RejectAlert,
} from "@/components/molecules/dashboard/DecisionDialogForm"
import {
  getPersonalFeedback,
  getDefaultInviteSubject,
  getDefaultRejectSubject,
  getDefaultInviteBody,
  getDefaultAcceptSubject,
  getDefaultAcceptBody,
} from "@/components/molecules/dashboard/DecisionDialogFeedback"

interface DecisionDialogProps {
  candidate: Candidate
  decision: "invite" | "accept" | "reject"
  trigger?: React.ReactNode
}

const STATUS_BY_DECISION = {
  invite: "interview",
  accept: "accepted",
  reject: "rejected",
} as const

export function DecisionDialog({ candidate, decision, trigger }: DecisionDialogProps) {
  const { changeApplicationStatus } = useDashboard()
  const [open, setOpen] = useState(false)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [interviewDate, setInterviewDate] = useState("")
  const [interviewTime, setInterviewTime] = useState("")
  const [interviewType, setInterviewType] = useState<"Wawancara Teknis" | "Wawancara HRD">(
    "Wawancara HRD"
  )
  const [isSending, setIsSending] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)

  const scoreInfo = React.useMemo(() => {
    const score = candidate.recommendationScore || 0
    if (score >= 75) return { label: "Memenuhi Syarat", variant: "default" as const, color: "text-success bg-success/10" }
    if (score >= 55) return { label: "Perlu Dikembangkan", variant: "secondary" as const, color: "text-warning bg-warning/10" }
    return { label: "Tidak Sesuai", variant: "destructive" as const, color: "text-destructive bg-destructive/10" }
  }, [candidate.recommendationScore])

  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setEmailSubject(
        decision === "invite"
          ? getDefaultInviteSubject(candidate.jobTitle)
          : decision === "accept"
            ? getDefaultAcceptSubject(candidate.jobTitle)
            : getDefaultRejectSubject(candidate.jobTitle)
      )
      setEmailBody(
        decision === "invite"
          ? getDefaultInviteBody(candidate.applicantName, candidate.jobTitle)
          : decision === "accept"
            ? getDefaultAcceptBody(candidate.applicantName, candidate.jobTitle)
            : getPersonalFeedback(candidate)
      )
      setShowConfirmation(false)
      setIsSending(false)
    }
  }

  const handleSend = async () => {
    if (decision === "invite" && (!interviewDate || !interviewTime)) {
      setWarning("Tanggal & waktu wawancara wajib diisi dulu ya")
      return
    }
    setIsSending(true)
    try {
      const interviewScheduledAt =
        decision === "invite" && interviewDate && interviewTime
          ? new Date(`${interviewDate}T${interviewTime}`).toISOString()
          : undefined
      await changeApplicationStatus(
        candidate.id,
        STATUS_BY_DECISION[decision],
        emailBody,
        { subject: emailSubject, body: emailBody },
        interviewScheduledAt,
      )
      setShowConfirmation(true)
      setTimeout(() => setOpen(false), 2500)
    } catch (err) {
      setWarning(err instanceof Error ? err.message : "Gagal ngirim keputusan, coba lagi ya")
    } finally {
      setIsSending(false)
    }
  }

  const defaultTrigger = (
    <Button variant={decision === "reject" ? "destructive" : "default"}>
      {decision === "invite" ? "Jadwalkan Wawancara" : decision === "accept" ? "Terima Kandidat" : "Tolak Kandidat"}
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <NoticeDialog
        message={warning}
        image="/status/warning.svg"
        onClose={() => setWarning(null)}
      />
      <DialogTrigger render={(trigger ?? defaultTrigger) as React.ReactElement} />
      <DialogContent className="gap-0 p-0 overflow-hidden">
        {showConfirmation ? (
          <DecisionDialogConfirmation applicantName={candidate.applicantName} />
        ) : (
          <>
            <DialogHeader className="p-6 pb-4 border-b">
              <DialogTitle>
                {decision === "invite" ? "Undang ke Wawancara" : decision === "accept" ? "Terima Kandidat" : "Tolak Lamaran"}
              </DialogTitle>
              <DialogDescription>
                {decision === "invite"
                  ? "Siapin undangan wawancaranya, tinggal kirim ke kandidat."
                  : decision === "accept"
                    ? "Kirim kabar baik ke kandidat kalau dia diterima buat posisi ini."
                    : "Kirim kabar penolakan yang tetap sopan dan berbasis data profil kandidat."}
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-6">
              {decision === "reject" && <RejectAlert />}
              <div className="grid gap-6">
                <div className="space-y-6">
                  <CandidateInfoPanel candidate={candidate} scoreInfo={scoreInfo} />
                  {decision === "invite" && (
                    <InterviewDetailPanel
                      interviewType={interviewType}
                      interviewDate={interviewDate}
                      interviewTime={interviewTime}
                      onTypeChange={setInterviewType}
                      onDateChange={setInterviewDate}
                      onTimeChange={setInterviewTime}
                    />
                  )}
                </div>
                <EmailPreviewPanel
                  emailSubject={emailSubject}
                  emailBody={emailBody}
                  onSubjectChange={setEmailSubject}
                  onBodyChange={setEmailBody}
                  decision={decision}
                  interviewType={interviewType}
                  interviewDate={interviewDate}
                  interviewTime={interviewTime}
                />
              </div>
            </div>
            <DialogFooter className="p-4 border-t bg-muted/10">
              <DialogClose render={<Button variant="outline" disabled={isSending}>Batal</Button>} />
              <Button
                onClick={handleSend}
                disabled={isSending}
                variant={decision === "reject" ? "destructive" : "default"}
                className={decision === "accept" ? "gap-2 min-w-[120px] bg-success hover:bg-success/90" : "gap-2 min-w-[120px]"}
              >
                {isSending ? (
                  <>Mengirim...</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {decision === "invite" ? "Kirim Undangan" : decision === "accept" ? "Kirim Keputusan" : "Kirim Penolakan"}
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
