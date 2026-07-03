import { Video, Clock, Users } from "lucide-react";

interface ReschedulingConfirmStepProps {
  typeLabel?: string;
  typeDuration?: string;
  formatted: string;
  selectedTime: string | null;
  onBack: () => void;
  onConfirm: () => void;
}

export function ReschedulingConfirmStep({
  typeLabel, typeDuration, formatted, selectedTime, onBack, onConfirm,
}: ReschedulingConfirmStepProps) {
  return (
    <div>
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 p-4 bg-surface-1 border border-hairline">
          <Video className="w-4 h-4 text-ink-muted flex-shrink-0" />
          <div>
            <p className="text-[12px] text-ink-muted uppercase">Tipe Wawancara</p>
            <p className="text-[14px] font-semibold text-ink">{typeLabel}</p>
            <p className="text-[12px] text-ink-muted">{typeDuration}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-surface-1 border border-hairline">
          <Clock className="w-4 h-4 text-ink-muted flex-shrink-0" />
          <div>
            <p className="text-[12px] text-ink-muted uppercase">Tanggal & Waktu</p>
            <p className="text-[14px] font-semibold text-ink">{formatted}</p>
            <p className="text-[12px] text-ink-muted">{selectedTime} WIB</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-surface-1 border border-hairline">
          <Users className="w-4 h-4 text-ink-muted flex-shrink-0" />
          <div>
            <p className="text-[12px] text-ink-muted uppercase">Format</p>
            <p className="text-[14px] font-semibold text-ink">Panggilan Video</p>
            <p className="text-[12px] text-ink-muted">Tautan dikirim 15 menit sebelumnya</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-hairline">
        <button onClick={onBack} className="text-[14px] text-ink-muted hover:text-ink transition-none">Kembali</button>
        <button onClick={onConfirm} className="btn-primary">Konfirmasi Jadwal</button>
      </div>
    </div>
  );
}
