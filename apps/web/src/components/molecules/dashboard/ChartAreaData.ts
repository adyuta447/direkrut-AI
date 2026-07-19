import { type ChartConfig } from "@/components/ui/chart"

export interface ChartDataPoint {
  date: string
  total: number
  wawancara: number
}

interface Application {
  appliedDate: string
  status: string
}

// Direkonstruksi dari lamaran asli (dikelompokkan per hari, dari appliedDate),
// bukan mock statis -- sebelumnya chart ini nunjukin angka acak yang gak
// nyambung sama data beneran.
export function buildAreaChartData(applications: Application[]): ChartDataPoint[] {
  const byDay = new Map<string, { total: number; wawancara: number }>()
  applications.forEach((app) => {
    const day = app.appliedDate.slice(0, 10)
    if (!day) return
    const entry = byDay.get(day) ?? { total: 0, wawancara: 0 }
    entry.total += 1
    if (app.status === "interview") entry.wawancara += 1
    byDay.set(day, entry)
  })
  return Array.from(byDay.entries())
    .map(([date, counts]) => ({ date, ...counts }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export const AREA_CHART_CONFIG = {
  visitors: { label: "Kandidat" },
  total: {
    label: "Total Lamaran",
    color: "var(--chart-1)",
  },
  wawancara: {
    label: "Lolos Wawancara",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function filterByTimeRange(
  data: ChartDataPoint[],
  timeRange: string
): ChartDataPoint[] {
  const daysMap: Record<string, number> = { "90d": 90, "30d": 30, "7d": 7 }
  const daysToSubtract = daysMap[timeRange] ?? 90
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - daysToSubtract)
  return data.filter((item) => new Date(item.date) >= startDate)
}
