/**
 * CandidateDetailAnalysis — Komponen AI Screening dengan Evidence-Based Scoring.
 *
 * Menampilkan:
 * 1. Skor keseluruhan + kategori kualitatif
 * 2. Breakdown per komponen (Skill Match, Experience, Education, Responsibilities, Additional)
 *    dengan bobot, skor, dan kutipan bukti dari CV
 * 3. Kutipan highlight dari CV
 * 4. Ringkasan CV
 * 5. Asisten AI interaktif
 */

"use client"

import * as React from "react"
import {
  IconSparkles, IconBriefcase, IconRefresh,
  IconBookmark, IconSchool, IconListCheck, IconStar,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { TypingDots } from "@/components/atoms/shared/TypingDots"
import { Application } from "@/lib/types"
import { ExtendedCandidateData } from "@/lib/dashboard/extended-data"
import { getScreeningResult, screenApplication, type ScreeningResult, type ComponentScore, getInterviewResult, type InterviewResult } from "@/services/aiService"
import { ApiError } from "@/services/apiClient"

interface CandidateDetailAnalysisProps {
  candidate: Application & ExtendedCandidateData
  resumeUrl?: string
}

// --- Konfigurasi tampilan per komponen ---
const COMPONENT_CONFIG: Record<string, {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  skill_match: {
    label: "Kecocokan Skill",
    icon: IconBriefcase,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
  },
  experience: {
    label: "Pengalaman Kerja",
    icon: IconBookmark,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  education: {
    label: "Pendidikan",
    icon: IconSchool,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  responsibilities: {
    label: "Relevansi Tanggung Jawab",
    icon: IconListCheck,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  additional: {
    label: "Kualifikasi Tambahan",
    icon: IconStar,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
  },
}

const COMPONENT_ORDER = ["skill_match", "experience", "education", "responsibilities", "additional"]

// --- Helper: Warna score bar ---
function getScoreColor(score: number) {
  if (score >= 0.75) return "bg-emerald-500"
  if (score >= 0.5) return "bg-amber-400"
  return "bg-rose-400"
}

function getScoreLabel(score: number) {
  if (score >= 0.8) return "Sangat Baik"
  if (score >= 0.6) return "Baik"
  if (score >= 0.4) return "Cukup"
  return "Perlu Pengembangan"
}

// --- Komponen ComponentScoreCard — evidence selalu tampil ---
function ComponentScoreCard({ componentKey, data }: { componentKey: string; data: ComponentScore }) {
  const cfg = COMPONENT_CONFIG[componentKey] || COMPONENT_CONFIG.skill_match
  const Icon = cfg.icon
  const pct = Math.round(data.score * 100)
  const evidenceList = (data.assessments ?? [])
    .map((a) => a.evidence_text || a.reasoning)
    .filter((e): e is string => Boolean(e))

  return (
    <div className={`rounded-2xl border ${cfg.borderColor} ${cfg.bgColor} overflow-hidden`}>
      {/* Header baris skor */}
      <div className="flex items-center gap-3 p-4">
        <div className={`rounded-xl p-2 bg-white/60 ${cfg.color}`}>
          <Icon className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] font-semibold text-ink truncate">{cfg.label}</span>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="text-[11px] text-ink-muted">Bobot: <strong>{data.weight}%</strong></span>
              <span className={`text-[12px] font-bold ${cfg.color}`}>{pct}%</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-white/70 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${getScoreColor(data.score)}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-ink-muted">{getScoreLabel(data.score)}</span>
            <span className="text-[11px] text-ink-muted">Kontribusi: <strong>{data.weighted_score.toFixed(1)}%</strong></span>
          </div>
        </div>
      </div>

      {/* Evidence selalu tampil */}
      {evidenceList.length > 0 && (
        <div className="px-4 pb-4 space-y-2 border-t border-white/40 pt-3">
          <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide">Bukti dari CV</p>
          {evidenceList.map((ev, i) => (
            <div key={i} className={`rounded-xl border-l-4 ${cfg.borderColor} bg-white/60 p-3 text-[12.5px] text-ink leading-relaxed italic`}>
              "{ev}"
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// --- CV Preview Panel ---
function CVPreviewPanel({ url }: { url: string }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface-1 overflow-hidden flex flex-col" style={{ minHeight: 480 }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-hairline bg-white/60">
        <span className="text-[12px] font-semibold text-ink-muted uppercase tracking-wide flex items-center gap-1.5">
          <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Preview CV
        </span>
        <a href={url} target="_blank" rel="noreferrer" className="text-[11px] text-primary font-medium hover:underline">
          Buka di tab baru ↗
        </a>
      </div>
      <iframe
        src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
        className="flex-1 w-full"
        title="CV Kandidat"
        style={{ minHeight: 480 }}
      />
    </div>
  )
}

// --- Kategori → warna ---
function getCategoryStyle(category?: string) {
  if (!category) return { text: "text-ink", bg: "bg-surface-1", border: "border-hairline" }
  const c = category.toLowerCase()
  if (c.includes("sangat")) return { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" }
  if (c.includes("sesuai")) return { text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" }
  if (c.includes("perlu dipertimbangkan")) return { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" }
  return { text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" }
}

function getConfidenceStyle(confidence?: string) {
  if (confidence === "High") return { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" }
  if (confidence === "High Potential") return { text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" }
  if (confidence === "Needs Validation") return { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" }
  return { text: "text-ink-muted", bg: "bg-surface-1", border: "border-hairline" }
}

// --- Main Component ---
export function CandidateDetailAnalysis({ candidate, resumeUrl }: CandidateDetailAnalysisProps) {
  const [screening, setScreening] = React.useState<ScreeningResult | null>(null)
  const [interview, setInterview] = React.useState<InterviewResult | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isScreening, setIsScreening] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    Promise.all([
      getScreeningResult(candidate.id).catch(() => null),
      getInterviewResult(candidate.id).catch(() => null)
    ]).then(([scr, intr]) => {
      if (!cancelled) {
        setScreening(scr)
        setInterview(intr)
      }
    }).finally(() => {
      if (!cancelled) setIsLoading(false)
    })
    return () => { cancelled = true }
  }, [candidate.id])

  const runScreening = async (force: boolean = false) => {
    setIsScreening(true)
    setError(null)
    try {
      const result = await screenApplication(candidate.id, force)
      setScreening(result)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal jalanin screening AI.")
    } finally {
      setIsScreening(false)
    }
  }

  const hasComponentScores = screening?.componentScores && Object.keys(screening.componentScores).length > 0
  const overallScore = Math.round(screening?.finalWeightedScore ?? screening?.overallScore ?? 0)
  const catStyle = getCategoryStyle(screening?.category)
  const confStyle = getConfidenceStyle(interview?.evidenceConfidence)

  return (
    <Card className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 overflow-hidden pt-0">
      <CardHeader className="rounded-t-3xl bg-primary py-5 text-white">
        <CardTitle className="text-[20px] font-semibold text-white">Screening AI & Validasi Kompetensi</CardTitle>
        <CardDescription className="text-white/80">Analisis berbasis bukti — cocok-cocokan CV {candidate.applicantName} dengan kualifikasi lowongan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-surface-1 p-6 text-ink-muted">
            <TypingDots /> Ngecek hasil screening & interview...
          </div>
        ) : !screening ? (
          <div className="rounded-2xl border border-dashed border-hairline bg-surface-1 p-6 text-center space-y-3">
            <IconSparkles className="size-8 text-primary mx-auto" />
            <p className="text-[15px] font-semibold text-ink">Kandidat ini belum discreen AI</p>
            <p className="text-sm text-ink-muted">Jalankan buat lihat analisis berbasis bukti — bobot per komponen, kutipan dari CV, dan kategori.</p>
            <Button onClick={() => runScreening(false)} disabled={isScreening} className="mt-2">
              {isScreening ? "Lagi discreen..." : "Jalankan Screening AI"}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        ) : (
          <>
            {/* Header: Skor + Kategori */}
            <div className="space-y-2 pb-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[17px] font-semibold text-ink">Hasil Analisis AI</h4>
                <Button variant="ghost" size="sm" onClick={() => runScreening(true)} disabled={isScreening} className="text-ink-muted">
                  <IconRefresh className="size-4 mr-1.5" /> {isScreening ? "Screening ulang..." : "Screening ulang"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. CV Fit Score */}
                <div className={`rounded-2xl border ${catStyle.border} ${catStyle.bg} p-4 flex flex-col justify-center gap-1`}>
                  <div className="flex items-center gap-2 mb-1">
                    <IconBriefcase className={`size-4 ${catStyle.text}`} />
                    <span className="text-[12px] font-semibold text-ink-muted uppercase tracking-wider">CV Fit Score</span>
                  </div>
                  <p className={`text-[22px] font-bold tracking-[-0.02em] ${catStyle.text}`}>
                    {overallScore}%
                  </p>
                  <p className="text-[12px] text-ink-muted mt-0.5">
                    {screening.category || "Perlu Dipertimbangkan"}
                  </p>
                </div>

                {/* 2. Interview Competency Score */}
                <div className={`rounded-2xl border border-blue-200 bg-blue-50 p-4 flex flex-col justify-center gap-1`}>
                  <div className="flex items-center gap-2 mb-1">
                    <IconListCheck className="size-4 text-blue-700" />
                    <span className="text-[12px] font-semibold text-ink-muted uppercase tracking-wider">Interview Score</span>
                  </div>
                  <p className="text-[22px] font-bold tracking-[-0.02em] text-blue-700">
                    {interview?.recommendationScore ? Math.round(interview.recommendationScore) + "%" : "-"}
                  </p>
                  <p className="text-[12px] text-ink-muted mt-0.5">
                    {interview?.status === "completed" ? "Udah divalidasi" : "Belum interview"}
                  </p>
                </div>

                {/* 3. Evidence Confidence */}
                <div className={`rounded-2xl border ${confStyle.border} ${confStyle.bg} p-4 flex flex-col justify-center gap-1`}>
                  <div className="flex items-center gap-2 mb-1">
                    <IconSparkles className={`size-4 ${confStyle.text}`} />
                    <span className="text-[12px] font-semibold text-ink-muted uppercase tracking-wider">Evidence Confidence</span>
                  </div>
                  <p className={`text-[18px] font-bold tracking-[-0.02em] ${confStyle.text}`}>
                    {interview?.evidenceConfidence || "-"}
                  </p>
                  <p className="text-[12px] text-ink-muted mt-0.5">
                    Hubungan CV & wawancara
                  </p>
                </div>
              </div>
            </div>

            {/* Breakdown Validasi Kompetensi (Interview) */}
            {interview?.competencyScores && Object.keys(interview.competencyScores).length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-[17px] font-semibold text-ink">Hasil Validasi Wawancara</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(interview.competencyScores).map(([compName, score]) => (
                    <div key={compName} className="rounded-xl border border-hairline bg-surface-1 p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] font-semibold text-ink truncate">{compName}</span>
                        <span className={`text-[12px] font-bold ${score >= 75 ? "text-emerald-600" : score >= 50 ? "text-amber-500" : "text-rose-500"}`}>
                          {Math.round(score)}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/70 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getScoreColor(score / 100)}`}
                          style={{ width: `${Math.round(score)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Breakdown bobot per komponen (CV) + PDF Preview side by side */}
            {hasComponentScores && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[17px] font-semibold text-ink">Breakdown Penilaian</h4>
                  {screening.weightsUsed && (
                    <span className="text-[11px] text-ink-muted bg-surface-1 border border-hairline rounded-full px-2.5 py-1">
                      {screening.candidateTrack === "Fresh Graduate" ? "Bobot Fresh Graduate" : "Bobot Professional"}
                    </span>
                  )}
                </div>
                <p className="text-[12.5px] text-ink-muted">Bukti kutipan dari CV ditampilkan langsung di bawah setiap komponen. Skor dihitung berdasarkan bobot yang sudah ditentukan.</p>

                {/* Grid: komponen kiri, preview CV kanan */}
                <div className={resumeUrl ? "grid grid-cols-1 lg:grid-cols-2 gap-4 items-start" : "space-y-2"}>
                  <div className="space-y-2">
                    {COMPONENT_ORDER.map((key) => {
                      const data = screening.componentScores?.[key as keyof typeof screening.componentScores]
                      if (!data) return null
                      return <ComponentScoreCard key={key} componentKey={key} data={data} />
                    })}
                  </div>

                  {resumeUrl && (
                    <div className="sticky top-4">
                      <CVPreviewPanel url={resumeUrl} />
                    </div>
                  )}
                </div>

                {/* Formula ringkasan */}
                <div className="rounded-2xl border border-hairline bg-surface-1 p-4 mt-2">
                  <p className="text-[12px] font-semibold text-ink-muted mb-2">Formula Perhitungan</p>
                  <div className="flex flex-wrap gap-1.5 text-[11.5px]">
                    {COMPONENT_ORDER.map((key, i) => {
                      const data = screening.componentScores?.[key as keyof typeof screening.componentScores]
                      const cfg = COMPONENT_CONFIG[key]
                      if (!data) return null
                      return (
                        <React.Fragment key={key}>
                          <span className={`${cfg.color} font-semibold`}>
                            {Math.round(data.score * 100)}% × {data.weight}%
                          </span>
                          {i < COMPONENT_ORDER.length - 1 && <span className="text-ink-muted">+</span>}
                        </React.Fragment>
                      )
                    })}
                    <span className="text-ink-muted ml-1">= <strong className="text-ink">{overallScore}%</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Alasan Penilaian */}
            {screening.reasoning && (
              <div className="space-y-2">
                <h4 className="text-[17px] font-semibold text-ink">Kesimpulan AI</h4>
                <div className="rounded-2xl border border-hairline bg-surface-1 p-5 text-[14.5px] text-ink leading-relaxed">
                  {screening.reasoning}
                </div>
              </div>
            )}

            {/* Kutipan highlight dari CV */}
            {screening.quotes && screening.quotes.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[17px] font-semibold text-ink">Bukti Kunci dari CV</h4>
                <div className="space-y-2">
                  {screening.quotes.map((quote, i) => (
                    <div key={i} className="rounded-xl border-l-4 border-l-primary bg-primary/8 p-4 text-[14px] text-ink font-medium italic relative overflow-hidden">
                      <IconSparkles className="size-5 text-primary/15 absolute -right-1 -top-1" />
                      &quot;{quote}&quot;
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {screening.skills && screening.skills.length > 0 && (
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

            {/* Ringkasan CV */}
            {screening.cvSummary && (
              <div className="space-y-2">
                <h4 className="text-[17px] font-semibold text-ink">Ringkasan CV (AI)</h4>
                <div className="rounded-2xl border border-hairline bg-surface-1 p-5">
                  <p className="text-[14.5px] leading-relaxed text-ink">{screening.cvSummary}</p>
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
