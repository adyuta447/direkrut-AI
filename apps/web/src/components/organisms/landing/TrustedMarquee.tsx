import Image from "next/image";

const companies = [
  { name: "ByteDance", logo: "/company/ByteDance_Logo.svg" },
  { name: "Grab", logo: "/company/Grab_Logo.webp" },
  { name: "Nestlé", logo: "/company/Nestlé_Logo.webp" },
  { name: "CSG", logo: "/company/CSG_Logo.jpg" },
  { name: "Universitas Indonesia", logo: "/company/UniversitasIndonesia_Logo.png" },
  { name: "Politeknik Negeri Jakarta", logo: "/company/PNJ_Logo.jpg" },
];

// Satu grup diulang tiga kali biar lebarnya lewat viewport paling lebar,
// lalu grup keduanya jadi kembaran buat bikin loop -50% mulus.
const groupItems = [...companies, ...companies, ...companies];

function LogoGroup({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-10 pr-10 sm:gap-16 sm:pr-16"
    >
      {groupItems.map((company, index) => {
        const isDuplicate = ariaHidden || index >= companies.length;

        return (
          <span
            key={`${company.name}-${index}`}
            aria-hidden={isDuplicate}
            className="relative block h-9 w-[110px] shrink-0 sm:h-11 sm:w-[140px]"
          >
            <Image
              src={company.logo}
              alt={isDuplicate ? "" : company.name}
              fill
              sizes="140px"
              quality={90}
              className="object-contain opacity-70 grayscale"
              unoptimized={company.logo.endsWith(".svg")}
              loading="lazy"
            />
          </span>
        );
      })}
    </div>
  );
}

export function TrustedMarquee() {
  return (
    <section
      className="overflow-hidden pb-8 pt-10 font-sans"
      aria-labelledby="trusted-companies-title"
      data-reveal
    >
      <p
        id="trusted-companies-title"
        className="mb-8 px-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-ink-muted sm:text-[12px]"
      >
        Masukan dari praktisi di perusahaan &amp; institusi
      </p>

      <div className="relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-testimonial-marquee">
          <LogoGroup />
          <LogoGroup ariaHidden />
        </div>
      </div>
    </section>
  );
}
