"use client"

import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { ChartBarMixed } from "@/components/chart-bar-mixed"
import { ChartPieLabelList } from "@/components/chart-pie-label-list"
import { useApp } from "@/components/providers/app-provider"

export default function HrdDashboardPage() {
  const { applications } = useApp()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
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
    </div>
  )
}
