import { Info } from "lucide-react";
import { JobFormState } from "../../../lib/hrd/useJobManagement";

interface JobFormDetailFieldsProps {
  form: JobFormState;
  errors: Partial<Record<keyof JobFormState, string>>;
  onFieldChange: (key: keyof JobFormState, value: string) => void;
}

export function JobFormDetailFields({ form, errors, onFieldChange }: JobFormDetailFieldsProps) {
  const inputClass = (key: keyof JobFormState) => `input-field w-full ${errors[key] ? "border-b-[#da1e28]" : ""}`;

  return (
    <>
      <div className="md:col-span-2">
        <label className="block text-[14px] text-ink mb-2 font-semibold">
          Deskripsi Pekerjaan <span className="text-[#da1e28]">*</span>
        </label>
        <textarea
          className={`${inputClass("description")} resize-none`}
          rows={4}
          value={form.description}
          onChange={(e) => onFieldChange("description", e.target.value)}
          placeholder="Jelaskan peran, tanggung jawab, dan ekspektasi posisi ini..."
        />
        {errors.description && <p className="text-[12px] text-[#da1e28] mt-1">{errors.description}</p>}
      </div>

      {/* REVISI 6: Field Kualifikasi (Administratif) */}
      <div className="md:col-span-2">
        <label className="block text-[14px] text-ink mb-2 font-semibold">
          Kualifikasi Administratif <span className="text-[#da1e28]">*</span>
        </label>
        <p className="text-[12px] text-ink-muted mb-2 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          Kriteria administratif seperti rentang usia, jenis kelamin (opsional), ekspektasi gaji, dan persyaratan domisili. Pisahkan dengan koma.
        </p>
        <input
          className={inputClass("qualificationsText")}
          value={form.qualificationsText}
          onChange={(e) => onFieldChange("qualificationsText", e.target.value)}
          placeholder="Contoh: Usia 22-30 tahun, Domisili Jabodetabek, Gaji 8-15 juta"
        />
        {errors.qualificationsText && <p className="text-[12px] text-[#da1e28] mt-1">{errors.qualificationsText}</p>}
      </div>

      {/* REVISI 6: Field Keahlian yang Dibutuhkan (Teknis) */}
      <div className="md:col-span-2">
        <label className="block text-[14px] text-ink mb-2 font-semibold">
          Keahlian yang Dibutuhkan <span className="text-[#da1e28]">*</span>
        </label>
        <p className="text-[12px] text-ink-muted mb-2 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          Semakin detail keahlian yang Anda isi, semakin akurat kandidat yang direkomendasikan sistem AI kami. Pisahkan dengan koma.
        </p>
        <input
          className={inputClass("requirementsText")}
          value={form.requirementsText}
          onChange={(e) => onFieldChange("requirementsText", e.target.value)}
          placeholder="Contoh: React.js, TypeScript, REST API, Git, Agile/Scrum"
        />
        {errors.requirementsText && <p className="text-[12px] text-[#da1e28] mt-1">{errors.requirementsText}</p>}
      </div>
    </>
  );
}
