const stats = [
  { v: "500+", l: "Perusahaan" },
  { v: "10rb+", l: "Ditempatkan" },
  { v: "98%", l: "Kepuasan" },
];

export function AuthMarketingPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between w-[52%] flex-shrink-0 bg-inverse-canvas p-10 xl:p-14">
      <div className="flex items-center justify-between">
        <span className="text-[16px] font-semibold text-white tracking-tight uppercase">Direkrut AI</span>
      </div>

      <div>
        <p className="text-[14px] font-semibold uppercase text-[#c6c6c6] mb-6">Untuk Perekrut & Kandidat</p>
        <h2 className="text-[52px] xl:text-[64px] font-light text-white tracking-[-0.5px] leading-[1.1] mb-8 max-w-lg">
          Masa depan rekrutmen ada di sini.
        </h2>
        <blockquote className="border-l-2 border-white pl-6">
          <p className="text-[16px] text-[#e0e0e0] leading-relaxed mb-6">
            &quot;Proses validasi AI ini menghemat lebih dari 40 jam waktu kami untuk setiap rekrutmen. Kami sekarang hanya mewawancarai kandidat yang benar-benar kompeten.&quot;
          </p>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#393939] flex items-center justify-center text-[#f4f4f4] font-semibold text-[14px]">
              RK
            </div>
            <div>
              <p className="text-white text-[14px] font-semibold">Rika Kusuma</p>
              <p className="text-[#c6c6c6] text-[12px]">Kepala Talent, TechCorp Indonesia</p>
            </div>
          </div>
        </blockquote>
      </div>

      <div className="grid grid-cols-3 border-t border-[#393939] pt-8">
        {stats.map((s, i) => (
          <div key={s.l} className={`${i < 2 ? "border-r border-[#393939]" : ""} pr-6 pl-${i === 0 ? "0" : "6"}`}>
            <p className="text-white text-[32px] font-light mb-1">{s.v}</p>
            <p className="text-[#c6c6c6] text-[12px] font-semibold uppercase">{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
