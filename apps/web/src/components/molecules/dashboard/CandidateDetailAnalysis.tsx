import {
  IconSparkles,
  IconBriefcase, IconSchool, IconChevronDown, IconChevronUp, IconVideo,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Application } from "@/lib/types"
import { ExtendedCandidateData } from "@/lib/dashboard/extended-data"

interface CandidateDetailAnalysisProps {
  candidate: Application & ExtendedCandidateData
  baseScore: number
  isFreshGrad: boolean
  expandedCards: Record<string, boolean>
  onToggleCard: (id: string) => void
}

export function CandidateDetailAnalysis({ candidate, baseScore, isFreshGrad, expandedCards, onToggleCard }: CandidateDetailAnalysisProps) {
  const scoreCards = [
    {
      id: "wawancara",
      pct: "40%",
      color: "text-info",
      hoverBorder: "hover:border-info/50",
      icon: <IconVideo className="size-16" />,
      title: "Performa Wawancara",
      desc: "Analisis semantik dari jawaban teknis dan soft skill selama wawancara asinkron.",
      details: [
        { label: "Kesesuaian Jawaban Teknis", val: "15%" },
        { label: "Pemecahan Masalah (Studi Kasus)", val: "15%" },
        { label: "Kejelasan Komunikasi", val: "10%" },
      ],
    },
    {
      id: "pengalaman",
      pct: isFreshGrad ? "35%" : "50%",
      color: "text-success",
      hoverBorder: "hover:border-success/50",
      icon: <IconBriefcase className="size-16" />,
      title: isFreshGrad ? "Magang & Proyek" : "Relevansi Pengalaman",
      desc: isFreshGrad ? "Relevansi pengalaman magang, organisasi, dan proyek perkuliahan." : "Kecocokan kata kunci, level, dan durasi pengalaman kerja nyata di CV.",
      details: isFreshGrad
        ? [{ label: "Kesesuaian Bidang Magang", val: "15%" }, { label: "Proyek Relevan", val: "15%" }, { label: "Aktif Berorganisasi", val: "5%" }]
        : [{ label: "Kesamaan Role Sebelumnya", val: "20%" }, { label: "Jenjang Posisi (Senioritas)", val: "15%" }, { label: "Durasi Masa Kerja Terkait", val: "15%" }],
    },
    {
      id: "akademik",
      pct: isFreshGrad ? "25%" : "10%",
      color: "text-warning",
      hoverBorder: "hover:border-warning/50",
      icon: <IconSchool className="size-16" />,
      title: isFreshGrad ? "Pendidikan Akademik" : "Pendidikan & Sertifikasi",
      desc: isFreshGrad ? "Kesesuaian jurusan, IPK, dan prestasi akademik lainnya." : "Validasi gelar dan sertifikasi profesional untuk role ini.",
      details: isFreshGrad
        ? [{ label: "Kesesuaian Jurusan/Fakultas", val: "15%" }, { label: "IPK Akademik", val: "10%" }]
        : [{ label: "Sertifikasi Profesional (Mis. PMP)", val: "5%" }, { label: "Kesesuaian Gelar/Fakultas", val: "5%" }],
    },
  ]

  return (
    <Card className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 overflow-hidden pt-0">
      <CardHeader className="rounded-t-3xl bg-primary py-5 text-white">
        <CardTitle className="text-[20px] font-semibold text-white">Cocok-cocokan CV &amp; Wawancara</CardTitle>
        <CardDescription className="text-white/80">Gini cara AI ngasih nilai buat {candidate.applicantName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2 pb-4">
          <h4 className="text-[17px] font-semibold text-ink">Transparansi Penilaian (Explainable AI)</h4>
          <p className="text-sm text-ink-muted mb-4">
            Ini metodologi &amp; bobot yang dipakai AI buat ngasih skor akhir {baseScore}% ke kandidat ini.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {scoreCards.map((card) => (
              <div
                key={card.id}
                className={`rounded-2xl border border-hairline bg-surface-1 p-5 relative overflow-hidden cursor-pointer transition-all ${card.hoverBorder}`}
                onClick={() => onToggleCard(card.id)}
              >
                <div className="absolute top-0 right-0 p-2 opacity-5">{card.icon}</div>
                <div className="flex justify-between items-start mb-1">
                  <div className={`font-bold text-3xl tracking-[-0.02em] ${card.color}`}>{card.pct}</div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 relative z-10">
                    {expandedCards[card.id] ? <IconChevronUp className="h-4 w-4" /> : <IconChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
                <h5 className="font-semibold text-[15px] mb-1 text-ink">{card.title}</h5>
                <p className="text-xs text-ink-muted relative z-10">{card.desc}</p>
                {expandedCards[card.id] && (
                  <div className="mt-3 pt-3 border-t border-hairline animate-in fade-in slide-in-from-top-2 text-xs space-y-2 relative z-10">
                    {card.details.map((d, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-ink-muted">{d.label}</span>
                        <span className={`font-medium ${card.color}`}>{d.val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-hairline" />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IconBriefcase className="size-5 text-primary" />
            <h4 className="text-[17px] font-semibold text-ink">Relevansi Pengalaman (Tinggi)</h4>
          </div>
          <div className="rounded-2xl border border-hairline bg-surface-1 p-5">
            <p className="text-sm italic text-ink-muted mb-2">Kutipan dari CV-nya:</p>
            <p className="text-[15px] leading-relaxed text-ink">
              &quot;Bertanggung jawab penuh atas{" "}
              <mark className="bg-warning/20 px-1 rounded font-medium">strategi manajemen di 3 proyek berskala nasional</mark>{" "}
              yang menghasilkan peningkatan efisiensi sebesar 20% dalam waktu 6 bulan.&quot;
            </p>
            <div className="mt-3 w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
              Analisis AI: Disebut 3x di CV, nyambung sama pengalaman langsung di proyek serupa.
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IconSchool className="size-5 text-primary" />
            <h4 className="text-[17px] font-semibold text-ink">Pendidikan &amp; Sertifikasi (Menengah)</h4>
          </div>
          <div className="rounded-2xl border border-hairline bg-surface-1 p-5">
            <p className="text-sm italic text-ink-muted mb-2">Kutipan dari CV-nya:</p>
            <p className="text-[15px] leading-relaxed text-ink">&quot;Sarjana Ilmu Komputer, Universitas XYZ. Aktif dalam organisasi kemahasiswaan.&quot;</p>
            <div className="mt-3 w-fit rounded-full bg-[color-mix(in_oklch,var(--warning),black_20%)] px-3 py-1 text-xs font-medium text-white">
              Analisis AI: Gelarnya relevan, tapi sertifikasi profesional spesifik belum ketemu.
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-primary p-6 text-white">
          <h4 className="text-[17px] font-semibold mb-1">Kesimpulan Akhir AI</h4>
          <p className="text-[15px] leading-relaxed text-white/90">
            CV dan jawaban wawancara teknisnya nyambung banget. Probabilitas kecocokan tinggi banget
            ({baseScore}%) — gaskeun ke tahap berikutnya.
          </p>
        </div>

        <div className="mt-8 mb-4 border-t border-hairline pt-6">
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
