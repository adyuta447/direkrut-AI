"use client"

import * as React from "react"
import Link from "next/link"

import { NavMain } from "@/components/organisms/dashboard/NavMain"
import { NavUser } from "@/components/organisms/dashboard/NavUser"
import { NavSecondary } from "@/components/organisms/dashboard/NavSecondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  BriefcaseIcon,
  Settings2Icon,
  CommandIcon,
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
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/candidate" />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">Direkrut AI</span>
            </SidebarMenuButton>
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
