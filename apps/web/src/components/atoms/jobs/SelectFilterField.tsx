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
    <div className="relative">
      <Icon
        className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
          value ? "text-white" : "text-ink-muted"
        }`}
        strokeWidth={1.5}
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none rounded-full pl-10 pr-9 h-11 text-[13px] font-normal cursor-pointer focus:outline-none transition-none max-w-[240px] ${
          value
            ? "bg-primary text-white"
            : "bg-surface-1 text-ink hover:bg-surface-2"
        }`}
      >
        <option value="">{placeholderOption}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown
        className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
          value ? "text-white" : "text-ink-muted"
        }`}
        strokeWidth={1.5}
      />
    </div>
  );
}
