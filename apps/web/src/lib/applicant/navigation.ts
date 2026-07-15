import { Upload, MessageSquare, CheckCircle, Video, Calendar, User, Mail, Settings, LucideIcon } from "lucide-react";

export interface ApplicantNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

export const applicantNavItems: ApplicantNavItem[] = [
  {
    href: "/applicant/apply",
    label: "Kirim Lamaran",
    icon: Upload,
    title: "Kirim Lamaran",
    subtitle: "Unggah dokumen Anda dan pilih peran target",
  },
  {
    href: "/applicant/validation",
    label: "Validasi Sistem",
    icon: MessageSquare,
    title: "Validasi AI",
    subtitle: "Urutan validasi sistem berdasarkan profil Anda",
  },
  {
    href: "/applicant/scheduling",
    label: "Jadwal Interview",
    icon: Calendar,
    title: "Jadwal Interview",
    subtitle: "Pilih jadwal wawancara AI Anda",
  },
  {
    href: "/applicant/ai-practice",
    label: "Wawancara AI",
    icon: Video,
    title: "Wawancara Video AI",
    subtitle: "Sesi wawancara otonom interaktif",
  },
  {
    href: "/applicant/status",
    label: "Status Lamaran",
    icon: CheckCircle,
    title: "Status Lamaran",
    subtitle: "Lacak posisi lamaran Anda saat ini",
  },
  {
    href: "/applicant/profile",
    label: "Profil Saya",
    icon: User,
    title: "Profil Saya",
    subtitle: "Kelola CV, pengalaman, dan preferensi kerja Anda",
  },
  {
    href: "/applicant/inbox",
    label: "Kotak Masuk",
    icon: Mail,
    title: "Kotak Masuk",
    subtitle: "Email dari perusahaan terkait lamaran Anda",
  },
  {
    href: "/applicant/settings",
    label: "Pengaturan Akun",
    icon: Settings,
    title: "Pengaturan Akun",
    subtitle: "Kelola preferensi, notifikasi, dan keamanan akun",
  },
];
