"use client"

import { Pie, PieChart, LabelList } from "recharts"

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

const chartConfig = {
  terkirim: { label: "Terkirim", color: "hsl(var(--muted-foreground))" },
  review: { label: "Sedang Direview", color: "hsl(var(--chart-4))" },
  interview: { label: "Wawancara", color: "hsl(var(--chart-2))" },
  rejected: { label: "Ditolak", color: "hsl(var(--destructive))" },
} satisfies ChartConfig

export function ChartCandidatePie({ data }: { data: any[] }) {
  const chartData = [
    { status: "Terkirim", count: data.filter(a => a.status === 'submitted').length, fill: "var(--color-terkirim)" },
    { status: "Sedang Direview", count: data.filter(a => a.status === 'under-review').length, fill: "var(--color-review)" },
    { status: "Wawancara", count: data.filter(a => a.status === 'interview').length, fill: "var(--color-interview)" },
    { status: "Ditolak", count: data.filter(a => a.status === 'rejected').length, fill: "var(--color-rejected)" },
  ].filter(d => d.count > 0)

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-2">
        <CardTitle>Sebaran Status Lamaran</CardTitle>
        <CardDescription>Distribusi berdasarkan tahap seleksi</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={40}
              outerRadius={80}
            >
              <LabelList
                dataKey="status"
                position="outside"
                stroke="none"
                fill="currentColor"
                className="text-[10px] font-medium"
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
