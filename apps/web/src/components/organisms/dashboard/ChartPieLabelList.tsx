"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"
import { getExtendedData } from "@/lib/dashboard/extended-data"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useDashboard } from "@/context/DashboardContext"

export const description = "A pie chart displaying candidate statuses"

const chartConfig = {
  count: {
    label: "Kandidat",
  },
  "fresh-graduate": {
    label: "Fresh Graduate",
    color: "var(--chart-1)",
  },
  professional: {
    label: "Professional",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartPieLabelList() {
  const { applications } = useDashboard()

  const chartData = React.useMemo(() => {
    let fg = 0, pro = 0
    applications.forEach(app => {
      const cat = getExtendedData(app.applicantName).category
      if (cat === "fresh-graduate") fg++
      else pro++
    })
    return [
      { category: "fresh-graduate", count: fg, fill: "var(--color-fresh-graduate)" },
      { category: "professional", count: pro, fill: "var(--color-professional)" },
    ]
  }, [applications])

  const total = chartData[0].count + chartData[1].count || 1
  const fgPct = Math.round((chartData[0].count / total) * 100)
  const proPct = 100 - fgPct

  return (
    <Card className="flex flex-col h-full rounded-3xl border border-hairline bg-canvas shadow-none ring-0 overflow-hidden pt-0">
      <CardHeader className="items-center rounded-t-3xl bg-brand-accent-strong py-5 text-white">
        <CardTitle className="text-[20px] font-semibold text-white">Demografi Kategori Kandidat</CardTitle>
        <CardDescription className="text-white/80">Fresh Graduate vs Professional</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pt-6 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[220px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="count" hideLabel />}
            />
            <Pie data={chartData} dataKey="count" nameKey="category">
              <LabelList
                dataKey="category"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: any) =>
                  chartConfig[value as keyof typeof chartConfig]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 flex justify-center gap-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
            style={{ backgroundColor: "var(--chart-2)" }}
          >
            Professional {proPct}%
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
            style={{ backgroundColor: "var(--chart-1)" }}
          >
            Fresh Graduate {fgPct}%
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm mt-4">
        <div className="flex items-center gap-2 leading-none font-medium">
          Kandidat Professional lebih mendominasi <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Dipakai AI buat nentuin bobot penilaian yang beda
        </div>
      </CardFooter>
    </Card>
  )
}
