import { CheckCircle2, ArrowRight } from "lucide-react";

interface SchedulingSuccessScreenProps {
  onStartNow: () => void;
}

export function SchedulingSuccessScreen({ onStartNow }: SchedulingSuccessScreenProps) {
  return (
    <div className="h-full flex flex-col justify-center items-center p-6 lg:p-12 animate-in fade-in">
      <div className="w-20 h-20 bg-[#defbe6] text-[#198038] flex items-center justify-center mb-6 border border-[#198038]">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h2 className="text-[32px] font-light text-ink tracking-[-0.5px] mb-4 text-center">
        Wawancara AI Berhasil Dijadwalkan
      </h2>
      <p className="text-[16px] text-ink-muted text-center max-w-xl mb-8 leading-[1.5]">
        Sesi wawancara asinkron Anda telah dikonfirmasi. Tautan dan instruksi akses akan dikirimkan ke email Anda. Pastikan Anda menyiapkan koneksi internet yang stabil dan ruangan yang tenang.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <button
          onClick={onStartNow}
          className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-[14px]"
        >
          Mulai Wawancara Sekarang
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
