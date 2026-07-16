import { FileTextIcon, UploadCloudIcon, CheckCircleIcon, SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ApplyStep2Props {
  file: File | null
  isParsing: boolean
  jobTitle: string
  onUpload: () => void
  onRemove: () => void
}

export function ApplyStep2({ file, isParsing, jobTitle, onUpload, onRemove }: ApplyStep2Props) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div
        className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={!file ? onUpload : undefined}
      >
        {isParsing ? (
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            <p className="text-sm font-medium">AI Sedang Mengekstrak Data CV...</p>
          </div>
        ) : file ? (
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-full text-primary">
              <FileTextIcon className="size-8" />
            </div>
            <div>
              <p className="font-medium text-lg">{file.name}</p>
              <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                <CheckCircleIcon className="size-4 text-success" />
                Berhasil diunggah dan dibaca oleh AI
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onRemove() }}>Ganti File</Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-muted rounded-full">
              <UploadCloudIcon className="size-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-lg">Klik buat upload CV kamu</p>
              <p className="text-sm text-muted-foreground mt-1">Mendukung PDF, DOCX (Maks 5MB)</p>
            </div>
          </div>
        )}
      </div>

      {file && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-4">
          <SparklesIcon className="size-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-primary">Ringkasan AI</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Direkrut AI udah baca profilmu. Pengalaman dan keahlian di CV kamu udah dicocokkan sama kualifikasi posisi{" "}
              <strong>{jobTitle}</strong>. Lanjutkan untuk mengirim lamaran.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
