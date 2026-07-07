export interface NavItem {
  label: string;
  href?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Cari Kerja", href: "/jobs" },
  { label: "Intip Perusahaan", href: "/companies" },
  { label: "Tips Karier", href: "/resources" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Tongkrongan" },
];
