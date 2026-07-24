import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from "recharts"
import { ChartCard, CHART_TOOLTIP_STYLE } from "@/components/molecules/dashboard/ChartCard"
import type { Job } from "@/lib/types"

interface ApplicationStatsTabProps {
  job: Pick<Job, "title" | "company">
  jobApplicationsCount: number
  applicationFlowData: { name: string; value: number; fill: string }[]
  positionDistribution: { name: string; value: number }[]
}

export function ApplicationStatsTab({ job, jobApplicationsCount, applicationFlowData, positionDistribution }: ApplicationStatsTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <ChartCard title="Funnel Lamaran Posisi Ini" description={`Dari ${jobApplicationsCount} kandidat yang melamar ${job.title}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={applicationFlowData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis fontSize={10} tickLine={false} axisLine={false} />
            <RechartsTooltip contentStyle={CHART_TOOLTIP_STYLE} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {applicationFlowData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title={`Posisi Lain di ${job.company}`} description="Jumlah pelamar per posisi yang lagi buka">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={positionDistribution} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
            <XAxis type="number" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" fontSize={10} tickLine={false} axisLine={false} width={100} />
            <RechartsTooltip contentStyle={CHART_TOOLTIP_STYLE} />
            <Bar dataKey="value" fill="var(--chart-1)" radius={[0, 4, 4, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
