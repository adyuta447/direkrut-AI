"use client"

import { useEffect } from "react"
import Link from "next/link"
import { BriefcaseIcon } from "lucide-react"
import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { HrdStatCards } from "@/components/organisms/dashboard/HrdStatCards"
import { ChartAreaInteractive } from "@/components/organisms/dashboard/ChartAreaInteractive"
import { DataTable } from "@/components/organisms/dashboard/CandidateDataTable"
import { ChartBarMixed } from "@/components/organisms/dashboard/ChartBarMixed"
import { ChartPieLabelList } from "@/components/organisms/dashboard/ChartPieLabelList"
import { Button } from "@/components/ui/button"
import { useDashboard } from "@/context/DashboardContext"

export default function HrdDashboardPage() {
  const { applications, currentUser, refetchApplications } = useDashboard()
  useEffect(() => {
    void refetchApplications()
  }, [])

  const perluTinjauan = applications.filter((a) => a.status === "under-review").length

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-8 py-6 md:py-8">
        <div className="px-4 lg:px-6">
          <PageHeader
            size="lg"
            eyebrow="Ringkasan Hari Ini"
            title={`Halo, ${currentUser?.name ?? "HRD"} 👋`}
            description={
              perluTinjauan > 0
                ? `Ada ${perluTinjauan} lamaran nunggu ditinjau nih. Semua progres rekrutmen kepantau gampang dari sini.`
                : "Mantap, semua lamaran udah ditinjau! Progres rekrutmen tetap kepantau dari sini."
            }
            action={
              <Button render={<Link href="/hrd/jobs" />}>
                <BriefcaseIcon className="size-4" />
                Kelola Lowongan
              </Button>
            }
          />
        </div>

        <HrdStatCards />

        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>

        <DataTable data={applications} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 lg:px-6 pb-6">
          <ChartBarMixed />
          <ChartPieLabelList />
        </div>
      </div>
    </div>
  )
}
