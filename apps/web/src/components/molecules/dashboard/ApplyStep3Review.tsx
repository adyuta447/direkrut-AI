import { CheckCircleIcon, FileTextIcon } from "lucide-react"
import type { Job } from "@/lib/types"

interface ApplyStep3ReviewProps {
  job: Job
  formData: { name: string; email: string }
  isProfileComplete: boolean
}

export function ApplyStep3Review({ job, formData, isProfileComplete }: ApplyStep3ReviewProps) {
  return (
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
  )
}
