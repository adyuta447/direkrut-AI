"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A radar chart showing candidate skills"

const chartConfig = {
  score: {
    label: "Skor AI",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface ChartRadarDotsProps {
  data: Array<{
    parameter: string
    score: number
  }>
}

export function ChartRadarDots({ data }: ChartRadarDotsProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto h-full w-full"
    >
      <RadarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarAngleAxis dataKey="parameter" tick={{ fill: "currentColor", fontSize: 11 }} />
        <PolarGrid />
        <Radar
          dataKey="score"
          fill="var(--color-score)"
          fillOpacity={0.6}
          dot={{
            r: 4,
            fillOpacity: 1,
          }}
        />
      </RadarChart>
    </ChartContainer>
  )
}
