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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div
        className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer"
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
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            <p className="text-sm font-medium">{isUploadingCv ? "Mengunggah CV kamu..." : "Mengecek CV..."}</p>
          </div>
        ) : hasCv ? (
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-full text-primary">
              <FileTextIcon className="size-8" />
            </div>
            <div>
              <p className="font-medium text-lg">CV kamu siap dikirim</p>
              <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                <CheckCircleIcon className="size-4 text-success" />
                Bakal dikirim ke HRD & discreen AI
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}>
              Ganti CV
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-muted rounded-full">
              <UploadCloudIcon className="size-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-lg">Klik buat upload CV kamu</p>
              <p className="text-sm text-muted-foreground mt-1">Mendukung PDF, JPG, PNG</p>
            </div>
          </div>
        )}
      </div>

      {cvUploadError && <p className="text-sm text-destructive text-center">{cvUploadError}</p>}

      {hasCv && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-4">
          <SparklesIcon className="size-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-primary">Screening AI</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Setelah lamaran dikirim, Direkrut AI bakal cocokin CV kamu sama kualifikasi posisi{" "}
              <strong>{jobTitle}</strong>. Lanjutkan untuk mengirim lamaran.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
