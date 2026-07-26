import Link from "next/link";

interface UtilityBarProps {
  contactLabel: string;
}

export function UtilityBar({ contactLabel }: UtilityBarProps) {
  return (
    <div className="bg-surface-1 min-h-8 flex items-center justify-center px-4 py-2 text-[12px] text-ink-muted sm:justify-between sm:px-6 sm:py-0 lg:px-10">
      <Link
        href="/auth/login?role=hrd"
        className="text-center leading-4 hover:text-ink sm:text-left"
      >
        Kamu dari tim HRD? Masuk di sini
      </Link>
      <div className="hidden gap-4 sm:flex">
        <span className="hover:text-ink cursor-pointer">Butuh Bantuan?</span>
        <span className="hover:text-ink cursor-pointer">{contactLabel}</span>
      </div>
    </div>
  );
}
