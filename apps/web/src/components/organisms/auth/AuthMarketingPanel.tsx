import Link from "next/link";
import Image from "next/image";

const stats = [
  { value: "500+", label: "Perusahaan mitra" },
  { value: "10rb+", label: "Kandidat ditempatkan" },
  { value: "98%", label: "Tingkat kepuasan" },
];

export function AuthMarketingPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between w-[52%] flex-shrink-0 p-10 xl:p-14 relative overflow-hidden">
      <Image
        src="/auth.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="52vw"
        className="pointer-events-none object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

      <Link href="/" className="relative flex items-center hover:opacity-90 transition-opacity">
        <Image src="/logo/Direkrut%20AI_DarkMode.png" className="h-7 w-auto" width={137} height={28} alt="Direkrut AI Logo" />
      </Link>

      <div className="relative">
        <p className="inline-flex rounded-full bg-white/15 backdrop-blur-md px-4 py-2 text-[13px] font-semibold text-white mb-6 border border-white/20">
          Buat Kandidat & Perekrut
        </p>
        <h2 className="text-[clamp(42px,4.2vw,68px)] font-bold text-white tracking-[-0.02em] leading-[1.05] mb-10 max-w-lg drop-shadow-sm">
          Masa depan cari kerja udah di sini.
        </h2>

        <div className="rounded-3xl border border-white/20 bg-white/10 p-6 max-w-md backdrop-blur-xl shadow-2xl">
          <p className="text-[16px] text-white leading-[1.6] mb-6">
            &quot;Proses validasi AI ini menghemat lebih dari 40 jam kerja kami di setiap
            rekrutmen. Sekarang kami cuma interview kandidat yang beneran kompeten.&quot;
          </p>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-[14px] shadow-lg">
              RK
            </div>
            <div>
              <p className="text-white text-[14px] font-medium">Rika Kusuma</p>
              <p className="text-white/70 text-[12px]">Kepala Talent, TechCorp Indonesia</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-3 gap-6 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 shadow-2xl">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-white text-[34px] font-bold leading-none mb-2">{stat.value}</p>
            <p className="text-white/70 text-[12px]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
