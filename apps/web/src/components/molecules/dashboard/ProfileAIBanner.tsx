import Image from "next/image"
import { BotIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfileAIBannerProps {
  isUploading: boolean
  isSimulatingAI: boolean
  onUploadClick: () => void
}

export function ProfileAIBanner({ isUploading, isSimulatingAI, onUploadClick }: ProfileAIBannerProps) {
  return (
    <Card className="rounded-3xl border border-hairline bg-primary text-white shadow-none ring-0 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-15">
        <BotIcon className="size-24 text-white" />
      </div>
      <CardHeader className="relative z-10 pb-4">
        <CardTitle className="text-[20px] font-semibold text-white flex items-center gap-2">
          <BotIcon className="size-5 text-white" />
          Isi Profil Otomatis dengan AI
        </CardTitle>
        <CardDescription className="text-base text-white/80">
          Nggak usah ngetik manual dari nol. Upload CV kamu (PDF/DOCX), biar Direkrut AI yang ngisiin profilnya.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <div
          className={`border-2 border-dashed ${isUploading || isSimulatingAI ? "border-white bg-white/10" : "border-white/40 bg-white/10"} rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer hover:border-white`}
          onClick={!isUploading && !isSimulatingAI ? onUploadClick : undefined}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
              <p className="font-medium">Mengunggah CV...</p>
            </div>
          ) : isSimulatingAI ? (
            <div className="flex flex-col items-center gap-4">
              <BotIcon className="size-10 text-white" />
              <div className="space-y-1">
                <p className="font-medium text-white">AI lagi baca CV kamu...</p>
                <p className="text-sm text-white/75">Membaca pengalaman kerja, pendidikan, dan skills</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Image src="/dashboard/add_file.svg" alt="" width={160} height={120} unoptimized className="pointer-events-none h-24 w-auto select-none" />
              <div>
                <p className="font-medium text-lg">Klik buat upload CV kamu</p>
                <p className="text-sm text-white/75 mt-1">Sistem kami akan mengisi seluruh kolom di bawah secara otomatis.</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
