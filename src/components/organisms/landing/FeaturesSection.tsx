const features = [
  {
    title: "Validasi Kompetensi Otomatis",
    desc: "Sistem analisis otomatis yang memverifikasi keterampilan teknis kandidat secara mendalam, memastikan kesesuaian di luar klaim tertulis pada CV.",
  },
  {
    title: "Rekomendasi Posisi Presisi",
    desc: "Pemetaan kompetensi menyeluruh untuk memberikan saran mutasi atau alternatif lowongan yang lebih ideal bagi setiap profil kandidat.",
  },
  {
    title: "Sistem Deteksi Integritas",
    desc: "Deteksi anomali mutakhir untuk menyaring respons yang tidak otentik atau dihasilkan sepenuhnya oleh perangkat generatif eksternal.",
  },
  {
    title: "Wawancara Video AI",
    desc: "Proses wawancara tahap pertama yang dipandu sepenuhnya oleh AI, memberikan wawasan analitis terstruktur dan menghemat puluhan jam kerja rekruter.",
  },
  {
    title: "Integrasi Penjadwalan",
    desc: "Fasilitas penjadwalan mandiri bagi kandidat untuk merencanakan sesi wawancara manual dengan tim HRD atau manajer teknis.",
  },
  {
    title: "Transparansi Metrik AI",
    desc: "Skor kecocokan yang tidak bersifat kotak hitam (black-box). Seluruh penilaian disertai dengan kutipan bukti yang jelas dari dokumen lamaran.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-6 lg:px-10 max-w-[1584px] mx-auto">
      <div className="mb-12">
        <h2 className="text-[42px] font-light leading-[1.2] text-ink">
          Dibangun untuk keandalan tingkat enterprise
        </h2>
      </div>

      <div className="grid md:grid-cols-3 border-t border-l border-hairline">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-6 border-r border-b border-hairline hover:bg-surface-1 transition-none"
          >
            <h3 className="text-[24px] font-normal leading-[1.33] mb-4 text-ink">{feature.title}</h3>
            <p className="text-[14px] text-ink leading-[1.5]">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
