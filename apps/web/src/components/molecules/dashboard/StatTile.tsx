interface StatTileProps {
  value: React.ReactNode
  label: string
  tone?: "primary" | "neutral" | "warning" | "success"
  className?: string
}

const TONE_TEXT: Record<NonNullable<StatTileProps["tone"]>, string> = {
  primary: "text-primary",
  neutral: "text-ink",
  warning: "text-warning",
  success: "text-success",
}

const TONE_BORDER: Record<NonNullable<StatTileProps["tone"]>, string> = {
  primary: "border-hairline",
  neutral: "border-hairline",
  warning: "border-warning",
  success: "border-hairline",
}

/** Kotak angka besar (skor, tahun pengalaman, jumlah pelanggaran, dst) --
 * satu pola dipakai di semua kartu detail kandidat biar angka penting
 * selalu gampang ditemuin di posisi & ukuran yang sama, bukan diketik
 * ulang beda-beda tiap kartu. */
export function StatTile({ value, label, tone = "primary", className = "" }: StatTileProps) {
  return (
    <div className={`rounded-2xl border ${TONE_BORDER[tone]} bg-surface-1 px-5 py-4 ${className}`}>
      <p className={`text-4xl font-bold tabular-nums tracking-tight ${TONE_TEXT[tone]}`}>
        {value}
      </p>
      <p className="mt-1 text-sm text-ink-muted">{label}</p>
    </div>
  )
}
