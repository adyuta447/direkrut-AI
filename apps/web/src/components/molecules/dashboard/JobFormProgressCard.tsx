import { IconCircle, IconCircleCheck, IconProgress } from "@tabler/icons-react"

interface JobFormProgressCardProps {
  progress: number
  fields: { key: string; label: string }[]
  filledFields: Set<string>
}

export function JobFormProgressCard({ progress, fields, filledFields }: JobFormProgressCardProps) {
  return (
    <div className="rounded-3xl bg-brand-accent-strong p-6 text-white">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-[17px] font-semibold">
          <IconProgress className="size-5" /> Progres Pengisian
        </h3>
        <span className="text-2xl font-bold tabular-nums">{progress}%</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/20">
        <div className="h-full rounded-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {fields.map(({ key, label }) => {
          const done = filledFields.has(key)
          return (
            <li key={key} className={`flex items-center gap-2 ${done ? "text-white" : "text-white/60"}`}>
              {done ? <IconCircleCheck className="size-4 shrink-0" /> : <IconCircle className="size-4 shrink-0" />}
              {label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
