import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "../components/organisms/shared/SiteHeader";
import { SiteFooter } from "../components/organisms/shared/SiteFooter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas text-ink font-sans overflow-x-clip flex flex-col">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center px-6 lg:px-10 py-16">
        <div className="max-w-2xl w-full text-center">
          <Image
            src="/notfound.svg"
            alt="Ilustrasi halaman tidak ditemukan"
            width={748}
            height={457}
            unoptimized
            priority
            className="w-full h-auto max-w-[380px] sm:max-w-[460px] mx-auto mb-10"
          />

          <p className="text-[12px] font-medium text-ink-muted uppercase tracking-[0.2em] mb-5">
            Error 404
          </p>
          <h1 className="text-[clamp(36px,4.5vw,60px)] font-light leading-[1.05] tracking-[-0.02em] mb-5 text-ink">
            Waduh, halamannya <span className="text-primary">nggak ketemu.</span>
          </h1>
          <p className="text-[16px] lg:text-[17px] text-ink-muted leading-[1.7] max-w-lg mx-auto mb-10">
            Mungkin link-nya udah pindah, salah ketik, atau emang nggak pernah ada. Tenang,
            kariermu masih di jalur yang benar. Yuk balik dan lanjut cari peluangnya.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-primary inline-flex items-center gap-2">
              Balik ke Beranda
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 border border-hairline text-ink rounded-full px-6 py-3 text-[14px] font-normal hover:border-primary hover:text-primary transition-none"
            >
              Cari Lowongan
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
