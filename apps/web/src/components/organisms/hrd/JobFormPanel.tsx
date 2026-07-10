import { Save, Plus } from "lucide-react";
import { JobFormState } from "../../../lib/hrd/useJobManagement";
import { JobFormBasicFields } from "../../molecules/hrd/JobFormBasicFields";
import { JobFormDetailFields } from "../../molecules/hrd/JobFormDetailFields";

interface JobFormPanelProps {
  form: JobFormState;
  errors: Partial<Record<keyof JobFormState, string>>;
  editingId: string | null;
  message: string;
  onFieldChange: (key: keyof JobFormState, value: string) => void;
  onCancelEdit: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function JobFormPanel({ form, errors, editingId, message, onFieldChange, onCancelEdit, onSubmit }: JobFormPanelProps) {
  return (
    <div className="bg-canvas border border-hairline p-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[18px] font-normal text-ink">{editingId ? "Edit Lowongan" : "Buat Lowongan Baru"}</p>
        {editingId && (
          <button type="button" onClick={onCancelEdit} className="text-[14px] text-ink-muted hover:text-ink transition-none">
            Batal edit
          </button>
        )}
      </div>
      <form className="grid md:grid-cols-2 gap-6" onSubmit={onSubmit}>
        <JobFormBasicFields form={form} errors={errors} onFieldChange={onFieldChange} />
        <JobFormDetailFields form={form} errors={errors} onFieldChange={onFieldChange} />

        <div className="md:col-span-2 flex items-center justify-between border-t border-hairline pt-6">
          <p className="text-[12px] text-ink-muted">
            <span className="text-[#da1e28]">*</span> Kolom yang wajib diisi sebelum lowongan dapat dipublikasikan.
          </p>
          <button type="submit" className="btn-primary flex items-center gap-2 px-6">
            {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editingId ? "Simpan Perubahan" : "Publikasikan Lowongan"}
          </button>
        </div>
      </form>
      {message && (
        <div className="mt-6 p-4 bg-[#defbe6] border border-[#198038]">
          <p className="text-[14px] text-[#198038]">{message}</p>
        </div>
      )}
    </div>
  );
}
