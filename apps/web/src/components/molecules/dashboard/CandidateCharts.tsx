import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Tooltip as RechartsTooltip, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts"
import { CHART_TOOLTIP_STYLE } from "@/components/molecules/dashboard/ChartCard"

interface CandidateChartsProps {
  weightData: { name: string; value: number; fill: string }[]
  radarData: { parameter: string; score: number }[]
  softSkillData: { name: string; score: number; fill: string }[]
}

export function CandidateCharts({ weightData, radarData, softSkillData }: CandidateChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-background rounded-xl border p-4 sm:p-6 flex flex-col items-center justify-center shadow-sm">
        <h3 className="font-semibold mb-1 text-center text-sm sm:text-base">Pembobotan Skor AI</h3>
        <p className="text-[11px] sm:text-xs text-muted-foreground text-center mb-4">Formula kalkulasi nilai</p>
        <div className="w-full h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={weightData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={5} dataKey="value">
                {weightData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
              </Pie>
              <RechartsTooltip formatter={(value: any) => [`${value}%`, "Bobot"]} contentStyle={CHART_TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {weightData.map((d, i) => (
            <div key={i} className="flex items-center gap-1 text-[10px]">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }} />
              <span>{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-background rounded-xl border p-4 sm:p-6 flex flex-col items-center justify-center shadow-sm">
        <h3 className="font-semibold mb-1 text-center text-sm sm:text-base">Peta Kompetensi Inti</h3>
        <p className="text-[11px] sm:text-xs text-muted-foreground text-center mb-4">Radar chart kemampuan teknis</p>
        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="70%">
              <PolarGrid />
              <PolarAngleAxis dataKey="parameter" tick={{ fill: "currentColor", fontSize: 10 }} />
              <Radar name="Skor" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} dot={{ r: 3, fillOpacity: 1 }} />
              <RechartsTooltip contentStyle={CHART_TOOLTIP_STYLE} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-background rounded-xl border p-4 sm:p-6 flex flex-col items-center justify-center shadow-sm">
        <h3 className="font-semibold mb-1 text-center text-sm sm:text-base">Soft Skills &amp; Culture Fit</h3>
        <p className="text-[11px] sm:text-xs text-muted-foreground text-center mb-4">Penilaian aspek non-teknis</p>
        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={softSkillData} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
              <XAxis type="number" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
              <YAxis dataKey="name" type="category" fontSize={10} tickLine={false} axisLine={false} width={85} />
              <RechartsTooltip cursor={{ fill: "var(--muted)" }} contentStyle={CHART_TOOLTIP_STYLE} formatter={(value: any) => [`${value} / 100`, "Skor"]} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
