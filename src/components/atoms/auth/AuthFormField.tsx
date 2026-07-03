interface AuthFormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}

export function AuthFormField({ label, type, value, onChange, placeholder, required }: AuthFormFieldProps) {
  return (
    <div>
      <label className="text-[14px] font-semibold text-ink block mb-2">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
}
