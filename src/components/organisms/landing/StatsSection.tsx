const stats = [
  { value: "10rb+", label: "Kandidat Berhasil Ditempatkan" },
  { value: "98%", label: "Tingkat Kepuasan Klien" },
  { value: "3×", label: "Akselerasi Proses Rekrutmen" },
  { value: "500+", label: "Mitra Perusahaan Terdaftar" },
];

export function StatsSection() {
  return (
    <section className="border-b border-hairline bg-surface-1">
      <div className="max-w-[1584px] mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`py-8 px-6 ${i < 3 ? "border-r border-hairline" : ""}`}
          >
            <p className="text-[42px] font-light tracking-normal mb-1">{stat.value}</p>
            <p className="text-[14px] text-ink font-normal">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
