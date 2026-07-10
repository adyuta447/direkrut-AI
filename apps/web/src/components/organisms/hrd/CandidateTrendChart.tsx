import { TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TrendDatum {
  day: string;
  Terkirim: number;
  Administrasi: number;
  Wawancara: number;
  Ditolak: number;
  Total: number;
}

interface CandidateTrendChartProps {
  data: TrendDatum[];
}

export function CandidateTrendChart({ data }: CandidateTrendChartProps) {
  return (
    <div className="bg-canvas border border-hairline p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-5 h-5 text-ink" />
        <h3 className="text-[16px] font-normal text-ink">Tren Lamaran</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="day" stroke="#525252" style={{ fontSize: "12px" }} />
          <YAxis stroke="#525252" style={{ fontSize: "12px" }} />
          <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "0px" }} />
          <Legend wrapperStyle={{ fontSize: "12px" }} iconType="line" />
          <Line type="monotone" dataKey="Terkirim" stroke="#8d8d8d" strokeWidth={2} dot={{ fill: "#8d8d8d", r: 4 }} />
          <Line type="monotone" dataKey="Administrasi" stroke="#525252" strokeWidth={2} dot={{ fill: "#525252", r: 4 }} />
          <Line type="monotone" dataKey="Wawancara" stroke="#0f62fe" strokeWidth={2} dot={{ fill: "#0f62fe", r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
