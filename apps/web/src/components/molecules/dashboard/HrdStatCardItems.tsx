import { IconTrendingUp, IconMinus, IconCheck } from "@tabler/icons-react"
import { daysSinceApplied } from "@/lib/dashboard/extended-data"
import { StatCard } from "@/components/molecules/dashboard/StatCard"
import { Badge } from "@/components/ui/badge"

interface Application {
  status: string
  applicantName: string
  appliedDate: string
  recommendationScore?: number
}

interface HrdStatCardItemsProps {
  applications: Application[]
}


const SOLID_CARD = "border-transparent text-white [&_.text-muted-foreground]:text-white/80"
const SOLID_BADGE = "border-white/40 bg-white/10 text-white"

export function HrdStatCardItems({ applications }: HrdStatCardItemsProps) {
  const totalLamaran = applications.length
  const administrasiApps = applications.filter((a) => a.status === "under-review")
  const tahapAdministrasi = administrasiApps.length
  const delayedApps = administrasiApps.filter(
    (a) => daysSinceApplied(a.appliedDate) > 7
  ).length
  const wawancara = applications.filter((a) => a.status === "interview" || a.status === "interview_completed").length
  const belumDiscreen = applications.filter(
    (a) => a.status !== "rejected" && a.status !== "accepted" && a.recommendationScore == null
  ).length

  return (
    <>
      <StatCard
        label="Total Lamaran"
        value={totalLamaran}
        className={`bg-surface-coral ${SOLID_CARD}`}
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
        className={`bg-surface-coral ${SOLID_CARD}`}
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
        className={`bg-surface-coral ${SOLID_CARD}`}
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
        label="Belum Discreen AI"
        value={belumDiscreen}
        className={`bg-surface-coral ${SOLID_CARD}`}
        badge={
          belumDiscreen > 0 ? (
            <Badge variant="outline" className="border-white/40 bg-white text-warning font-semibold">
              Perlu Screening
            </Badge>
          ) : (
            <Badge variant="outline" className={SOLID_BADGE}>
              <IconCheck />
              Semua Beres
            </Badge>
          )
        }
        footer={belumDiscreen > 0 ? "Klik buat jalanin screening AI" : "Semua CV udah dianalisis AI"}
        footerDetail={belumDiscreen > 0 ? `${belumDiscreen} kandidat nunggu dinilai` : "Gak ada yang ketinggalan"}
      />
    </>
  )
}
