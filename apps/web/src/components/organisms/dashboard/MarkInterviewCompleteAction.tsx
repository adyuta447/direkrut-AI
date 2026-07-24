"use client"

import * as React from "react"
import { useDashboard } from "@/context/DashboardContext"
import { Candidate } from "@/components/molecules/dashboard/CandidateTableTypes"
import { ConfirmDialog } from "@/components/molecules/dashboard/ConfirmDialog"
import { NoticeDialog } from "@/components/molecules/dashboard/NoticeDialog"

interface MarkInterviewCompleteActionProps {
  candidate: Candidate
  trigger: React.ReactElement
}

/** Nandain wawancara teknis kandidat udah selesai -- internal doang (HRD
 * belum ngasih keputusan), jadi gak perlu compose email kayak DecisionDialog
 * (invite/accept/reject). Pola confirm+notice sama kayak hapus lowongan. */
export function MarkInterviewCompleteAction({ candidate, trigger }: MarkInterviewCompleteActionProps) {
  const { changeApplicationStatus } = useDashboard()
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [notice, setNotice] = React.useState<string | null>(null)

  return (
    <>
      {React.cloneElement(trigger, { onClick: () => setConfirmOpen(true) } as React.HTMLAttributes<HTMLElement>)}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Tandai wawancara teknis udah selesai?"
        description={`Status "${candidate.applicantName}" bakal pindah ke "Sudah Wawancara Teknis", siap buat diputuskan diterima atau ditolak.`}
        confirmLabel="Ya, Selesai"
        onConfirm={async () => {
          try {
            await changeApplicationStatus(candidate.id, "interview_completed")
            setNotice("Ditandai udah selesai wawancara")
          } catch (err) {
            setNotice(err instanceof Error ? err.message : "Gagal update status, coba lagi ya")
          }
        }}
      />
      <NoticeDialog message={notice} onClose={() => setNotice(null)} />
    </>
  )
}
