import * as React from "react"
import {
  IconSparkles, IconBriefcase, IconRefresh,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { TypingDots } from "@/components/atoms/shared/TypingDots"
import { DetailSection } from "@/components/molecules/dashboard/DetailSection"
import { StatTile } from "@/components/molecules/dashboard/StatTile"
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
      if (err instanceof ApiError && err.status === 403) {
        // Biasanya sesi ketimpa login kandidat di tab lain (token kandidat
        // kepakai buat aksi HRD). Kasih arahan yang jelas, bukan pesan mentah.
        setError("Sesi kamu kelihatannya berganti (mungkin login di tab lain). Logout terus login ulang sebagai HRD, lalu coba lagi.")
      } else {
        setError(err instanceof ApiError ? err.message : "Gagal jalanin screening AI.")
      }
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
      <CardContent className="space-y-7">
        {isLoading ? (
          <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-surface-1 p-6 text-base text-ink-muted">
            <TypingDots /> Ngecek hasil screening...
          </div>
        ) : !screening ? (
          <div className="rounded-2xl border border-dashed border-hairline bg-surface-1 p-8 text-center space-y-3">
            <IconSparkles className="size-9 text-primary mx-auto" />
            <p className="text-lg font-bold text-ink">Kandidat ini belum discreen AI</p>
            <p className="text-base text-ink-muted">Jalankan buat lihat skor kecocokan CV vs lowongan ini.</p>
            <Button onClick={runScreening} disabled={isScreening} className="mt-2 rounded-full">
              {isScreening ? "Lagi discreen..." : "Jalankan Screening AI"}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        ) : (
          <>
            <DetailSection
              title="Skor Kecocokan"
              action={
                <Button variant="outline" size="sm" onClick={runScreening} disabled={isScreening} className="rounded-full border-hairline text-ink-muted">
                  <IconRefresh className="size-4 mr-1.5" /> {isScreening ? "Screening ulang..." : "Screening ulang"}
                </Button>
              }
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <StatTile value={`${Math.round(screening.overallScore)}%`} label={getScoreLevel(screening.overallScore).label} />
                {screening.workExperienceYears != null && (
                  <StatTile tone="neutral" value={screening.workExperienceYears} label="tahun pengalaman (estimasi AI)" />
                )}
              </div>
            </DetailSection>

            {screening.matchedEvidence && screening.matchedEvidence.length > 0 && (
              <DetailSection title="Bukti Kecocokan">
                <div className="space-y-2">
                  {screening.matchedEvidence.map((evidence, i) => (
                    <div key={i} className="rounded-2xl border border-hairline bg-surface-1 p-4 text-base text-ink flex gap-3">
                      <IconSparkles className="size-4 text-primary shrink-0 mt-1" />
                      <span>{evidence}</span>
                    </div>
                  ))}
                </div>
              </DetailSection>
            )}

            {screening.skills.length > 0 && (
              <DetailSection title="Skill Terdeteksi dari CV" icon={IconBriefcase}>
                <div className="flex flex-wrap gap-2">
                  {screening.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-surface-1 border border-hairline px-3.5 py-1.5 text-sm font-medium text-ink">
                      {skill}
                    </span>
                  ))}
                </div>
              </DetailSection>
            )}

            {screening.cvSummary && (
              <DetailSection title="Ringkasan CV (AI)">
                <div className="rounded-2xl border border-hairline bg-surface-1 p-5">
                  <p className="text-base leading-relaxed text-ink">{screening.cvSummary}</p>
                </div>
              </DetailSection>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
          </>
        )}

        <Separator className="bg-hairline" />

        <DetailSection title="Asisten AI Interaktif" icon={IconSparkles}>
          <p className="-mt-1 text-base text-ink-muted">Mau tau lebih dalam soal profil, pengalaman, atau wawancara kandidat ini? Tanya aja ke Asisten AI.</p>
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
            className="flex flex-col sm:flex-row gap-3 pt-1"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IconSparkles className="size-5 text-primary" />
              </div>
              <Input
                name="q"
                placeholder={`Tanya lebih lanjut soal ${candidate.applicantName}...`}
                className="h-12 rounded-full border-hairline bg-canvas pl-12 pr-4 text-base shadow-none focus-visible:border-primary"
                required
              />
            </div>
            <Button type="submit" className="h-12 rounded-full px-6 sm:w-auto w-full">
              Tanya AI
            </Button>
          </form>
        </DetailSection>
      </CardContent>
    </Card>
  )
}
