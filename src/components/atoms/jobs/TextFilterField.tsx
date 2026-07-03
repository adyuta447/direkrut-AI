import { LucideIcon } from "lucide-react";

interface TextFilterFieldProps {
  icon: LucideIcon;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  wrapperClassName?: string;
}

export function TextFilterField({
  icon: Icon,
  placeholder,
  value,
  onChange,
  wrapperClassName = "relative flex-1 min-w-[200px]",
}: TextFilterFieldProps) {
  return (
    <div className={wrapperClassName}>
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field pl-11 bg-surface-1 border-b border-hairline hover:bg-[#e8e8e8]"
      />
    </div>
  );
}
