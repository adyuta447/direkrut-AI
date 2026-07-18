import { CheckCircle2 } from "lucide-react";

interface JobRequirementsProps {
  requirements: string[];
}

export function JobRequirements({ requirements }: JobRequirementsProps) {
  return (
    <div className="mb-8">
      <h3 className="text-[20px] font-semibold mb-4 text-ink">Keahlian yang Dibutuhkan</h3>
      <div className="flex flex-wrap gap-2">
        {requirements.map((req, idx) => (
          <span key={idx} className="text-[14px] rounded-full bg-surface-1 px-4 py-1.5 text-ink">
            {req}
          </span>
        ))}
      </div>
      <div className="mt-4 p-5 rounded-3xl bg-surface-1 flex gap-4">
        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
        <div>
          <p className="text-[14px] font-semibold text-primary mb-1">Analisis Kecocokan AI</p>
          <p className="text-[13px] text-ink-muted leading-[1.5]">
            Upload CV kamu buat lihat seberapa cocok skill kamu sama kriteria ini.
          </p>
        </div>
      </div>
    </div>
  );
}
