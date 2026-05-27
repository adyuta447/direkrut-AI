import { useApp } from "../context/AppContext";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export default function LandingPage() {
  const { setCurrentPage, jobs } = useApp();
  const featuredJobs = jobs.slice(0, 4);

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans overflow-x-hidden">

      {/* ── UTILITY BAR & NAV ───────────────────────────────────────────── */}
      <div className="bg-surface-1 h-8 flex items-center px-6 lg:px-10 justify-end text-[12px] text-ink-muted">
        <div className="flex gap-4">
          <span className="hover:text-ink cursor-pointer">Bantuan</span>
          <span className="hover:text-ink cursor-pointer">Hubungi Kami</span>
        </div>
      </div>
      <nav className="border-b border-hairline bg-canvas">
        <div className="max-w-[1584px] mx-auto px-6 lg:px-10 h-16 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <span className="text-[20px] font-semibold tracking-tight uppercase">Direkrut AI</span>
            
            {/* New Navbar Links */}
            <div className="hidden lg:flex items-center gap-6">
              <button
                onClick={() => setCurrentPage("jobs")}
                className="text-[14px] font-normal text-ink hover:text-primary transition-none"
              >
                Cari Lowongan
              </button>
              <button className="text-[14px] font-normal text-ink hover:text-primary transition-none">
                Cari Profil
              </button>
              <button className="text-[14px] font-normal text-ink hover:text-primary transition-none">
                Sumber Daya Karir
              </button>
              <button className="text-[14px] font-normal text-ink hover:text-primary transition-none">
                Perusahaan
              </button>
              <button className="text-[14px] font-normal text-ink hover:text-primary transition-none">
                Komunitas
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentPage("auth")}
              className="text-[14px] font-normal hover:text-primary transition-none"
            >
              Masuk
            </button>
            <button
              onClick={() => setCurrentPage("auth")}
              className="btn-primary"
            >
              Mendaftar
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="pt-24 pb-16 px-6 lg:px-10 max-w-[1584px] mx-auto">
        <h1 className="text-[76px] leading-[1.17] font-light tracking-[-0.5px] mb-8 text-ink max-w-4xl">
          Otomatisasi proses rekrutmen dengan presisi kecerdasan buatan.
        </h1>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-16 border-b border-hairline">
          <p className="text-[18px] text-ink leading-[1.5] max-w-2xl font-normal">
            Tingkatkan efisiensi akuisisi talenta perusahaan Anda melalui ekstraksi riwayat kerja yang cerdas, 
            validasi kompetensi otomatis, dan simulasi wawancara video berbasis AI. Dirancang khusus untuk ekosistem korporasi (Enterprise).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <button
              onClick={() => setCurrentPage("auth")}
              className="btn-primary flex items-center justify-center gap-2"
            >
              Jelajahi Peluang
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage("auth")}
              className="border border-primary text-primary px-4 py-3 font-normal text-sm hover:bg-primary hover:text-white transition-none text-center"
            >
              Masuk Portal HRD
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section className="border-b border-hairline bg-surface-1">
        <div className="max-w-[1584px] mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4">
          {[
            { value: "10rb+", label: "Kandidat Berhasil Ditempatkan" },
            { value: "98%", label: "Tingkat Kepuasan Klien" },
            { value: "3×", label: "Akselerasi Proses Rekrutmen" },
            { value: "500+", label: "Mitra Perusahaan Terdaftar" },
          ].map((stat, i) => (
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

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-10 max-w-[1584px] mx-auto">
        <div className="mb-12">
          <h2 className="text-[42px] font-light leading-[1.2] text-ink">
            Dibangun untuk keandalan tingkat enterprise
          </h2>
        </div>

        <div className="grid md:grid-cols-3 border-t border-l border-hairline">
          {[
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
          ].map((feature) => (
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

      {/* ── FEATURED JOBS ─────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-10 max-w-[1584px] mx-auto bg-surface-1 border-y border-hairline">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-[42px] font-light leading-[1.2] text-ink">
            Peluang Karir Terkini
          </h2>
          <button
            onClick={() => setCurrentPage("jobs")}
            className="flex items-center gap-2 text-primary font-normal text-[14px] hover:underline"
          >
            Lihat seluruh posisi
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {featuredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setCurrentPage("jobs")}
              className="bg-canvas border border-hairline p-8 cursor-pointer hover:border-primary group"
            >
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="text-[24px] font-normal text-ink leading-[1.33]">{job.title}</h3>
                  <p className="text-[14px] text-ink mt-1">{job.company} — {job.location}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-none" />
              </div>
              <div className="flex items-center gap-4 border-t border-hairline pt-4">
                <span className="text-[14px] text-ink">{job.type}</span>
                <span className="text-[14px] text-ink-muted">{job.posted}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────── */}
      <section className="bg-primary text-white py-24 px-6 lg:px-10">
        <div className="max-w-[1584px] mx-auto">
          <h2 className="text-[42px] font-light leading-[1.2] mb-8">
            Optimalkan strategi akuisisi talenta Anda.
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage("auth")}
              className="bg-white text-ink px-4 py-3 font-normal text-[14px] hover:bg-surface-1 transition-none"
            >
              Akses Dasbor Perekrut
            </button>
            <button
              onClick={() => setCurrentPage("jobs")}
              className="border border-white text-white px-4 py-3 font-normal text-[14px] hover:bg-white hover:text-ink transition-none"
            >
              Lihat Portal Lowongan
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="bg-inverse-canvas py-16 px-6 lg:px-10">
        <div className="max-w-[1584px] mx-auto flex flex-col md:flex-row justify-between items-start gap-8 border-b border-[#393939] pb-8 mb-8">
          <div>
            <span className="text-[20px] font-semibold text-white tracking-tight uppercase">Direkrut AI</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="flex flex-col gap-4">
              <span className="text-white text-[14px] font-semibold">Platform Integrasi</span>
              <a href="#" className="text-[#c6c6c6] text-[14px] hover:text-white">Ekstraksi Dokumen AI</a>
              <a href="#" className="text-[#c6c6c6] text-[14px] hover:text-white">Validasi Video Cerdas</a>
              <a href="#" className="text-[#c6c6c6] text-[14px] hover:text-white">Sistem Rekomendasi</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-white text-[14px] font-semibold">Pusat Referensi</span>
              <a href="#" className="text-[#c6c6c6] text-[14px] hover:text-white">Panduan Pengguna</a>
              <a href="#" className="text-[#c6c6c6] text-[14px] hover:text-white">Dokumentasi API</a>
            </div>
          </div>
        </div>
        <div className="max-w-[1584px] mx-auto flex justify-between items-center text-[#8d8d8d] text-[12px]">
          <p>© 2026 Direkrut AI. Hak cipta dilindungi.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white">Syarat dan Ketentuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
