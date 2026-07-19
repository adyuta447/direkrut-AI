import { CheckCircleIcon } from "lucide-react"

const STEP_LABELS = ["Data Diri", "Unggah CV", "Tinjauan"]

interface ApplyStepIndicatorProps {
  step: number
}

export function ApplyStepIndicator({ step }: ApplyStepIndicatorProps) {
  return (
    <div className="flex items-center justify-between relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }} />
      </div>
      {STEP_LABELS.map((label, idx) => {
        const num = idx + 1
        const isActive = step === num
        const isPast = step > num
        return (
          <div key={num} className="relative flex flex-col items-center gap-2 bg-background px-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                  : isPast
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {isPast ? <CheckCircleIcon className="size-4" /> : num}
            </div>
            <span className={`text-xs font-medium absolute -bottom-6 whitespace-nowrap ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
