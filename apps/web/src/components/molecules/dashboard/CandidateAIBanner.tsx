import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, SparklesIcon } from "lucide-react"

export function CandidateAIBanner() {
  return (
    <div className="flex flex-col items-start justify-between gap-6 rounded-4xl bg-primary p-8 text-primary-foreground sm:flex-row sm:items-center md:p-10">
      <div className="space-y-2">
        <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/90">
          <SparklesIcon className="size-4 text-brand-accent" />
          Rekomendasi AI
        </p>
        <h2 className="text-2xl font-bold leading-[1.1] tracking-[-0.02em] md:text-3xl">
          Belum nemu yang pas?
        </h2>
        <p className="max-w-md text-[15px] leading-relaxed text-primary-foreground/80">
          Lowongan baru masuk tiap hari. Upload CV sekali, biar AI yang nyariin
          posisi paling cocok buat kamu.
        </p>
      </div>
      <Button
        variant="secondary"
        className="shrink-0 bg-white text-primary hover:bg-white/90"
        render={<Link href="/candidate/jobs" />}
      >
        Lihat Lowongan Baru
        <ArrowRightIcon className="size-4" />
      </Button>
    </div>
  )
}
