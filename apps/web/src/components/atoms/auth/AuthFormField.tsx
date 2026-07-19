interface AuthFormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
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
  required,
  minLength,
  maxLength,
}: AuthFormFieldProps) {
  return (
    <div>
      <label className="text-[13px] font-medium text-ink block mb-2">{label}</label>
      <input
        type={type}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-5 py-3.5 bg-surface-1 border border-transparent rounded-2xl text-[15px] text-ink placeholder-ink-muted focus:outline-none focus:border-primary focus:bg-canvas transition-none"
      />
    </div>
  );
}
