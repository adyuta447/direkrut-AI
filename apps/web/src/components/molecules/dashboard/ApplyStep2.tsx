import * as React from "react"
import { FileTextIcon, CheckCircleIcon, SparklesIcon, UploadCloudIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ApplyStep2Props {
  hasCv: boolean
  isLoadingCv: boolean
  isUploadingCv: boolean
  cvUploadError: string | null
  jobTitle: string
  onUploadCv: (file: File) => void
}

export function ApplyStep2({ hasCv, isLoadingCv, isUploadingCv, cvUploadError, jobTitle, onUploadCv }: ApplyStep2Props) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div
        className={[
          "group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed p-10 text-center transition-colors",
          hasCv ? "border-primary/40" : "border-hairline hover:border-primary/40",
        ].join(" ")}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onUploadCv(file)
            e.target.value = ""
          }}
        />
        {isLoadingCv || isUploadingCv ? (
          <div className="flex flex-col items-center gap-4">
            <div className="size-12 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
            <p className="text-base font-semibold text-ink">{isUploadingCv ? "Mengunggah CV kamu..." : "Mengecek CV..."}</p>
          </div>
        ) : hasCv ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-white">
              <FileTextIcon className="size-8" />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-ink">CV kamu siap dikirim</p>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-ink-muted">
                <CheckCircleIcon className="size-4 text-success" />
                Bakal dikirim ke HRD &amp; discreen AI
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-hairline"
                onClick={async (e) => {
                  e.stopPropagation()
                  const { getCVDownloadUrl } = await import("@/services/candidateService")
                  const url = await getCVDownloadUrl()
                  if (url) window.open(url, "_blank")
                  else alert("Gagal mengambil preview CV")
                }}
              >
                Lihat CV
              </Button>
              <Button variant="outline" size="sm" className="rounded-full border-hairline" onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}>
                Ganti CV
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-hairline text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary">
              <UploadCloudIcon className="size-8" />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-ink">Klik buat upload CV kamu</p>
              <p className="mt-1 text-sm text-ink-muted">Mendukung PDF, JPG, PNG</p>
            </div>
          </div>
        )}
      </div>

      {cvUploadError && <p className="text-center text-sm text-destructive">{cvUploadError}</p>}

      {hasCv && (
        <div className="flex gap-4 rounded-2xl border border-hairline p-4">
          <SparklesIcon className="size-5 shrink-0 text-primary" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-foreground">Screening AI</h4>
            <p className="text-sm leading-relaxed text-ink-muted">
              Setelah lamaran dikirim, Direkrut AI bakal cocokin CV kamu sama kualifikasi posisi{" "}
              <strong className="text-ink">{jobTitle}</strong>. Lanjutkan untuk mengirim lamaran.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
