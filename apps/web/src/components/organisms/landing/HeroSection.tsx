import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSearchBar } from "../../molecules/landing/HeroSearchBar";

const popularSearches = ["Backend Engineer", "Product Designer", "Data Analyst", "Marketing"];

export function HeroSection() {
  return (
    <section className="sticky top-0 z-0 overflow-hidden">
      {/* Elemen LCP: lewat next/image (bukan CSS background) supaya
          dioptimasi ke AVIF/WebP + responsive sizes oleh Vercel, ter-
          discover dini di HTML, dan dapat fetchpriority=high dari
          prop priority. */}
      <Image
        src="/hero-section.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30"
      />

      <div className="hero-pin-content relative min-h-[calc(100svh-3.5rem)] flex flex-col justify-center pt-16 pb-28 px-6 lg:px-10 max-w-[1584px] mx-auto">
        <p className="hero-kicker text-[12px] font-medium text-white/70 uppercase tracking-[0.2em] mb-8">
          Ketemu Kerja Lebih Cepat Bareng AI
        </p>

        <h1 className="text-[clamp(52px,8.5vw,112px)] leading-[0.98] font-bold tracking-[-0.03em] mb-10 text-white">
          <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
            <span className="hero-line-inner block">Kamu tinggal upload CV,</span>
          </span>
          <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
            <span className="hero-line-inner block">
              sisanya <span className="text-[#93c5fd]">biar AI yang urus.</span>
            </span>
          </span>
        </h1>

        <div className="max-w-5xl">
          <div className="hero-search">
            <HeroSearchBar />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="hero-chip text-[13px] text-white/60 mr-1">Lagi banyak dicari:</span>
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  href={`/jobs?q=${encodeURIComponent(term)}`}
                  className="hero-chip px-4 py-1.5 rounded-full border border-white/30 text-[13px] text-white hover:border-white hover:bg-white/10 transition-none"
                >
                  {term}
                </Link>
              ))}
            </div>
            <Link
              href="/auth/login"
              className="hero-chip lg:ml-auto flex items-center gap-2 text-[14px] font-normal text-white hover:underline flex-shrink-0"
            >
              Kamu dari tim HRD? Masuk di sini
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
