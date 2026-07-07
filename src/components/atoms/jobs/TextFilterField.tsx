import { LucideIcon } from "lucide-react";

interface TextFilterFieldProps {
  icon: LucideIcon;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TextFilterField({
  icon: Icon,
  label,
  placeholder,
  value,
  onChange,
  className = "",
}: TextFilterFieldProps) {
  return (
    <label
      className={`flex items-center gap-3 sm:gap-3.5 px-4 sm:px-6 h-[52px] sm:h-14 rounded-xl sm:rounded-full cursor-text transition-none hover:bg-surface-1 focus-within:bg-surface-1 ${className}`}
    >
      <Icon className="w-5 h-5 text-ink-muted flex-shrink-0" strokeWidth={1.5} />
      <span className="flex flex-col justify-center gap-px w-full min-w-0">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink leading-none">
          {label}
        </span>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-[14px] sm:text-[15px] text-ink placeholder-ink-muted focus:outline-none leading-snug"
        />
      </span>
    </label>
  );
}
