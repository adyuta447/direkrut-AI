import { Upload, MessageSquare, CheckCircle, Video, Calendar, LucideIcon } from "lucide-react";

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
];
