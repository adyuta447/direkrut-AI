"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", total: 222, wawancara: 150 },
  { date: "2024-04-02", total: 97, wawancara: 180 },
  { date: "2024-04-03", total: 167, wawancara: 120 },
  { date: "2024-04-04", total: 242, wawancara: 260 },
  { date: "2024-04-05", total: 373, wawancara: 290 },
  { date: "2024-04-06", total: 301, wawancara: 340 },
  { date: "2024-04-07", total: 245, wawancara: 180 },
  { date: "2024-04-08", total: 409, wawancara: 320 },
  { date: "2024-04-09", total: 59, wawancara: 110 },
  { date: "2024-04-10", total: 261, wawancara: 190 },
  { date: "2024-04-11", total: 327, wawancara: 350 },
  { date: "2024-04-12", total: 292, wawancara: 210 },
  { date: "2024-04-13", total: 342, wawancara: 380 },
  { date: "2024-04-14", total: 137, wawancara: 220 },
  { date: "2024-04-15", total: 120, wawancara: 170 },
  { date: "2024-04-16", total: 138, wawancara: 190 },
  { date: "2024-04-17", total: 446, wawancara: 360 },
  { date: "2024-04-18", total: 364, wawancara: 410 },
  { date: "2024-04-19", total: 243, wawancara: 180 },
  { date: "2024-04-20", total: 89, wawancara: 150 },
  { date: "2024-04-21", total: 137, wawancara: 200 },
  { date: "2024-04-22", total: 224, wawancara: 170 },
  { date: "2024-04-23", total: 138, wawancara: 230 },
  { date: "2024-04-24", total: 387, wawancara: 290 },
  { date: "2024-04-25", total: 215, wawancara: 250 },
  { date: "2024-04-26", total: 75, wawancara: 130 },
  { date: "2024-04-27", total: 383, wawancara: 420 },
  { date: "2024-04-28", total: 122, wawancara: 180 },
  { date: "2024-04-29", total: 315, wawancara: 240 },
  { date: "2024-04-30", total: 454, wawancara: 380 },
  { date: "2024-05-01", total: 165, wawancara: 220 },
  { date: "2024-05-02", total: 293, wawancara: 310 },
  { date: "2024-05-03", total: 247, wawancara: 190 },
  { date: "2024-05-04", total: 385, wawancara: 420 },
  { date: "2024-05-05", total: 481, wawancara: 390 },
  { date: "2024-05-06", total: 498, wawancara: 520 },
  { date: "2024-05-07", total: 388, wawancara: 300 },
  { date: "2024-05-08", total: 149, wawancara: 210 },
  { date: "2024-05-09", total: 227, wawancara: 180 },
  { date: "2024-05-10", total: 293, wawancara: 330 },
  { date: "2024-05-11", total: 335, wawancara: 270 },
  { date: "2024-05-12", total: 197, wawancara: 240 },
  { date: "2024-05-13", total: 197, wawancara: 160 },
  { date: "2024-05-14", total: 448, wawancara: 490 },
  { date: "2024-05-15", total: 473, wawancara: 380 },
  { date: "2024-05-16", total: 338, wawancara: 400 },
  { date: "2024-05-17", total: 499, wawancara: 420 },
  { date: "2024-05-18", total: 315, wawancara: 350 },
  { date: "2024-05-19", total: 235, wawancara: 180 },
  { date: "2024-05-20", total: 177, wawancara: 230 },
  { date: "2024-05-21", total: 82, wawancara: 140 },
  { date: "2024-05-22", total: 81, wawancara: 120 },
  { date: "2024-05-23", total: 252, wawancara: 290 },
  { date: "2024-05-24", total: 294, wawancara: 220 },
  { date: "2024-05-25", total: 201, wawancara: 250 },
  { date: "2024-05-26", total: 213, wawancara: 170 },
  { date: "2024-05-27", total: 420, wawancara: 460 },
  { date: "2024-05-28", total: 233, wawancara: 190 },
  { date: "2024-05-29", total: 78, wawancara: 130 },
  { date: "2024-05-30", total: 340, wawancara: 280 },
  { date: "2024-05-31", total: 178, wawancara: 230 },
  { date: "2024-06-01", total: 178, wawancara: 200 },
  { date: "2024-06-02", total: 470, wawancara: 410 },
  { date: "2024-06-03", total: 103, wawancara: 160 },
  { date: "2024-06-04", total: 439, wawancara: 380 },
  { date: "2024-06-05", total: 88, wawancara: 140 },
  { date: "2024-06-06", total: 294, wawancara: 250 },
  { date: "2024-06-07", total: 323, wawancara: 370 },
  { date: "2024-06-08", total: 385, wawancara: 320 },
  { date: "2024-06-09", total: 438, wawancara: 480 },
  { date: "2024-06-10", total: 155, wawancara: 200 },
  { date: "2024-06-11", total: 92, wawancara: 150 },
  { date: "2024-06-12", total: 492, wawancara: 420 },
  { date: "2024-06-13", total: 81, wawancara: 130 },
  { date: "2024-06-14", total: 426, wawancara: 380 },
  { date: "2024-06-15", total: 307, wawancara: 350 },
  { date: "2024-06-16", total: 371, wawancara: 310 },
  { date: "2024-06-17", total: 475, wawancara: 520 },
  { date: "2024-06-18", total: 107, wawancara: 170 },
  { date: "2024-06-19", total: 341, wawancara: 290 },
  { date: "2024-06-20", total: 408, wawancara: 450 },
  { date: "2024-06-21", total: 169, wawancara: 210 },
  { date: "2024-06-22", total: 317, wawancara: 270 },
  { date: "2024-06-23", total: 480, wawancara: 530 },
  { date: "2024-06-24", total: 132, wawancara: 180 },
  { date: "2024-06-25", total: 141, wawancara: 190 },
  { date: "2024-06-26", total: 434, wawancara: 380 },
  { date: "2024-06-27", total: 448, wawancara: 490 },
  { date: "2024-06-28", total: 149, wawancara: 200 },
  { date: "2024-06-29", total: 103, wawancara: 160 },
  { date: "2024-06-30", total: 446, wawancara: 400 },
]

const chartConfig = {
  visitors: {
    label: "Kandidat",
  },
  total: {
    label: "Total Lamaran",
    color: "var(--chart-1)",
  },
  wawancara: {
    label: "Lolos Wawancara",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Tren Lamaran Masuk</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total pelamar vs lolos wawancara (3 bulan terakhir)
          </span>
          <span className="@[540px]/card:hidden">3 Bulan Terakhir</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            value={timeRange as any}
            onValueChange={(v: any) => setTimeRange(v as string)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">90 Hari</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 Hari</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 Hari</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={(val: any) => val && setTimeRange(val)}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="3 Bulan Terakhir" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                90 Hari
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 Hari
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 Hari
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillWawancara" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-wawancara)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-wawancara)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("id-ID", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("id-ID", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="wawancara"
              type="natural"
              fill="url(#fillWawancara)"
              stroke="var(--color-wawancara)"
              stackId="a"
            />
            <Area
              dataKey="total"
              type="natural"
              fill="url(#fillTotal)"
              stroke="var(--color-total)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
