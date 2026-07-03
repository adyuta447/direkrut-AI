import { Briefcase } from "lucide-react";

interface CandidateExperienceSummaryProps {
  jobTitle: string;
}

// REVISI 3: Ringkasan Pengalaman Kerja
export function CandidateExperienceSummary({ jobTitle }: CandidateExperienceSummaryProps) {
  return (
    <div className="bg-canvas border border-hairline p-6">
      <div className="flex items-center gap-3 mb-4">
        <Briefcase className="w-5 h-5 text-ink" />
        <p className="text-[14px] font-semibold text-ink">Ringkasan Pengalaman Kerja</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-1 p-4 border border-hairline">
          <p className="text-[12px] font-semibold uppercase text-ink-muted mb-1">Total Pengalaman</p>
          <p className="text-[20px] font-light text-ink">2–3 Tahun</p>
        </div>
        <div className="bg-surface-1 p-4 border border-hairline">
          <p className="text-[12px] font-semibold uppercase text-ink-muted mb-1">Perusahaan Sebelumnya</p>
          <p className="text-[20px] font-light text-ink">2 Perusahaan</p>
        </div>
        <div className="bg-surface-1 p-4 border border-hairline">
          <p className="text-[12px] font-semibold uppercase text-ink-muted mb-1">Relevansi Bidang</p>
          <p className="text-[20px] font-light text-[#198038]">Sesuai</p>
        </div>
      </div>
      <p className="text-[14px] text-ink-muted leading-[1.5]">
        Kandidat memiliki riwayat kerja yang linier dan relevan di bidang {jobTitle}. Pengalaman sebelumnya mendukung kesiapan untuk mengambil tanggung jawab di posisi ini.
      </p>
    </div>
  );
}
