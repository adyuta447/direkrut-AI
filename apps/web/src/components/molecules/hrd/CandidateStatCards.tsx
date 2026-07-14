interface StatCard {
  label: string;
  value: string | number;
}

interface CandidateStatCardsProps {
  statCards: StatCard[];
}

export function CandidateStatCards({ statCards }: CandidateStatCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((card) => (
        <div key={card.label} className="bg-surface-1 border border-hairline p-6">
          <p className="text-[12px] font-semibold text-ink-muted mb-2 uppercase">{card.label}</p>
          <p className="text-[24px] font-bold text-ink">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
