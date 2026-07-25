import { SiteHeader } from "../../components/organisms/shared/SiteHeader";
import { SiteFooter } from "../../components/organisms/shared/SiteFooter";
import { CtaBanner } from "../../components/organisms/landing/CtaBanner";
import { TeamShowcase } from "../../components/organisms/landing/TeamShowcase";
import { FooterRevealBody } from "../../components/atoms/shared/FooterRevealBody";
import Image from "next/image";

const values = [
  {
    number: "01",
    title: "Transparan dari awal",
    desc: "Nggak ada skor kotak hitam, nggak ada kandidat digantung. Semua penilaian bisa dilihat alasannya, semua status bisa dipantau.",
  },
  {
    number: "02",
    title: "Kandidat duluan",
    desc: "Fitur kami dibangun dari keresahan pencari kerja, bukan cuma kebutuhan perusahaan. Kalau kandidat nyaman, hasil rekrutmennya ikut bagus.",
  },
  {
    number: "03",
    title: "Serius di teknologi, santai di bahasa",
    desc: "AI-nya kami bangun sungguh-sungguh, tapi cara kami ngomong tetap manusiawi. Teknologi canggih nggak harus terdengar kaku.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink font-sans overflow-x-clip">
      <FooterRevealBody>
        <SiteHeader />

        {/* Hero */}
        <section className="relative overflow-hidden bg-black">
          <Image
            src="/map.png"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent"
          />

          <div className="relative max-w-[1584px] mx-auto px-6 lg:px-10 py-24 lg:py-32">
            <p className="text-[12px] font-medium text-white/60 uppercase tracking-[0.2em] mb-6">
              Tentang Kami
            </p>
            <h1 className="text-[clamp(40px,5.5vw,76px)] font-bold leading-[1.02] tracking-[-0.02em] mb-8 text-white max-w-3xl">
              Tim kecil, misinya gede:{" "}
              <span className="text-[#93c5fd]">
                bikin cari kerja nggak ribet lagi.
              </span>
            </h1>
            <p className="text-[17px] lg:text-[18px] text-white/70 leading-[1.7] max-w-xl">
              Direkrut AI lahir dari keresahan sederhana: proses rekrutmen itu
              kelamaan, kandidat sering digantung, dan skill nyata kalah sama CV
              yang bagus doang. Jadi kami bangun AI yang menilai kemampuan
              beneran, dan bikin semua prosesnya transparan.
            </p>
          </div>
        </section>

        {/* Misi */}
        <section className="py-24 px-6 lg:px-10 max-w-[1584px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-8">
            <p className="lg:col-span-3 text-[12px] font-medium text-ink-muted uppercase tracking-[0.2em]">
              Misi Kami
            </p>
            <h2 className="lg:col-span-9 text-[clamp(28px,3.5vw,52px)] font-bold leading-[1.15] tracking-[-0.01em] text-ink max-w-4xl">
              Kami percaya skill nyata lebih penting daripada koneksi.
              <span className="text-primary">
                {" "}
                AI kami dibangun buat ngebuktiin itu.
              </span>{" "}
              Satu kandidat, satu perusahaan, satu proses rekrutmen dalam satu
              waktu.
            </h2>
          </div>
        </section>

        <section className="pb-24 px-6 lg:px-10 max-w-[1584px] mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {values.map((value) => (
              <div
                key={value.number}
                className="rounded-2xl bg-surface-1 p-8 lg:p-10"
              >
                <p className="text-[15px] font-normal text-primary tabular-nums mb-6">
                  {value.number}
                </p>
                <h3 className="text-[22px] font-semibold leading-[1.3] mb-3 text-ink">
                  {value.title}
                </h3>
                <p className="text-[14px] text-ink-muted leading-[1.6]">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <TeamShowcase />

        <CtaBanner />
      </FooterRevealBody>
      <SiteFooter />
    </div>
  );
}
