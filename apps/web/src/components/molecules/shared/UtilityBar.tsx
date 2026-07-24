import Link from "next/link";

interface UtilityBarProps {
  contactLabel: string;
}

export function UtilityBar({ contactLabel }: UtilityBarProps) {
  return (
    <div className="bg-surface-1 h-8 flex items-center px-6 lg:px-10 justify-between text-[12px] text-ink-muted">
      <Link href="/auth/login" className="hover:text-ink">
        Kamu dari tim HRD? Masuk di sini
      </Link>
      <div className="flex gap-4">
        <span className="hover:text-ink cursor-pointer">Butuh Bantuan?</span>
        <span className="hover:text-ink cursor-pointer">{contactLabel}</span>
      </div>
    </div>
  );
}
