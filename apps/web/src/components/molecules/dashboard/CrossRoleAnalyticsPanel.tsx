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

interface CrossRoleAnalyticsPanelProps {
  show: boolean
  onToggle: () => void
  chartData: ChartEntry[]
  relevanceData: ChartEntry[]
  evidenceData: ChartEntry[]
  totalVisible: number
}

export function CrossRoleAnalyticsPanel({
  show, onToggle, chartData, relevanceData, evidenceData, totalVisible,
}: CrossRoleAnalyticsPanelProps) {
  return (
    <>
      {totalVisible > 0 && (
        <Button variant="outline" onClick={onToggle}>
          <IconChartPie className="size-4 mr-2 text-primary" />
          {show ? "Tutup Analisis" : "Lihat Analisis"}
          {show
            ? <IconChevronUp className="size-4 ml-2" />
            : <IconChevronDown className="size-4 ml-2" />}
        </Button>
      )}

      {show && totalVisible > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 fade-in duration-300 w-full max-w-6xl mx-auto">
          <div className="bg-background rounded-xl border p-6 flex flex-col items-center justify-center">
            <h3 className="font-semibold mb-2 text-center">Top 5 Posisi Potensial</h3>
            <p className="text-xs text-muted-foreground text-center mb-6">Distribusi berdasarkan peran lintas</p>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: any) => [`${value} Kandidat`, "Jumlah"]}
                    contentStyle={CHART_TOOLTIP_STYLE}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-background rounded-xl border p-6 flex flex-col items-center justify-center">
            <h3 className="font-semibold mb-2 text-center">Tingkat Relevansi</h3>
            <p className="text-xs text-muted-foreground text-center mb-6">Kekuatan profil vs posisi baru</p>
            <div className="flex-1 min-h-[220px] w-full">
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
          </div>

          <div className="bg-background rounded-xl border p-6 flex flex-col items-center justify-center">
            <h3 className="font-semibold mb-2 text-center">Sumber Penemuan AI</h3>
            <p className="text-xs text-muted-foreground text-center mb-6">Dari mana asal potensi kandidat?</p>
            <div className="flex-1 min-h-[220px] w-full">
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
          </div>
        </div>
      )}
    </>
  )
}
