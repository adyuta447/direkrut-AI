import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="pt-24 pb-16 px-6 lg:px-10 max-w-[1584px] mx-auto">
      <h1 className="text-[76px] leading-[1.17] font-light tracking-[-0.5px] mb-8 text-ink max-w-4xl">
        Otomatisasi proses rekrutmen dengan presisi kecerdasan buatan.
      </h1>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-16 border-b border-hairline">
        <p className="text-[18px] text-ink leading-[1.5] max-w-2xl font-normal">
          Tingkatkan efisiensi akuisisi talenta perusahaan Anda melalui ekstraksi riwayat kerja yang cerdas,
          validasi kompetensi otomatis, dan simulasi wawancara video berbasis AI. Dirancang khusus untuk ekosistem korporasi (Enterprise).
        </p>
        <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
          <Link href="/auth" className="btn-primary flex items-center justify-center gap-2">
            Jelajahi Peluang
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/auth"
            className="border border-primary text-primary px-4 py-3 font-normal text-sm hover:bg-primary hover:text-white transition-none text-center"
          >
            Masuk Portal HRD
          </Link>
        </div>
      </div>
    </section>
  );
}
