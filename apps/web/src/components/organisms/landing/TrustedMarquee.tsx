const reviews = [
  {
    initials: "JA",
    identity: "Kak Jason — Software Engineer, perusahaan e-commerce",
    review:
      "Perjelas status kandidat dan pisahkan tahapan rekrutmen dari rekomendasi AI. Status kini dibuat lebih eksplisit dan perpindahan posisi tetap membutuhkan persetujuan HRD.",
  },
  {
    initials: "KE",
    identity: "Kak Kevin — IT Specialist/Software Engineer, perbankan",
    review:
      "Fokuskan MVP pada kestabilan alur inti dan penyimpanan state sebelum scaling. Arsitektur modular dipertahankan dengan session ID dan state database.",
  },
  {
    initials: "NU",
    identity:
      "Kak Nugi — Product Designer dan berpengalaman sebagai Product Manager",
    review:
      "Sederhanakan warna dan hierarki agar pengguna fokus pada status, hasil analisis, dan langkah berikutnya. Palet serta copywriting kemudian dibuat lebih ringkas.",
  },
  {
    initials: "AT",
    identity: "Kak Athallah — lulusan Fakultas Hukum Universitas Indonesia",
    review:
      "Penggunaan data kandidat dan peran AI harus dijelaskan secara transparan. Persetujuan pemrosesan data kini ditempatkan sebelum kandidat memulai asesmen.",
  },
  {
    initials: "FE",
    identity: "Pak Fedy — praktisi HR Perusahaan Multinasional",
    review:
      "AI harus membantu, bukan menggantikan keputusan rekruter. Hasil analisis dibuat mudah ditinjau dan keputusan akhir tetap berada di tangan HRD.",
  },
];

function ReviewGroup({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden}
      className="flex shrink-0 gap-5 pr-5"
    >
      {[...reviews, ...reviews].map((review, index) => (
        <blockquote
          key={`${review.identity}-${index}`}
          aria-hidden={ariaHidden || index >= reviews.length}
          className="flex h-[270px] w-[320px] shrink-0 flex-col rounded-3xl border border-hairline bg-white p-5 sm:h-[250px] sm:w-[370px] sm:p-6"
        >
          <p className="flex-1 text-[13px] font-medium leading-[1.7] text-ink sm:text-[14px]">
            &ldquo;{review.review}&rdquo;
          </p>

          <footer className="mt-4 flex min-h-[52px] items-center gap-3 border-t border-hairline pt-4">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[10px] font-bold text-ink"
            >
              {review.initials}
            </span>
            <cite className="min-w-0 not-italic">
              <span className="block text-[10px] font-semibold leading-[1.5] text-ink-muted sm:text-[11px]">
                {review.identity}
              </span>
            </cite>
          </footer>
        </blockquote>
      ))}
    </div>
  );
}

export function TrustedMarquee() {
  return (
    <section
      className="overflow-hidden pb-8 pt-10 font-sans"
      aria-labelledby="product-reviews-title"
      data-reveal
    >
      <p
        id="product-reviews-title"
        className="mb-6 px-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-ink-muted sm:text-[12px]"
      >
        Masukan yang membentuk Direkrut AI
      </p>

      <div className="relative overflow-hidden">
        <div className="flex w-max animate-testimonial-marquee">
          <ReviewGroup />
          <ReviewGroup ariaHidden />
        </div>
      </div>
    </section>
  );
}
