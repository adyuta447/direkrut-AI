import { PieChart } from "lucide-react";

interface StatusDatum {
  label: string;
  count: number;
  color: string;
}

interface CandidateStatusChartProps {
  distribution: StatusDatum[];
  total: number;
}

export function CandidateStatusChart({ distribution, total }: CandidateStatusChartProps) {
  return (
    <div className="bg-canvas border border-hairline p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <PieChart className="w-5 h-5 text-ink" />
          <h3 className="text-[16px] font-normal text-ink">Rincian Status</h3>
        </div>
        <div className="space-y-6">
          {distribution.map((status) => (
            <div key={status.label}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3" style={{ backgroundColor: status.color }} />
                  <span className="text-[14px] font-semibold text-ink">{status.label}</span>
                </div>
                <span className="text-[16px] font-light text-ink">{status.count}</span>
              </div>
              <div className="w-full bg-[#e0e0e0] h-1.5">
                <div
                  className="h-1.5 transition-all duration-500"
                  style={{ backgroundColor: status.color, width: `${(status.count / Math.max(total, 1)) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 pt-4 border-t border-hairline">
        <p className="text-[14px] text-ink-muted text-center">Total {total} lamaran masuk</p>
      </div>
    </div>
  );
}
