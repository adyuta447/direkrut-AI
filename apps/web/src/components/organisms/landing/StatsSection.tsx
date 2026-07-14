const stats = [
  { count: 10, suffix: "rb+", display: "10rb+", label: "Kandidat berhasil dapat kerja di sini" },
  { count: 98, suffix: "%", display: "98%", label: "Klien puas dengan hasilnya" },
  { count: 3, suffix: "×", display: "3×", label: "Lebih cepat dari proses rekrutmen biasa" },
  { count: 500, suffix: "+", display: "500+", label: "Perusahaan sudah jadi mitra kami" },
];

export function StatsSection() {
  return (
    <section className="px-6 lg:px-10 max-w-[1584px] mx-auto py-24">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-reveal-group>
        {stats.map((stat) => (
          <div key={stat.label} className="bg-primary rounded-3xl p-8 lg:p-10" data-reveal-item>
            <p className="text-[clamp(40px,4.5vw,64px)] font-bold tracking-[-0.02em] leading-none mb-4 text-white">
              <span data-count={stat.count} data-suffix={stat.suffix}>
                {stat.display}
              </span>
            </p>
            <p className="text-[14px] text-white/75 font-normal">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
