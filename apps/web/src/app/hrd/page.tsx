"use client"

import { HrdStatCards } from "@/components/organisms/dashboard/HrdStatCards"
import { ChartAreaInteractive } from "@/components/organisms/dashboard/ChartAreaInteractive"
import { DataTable } from "@/components/organisms/dashboard/CandidateDataTable"
import { ChartBarMixed } from "@/components/organisms/dashboard/ChartBarMixed"
import { ChartPieLabelList } from "@/components/organisms/dashboard/ChartPieLabelList"
import { useDashboard } from "@/context/DashboardContext"

export default function HrdDashboardPage() {
  const { applications } = useDashboard()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
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
    </div>
  )
}
