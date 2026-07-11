interface JobStat {
  label: string;
  value: string | number;
}

interface JobStatsRowProps {
  stats: JobStat[];
}

export function JobStatsRow({ stats }: JobStatsRowProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-surface-1 border border-hairline p-6">
          <p className="text-[12px] font-semibold text-ink-muted mb-2 uppercase">{stat.label}</p>
          <p className="text-[32px] font-bold text-ink">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
