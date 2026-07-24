const companies = [
  "aju Bersama Tbk",
  "PT Nusantara Jaya",
  "TechIndo Makmur",
  "Bintang Sejahtera",
  "Grup Merdeka",
  "Karya Cipta",
  "Solusi Bangsa",
];

export function TrustedMarquee() {
  return (
    <section
      className="pt-10 pb-8 overflow-hidden"
      aria-label="Mitra perusahaan"
      data-reveal
    >
      <p className="text-center text-[12px] font-medium text-ink-muted uppercase tracking-[0.2em] mb-6">
        Direview oleh profesional dari berbagai perusahaan & institusi di
        Indonesia
      </p>
      <div className="relative flex overflow-hidden">
        <div className="flex flex-shrink-0 items-center gap-16 pr-16 animate-marquee">
          {[...companies, ...companies].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-[22px] font-bold text-ink-muted whitespace-nowrap"
            >
              {name}
            </span>
          ))}
        </div>
        <div
          aria-hidden="true"
          className="flex flex-shrink-0 items-center gap-16 pr-16 animate-marquee"
        >
          {[...companies, ...companies].map((name, i) => (
            <span
              key={`${name}-dup-${i}`}
              className="text-[22px] font-bold text-ink-muted whitespace-nowrap"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
