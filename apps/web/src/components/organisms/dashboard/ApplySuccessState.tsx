"use client"

import { useRouter } from "next/navigation"
import { ArrowRightIcon, CheckCircleIcon, VideoIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Job } from "@/lib/types"

interface ApplySuccessStateProps {
  job: Job
}

export function ApplySuccessState({ job }: ApplySuccessStateProps) {
  const router = useRouter()

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-12 w-full flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-6 animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto animate-in zoom-in spin-in-12 duration-700">
          <CheckCircleIcon className="size-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Lamaran Terkirim!</h2>
          <p className="text-muted-foreground">
            Lamaranmu udah terkirim buat posisi <strong>{job.title}</strong> di <strong>{job.company}</strong>.
          </p>
        </div>
        <div className="rounded-2xl border p-6 text-left space-y-4 mt-8">
          <div className="flex items-center gap-3 text-primary">
            <VideoIcon className="size-6" />
            <h3 className="font-semibold text-lg">Tahap Selanjutnya: Wawancara AI</h3>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Tahap awalnya wawancara video sama AI. Cari tempat yang terang dan tenang ya.
          </p>
          <Button
            className="w-full gap-2 font-semibold text-base py-6"
            onClick={() => router.push(`/interview/${job.id}`)}
          >
            Mulai Wawancara AI Sekarang <ArrowRightIcon className="size-5" />
          </Button>
        </div>
        <Button variant="ghost" className="w-full mt-4" onClick={() => router.push("/candidate")}>
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  )
}
