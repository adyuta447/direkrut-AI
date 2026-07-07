import Link from "next/link";

const stats = [
  { value: "500+", label: "Perusahaan mitra" },
  { value: "10rb+", label: "Kandidat ditempatkan" },
  { value: "98%", label: "Tingkat kepuasan" },
];

export function AuthMarketingPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between w-[52%] flex-shrink-0 bg-inverse-canvas p-10 xl:p-14">
      <Link href="/" className="text-[16px] font-semibold text-white tracking-tight uppercase">
        Direkrut AI
      </Link>

      <div>
        <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-white/60 mb-6">
          Buat Kandidat & Perekrut
        </p>
        <h2 className="text-[clamp(40px,4vw,64px)] font-light text-white tracking-[-0.02em] leading-[1.05] mb-10 max-w-lg">
          Masa depan cari kerja udah di sini.
        </h2>

        <div className="rounded-3xl bg-white/5 p-6 max-w-md">
          <p className="text-[15px] text-white/80 leading-[1.6] mb-6">
            &quot;Proses validasi AI ini menghemat lebih dari 40 jam kerja kami di setiap
            rekrutmen. Sekarang kami cuma interview kandidat yang beneran kompeten.&quot;
          </p>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white font-medium text-[14px]">
              RK
            </div>
            <div>
              <p className="text-white text-[14px] font-medium">Rika Kusuma</p>
              <p className="text-white/60 text-[12px]">Kepala Talent, TechCorp Indonesia</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 border-t border-white/15 pt-8">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-white text-[32px] font-light leading-none mb-2">{stat.value}</p>
            <p className="text-white/60 text-[12px]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
