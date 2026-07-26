"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"

import { NavMain } from "@/components/organisms/dashboard/NavMain"
import { NavUser } from "@/components/organisms/dashboard/NavUser"
import { NavSecondary } from "@/components/organisms/dashboard/NavSecondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  BriefcaseIcon,
  Settings2Icon,
  UserIcon,
  FileTextIcon,
  UploadCloudIcon,
  HelpCircleIcon,
} from "lucide-react"
import { useDashboard } from "@/context/DashboardContext"

const navMain = [
  { title: "Dasbor Lamaran", url: "/candidate", icon: <LayoutDashboardIcon /> },
  { title: "Cari Lowongan", url: "/candidate/jobs", icon: <BriefcaseIcon /> },
  { title: "Riwayat Lamaran", url: "/candidate/applications", icon: <FileTextIcon /> },
  { title: "Profil Saya", url: "/candidate/profile", icon: <UserIcon /> },
]

const navSecondary = [
  { title: "Ke Landing Page", url: "/", icon: <LayoutDashboardIcon /> },
  { title: "Bantuan & Dukungan", url: "/candidate/settings", icon: <HelpCircleIcon /> },
  { title: "Pengaturan Akun", url: "/candidate/settings", icon: <Settings2Icon /> },
]

export function CandidateSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentUser } = useDashboard()
  const user = {
    name: currentUser?.name ?? "Kandidat",
    email: currentUser?.email ?? "",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/candidate"
              className="flex h-9 items-center rounded-xl px-1.5 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            >
              <Image src="/logo/Direkrut%20AI_WhiteMode.png" className="block dark:hidden h-7 w-auto" width={137} height={28} alt="Direkrut AI Logo" />
              <Image src="/logo/DirekrutAI_DarkMode.png" className="hidden dark:block h-7 w-auto" width={137} height={28} alt="Direkrut AI Logo" />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={navMain}
          actionButton={{
            title: "Unggah CV Baru",
            url: "/candidate/profile",
            icon: <UploadCloudIcon />,
          }}
          inboxUrl="/candidate/inbox"
        />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} accountUrl="/candidate/settings" />
      </SidebarFooter>
    </Sidebar>
  )
}
