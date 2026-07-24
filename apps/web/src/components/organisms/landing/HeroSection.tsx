import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSearchBar } from "../../molecules/landing/HeroSearchBar";

const popularSearches = [
  "Backend Engineer",
  "Product Designer",
  "Data Analyst",
  "Marketing",
];

export function HeroSection() {
  return (
    <section className="sticky top-0 z-0 overflow-hidden">
      {/* Image `fill` butuh ancestor position: absolute/fixed/relative --
          `sticky` di <section> gak masuk allowlist Next.js meski secara CSS
          sticky juga bikin containing block yang sama. Wrapper ini nge-skip
          warning-nya tanpa ngubah layout (posisinya tetap ngisi section). */}
      <div className="absolute inset-0">
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
      </div>

      <div className="hero-pin-content relative min-h-[calc(100svh-3.5rem)] flex flex-col justify-center pt-16 pb-28 px-6 lg:px-10 max-w-[1584px] mx-auto">
        <p className="hero-kicker text-[12px] font-bold text-white uppercase tracking-[0.2em] mb-8">
          Ketemu Kerja Lebih Cepat Bareng AI
        </p>

        <h1 className="text-[clamp(52px,8.5vw,112px)] leading-[0.98] font-bold tracking-[-0.03em] mb-10 text-white">
          <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
            <span className="hero-line-inner block">
              Kamu tinggal upload CV,
            </span>
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
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="hero-chip flex items-center gap-1.5 text-[13px] font-medium text-white/70 mr-1">
                Lagi banyak dicari
              </span>
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  href={`/jobs?q=${encodeURIComponent(term)}`}
                  className="hero-chip group flex items-center gap-2 pl-3.5 pr-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[13px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:bg-white hover:text-neutral-900 hover:border-white"
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
