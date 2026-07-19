import { CheckCircleIcon, ClockIcon, MessageSquareIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TimelineStep {
  label: string
  date: string
  done: boolean
  active: boolean
  description: string
}

interface AppDetailTimelineProps {
  timelineSteps: TimelineStep[]
  showFeedback: boolean
}

export function AppDetailTimeline({ timelineSteps, showFeedback }: AppDetailTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold leading-[1.1] tracking-[-0.02em] md:text-2xl">
          <ClockIcon className="size-5 text-primary" />
          Perjalanan Lamaran
        </CardTitle>
        <CardDescription>Tiap tahap kepantau transparan, nggak ada yang disembunyiin.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {timelineSteps.map((step, i) => (
            <div key={i} className="relative flex gap-5 pb-8 last:pb-0">
              {i < timelineSteps.length - 1 && (
                <div className={cn("absolute left-4 top-9 bottom-0 w-px -translate-x-1/2", step.done ? "bg-primary/40" : "bg-border")} />
              )}
              <div
                className={cn(
                  "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
                  step.done ? "bg-primary text-primary-foreground"
                    : step.active ? "bg-brand-accent text-white ring-4 ring-brand-accent/15"
                    : "border bg-background text-muted-foreground"
                )}
              >
                {step.done ? <CheckCircleIcon className="size-4" /> : <ClockIcon className="size-4" />}
              </div>
              <div className="flex-1 pt-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h4 className={cn("text-sm font-semibold", step.active && "text-primary")}>
                    {step.label}
                    {step.active && (
                      <Badge className="ml-2 border-transparent bg-brand-accent text-white">Sekarang</Badge>
                    )}
                  </h4>
                  <span className="text-xs text-muted-foreground">{step.date}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {showFeedback && (
          <div className="mt-8 space-y-4">
            <h4 className="flex items-center gap-2 text-lg font-bold tracking-[-0.02em] md:text-xl">
              <MessageSquareIcon className="size-5 text-primary" />
              Umpan Balik Wawancara AI
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-4xl bg-primary p-6 text-white md:p-8">
                <p className="mb-3 flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.22em] text-white/60">
                  <CheckCircleIcon className="size-4" /> Hasil Analisis AI
                </p>
                <h5 className="mb-3 text-xl font-bold leading-[1.1] tracking-[-0.02em] md:text-2xl">Kekuatan Kamu</h5>
                <p className="text-[15px] leading-relaxed text-white/90">
                  Pemahamanmu soal peran yang dilamar dalem banget. Cara komunikasimu selama sesi wawancara jelas dan terstruktur.
                </p>
              </div>
              <div className="rounded-4xl bg-brand-accent p-6 text-white md:p-8">
                <p className="mb-3 flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.22em] text-white/70">
                  <ClockIcon className="size-4" /> Ruang Bertumbuh
                </p>
                <h5 className="mb-3 text-xl font-bold leading-[1.1] tracking-[-0.02em] md:text-2xl">Yang Bisa Ditingkatin</h5>
                <p className="text-[15px] leading-relaxed text-white/90">
                  Coba perkuat jawaban dengan contoh nyata yang lebih spesifik dan terukur.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
