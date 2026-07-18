import { IconChartPie, IconChevronDown, IconChevronUp } from "@tabler/icons-react"
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip as RechartsTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts"
import { CHART_TOOLTIP_STYLE } from "@/components/molecules/dashboard/ChartCard"
import { Button } from "@/components/ui/button"

interface ChartEntry {
  name: string
  value?: number
  count?: number
  color?: string
  fill?: string
}

export function CrossRoleAnalyticsToggle({
  show, onToggle, totalVisible,
}: { show: boolean; onToggle: () => void; totalVisible: number }) {
  if (totalVisible <= 0) return null
  return (
    <Button variant="outline" className="rounded-full border-hairline shrink-0" onClick={onToggle}>
      <IconChartPie className="size-4 mr-2 text-primary" />
      {show ? "Tutup Analisis" : "Lihat Analisis"}
      {show
        ? <IconChevronUp className="size-4 ml-2" />
        : <IconChevronDown className="size-4 ml-2" />}
    </Button>
  )
}

interface CrossRoleAnalyticsChartsProps {
  chartData: ChartEntry[]
  relevanceData: ChartEntry[]
  evidenceData: ChartEntry[]
}

function AnalyticsCard({
  band, title, description, children,
}: { band: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col rounded-3xl border border-hairline bg-canvas shadow-none overflow-hidden">
      <div className={`${band} px-6 py-5 text-center text-white`}>
        <h3 className="text-[17px] font-semibold">{title}</h3>
        <p className="mt-1 text-xs text-white/80">{description}</p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        {children}
      </div>
    </div>
  )
}

export function CrossRoleAnalyticsCharts({
  chartData, relevanceData, evidenceData,
}: CrossRoleAnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 fade-in duration-300 w-full max-w-6xl mx-auto">
      <AnalyticsCard band="bg-primary" title="Top 5 Posisi Potensial" description="Sebaran rekomendasi lintas posisi">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value) => [`${value} Kandidat`, "Jumlah"]}
                contentStyle={CHART_TOOLTIP_STYLE}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </AnalyticsCard>

      <AnalyticsCard band="bg-success" title="Tingkat Relevansi" description="Seberapa nyambung profil ke posisi baru">
        <div className="min-h-[220px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={relevanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} />
              <RechartsTooltip cursor={{ fill: "var(--muted)" }} contentStyle={CHART_TOOLTIP_STYLE} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </AnalyticsCard>

      <AnalyticsCard band="bg-brand-accent-strong" title="Sumber Penemuan AI" description="Dari mana AI nemuin potensi ini">
        <div className="min-h-[220px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={evidenceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} />
              <RechartsTooltip cursor={{ fill: "var(--muted)" }} contentStyle={CHART_TOOLTIP_STYLE} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </AnalyticsCard>
    </div>
  )
}
