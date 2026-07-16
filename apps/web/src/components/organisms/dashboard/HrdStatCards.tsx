"use client"

import { useDashboard } from "@/context/DashboardContext"
import { StatCardGrid } from "@/components/molecules/dashboard/StatCard"
import { HrdStatCardItems } from "@/components/molecules/dashboard/HrdStatCardItems"

export function HrdStatCards() {
  const { applications } = useDashboard()

  return (
    <StatCardGrid>
      <HrdStatCardItems applications={applications} />
    </StatCardGrid>
  )
}
