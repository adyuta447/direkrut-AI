import { useId } from "react";
import { UploadCloud, FileCheck2 } from "lucide-react";

interface AuthFileFieldProps {
  label: string;
  hint?: string;
  file: File | null;
  onChange: (file: File | null) => void;
  required?: boolean;
}

export function AuthFileField({ label, hint, file, onChange, required }: AuthFileFieldProps) {
  const inputId = useId();

  return (
    <div>
      <label htmlFor={inputId} className="text-[14px] font-semibold text-ink block mb-2">
        {label}
        {hint && <span className="ml-2 text-[12px] font-normal text-ink-muted">{hint}</span>}
      </label>
      <label
        htmlFor={inputId}
        className={`flex items-center gap-3 w-full px-5 py-4 bg-surface-1 border-2 rounded-2xl cursor-pointer transition-none ${
          file ? "border-primary" : "border-transparent hover:border-hairline"
        }`}
      >
        {file ? (
          <FileCheck2 className="size-5 text-primary shrink-0" />
        ) : (
          <UploadCloud className="size-5 text-ink-muted shrink-0" />
        )}
        <span className={`text-[15px] truncate ${file ? "text-ink font-medium" : "text-ink-muted"}`}>
          {file ? file.name : "Pilih file (PDF/JPG/PNG)"}
        </span>
      </label>
      <input
        id={inputId}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        required={required && !file}
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
