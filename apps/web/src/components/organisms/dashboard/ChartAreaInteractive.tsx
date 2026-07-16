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
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  CHART_DATA,
  AREA_CHART_CONFIG,
  filterByTimeRange,
} from "@/components/molecules/dashboard/ChartAreaData"

export const description = "An interactive area chart"

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    month: "short",
    day: "numeric",
  })
}

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d")
  }, [isMobile])

  const filteredData = filterByTimeRange(CHART_DATA, timeRange)

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
          <Select
            value={timeRange}
            onValueChange={(val: any) => val && setTimeRange(val)}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="3 Bulan Terakhir" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">90 Hari</SelectItem>
              <SelectItem value="30d" className="rounded-lg">30 Hari</SelectItem>
              <SelectItem value="7d" className="rounded-lg">7 Hari</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={AREA_CHART_CONFIG}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-total)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillWawancara" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-wawancara)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-wawancara)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatDate}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatDate(String(value))}
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
