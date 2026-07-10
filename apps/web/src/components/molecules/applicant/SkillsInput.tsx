import { Plus, X, AlertCircle } from "lucide-react";

interface SkillsInputProps {
  skillInput: string;
  onSkillInputChange: (value: string) => void;
  skills: string[];
  onAddSkill: () => void;
  onRemoveSkill: (skill: string) => void;
  skillError: string;
}

export function SkillsInput({
  skillInput, onSkillInputChange, skills, onAddSkill, onRemoveSkill, skillError,
}: SkillsInputProps) {
  return (
    <div className="bg-canvas border border-hairline p-6">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-[14px] text-ink font-semibold">2. Keahlian Utama Anda</label>
        <span className={`text-[12px] font-semibold ${skills.length >= 3 ? "text-[#198038]" : "text-ink-muted"}`}>
          {skills.length}/3 minimum
        </span>
      </div>
      <p className="text-[12px] text-ink-muted mb-3">
        Isi minimal 3 keahlian untuk meningkatkan akurasi pencocokan dan peluang rekomendasi ke posisi yang sesuai.
      </p>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={skillInput}
          onChange={(e) => onSkillInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              onAddSkill();
            }
          }}
          placeholder="Contoh: React.js, Python, Analisis Data..."
          className="input-field flex-1"
        />
        <button type="button" onClick={onAddSkill} className="btn-primary px-4 flex-shrink-0">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="flex items-center gap-1.5 text-[12px] bg-surface-1 border border-hairline px-2 py-1 text-ink">
              {skill}
              <button type="button" onClick={() => onRemoveSkill(skill)}>
                <X className="w-3 h-3 text-ink-muted hover:text-ink" />
              </button>
            </span>
          ))}
        </div>
      )}
      {skillError && (
        <div className="mt-2 flex items-center gap-2 text-[12px] text-[#da1e28]">
          <AlertCircle className="w-3.5 h-3.5" />
          {skillError}
        </div>
      )}
    </div>
  );
}
