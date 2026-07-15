"use client"

import * as React from "react"
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  score: { label: "Skor AI", color: "hsl(var(--chart-2))" }
} satisfies ChartConfig

export function ChartCandidateBar({ data, jobs }: { data: any[], jobs: any[] }) {
  const chartData = React.useMemo(() => {
    return data
      .filter(app => app.recommendationScore)
      .slice(0, 5)
      .map(app => {
        const job = jobs.find(j => j.id === app.jobId)
        return {
          title: job ? job.title.split(' ')[0] : 'Posisi',
          score: app.recommendationScore || 0,
        }
      })
  }, [data, jobs])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-2 text-center">
        <CardTitle>Tingkat Kesesuaian Posisi</CardTitle>
        <CardDescription>Skor kecocokan profil Anda (Top 5)</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-[200px] w-full mt-4">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="title" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="score" fill="var(--color-score)" radius={[4, 4, 0, 0]} barSize={32} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
