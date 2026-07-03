import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="bg-primary text-white py-24 px-6 lg:px-10">
      <div className="max-w-[1584px] mx-auto">
        <h2 className="text-[42px] font-light leading-[1.2] mb-8">
          Optimalkan strategi akuisisi talenta Anda.
        </h2>
        <div className="flex gap-4">
          <Link
            href="/auth"
            className="bg-white text-ink px-4 py-3 font-normal text-[14px] hover:bg-surface-1 transition-none"
          >
            Akses Dasbor Perekrut
          </Link>
          <Link
            href="/jobs"
            className="border border-white text-white px-4 py-3 font-normal text-[14px] hover:bg-white hover:text-ink transition-none"
          >
            Lihat Portal Lowongan
          </Link>
        </div>
      </div>
    </section>
  );
}
