import { Check } from "lucide-react";

interface ReschedulingDoneScreenProps {
  typeLabel?: string;
  formatted: string;
  selectedTime: string | null;
  onClose: () => void;
}

export function ReschedulingDoneScreen({ typeLabel, formatted, selectedTime, onClose }: ReschedulingDoneScreenProps) {
  return (
    <div className="fixed inset-0 bg-[#393939]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-canvas border border-hairline p-10 w-full max-w-md text-center">
        <div className="w-14 h-14 bg-[#defbe6] flex items-center justify-center mx-auto mb-5 border border-hairline">
          <Check className="w-7 h-7 text-[#198038]" />
        </div>
        <h3 className="text-[24px] font-semibold mb-2 text-ink">Wawancara Terjadwal!</h3>
        <p className="text-[14px] text-ink-muted mb-2">{typeLabel}</p>
        <p className="text-[14px] font-semibold text-ink">{formatted}</p>
        <p className="text-[14px] text-ink-muted">{selectedTime}</p>
        <p className="text-[12px] text-ink-muted mt-5 mb-6 leading-[1.5]">
          Undangan kalender telah dikirim ke email Anda. Tautan pertemuan akan
          tersedia 15 menit sebelum sesi dimulai.
        </p>
        <button onClick={onClose} className="btn-primary mx-auto">Kembali ke Dasbor</button>
      </div>
    </div>
  );
}
