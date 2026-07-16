"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
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
} from "@/components/ui/chart"
import { useDashboard } from "@/context/DashboardContext"
import { buildTopJobsData } from "@/components/molecules/dashboard/ChartBarData"

export const description = "A mixed bar chart showing top jobs"

export function ChartBarMixed() {
  const { applications } = useDashboard()

  const { topJobs, chartConfig } = React.useMemo(
    () => buildTopJobsData(applications),
    [applications]
  )

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Top 5 Posisi Paling Diminati</CardTitle>
        <CardDescription>Berdasarkan total pelamar yang masuk</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={topJobs}
            layout="vertical"
            margin={{ left: 0 }}
          >
            <YAxis
              dataKey="jobKey"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label || value
              }
              width={140}
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm mt-4">
        <div className="flex gap-2 leading-none font-medium">
          Persaingan ketat di posisi teratas <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Menampilkan 5 posisi dengan pelamar terbanyak
        </div>
      </CardFooter>
    </Card>
  )
}
