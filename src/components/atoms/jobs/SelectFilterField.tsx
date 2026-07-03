import { ChevronDown, LucideIcon } from "lucide-react";

interface SelectFilterFieldProps {
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  placeholderOption: string;
  options: string[];
}

export function SelectFilterField({
  icon: Icon,
  value,
  onChange,
  placeholderOption,
  options,
}: SelectFilterFieldProps) {
  return (
    <div className="relative min-w-[160px]">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field appearance-none pl-11 pr-10 bg-surface-1 border-b border-hairline hover:bg-[#e8e8e8] cursor-pointer"
      >
        <option value="">{placeholderOption}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
    </div>
  );
}
