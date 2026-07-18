import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts"
import { ChartCard, CHART_TOOLTIP_STYLE } from "@/components/molecules/dashboard/ChartCard"
import type { AnalyticsDatum } from "@/lib/dashboard/useCandidateAnalytics"

interface CandidateAnalyticsChartsProps {
  statusData: AnalyticsDatum[]
  scoreData: AnalyticsDatum[]
  expData: AnalyticsDatum[]
}

export function CandidateAnalyticsCharts({ statusData, scoreData, expData }: CandidateAnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 fade-in duration-300">
      <ChartCard title="Status Kandidat" description="Sebaran status tahapan kandidat">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip
              formatter={(value) => [`${value} Kandidat`, "Jumlah"]}
              contentStyle={CHART_TOOLTIP_STYLE}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Skor Rekomendasi AI" description="Kelayakan berdasarkan analisis profil">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis fontSize={11} tickLine={false} axisLine={false} />
            <RechartsTooltip cursor={{ fill: "var(--muted)" }} contentStyle={CHART_TOOLTIP_STYLE} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Tingkat Pengalaman" description="Lama pengalaman kerja kandidat">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={expData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis fontSize={11} tickLine={false} axisLine={false} />
            <RechartsTooltip cursor={{ fill: "var(--muted)" }} contentStyle={CHART_TOOLTIP_STYLE} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
