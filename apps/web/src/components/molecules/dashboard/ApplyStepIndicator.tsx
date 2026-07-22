import { CheckIcon } from "lucide-react"

const STEP_LABELS = ["Data Diri", "Unggah CV", "Tinjauan"]

interface ApplyStepIndicatorProps {
  step: number
}

export function ApplyStepIndicator({ step }: ApplyStepIndicatorProps) {
  return (
    <div className="relative flex items-center justify-between pb-7">
      {/* Rel dasar + progress terisi (brand blue) */}
      <div className="absolute left-0 top-4 h-[3px] w-full -translate-y-1/2 rounded-full bg-muted" />
      <div
        className="absolute left-0 top-4 h-[3px] -translate-y-1/2 rounded-full bg-primary transition-all duration-500 ease-out"
        style={{ width: `${((step - 1) / (STEP_LABELS.length - 1)) * 100}%` }}
      />

      {STEP_LABELS.map((label, idx) => {
        const num = idx + 1
        const isActive = step === num
        const isPast = step > num
        return (
          <div key={num} className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={[
                "flex size-10 items-center justify-center rounded-full text-base font-bold transition-colors",
                isActive || isPast
                  ? "bg-primary text-primary-foreground"
                  : "border-2 border-hairline bg-background text-muted-foreground",
              ].join(" ")}
            >
              {isPast ? <CheckIcon className="size-5 stroke-3" /> : num}
            </div>
            <span
              className={`absolute -bottom-7 whitespace-nowrap text-sm font-semibold tracking-tight transition-colors ${
                isActive ? "text-foreground" : isPast ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
