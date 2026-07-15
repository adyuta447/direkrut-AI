"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A bar chart comparing candidate vs average"

const chartConfig = {
  score: {
    label: "Skor AI",
  },
  candidate: {
    label: "Kandidat Ini",
    color: "var(--chart-2)",
  },
  average: {
    label: "Rata-rata Pelamar",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface ChartBarComparisonProps {
  candidateScore: number
  averageScore: number
}

export function ChartBarComparison({ candidateScore, averageScore }: ChartBarComparisonProps) {
  const data = [
    { category: "Kandidat Ini", score: candidateScore, fill: "var(--color-candidate)" },
    { category: "Rata-rata", score: averageScore, fill: "var(--color-average)" },
  ]

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-4">
        <CardTitle>Perbandingan Kandidat</CardTitle>
        <CardDescription>Skor AI Kandidat vs Rata-rata Posisi Serupa</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-2">
        <ChartContainer config={chartConfig} className="w-full h-[200px]">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis 
              dataKey="category" 
              type="category" 
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              width={90}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="score" radius={4} barSize={40} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
