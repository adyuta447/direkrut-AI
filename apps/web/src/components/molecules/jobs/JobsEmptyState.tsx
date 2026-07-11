import Image from "next/image";

interface JobsEmptyStateProps {
  onClearFilters: () => void;
}

export function JobsEmptyState({ onClearFilters }: JobsEmptyStateProps) {
  return (
    <div className="py-16 sm:py-20 px-6 text-center rounded-[32px] bg-surface-1">
      <Image
        src="/notfound.svg"
        alt="Ilustrasi lowongan tidak ditemukan"
        width={748}
        height={457}
        unoptimized
        className="w-full h-auto max-w-[300px] sm:max-w-[360px] mx-auto mb-8"
      />
      <p className="text-[24px] font-bold text-ink mb-2">
        Belum ada lowongan yang cocok sama filter kamu
      </p>
      <p className="text-[14px] text-ink-muted mb-8 max-w-md mx-auto">
        Coba longgarin filternya atau pakai kata kunci lain. Lowongan baru juga masuk tiap hari.
      </p>
      <button onClick={onClearFilters} className="btn-primary">
        Hapus Filter
      </button>
    </div>
  );
}
