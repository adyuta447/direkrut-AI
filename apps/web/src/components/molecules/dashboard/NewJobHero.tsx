import Image from "next/image"

export function NewJobHero() {
  return (
    <div className="relative mt-4 flex flex-col items-center gap-5 overflow-hidden rounded-3xl bg-primary p-8 text-center text-white sm:flex-row sm:text-left">
      <Image
        src="/dashboard/add_file.svg"
        alt=""
        width={220}
        height={165}
        unoptimized
        className="pointer-events-none h-28 w-auto shrink-0 select-none sm:h-32"
      />
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Lowongan Baru
        </p>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Buka Posisi Baru</h1>
        <p className="mt-2 text-base text-white/85">
          Isi detailnya di bawah. Belum yakin semua siap? Simpan draft dulu aja, lanjutin kapan pun.
        </p>
      </div>
    </div>
  )
}
