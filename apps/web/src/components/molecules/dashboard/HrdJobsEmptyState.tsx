import Image from "next/image"

/** Varian HRD dari empty state pencarian lowongan -- beda copy/illustration
 * dari molecules/jobs/JobsEmptyState.tsx (yang buat portal publik kandidat). */
export function HrdJobsEmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center rounded-2xl bg-surface-1 py-12 px-6 text-center">
      <Image
        src="/dashboard/add_file.svg"
        alt=""
        width={200}
        height={150}
        unoptimized
        className="pointer-events-none mb-5 h-28 w-auto select-none"
      />
      <p className="text-[17px] font-semibold text-ink">Belum ada lowongan yang cocok</p>
      <p className="mt-1 text-sm text-ink-muted">Coba ganti kata kunci atau tab status-nya.</p>
    </div>
  )
}
