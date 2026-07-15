"use client"

import { IconTrendingUp, IconMinus } from "@tabler/icons-react"
import { useDashboard } from "@/components/dashboard-provider"
import { getExtendedData } from "@/components/data-table"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function getScoreLabel(score?: number): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  if (!score) return { label: "—", variant: "outline" };
  if (score >= 75) return { label: "Memenuhi Syarat", variant: "default" };
  if (score >= 55) return { label: "Perlu Dikembangkan", variant: "secondary" };
  return { label: "Tidak Sesuai", variant: "destructive" };
}

export function SectionCards() {
  const { applications } = useDashboard()

  const totalLamaran = applications.length
  const administrasiApps = applications.filter((a) => a.status === "under-review")
  const tahapAdministrasi = administrasiApps.length
  const delayedApps = administrasiApps.filter(a => (getExtendedData(a.applicantName).waitingDays || 0) > 7).length
  
  const wawancara = applications.filter((a) => a.status === "interview").length
  
  const applicationsWithScore = applications.filter((a) => a.recommendationScore)
  const avgScore = applicationsWithScore.length > 0
    ? Math.round(
        applicationsWithScore.reduce((sum, a) => sum + (a.recommendationScore || 0), 0) /
          applicationsWithScore.length,
      )
    : undefined
  const avgScoreLabel = getScoreLabel(avgScore)

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Lamaran</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalLamaran}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Tren naik bulan ini <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Berdasarkan 30 hari terakhir
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card border-yellow-500/20">
        <CardHeader>
          <CardDescription>Tahap Administrasi</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {tahapAdministrasi}
          </CardTitle>
          <CardAction>
            {delayedApps > 0 ? (
              <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">
                {delayedApps} Terbengkalai {'>'} 7 Hari
              </Badge>
            ) : (
              <Badge variant="outline">
                <IconMinus />
                Stabil
              </Badge>
            )}
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {delayedApps > 0 ? (
              <span className="text-red-600 dark:text-red-400">Tindakan segera diperlukan</span>
            ) : (
              <>Proses berjalan normal <IconMinus className="size-4" /></>
            )}
          </div>
          <div className="text-muted-foreground">
            Menunggu review HR
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Lolos Wawancara</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {wawancara}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Kualitas kandidat meningkat <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Di atas rata-rata bulan lalu</div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Rata-rata Kecocokan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
            {avgScoreLabel.label}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={
              avgScoreLabel.variant === "default" ? "text-green-500" :
              avgScoreLabel.variant === "secondary" ? "text-yellow-500" : "text-red-500"
            }>
              {avgScore ? `${avgScore}%` : "-"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Berdasarkan skor AI <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Memenuhi kriteria perusahaan</div>
        </CardFooter>
      </Card>
    </div>
  )
}
