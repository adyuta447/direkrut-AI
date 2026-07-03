import { FileText } from "lucide-react";

export function StatusEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] border border-hairline bg-surface-1 p-12 text-center">
      <div className="w-20 h-20 bg-canvas flex items-center justify-center mb-6 border border-hairline">
        <FileText className="w-8 h-8 text-ink-muted" />
      </div>
      <p className="text-[16px] font-semibold text-ink uppercase mb-3">Belum Ada Lamaran</p>
      <p className="text-[14px] text-ink-muted">Mulai melamar lowongan untuk melihat status Anda di sini.</p>
    </div>
  );
}
