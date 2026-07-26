import Image from "next/image";
import { AuthMarketingPanel } from "./AuthMarketingPanel";
import { AuthMobileNav } from "../../molecules/auth/AuthMobileNav";

export function VerificationSuccessScreen() {
  return (
    <main className="flex min-h-screen flex-col bg-canvas font-sans text-ink lg:flex-row">
      <AuthMarketingPanel />

      <section className="flex min-h-screen flex-1 flex-col bg-canvas lg:min-h-0">
        <AuthMobileNav />

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-[620px] text-center">
            <div className="mx-auto flex min-h-[300px] items-center justify-center overflow-hidden rounded-3xl border border-hairline bg-canvas p-7 sm:min-h-[360px] sm:p-10">
              <Image
                src="/success.svg"
                alt="Dokumen perusahaan berhasil dikirim untuk verifikasi"
                width={219}
                height={255}
                priority
                className="h-auto w-[min(58vw,290px)]"
              />
            </div>

            <div className="mx-auto mt-8 max-w-[590px]">
              <p className="mb-4 text-[12px] font-bold uppercase tracking-[0.2em] text-primary">
                Dokumen berhasil dikirim
              </p>
              <h1 className="text-[clamp(40px,5vw,68px)] font-bold leading-[0.98] tracking-[-0.04em] text-ink">
                Verifikasi perusahaan sedang diproses.
              </h1>
              <p className="mx-auto mt-6 max-w-[500px] text-[15px] leading-7 text-ink-muted sm:text-[17px]">
                Tim kami akan mengecek dokumen legalitas perusahaanmu. Akses akun
                akan tersedia setelah proses verifikasi selesai.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
