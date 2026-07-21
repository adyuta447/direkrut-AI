import * as React from "react"
import { IconVideo, IconPlayerPlay, IconAlertTriangle, IconSparkles } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TypingDots } from "@/components/atoms/shared/TypingDots"
import { Application } from "@/lib/types"
import { ExtendedCandidateData } from "@/lib/dashboard/extended-data"
import { getInterviewResult, getInterviewAudioUrl, type InterviewResult } from "@/services/aiService"

interface CandidateDetailCVProps {
  candidate: Application & ExtendedCandidateData
}

function AnswerAudioPlayer({ applicationId, questionIndex }: { applicationId: string; questionIndex: number }) {
  const [url, setUrl] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const handlePlay = async () => {
    if (url) return
    setIsLoading(true)
    try {
      const audioUrl = await getInterviewAudioUrl(applicationId, questionIndex)
      setUrl(audioUrl)
    } catch {
      // ponytail: gagal ambil URL playback -- biarin tombolnya tetap ada, HRD bisa coba lagi.
    } finally {
      setIsLoading(false)
    }
  }

  if (url) return <audio controls autoPlay src={url} className="h-8 w-full max-w-[240px]" />
  return (
    <Button variant="ghost" size="sm" onClick={handlePlay} disabled={isLoading} className="h-7 px-2 text-xs text-primary">
      <IconPlayerPlay className="size-3.5 mr-1" /> {isLoading ? "Memuat..." : "Putar Jawaban"}
    </Button>
  )
}

function InterviewLogCard({ candidate }: { candidate: Application & ExtendedCandidateData }) {
  const [interview, setInterview] = React.useState<InterviewResult | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    getInterviewResult(candidate.id)
      .then((result) => { if (!cancelled) setInterview(result) })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [candidate.id])

  return (
    <Card className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 overflow-hidden pt-0">
      <CardHeader className="rounded-t-3xl bg-info py-5 text-white">
        <CardTitle className="text-[20px] font-semibold text-white">Rekaman &amp; Transkrip Wawancara AI</CardTitle>
        <CardDescription className="text-white/80">Sesi wawancara asinkron yang udah dijalani kandidat, kamera wajib nyala buat proctoring</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-surface-1 p-6 text-ink-muted">
            <TypingDots /> Ngecek hasil wawancara...
          </div>
        ) : !interview ? (
          <div className="rounded-2xl border border-dashed border-hairline bg-surface-1 p-6 text-center space-y-2">
            <IconVideo className="size-8 text-muted-foreground/50 mx-auto" />
            <p className="text-[15px] font-semibold text-ink">Kandidat belum menyelesaikan wawancara AI</p>
            <p className="text-sm text-ink-muted">Transkrip &amp; skor bakal muncul di sini begitu kandidat selesai wawancara.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3">
              {interview.recommendationScore != null && (
                <div className="rounded-2xl border border-hairline bg-surface-1 px-4 py-3">
                  <p className="text-xs text-ink-muted">Skor Rekomendasi AI</p>
                  <p className="text-2xl font-bold text-primary tabular-nums">{Math.round(interview.recommendationScore)}</p>
                </div>
              )}
              {interview.proctoringFlags.length > 0 && (
                <div className="flex items-center gap-2 rounded-2xl border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-ink">
                  <IconAlertTriangle className="size-5 text-warning shrink-0" />
                  <span>{interview.proctoringFlags.length} peringatan integritas selama sesi ini</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-[17px] font-semibold text-ink border-b border-hairline pb-2">Transkrip Tanya Jawab</h4>
              <div className="space-y-4 bg-surface-1 p-4 rounded-2xl border border-hairline max-h-[400px] overflow-y-auto">
                {interview.items.map((item) => (
                  <React.Fragment key={item.questionIndex}>
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-xs font-semibold text-primary px-2">AI Interviewer</span>
                      <div className="bg-background border p-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                        <p className="text-sm">{item.question}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-xs font-semibold text-muted-foreground px-2">{candidate.applicantName}</span>
                      <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm text-right">
                        <p className="text-sm">{item.answer || "(gak ada transkrip)"}</p>
                      </div>
                      <AnswerAudioPlayer applicationId={candidate.id} questionIndex={item.questionIndex} />
                    </div>
                    {item.aiFeedback && (
                      <div className="flex items-start gap-2 max-w-[85%] rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-ink-muted">
                        <IconSparkles className="size-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{item.aiFeedback}</span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function CandidateDetailCV({ candidate }: CandidateDetailCVProps) {
  return (
    <div className="space-y-6">
      <InterviewLogCard candidate={candidate} />

      <Card className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 overflow-hidden pt-0">
        <CardHeader className="rounded-t-3xl bg-brand-accent-strong py-5 text-white">
          <CardTitle className="text-[20px] font-semibold text-white">Portofolio &amp; Riwayat Kandidat</CardTitle>
          <CardDescription className="text-white/80">Diambil otomatis dari CV dan dokumen yang diunggah</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h4 className="text-[17px] font-semibold text-ink border-b border-hairline pb-2 mb-4">Ringkasan Pengalaman Kerja (dari AI)</h4>
            <p className="text-[15px] leading-relaxed p-5 bg-surface-1 border border-hairline rounded-2xl italic text-ink">
              &quot;{candidate.experienceSummary}&quot;
            </p>
          </div>
          <div>
            <h4 className="text-[17px] font-semibold text-ink border-b border-hairline pb-2 mb-4">Profil Singkat</h4>
            <p className="text-sm leading-relaxed">
              Profil dasarnya udah sesuai sama kualifikasi awal <strong>{candidate.jobTitle}</strong>. Layak banget lanjut ke tahap berikutnya.
            </p>
          </div>
          <div>
            <h4 className="text-[17px] font-semibold text-ink border-b border-hairline pb-2 mb-4">Pengalaman Kerja</h4>
            <div className="relative border-l-2 border-muted ml-3 space-y-6">
              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-background" />
                <h5 className="font-semibold">{candidate.lastPosition || "Staff Senior"}</h5>
                <p className="text-sm text-muted-foreground">Perusahaan Tech XYZ • Jan 2021 - Sekarang (2 Tahun 8 Bulan)</p>
                <p className="text-sm mt-2">Memimpin tim beranggotakan 5 orang dan berhasil menaikkan metrik kesuksesan proyek hingga 20%.</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-muted-foreground rounded-full -left-[7px] top-1.5 ring-4 ring-background" />
                <h5 className="font-semibold">Junior Staff</h5>
                <p className="text-sm text-muted-foreground">Startup Kreatif Nusantara • Mei 2019 - Des 2020 (1 Tahun 7 Bulan)</p>
                <p className="text-sm mt-2">Membantu administrasi proyek dan pengolahan data pelanggan secara reguler.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-[17px] font-semibold text-ink border-b border-hairline pb-2 mb-4">Sertifikasi</h4>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>Sertifikasi Manajemen Proyek Profesional (PMP) - 2022</li>
                <li>Google Data Analytics Certificate - 2021</li>
                <li>AWS Certified Cloud Practitioner - 2020</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[17px] font-semibold text-ink border-b border-hairline pb-2 mb-4">Pencapaian &amp; Prestasi</h4>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>Karyawan Terbaik (Employee of the Year) - 2022</li>
                <li>Juara 1 Lomba Analisis Data Tingkat Nasional - 2019</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
