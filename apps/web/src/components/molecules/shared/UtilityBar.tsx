interface UtilityBarProps {
  contactLabel: string;
}

export function UtilityBar({ contactLabel }: UtilityBarProps) {
  return (
    <div className="bg-surface-1 h-8 flex items-center px-6 lg:px-10 justify-end text-[12px] text-ink-muted">
      <div className="flex gap-4">
        <span className="hover:text-ink cursor-pointer">Butuh Bantuan?</span>
        <span className="hover:text-ink cursor-pointer">{contactLabel}</span>
      </div>
    </div>
  );
}
