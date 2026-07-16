import { type ChartConfig } from "@/components/ui/chart"

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

interface Application {
  jobTitle: string
}

export interface TopJobEntry {
  jobKey: string
  jobTitle: string
  count: number
  fill: string
}

export function buildTopJobsData(applications: Application[]): {
  topJobs: TopJobEntry[]
  chartConfig: ChartConfig
} {
  const jobCounts: Record<string, number> = {}
  applications.forEach((app) => {
    jobCounts[app.jobTitle] = (jobCounts[app.jobTitle] || 0) + 1
  })

  const sorted = Object.entries(jobCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const config: ChartConfig = {
    count: { label: "Kandidat" },
  }

  const topJobs = sorted.map(([jobTitle, count], index) => {
    const key = `job${index + 1}`
    config[key] = {
      label: jobTitle,
      color: CHART_COLORS[index],
    }
    return {
      jobKey: key,
      jobTitle,
      count,
      fill: `var(--color-${key})`,
    }
  })

  return { topJobs, chartConfig: config }
}
