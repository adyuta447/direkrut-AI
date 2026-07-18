import { IconTrendingUp, IconMinus } from "@tabler/icons-react"
import { getExtendedData } from "@/lib/dashboard/extended-data"
import { getScoreLevel } from "@/lib/dashboard/status"
import { StatCard } from "@/components/molecules/dashboard/StatCard"
import { Badge } from "@/components/ui/badge"

interface Application {
  status: string
  applicantName: string
  recommendationScore?: number
}

interface HrdStatCardItemsProps {
  applications: Application[]
}

/* Gaya kartu solid yang sama dengan dashboard kandidat. */
const SOLID_CARD = "border-transparent text-white [&_.text-muted-foreground]:text-white/80"
const SOLID_BADGE = "border-white/40 bg-white/10 text-white"

export function HrdStatCardItems({ applications }: HrdStatCardItemsProps) {
  const totalLamaran = applications.length
  const administrasiApps = applications.filter((a) => a.status === "under-review")
  const tahapAdministrasi = administrasiApps.length
  const delayedApps = administrasiApps.filter(
    (a) => (getExtendedData(a.applicantName).waitingDays || 0) > 7
  ).length
  const wawancara = applications.filter((a) => a.status === "interview").length

  const applicationsWithScore = applications.filter((a) => a.recommendationScore)
  const avgScore =
    applicationsWithScore.length > 0
      ? Math.round(
          applicationsWithScore.reduce(
            (sum, a) => sum + (a.recommendationScore || 0),
            0
          ) / applicationsWithScore.length
        )
      : undefined
  const avgLevel = getScoreLevel(avgScore)

  return (
    <>
      <StatCard
        label="Total Lamaran"
        value={totalLamaran}
        className={`bg-primary ${SOLID_CARD}`}
        image="/dashboard/paper.svg"
        badge={
          <Badge variant="outline" className={SOLID_BADGE}>
            <IconTrendingUp />
            +12.5%
          </Badge>
        }
        footer="Makin rame bulan ini"
        footerDetail="Data 30 hari terakhir"
      />

      <StatCard
        label="Tahap Administrasi"
        value={tahapAdministrasi}
        className={`bg-[color-mix(in_oklch,var(--warning),black_20%)] ${SOLID_CARD}`}
        image="/dashboard/administrasi.svg"
        badge={
          delayedApps > 0 ? (
            <Badge variant="outline" className="border-white/40 bg-white text-destructive font-semibold">
              {delayedApps} Macet
            </Badge>
          ) : (
            <Badge variant="outline" className={SOLID_BADGE}>
              <IconMinus />
              Aman
            </Badge>
          )
        }
        footer={delayedApps > 0 ? "Gaskeun, perlu ditindak" : "Jalan normal, tenang aja"}
        footerDetail="Nunggu kamu tinjau"
      />

      <StatCard
        label="Lolos Wawancara"
        value={wawancara}
        className={`bg-brand-accent-strong ${SOLID_CARD}`}
        image="/dashboard/conference.svg"
        badge={
          <Badge variant="outline" className={SOLID_BADGE}>
            <IconTrendingUp />
            +5%
          </Badge>
        }
        footer="Kualitas kandidat makin oke"
        footerDetail="Ngalahin rata-rata bulan lalu"
      />

      <StatCard
        label="Rata-rata Kecocokan"
        value={avgScore ? `${avgScore}%` : "-"}
        className={`bg-success ${SOLID_CARD}`}
        image="/dashboard/resume.svg"
        badge={
          <Badge variant="outline" className={SOLID_BADGE}>
            {avgLevel.label}
          </Badge>
        }
        footer="Dihitung otomatis sama AI"
        footerDetail="Udah sesuai kriteria perusahaan"
      />
    </>
  )
}
