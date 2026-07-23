"use client"

import Link from "next/link"
import { useDashboard } from "@/context/DashboardContext"
import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { StatCard, StatCardGrid } from "@/components/molecules/dashboard/StatCard"
import { Button } from "@/components/ui/button"
import {
  CandidateRecentApplications,
  CandidateRecentApplicationsHeader,
} from "@/components/molecules/dashboard/CandidateRecentApplications"
import { CandidateAIBanner } from "@/components/molecules/dashboard/CandidateAIBanner"
import { BriefcaseIcon } from "lucide-react"

export default function CandidateDashboardPage() {
  const { myApplications, currentUser } = useDashboard()

  const total = myApplications.length
  const administrasi = myApplications.filter((a) => a.status === "under-review").length
  const wawancara = myApplications.filter((a) => a.status === "interview").length
  const ditolak = myApplications.filter((a) => a.status === "rejected").length
  const aktif = total - ditolak

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-8 py-6 md:py-8">
        <div className="px-4 lg:px-6">
          <PageHeader
            size="lg"
            eyebrow="Dashboard Kamu"
            title={`Halo, ${currentUser?.name ?? "Kandidat"} 👋`}
            description={
              aktif > 0
                ? `Ada ${aktif} lamaran yang lagi jalan. Semua progresnya kepantau dari sini.`
                : "Belum ada lamaran yang jalan. Yuk mulai, biar AI yang urus sisanya."
            }
            action={
              <Button render={<Link href="/candidate/jobs" />}>
                <BriefcaseIcon className="size-4" />
                Cari Lowongan
              </Button>
            }
          />
        </div>

        <StatCardGrid>
          <StatCard
            label="Lamaran Terkirim"
            value={total}
            className="bg-surface-soft border-transparent text-white [&_.text-muted-foreground]:text-white/80"
            image="/dashboard/paper.svg"
            footerDetail="Semua yang udah kamu kirim"
          />
          <StatCard
            label="Tahap Administrasi"
            value={administrasi}
            className="bg-surface-soft border-transparent text-white [&_.text-muted-foreground]:text-white/80"
            image="/dashboard/administrasi.svg"
            footerDetail="Lagi dicek sama HRD"
          />
          <StatCard
            label="Wawancara"
            className="bg-surface-soft border-transparent text-white [&_.text-muted-foreground]:text-white/80"
            value={wawancara}
            image="/dashboard/conference.svg"
            footerDetail={wawancara > 0 ? "Gas, siapin dirimu!" : "Belum ada jadwal"}
          />
          <StatCard
            label="Ditolak"
            value={ditolak}
            className="bg-destructive border-transparent text-white [&_.text-muted-foreground]:text-white/80"
            image="/dashboard/decline.svg"
            footerDetail={ditolak > 0 ? "Gapapa, lanjut coba yang lain" : "Aman, belum ada"}
          />
        </StatCardGrid>

        <div className="flex flex-col gap-4 px-4 lg:px-6">
          <CandidateRecentApplicationsHeader />
          <CandidateRecentApplications applications={myApplications} />
        </div>

        <div className="px-4 lg:px-6">
          <CandidateAIBanner />
        </div>
      </div>
    </div>
  )
}
