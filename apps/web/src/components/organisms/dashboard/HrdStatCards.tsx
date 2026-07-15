"use client"

import { IconTrendingUp, IconMinus } from "@tabler/icons-react"
import { useDashboard } from "@/context/DashboardContext"
import { getExtendedData } from "@/lib/dashboard/extended-data"
import { getScoreLevel } from "@/lib/dashboard/status"
import { StatCard, StatCardGrid } from "@/components/molecules/dashboard/StatCard"
import { Badge } from "@/components/ui/badge"

export function HrdStatCards() {
  const { applications } = useDashboard()

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
          applicationsWithScore.reduce((sum, a) => sum + (a.recommendationScore || 0), 0) /
            applicationsWithScore.length
        )
      : undefined
  const avgLevel = getScoreLevel(avgScore)

  return (
    <StatCardGrid>
      <StatCard
        label="Total Lamaran"
        value={totalLamaran}
        badge={
          <Badge variant="outline">
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
        className={delayedApps > 0 ? "border-warning/30" : undefined}
        badge={
          delayedApps > 0 ? (
            <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
              {delayedApps} Terbengkalai {">"} 7 Hari
            </Badge>
          ) : (
            <Badge variant="outline">
              <IconMinus />
              Stabil
            </Badge>
          )
        }
        footer={
          delayedApps > 0 ? (
            <span className="text-destructive">Perlu tindakan segera</span>
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
        badge={
          <Badge variant="outline">
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
        value={avgLevel.label}
        badge={
          <Badge variant="outline" style={{ color: avgLevel.color }}>
            {avgScore ? `${avgScore}%` : "-"}
          </Badge>
        }
        footer={
          <>
            Berdasarkan skor AI <IconTrendingUp className="size-4" />
          </>
        }
        footerDetail="Memenuhi kriteria perusahaan"
      />
    </StatCardGrid>
  )
}
