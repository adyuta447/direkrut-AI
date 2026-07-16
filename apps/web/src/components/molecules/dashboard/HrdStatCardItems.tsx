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
        footer={
          <>
            Tren naik bulan ini <IconTrendingUp className="size-4" />
          </>
        }
        footerDetail="Berdasarkan 30 hari terakhir"
      />

      <StatCard
        label="Tahap Administrasi"
        value={tahapAdministrasi}
        className={`bg-[color-mix(in_oklch,var(--warning),black_20%)] ${SOLID_CARD}`}
        image="/dashboard/administrasi.svg"
        badge={
          delayedApps > 0 ? (
            <Badge variant="outline" className="border-white/40 bg-white text-destructive font-semibold">
              {delayedApps} Terbengkalai
            </Badge>
          ) : (
            <Badge variant="outline" className={SOLID_BADGE}>
              <IconMinus />
              Stabil
            </Badge>
          )
        }
        footer={
          delayedApps > 0 ? (
            "Perlu tindakan segera"
          ) : (
            <>
              Proses berjalan normal <IconMinus className="size-4" />
            </>
          )
        }
        footerDetail="Menunggu tinjauan HRD"
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
        footer={
          <>
            Kualitas kandidat meningkat <IconTrendingUp className="size-4" />
          </>
        }
        footerDetail="Di atas rata-rata bulan lalu"
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
        footer={
          <>
            Berdasarkan skor AI <IconTrendingUp className="size-4" />
          </>
        }
        footerDetail="Memenuhi kriteria perusahaan"
      />
    </>
  )
}
