import { Users, Target, ClipboardList, Sparkles, CheckSquare, Inbox, Settings, CircleHelp, LucideIcon } from "lucide-react";

export interface HrdPageMeta {
  hrefPrefix: string;
  title: string;
  subtitle: string;
}

export const hrdPageMeta: HrdPageMeta[] = [
  { hrefPrefix: "/hrd/candidates", title: "Detail Kandidat", subtitle: "Informasi dan analisis mendetail tentang kandidat" },
  { hrefPrefix: "/hrd/cross-role", title: "Rekomendasi Alternatif Posisi", subtitle: "Temukan kecocokan peran alternatif dengan AI" },
  { hrefPrefix: "/hrd/jobs/", title: "Kandidat Lowongan", subtitle: "Daftar & analisis kandidat untuk lowongan ini" },
  { hrefPrefix: "/hrd/jobs", title: "Manajemen Lowongan", subtitle: "Kelola lowongan pekerjaan yang aktif" },
  { hrefPrefix: "/hrd/assistant", title: "Asisten AI", subtitle: "Asisten chat pintar untuk analisis rekrutmen" },
  { hrefPrefix: "/hrd/gap-analysis", title: "Validasi Kompetensi (AI)", subtitle: "Validasi keterampilan kandidat secara langsung terhadap bukti yang ditemukan di CV mereka." },
  { hrefPrefix: "/hrd/inbox", title: "Kotak Masuk Email", subtitle: "Riwayat email yang dikirim ke kandidat" },
  { hrefPrefix: "/hrd/settings", title: "Pengaturan", subtitle: "Kelola preferensi akun, sistem AI, dan tagihan" },
  { hrefPrefix: "/hrd/help", title: "Pusat Bantuan & Panduan", subtitle: "Pelajari cara menggunakan dasbor Direkrut AI" },
  { hrefPrefix: "/hrd", title: "Manajemen Pelamar", subtitle: "Tinjau dan kelola lamaran kandidat" },
];

export interface HrdNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const hrdNavItems: HrdNavItem[] = [
  { href: "/hrd", label: "Manajemen Pelamar", icon: Users },
  { href: "/hrd/cross-role", label: "Rekomendasi Alternatif Posisi", icon: Target },
  { href: "/hrd/jobs", label: "Manajemen Lowongan", icon: ClipboardList },
  { href: "/hrd/assistant", label: "Asisten AI", icon: Sparkles },
  { href: "/hrd/gap-analysis", label: "Validasi Kompetensi (AI)", icon: CheckSquare },
  { href: "/hrd/inbox", label: "Kotak Masuk Email", icon: Inbox },
  { href: "/hrd/settings", label: "Pengaturan", icon: Settings },
  { href: "/hrd/help", label: "Pusat Bantuan", icon: CircleHelp },
];
