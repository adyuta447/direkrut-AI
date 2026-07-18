"use client"

import * as React from "react"
import Link from "next/link"

import { NavDocuments } from "@/components/organisms/dashboard/NavDocuments"
import { NavMain } from "@/components/organisms/dashboard/NavMain"
import { NavSecondary } from "@/components/organisms/dashboard/NavSecondary"
import { NavUser } from "@/components/organisms/dashboard/NavUser"
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
  UsersIcon,
  Settings2Icon,
  CommandIcon,
  SearchIcon,
  FileTextIcon,
  CirclePlusIcon,
  FileChartColumnIcon,
  FolderIcon,
  CircleHelpIcon,
  SparklesIcon,
  Building2Icon,
} from "lucide-react"
import { useDashboard } from "@/context/DashboardContext"

const navMain = [
  { title: "Dasbor", url: "/hrd", icon: <LayoutDashboardIcon /> },
  { title: "Manajemen Lowongan", url: "/hrd/jobs", icon: <FolderIcon /> },
  { title: "Departemen", url: "/hrd/departments", icon: <Building2Icon /> },
  { title: "Asisten AI", url: "/hrd/ai-assistant", icon: <SparklesIcon /> },
  { title: "Lintas Posisi", url: "/hrd/cross-role", icon: <UsersIcon /> },
]

const navSecondary = [
  { title: "Pengaturan", url: "/hrd/settings", icon: <Settings2Icon /> },
  { title: "Bantuan", url: "/hrd/help", icon: <CircleHelpIcon /> },
  { title: "Pencarian", search: true, icon: <SearchIcon /> },
]

const documents = [
  { name: "Panduan HRD", url: "/hrd/help", icon: <FileTextIcon /> },
  { name: "Bobot Penilaian AI", url: "/hrd/help", icon: <FileChartColumnIcon /> },
]

export function HrdSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentUser } = useDashboard()
  const user = {
    name: currentUser?.name ?? "Pengguna HRD",
    email: currentUser?.email ?? "",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/hrd" />}
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
            title: "Buat Lowongan",
            url: "/hrd/jobs",
            icon: <CirclePlusIcon />,
          }}
          inboxUrl="/hrd/inbox"
        />
        <NavDocuments items={documents} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} accountUrl="/hrd/settings" />
      </SidebarFooter>
    </Sidebar>
  )
}
