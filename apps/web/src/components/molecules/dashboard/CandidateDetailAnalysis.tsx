import * as React from "react"
import {
  IconSparkles, IconBriefcase, IconRefresh,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { TypingDots } from "@/components/atoms/shared/TypingDots"
import { Application } from "@/lib/types"
import { ExtendedCandidateData } from "@/lib/dashboard/extended-data"
import { getScreeningResult, screenApplication, type ScreeningResult } from "@/services/aiService"
import { ApiError } from "@/services/apiClient"
import { getScoreLevel } from "@/lib/dashboard/status"

interface CandidateDetailAnalysisProps {
  candidate: Application & ExtendedCandidateData
}

export function CandidateDetailAnalysis({ candidate }: CandidateDetailAnalysisProps) {
  const [screening, setScreening] = React.useState<ScreeningResult | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isScreening, setIsScreening] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    getScreeningResult(candidate.id)
      .then((result) => { if (!cancelled) setScreening(result) })
      .catch(() => { if (!cancelled) setError("Gagal ambil hasil screening.") })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [candidate.id])

  const runScreening = async () => {
    setIsScreening(true)
    setError(null)
    try {
      const result = await screenApplication(candidate.id)
      setScreening(result)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal jalanin screening AI.")
    } finally {
      setIsScreening(false)
    }
  }

  return (
    <Card className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 overflow-hidden pt-0">
      <CardHeader className="rounded-t-3xl bg-primary py-5 text-white">
        <CardTitle className="text-[20px] font-semibold text-white">Screening AI</CardTitle>
        <CardDescription className="text-white/80">Cocok-cocokan CV {candidate.applicantName} sama kualifikasi lowongan ini</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-surface-1 p-6 text-ink-muted">
            <TypingDots /> Ngecek hasil screening...
          </div>
        ) : !screening ? (
          <div className="rounded-2xl border border-dashed border-hairline bg-surface-1 p-6 text-center space-y-3">
            <IconSparkles className="size-8 text-primary mx-auto" />
            <p className="text-[15px] font-semibold text-ink">Kandidat ini belum discreen AI</p>
            <p className="text-sm text-ink-muted">Jalankan buat lihat skor kecocokan CV vs lowongan ini.</p>
            <Button onClick={runScreening} disabled={isScreening} className="mt-2">
              {isScreening ? "Lagi discreen..." : "Jalankan Screening AI"}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        ) : (
          <>
            <div className="space-y-2 pb-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[17px] font-semibold text-ink">Skor Kecocokan</h4>
                <Button variant="ghost" size="sm" onClick={runScreening} disabled={isScreening} className="text-ink-muted">
                  <IconRefresh className="size-4 mr-1.5" /> {isScreening ? "Screening ulang..." : "Screening ulang"}
                </Button>
              </div>
              <div className="rounded-2xl border border-hairline bg-surface-1 p-6 flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold tracking-[-0.02em] text-primary tabular-nums">{Math.round(screening.overallScore)}%</p>
                  <p className="text-sm text-ink-muted mt-1">{getScoreLevel(screening.overallScore).label}</p>
                </div>
                {screening.workExperienceYears != null && (
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-ink tabular-nums">{screening.workExperienceYears}</p>
                    <p className="text-xs text-ink-muted">tahun pengalaman (est. AI)</p>
                  </div>
                )}
              </div>
            </div>

            {screening.matchedEvidence && screening.matchedEvidence.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[17px] font-semibold text-ink">Bukti Kecocokan</h4>
                <div className="space-y-2">
                  {screening.matchedEvidence.map((evidence, i) => (
                    <div key={i} className="rounded-2xl border border-hairline bg-surface-1 p-4 text-[14px] text-ink flex gap-3">
                      <IconSparkles className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>{evidence}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {screening.skills.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <IconBriefcase className="size-5 text-primary" />
                  <h4 className="text-[17px] font-semibold text-ink">Skill Terdeteksi dari CV</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {screening.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-surface-1 border border-hairline px-3 py-1 text-xs font-medium text-ink">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {screening.cvSummary && (
              <div className="space-y-2">
                <h4 className="text-[17px] font-semibold text-ink">Ringkasan CV (AI)</h4>
                <div className="rounded-2xl border border-hairline bg-surface-1 p-5">
                  <p className="text-[15px] leading-relaxed text-ink">{screening.cvSummary}</p>
                </div>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
          </>
        )}

        <Separator className="bg-hairline" />

        <div className="mt-2 mb-4">
          <h4 className="text-[17px] font-semibold text-ink mb-1 flex items-center gap-2">
            <IconSparkles className="size-4 text-primary" /> Asisten AI Interaktif
          </h4>
          <p className="text-sm text-ink-muted">Mau tau lebih dalam soal profil, pengalaman, atau wawancara kandidat ini? Tanya aja ke Asisten AI.</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const q = formData.get("q")
            if (q) {
              localStorage.setItem("pendingAiQuery", JSON.stringify({ q, candidate: candidate.id }))
              window.open("/hrd/ai-assistant", "_blank")
            }
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <IconSparkles className="size-5 text-primary" />
            </div>
            <Input
              name="q"
              placeholder={`Tanya lebih lanjut soal ${candidate.applicantName}...`}
              className="h-12 rounded-full border-hairline bg-canvas pl-12 pr-4 text-sm shadow-none focus-visible:border-primary"
              required
            />
          </div>
          <Button type="submit" className="h-12 rounded-full px-6 sm:w-auto w-full">
            Tanya AI
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
