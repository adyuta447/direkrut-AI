import { useId } from "react";
import type { HTMLInputTypeAttribute } from "react";

interface AuthFormFieldProps {
  label: string;
  type: HTMLInputTypeAttribute;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  name?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

export function AuthFormField({
  label,
  type,
  value,
  onChange,
  placeholder,
  name,
  autoComplete,
  required,
  minLength,
  maxLength,
}: AuthFormFieldProps) {
  const inputId = useId();

  return (
    <div>
      <label htmlFor={inputId} className="text-[14px] font-semibold text-ink block mb-2">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-5 py-4 border-2 rounded-2xl text-[16px] text-ink placeholder-ink-muted focus:outline-none focus:border-primary focus:bg-canvas transition-none ${
          value ? "bg-canvas border-hairline" : "bg-surface-1 border-transparent"
        }`}
      />
    </div>
  );
}
