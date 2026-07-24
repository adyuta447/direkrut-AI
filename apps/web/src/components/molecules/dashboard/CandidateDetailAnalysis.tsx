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
import { TypingDots } from "@/components/atoms/shared/TypingDots"
import { Application } from "@/lib/types"
import { ExtendedCandidateData } from "@/lib/dashboard/extended-data"
import { getScreeningResult, screenApplication, type ScreeningResult, type ComponentScore, getInterviewResult, type InterviewResult } from "@/services/aiService"
import { ApiError } from "@/services/apiClient"

interface CandidateDetailAnalysisProps {
  candidate: Application & ExtendedCandidateData
  resumeUrl?: string
}

// --- Konfigurasi label + ikon per komponen -- warna SENGAJA gak di sini,
// biar semua kartu komponen konsisten netral. Warna cuma dipakai buat angka
// skor (semantik: bagus/cukup/kurang), bukan identitas kategori. ---
const COMPONENT_CONFIG: Record<string, { label: string; icon: React.ElementType }> = {
  skill_match: { label: "Kecocokan Skill", icon: IconBriefcase },
  experience: { label: "Pengalaman Kerja", icon: IconBookmark },
  education: { label: "Pendidikan", icon: IconSchool },
  responsibilities: { label: "Relevansi Tanggung Jawab", icon: IconListCheck },
  additional: { label: "Kualifikasi Tambahan", icon: IconStar },
}

const COMPONENT_ORDER = ["skill_match", "experience", "education", "responsibilities", "additional"]

// --- Warna semantik berbasis skor -- SATU-SATUNYA tempat warna dipakai
// buat menyampaikan makna (bagus/cukup/kurang). `pct` diharapkan 0-100
// (skala asli dari ai-engine, lihat vector_search.py -- BUKAN 0-1). ---
function getScoreTone(pct: number) {
  if (pct >= 75) return { bar: "bg-emerald-500", text: "text-emerald-600" }
  if (pct >= 50) return { bar: "bg-amber-400", text: "text-amber-600" }
  return { bar: "bg-rose-400", text: "text-rose-600" }
}

function getScoreLabel(pct: number) {
  if (pct >= 80) return "Sangat Baik"
  if (pct >= 60) return "Baik"
  if (pct >= 40) return "Cukup"
  return "Perlu Pengembangan"
}

// --- Komponen ComponentScoreCard — evidence selalu tampil ---
function ComponentScoreCard({ componentKey, data }: { componentKey: string; data: ComponentScore }) {
  const cfg = COMPONENT_CONFIG[componentKey] || COMPONENT_CONFIG.skill_match
  const Icon = cfg.icon
  const pct = Math.round(data.score)
  const tone = getScoreTone(pct)
  const evidenceList = (data.assessments ?? [])
    .map((a) => a.evidence_text || a.reasoning)
    .filter((e): e is string => Boolean(e))

  return (
    <div className="rounded-2xl border border-hairline bg-surface-1 overflow-hidden">
      {/* Header baris skor */}
      <div className="flex items-center gap-3 p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[13px] font-semibold text-ink truncate">{cfg.label}</span>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="text-[11px] text-ink-muted">Bobot <strong className="text-ink">{Math.round(data.weight)}%</strong></span>
              <span className={`text-[12px] font-bold ${tone.text}`}>{pct}%</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-hairline/70 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${tone.bar}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-ink-muted">{getScoreLabel(pct)}</span>
            <span className="text-[11px] text-ink-muted">Kontribusi <strong className="text-ink">{data.weighted_score.toFixed(1)}%</strong></span>
          </div>
        </div>
      </div>

      {/* Evidence selalu tampil */}
      {evidenceList.length > 0 && (
        <div className="px-4 pb-4 space-y-2 border-t border-hairline pt-3">
          <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide">Bukti dari CV</p>
          {evidenceList.map((ev, i) => (
            <div key={i} className="rounded-xl border border-hairline bg-canvas p-3 text-[12.5px] text-ink leading-relaxed italic">
              &quot;{ev}&quot;
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
      <div className="flex items-center justify-between px-4 py-3 border-b border-hairline bg-canvas">
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

// --- Kategori/Confidence → warna teks semantik (bukan bg kartu) ---
function getCategoryTextColor(category?: string) {
  if (!category) return "text-ink"
  const c = category.toLowerCase()
  if (c.includes("sangat")) return "text-emerald-600"
  if (c.includes("sesuai")) return "text-primary"
  if (c.includes("perlu dipertimbangkan")) return "text-amber-600"
  return "text-rose-600"
}

function getConfidenceTextColor(confidence?: string) {
  if (confidence === "High") return "text-emerald-600"
  if (confidence === "High Potential") return "text-primary"
  if (confidence === "Needs Validation") return "text-amber-600"
  return "text-ink-muted"
}

/** Satu kartu ringkasan skor -- SEMUA kartu di baris ini pakai bg netral
 * yang sama; cuma angka/labelnya yang diwarnai semantik. Konsisten & mudah
 * discan HRD, gak kayak versi lama yang tiap kartu punya warna bg sendiri. */
function StatTile({ icon: Icon, label, valueClassName, value, caption }: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  valueClassName: string
  caption: string
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface-1 p-4 flex flex-col justify-center gap-1">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="size-4 text-primary" />
        <span className="text-[12px] font-semibold text-ink-muted uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-[22px] font-bold tracking-[-0.02em] ${valueClassName}`}>{value}</p>
      <p className="text-[12px] text-ink-muted mt-0.5">{caption}</p>
    </div>
  )
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
  const interviewScore = interview?.recommendationScore != null ? Math.round(interview.recommendationScore) : null

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
                <StatTile
                  icon={IconBriefcase}
                  label="CV Fit Score"
                  value={`${overallScore}%`}
                  valueClassName={getCategoryTextColor(screening.category)}
                  caption={screening.category || "Perlu Dipertimbangkan"}
                />
                <StatTile
                  icon={IconListCheck}
                  label="Interview Score"
                  value={interviewScore != null ? `${interviewScore}%` : "-"}
                  valueClassName={interviewScore != null ? getScoreTone(interviewScore).text : "text-ink-muted"}
                  caption={interview?.status === "completed" ? "Udah divalidasi" : "Belum interview"}
                />
                <StatTile
                  icon={IconSparkles}
                  label="Evidence Confidence"
                  value={interview?.evidenceConfidence || "-"}
                  valueClassName={getConfidenceTextColor(interview?.evidenceConfidence)}
                  caption="Hubungan CV & wawancara"
                />
              </div>
            </div>

            {/* Breakdown Validasi Kompetensi (Interview) */}
            {interview?.competencyScores && Object.keys(interview.competencyScores).length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-[17px] font-semibold text-ink">Hasil Validasi Wawancara</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(interview.competencyScores).map(([compName, score]) => {
                    const pct = Math.round(score)
                    const tone = getScoreTone(pct)
                    return (
                      <div key={compName} className="rounded-xl border border-hairline bg-surface-1 p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[13px] font-semibold text-ink truncate">{compName}</span>
                          <span className={`text-[12px] font-bold ${tone.text}`}>{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-hairline/70 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${tone.bar}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
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
                      if (!data) return null
                      return (
                        <React.Fragment key={key}>
                          <span className="text-ink font-semibold">
                            {Math.round(data.score)}% × {Math.round(data.weight)}%
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
                    <div key={i} className="rounded-2xl border border-hairline bg-surface-1 p-4 text-[14px] text-ink font-medium italic relative overflow-hidden">
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
      </CardContent>
    </Card>
  )
}
