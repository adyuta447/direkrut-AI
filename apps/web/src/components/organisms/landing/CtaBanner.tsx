import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="px-6 lg:px-10 max-w-[1584px] mx-auto pb-24">
      <div className="bg-primary text-white rounded-[32px] grid lg:grid-cols-2 overflow-hidden" data-reveal>
        <div className="p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-white/20">
          <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-[13px] font-medium text-white mb-6">
            Buat kamu yang lagi cari kerja
          </p>
          <h2 className="text-[28px] sm:text-[32px] font-bold leading-[1.2] mb-8 max-w-md">
            Mulai lamaran pertamamu hari ini. Gratis, tanpa biaya apa pun.
          </h2>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-white text-ink rounded-full px-6 py-3 font-normal text-[14px] hover:bg-surface-1"
          >
            Lihat Lowongan
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-10 lg:p-16">
          <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-[13px] font-medium text-white mb-6">
            Untuk perusahaan
          </p>
          <h2 className="text-[28px] sm:text-[32px] font-bold leading-[1.2] mb-8 max-w-md">
            Menemukan kandidat berkualitas nggak perlu selama itu.
          </h2>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 border border-white text-white rounded-full px-6 py-3 font-normal text-[14px] hover:bg-white hover:text-ink"
          >
            Akses Dasbor Perekrut
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
