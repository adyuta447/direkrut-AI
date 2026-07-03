import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ScoreDatum {
  name: string;
  Kandidat: number;
}

interface CandidateScoreChartProps {
  data: ScoreDatum[];
}

export function CandidateScoreChart({ data }: CandidateScoreChartProps) {
  return (
    <div className="bg-canvas border border-hairline p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-5 h-5 text-ink" />
        <h3 className="text-[16px] font-normal text-ink">Distribusi Profil Keahlian</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" stroke="#525252" style={{ fontSize: "11px" }} />
          <YAxis stroke="#525252" style={{ fontSize: "12px" }} />
          <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "0px" }} />
          <Bar dataKey="Kandidat" fill="#0f62fe" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
