"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/organisms/dashboard/ModeToggle"
import { NotificationBell } from "@/components/molecules/dashboard/NotificationBell"

const SECTION_TITLES: [prefix: string, title: string][] = [
  ["/candidate/jobs", "Cari Lowongan"],
  ["/candidate/applications", "Riwayat Lamaran"],
  ["/candidate/profile", "Profil Saya"],
  ["/candidate/inbox", "Kotak Masuk"],
  ["/candidate/settings", "Pengaturan Akun"],
  ["/candidate", "Dasbor Kandidat"],
  ["/hrd/jobs", "Manajemen Lowongan"],
  ["/hrd/ai-assistant", "Asisten AI"],
  ["/hrd/cross-role", "Lintas Posisi"],
  ["/hrd/candidates", "Detail Kandidat"],
  ["/hrd/inbox", "Kotak Masuk"],
  ["/hrd/settings", "Pengaturan"],
  ["/hrd/help", "Bantuan"],
  ["/hrd", "Dasbor HRD"],
]

function getSectionTitle(pathname: string): string {
  return SECTION_TITLES.find(([prefix]) => pathname.startsWith(prefix))?.[1] ?? "Direkrut AI"
}

export function DashboardHeader() {
  const pathname = usePathname()
  const title = getSectionTitle(pathname)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <span className="text-base font-medium">{title}</span>
      </div>
      <div className="flex items-center gap-2 px-4 lg:px-6">
        <NotificationBell />
        <ModeToggle />
      </div>
    </header>
  )
}
