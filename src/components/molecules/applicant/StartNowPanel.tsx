import { Video } from "lucide-react";

interface StartNowPanelProps {
  onStartNow: () => void;
}

export function StartNowPanel({ onStartNow }: StartNowPanelProps) {
  return (
    <div className="bg-[#e5f6ff] border border-[#0f62fe] p-6 text-center flex flex-col items-center">
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3">
        <Video className="w-6 h-6 text-primary" />
      </div>
      <p className="text-[16px] font-semibold text-ink mb-2">Siap lebih awal?</p>
      <p className="text-[14px] text-ink leading-[1.5] mb-6">
        Anda tidak perlu menunggu. Jika Anda sudah siap sekarang, Anda bisa langsung memulai sesi wawancara asinkron Anda.
      </p>
      <button
        onClick={onStartNow}
        className="text-[14px] font-normal border border-primary bg-white text-primary px-6 py-3 hover:bg-primary hover:text-white transition-none w-full"
      >
        Mulai Wawancara Sekarang
      </button>
    </div>
  );
}
