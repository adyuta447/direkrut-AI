"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/candidate")) return "Dashboard Kandidat"
  if (pathname.startsWith("/hrd/jobs")) return "Manajemen Lowongan"
  if (pathname.startsWith("/hrd/ai-assistant")) return "Asisten AI"
  if (pathname.startsWith("/hrd/cross-role")) return "Lintas Posisi"
  if (pathname.startsWith("/hrd")) return "Dashboard HRD"
  return "Direkrut AI"
}

export function SiteHeader() {
  const pathname = usePathname()
  const title = getPageTitle(pathname)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
      <div className="flex items-center gap-2 px-4 lg:px-6">
        <ModeToggle />
      </div>
    </header>
  )
}
