import Link from "next/link";
import Image from "next/image";

const columns = [
  {
    heading: "Jelajahi",
    links: [
      { label: "Cari Lowongan", href: "/jobs" },
      { label: "Perusahaan", href: "/companies" },
      { label: "Sumber Daya Karir", href: "/resources" },
      { label: "Tentang Kami", href: "/about" },
      { label: "Harga", href: "/pricing" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "Ekstraksi Dokumen AI", href: "/auth" },
      { label: "Validasi Video Cerdas", href: "/auth" },
      { label: "Sistem Rekomendasi", href: "/auth" },
    ],
  },
  {
    heading: "Referensi",
    links: [
      { label: "Panduan Pengguna", href: "/resources" },
      { label: "Dokumentasi API", href: "/resources" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative z-10 bg-inverse-canvas pt-16 px-6 lg:px-10 rounded-t-[30px] sm:rounded-t-[60px] overflow-hidden">
      <div className="max-w-[1584px] mx-auto flex flex-col md:flex-row justify-between items-start gap-10 border-b border-[#393939] pb-10 mb-10">
        <div className="max-w-sm">
          <span className="flex items-center">
            <Image src="/logo/Direkrut%20AI_DarkMode.png" className="h-7 w-auto" width={137} height={28} alt="Direkrut AI Logo" />
          </span>
          <p className="text-[#8d8d8d] text-[14px] leading-[1.6] mt-4">
            Platform cari kerja bertenaga AI. Cepat, relevan, dan transparan di
            setiap tahap seleksinya.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          {columns.map((column) => (
            <div key={column.heading} className="flex flex-col gap-4">
              <span className="text-white text-[14px] font-semibold">
                {column.heading}
              </span>
              {column.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[#c6c6c6] text-[14px] hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1584px] mx-auto flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center text-[#8d8d8d] text-[12px] pb-10">
        <p>© 2026 Direkrut AI. Hak cipta dilindungi.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">
            Kebijakan Privasi
          </a>
          <a href="#" className="hover:text-white">
            Syarat dan Ketentuan
          </a>
        </div>
      </div>

      <div className="max-w-[1584px] mx-auto" aria-hidden="true">
        <p className="text-[clamp(64px,12.5vw,196px)] font-semibold uppercase tracking-[-0.03em] leading-[0.8] text-white/10 whitespace-nowrap select-none translate-y-[18%]">
          Direkrut AI
        </p>
      </div>
    </footer>
  );
}
