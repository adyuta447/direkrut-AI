import { ChevronDown } from "lucide-react";
import { JobFormState } from "../../../lib/hrd/useJobManagement";

interface JobFormBasicFieldsProps {
  form: JobFormState;
  errors: Partial<Record<keyof JobFormState, string>>;
  onFieldChange: (key: keyof JobFormState, value: string) => void;
}

export function JobFormBasicFields({ form, errors, onFieldChange }: JobFormBasicFieldsProps) {
  const inputClass = (key: keyof JobFormState) => `input-field w-full ${errors[key] ? "border-b-[#da1e28]" : ""}`;

  return (
    <>
      <div>
        <label className="block text-[14px] text-ink mb-2 font-semibold">
          Judul Posisi <span className="text-[#da1e28]">*</span>
        </label>
        <input
          className={inputClass("title")}
          value={form.title}
          onChange={(e) => onFieldChange("title", e.target.value)}
          placeholder="Contoh: Software Engineer"
        />
        {errors.title && <p className="text-[12px] text-[#da1e28] mt-1">{errors.title}</p>}
      </div>
      <div>
        <label className="block text-[14px] text-ink mb-2 font-semibold">
          Departemen <span className="text-[#da1e28]">*</span>
        </label>
        <input
          className={inputClass("department")}
          value={form.department}
          onChange={(e) => onFieldChange("department", e.target.value)}
          placeholder="Contoh: Teknologi Informasi"
        />
        {errors.department && <p className="text-[12px] text-[#da1e28] mt-1">{errors.department}</p>}
      </div>
      <div>
        <label className="block text-[14px] text-ink mb-2 font-semibold">Lokasi</label>
        <input
          className="input-field w-full"
          value={form.location}
          onChange={(e) => onFieldChange("location", e.target.value)}
          placeholder="Jakarta / WFH / Hybrid"
        />
      </div>
      <div>
        <label className="block text-[14px] text-ink mb-2 font-semibold">Jenis Pekerjaan</label>
        <div className="relative">
          <select
            className="appearance-none input-field w-full pr-10 cursor-pointer"
            value={form.type}
            onChange={(e) => onFieldChange("type", e.target.value)}
          >
            <option>Purna Waktu</option>
            <option>Paruh Waktu</option>
            <option>Kontrak</option>
            <option>Magang</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
        </div>
      </div>
      <div>
        <label className="block text-[14px] text-ink mb-2 font-semibold">Perusahaan</label>
        <input
          className="input-field w-full"
          value={form.company}
          onChange={(e) => onFieldChange("company", e.target.value)}
          placeholder="Direkrut AI"
        />
      </div>
    </>
  );
}
