import Link from "next/link";
import { Check, X } from "lucide-react";
import { SiteHeader } from "../../components/organisms/shared/SiteHeader";
import { SiteFooter } from "../../components/organisms/shared/SiteFooter";
import { CtaBanner } from "../../components/organisms/landing/CtaBanner";
import { FooterRevealBody } from "../../components/atoms/shared/FooterRevealBody";

const tiers = [
  {
    name: "Free",
    price: "Rp 0",
    period: "/bulan",
    desc: "Buat yang mau coba dulu. Nggak perlu kartu kredit, nggak ada jebakan.",
    cta: "Mulai Gratis",
    href: "/auth/register",
    popular: false,
  },
  {
    name: "Pro",
    price: "Rp 299rb – 500rb",
    period: "/bulan",
    desc: "Paling pas buat tim yang mulai serius rekrut. Semua fitur AI-nya kebuka.",
    cta: "Pilih Pro",
    href: "/auth/register",
    popular: true,
  },
  {
    name: "Pro Plus",
    price: "Rp 1jt – 2,5jt",
    period: "/bulan",
    desc: "Buat yang hiring-nya udah rutin. Lowongan unlimited, analytics lengkap.",
    cta: "Pilih Pro Plus",
    href: "/auth/register",
    popular: false,
  },
  {
    name: "Max",
    price: "Rp 5jt+",
    period: "/bulan atau nego",
    desc: "Full power tanpa batas, plus orang kami yang siap bantuin kapan aja.",
    cta: "Hubungi Kami",
    href: "/auth/register",
    popular: false,
  },
];

type FeatureValue = boolean | string;

const features: { label: string; values: [FeatureValue, FeatureValue, FeatureValue, FeatureValue] }[] = [
  { label: "Upload lowongan", values: ["Maks. 2", "Maks. 10", "Unlimited", "Unlimited"] },
  { label: "Terima lamaran CV", values: ["500 MB", "5 GB", "20 GB", "Unlimited"] },
  { label: "AI screening CV", values: [false, true, true, true] },
  { label: "AI interview asinkron", values: [false, true, true, true] },
  { label: "Ranking kandidat objektif", values: [false, true, true, true] },
  { label: "Feedback otomatis kandidat", values: [false, "Dasar", "Lengkap", "Lengkap + Custom"] },
  { label: "Dashboard analytics HRD", values: [false, "Dasar", "Lengkap", "Lengkap + Export"] },
  { label: "Cross-Role Discovery", values: [false, false, true, true] },
  { label: "Dedicated account manager", values: [false, false, false, true] },
];

function FeatureCell({ value }: { value: FeatureValue }) {
  if (value === true) {
    return <Check className="w-4 h-4 text-primary mx-auto" strokeWidth={2} aria-label="Termasuk" />;
  }
  if (value === false) {
    return <X className="w-4 h-4 text-ink-muted/50 mx-auto" strokeWidth={1.5} aria-label="Tidak termasuk" />;
  }
  return <span className="text-[13px] text-ink">{value}</span>;
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink font-sans overflow-x-clip">
      <FooterRevealBody>
        <SiteHeader />

        {/* Hero */}
        <section className="pt-14 pb-12 px-6 lg:px-10 max-w-[1584px] mx-auto">
          <p className="text-[12px] font-medium text-ink-muted uppercase tracking-[0.2em] mb-6">
            Harga
          </p>
          <h1 className="text-[clamp(40px,5vw,68px)] font-light leading-[1.05] tracking-[-0.02em] mb-6 text-ink max-w-3xl">
            Mulai gratis, upgrade pas udah butuh.
          </h1>
          <p className="text-[17px] text-ink-muted leading-[1.7] max-w-2xl">
            Buat kandidat, Direkrut AI selalu gratis. Paket di bawah ini buat kamu yang lagi
            rekrut: dari yang baru buka lowongan pertama sampai yang hiring-nya nggak pernah
            berhenti.
          </p>
        </section>

        {/* Kartu tier */}
        <section className="pb-16 px-6 lg:px-10 max-w-[1584px] mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-8 flex flex-col ${
                  tier.popular
                    ? "border-2 border-primary bg-canvas"
                    : "border border-hairline bg-canvas"
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[20px] font-normal text-ink">{tier.name}</h2>
                  {tier.popular && (
                    <span className="text-[11px] font-medium rounded-full bg-primary text-white px-3 py-1.5">
                      Paling Laris
                    </span>
                  )}
                </div>

                <p className="text-[clamp(26px,2vw,32px)] font-light tracking-[-0.01em] text-ink leading-none">
                  {tier.price}
                </p>
                <p className="text-[13px] text-ink-muted mt-2 mb-6">{tier.period}</p>

                <p className="text-[14px] text-ink-muted leading-[1.6] mb-8">{tier.desc}</p>

                <Link
                  href={tier.href}
                  className={`mt-auto block text-center rounded-full py-3 text-[14px] font-medium transition-none ${
                    tier.popular
                      ? "bg-primary text-white hover:bg-primary-strong"
                      : "border border-hairline text-ink hover:border-primary hover:text-primary"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Tabel perbandingan */}
        <section className="pb-24 px-6 lg:px-10 max-w-[1584px] mx-auto">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-[clamp(28px,3.5vw,44px)] font-light leading-[1.15] tracking-[-0.01em] text-ink mb-4">
              Bandingin dulu, baru pilih
            </h2>
            <p className="text-[15px] text-ink-muted leading-[1.6]">
              Semua paket bisa di-upgrade kapan aja. Nggak cocok? Turun paket juga gampang.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="text-left text-[13px] font-medium text-ink-muted uppercase tracking-[0.12em] bg-surface-1 rounded-tl-2xl px-6 py-5 w-[28%]">
                    Fitur
                  </th>
                  {tiers.map((tier, i) => (
                    <th
                      key={tier.name}
                      className={`text-center text-[14px] font-medium px-4 py-5 bg-surface-1 ${
                        i === tiers.length - 1 ? "rounded-tr-2xl" : ""
                      } ${tier.popular ? "text-primary" : "text-ink"}`}
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, rowIndex) => (
                  <tr key={feature.label}>
                    <td
                      className={`text-[14px] text-ink px-6 py-4 border-b border-hairline ${
                        rowIndex === 0 ? "" : ""
                      }`}
                    >
                      {feature.label}
                    </td>
                    {feature.values.map((value, i) => (
                      <td
                        key={i}
                        className="text-center px-4 py-4 border-b border-hairline"
                      >
                        <FeatureCell value={value} />
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="text-[14px] font-medium text-ink px-6 py-5">
                    Estimasi harga/bulan
                  </td>
                  <td className="text-center text-[13px] text-ink px-4 py-5">Rp 0</td>
                  <td className="text-center text-[13px] text-primary font-medium px-4 py-5">
                    Rp 299.000 – 500.000
                  </td>
                  <td className="text-center text-[13px] text-ink px-4 py-5">
                    Rp 1.000.000 – 2.500.000
                  </td>
                  <td className="text-center text-[13px] text-ink px-4 py-5">
                    Rp 5.000.000+ atau negosiasi
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[13px] text-ink-muted mt-6">
            Harga masih estimasi dan bisa berubah. Butuh paket yang lebih custom? Ngobrol sama
            kami dulu aja, gratis kok.
          </p>
        </section>

        <CtaBanner />
      </FooterRevealBody>
      <SiteFooter />
    </div>
  );
}
