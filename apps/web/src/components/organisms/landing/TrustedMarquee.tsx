import Image from "next/image";

const companies = [
  { name: "ByteDance", logo: "/company/ByteDance_Logo.svg" },
  { name: "Grab", logo: "/company/Grab_Logo.webp" },
  { name: "Nestlé", logo: "/company/Nestlé_Logo.webp" },
  {
    name: "Universitas Indonesia",
    logo: "/company/UniversitasIndonesia_Logo.png",
  },
  { name: "CSG", logo: "/company/CSG_Logo.jpg" },
  { name: "Politeknik Negeri Jakarta", logo: "/company/PNJ_Logo.jpg" },
];

function LogoRow({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden}
      className="flex flex-shrink-0 items-center gap-16 pr-16 animate-marquee"
    >
      {[...companies, ...companies].map((company, i) => (
        <div
          key={`${company.name}-${i}`}
          className="relative h-16 w-48 flex-shrink-0"
        >
          <Image
            src={company.logo}
            alt={company.name}
            fill
            sizes="192px"
            unoptimized
            className="object-contain grayscale opacity-60 transition hover:opacity-100 hover:grayscale-0"
          />
        </div>
      ))}
    </div>
  );
}

export function TrustedMarquee() {
  return (
    <section
      className="pt-10 pb-8 overflow-hidden"
      aria-label="Mitra perusahaan"
      data-reveal
    >
      <p className="text-center text-sm sm:text-[12px] font-bold font-sans text-ink-muted uppercase tracking-[0.2em] mb-6 px-4">
        Direview oleh profesional dari berbagai perusahaan & institusi di
        Indonesia
      </p>
      <div className="relative flex overflow-hidden">
        <LogoRow />
        <LogoRow ariaHidden />
      </div>
    </section>
  );
}
