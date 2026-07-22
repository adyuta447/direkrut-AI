import { CheckCircleIcon, FileTextIcon, BriefcaseIcon, UserIcon, MailIcon } from "lucide-react"
import type { Job } from "@/lib/types"

interface ApplyStep3ReviewProps {
  job: Job
  formData: { name: string; email: string }
  isProfileComplete: boolean
}

function ReviewRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <span className="flex items-center gap-2 text-sm text-ink-muted">
        <Icon className="size-4" /> {label}
      </span>
      <span className="text-right text-base font-semibold text-ink">{value}</span>
    </div>
  )
}

export function ApplyStep3Review({ job, formData, isProfileComplete }: ApplyStep3ReviewProps) {
  return (
    <div className="space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-4">
      {isProfileComplete && (
        <div className="flex items-start gap-3 rounded-2xl border border-hairline p-4">
          <CheckCircleIcon className="mt-0.5 size-5 shrink-0 text-success" />
          <div>
            <p className="text-sm font-bold text-ink">Data Diambil dari Profil Kamu</p>
            <p className="mt-1 text-sm text-ink-muted">Profilmu udah lengkap, jadi tinggal tinjau sebentar terus kirim deh.</p>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-hairline">
        <div className="border-b border-hairline bg-surface-1/50 px-5 py-3.5">
          <h3 className="text-sm font-bold tracking-tight text-ink">Tinjauan Lamaran</h3>
        </div>
        <div className="divide-y divide-hairline px-5">
          <ReviewRow icon={BriefcaseIcon} label="Posisi" value={`${job.title} di ${job.company}`} />
          <ReviewRow icon={UserIcon} label="Nama Lengkap" value={formData.name} />
          <ReviewRow icon={MailIcon} label="Email" value={formData.email} />
          <ReviewRow
            icon={FileTextIcon}
            label="Dokumen CV"
            value={
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success px-2.5 py-1 text-xs font-semibold text-success">
                <CheckCircleIcon className="size-3.5" /> Profil &amp; CV Tersimpan
              </span>
            }
          />
        </div>
      </div>

      <p className="px-4 text-center text-xs leading-relaxed text-ink-muted">
        Dengan menekan tombol kirim, kamu menyetujui bahwa semua data yang kamu isi benar dan siap diproses sistem Direkrut AI.
      </p>
    </div>
  )
}
