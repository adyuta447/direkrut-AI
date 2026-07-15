"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, UsersIcon, CheckSquareIcon, Settings2Icon, CommandIcon, SearchIcon, FileTextIcon, CirclePlusIcon, FileChartColumnIcon, FileIcon, FolderIcon, CircleHelpIcon, CameraIcon } from "lucide-react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/hrd",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    {
      title: "Manajemen Lowongan",
      url: "/hrd/jobs",
      icon: (
        <FolderIcon
        />
      ),
    },
    {
      title: "Asisten AI",
      url: "/hrd/assistant",
      icon: (
        <CircleHelpIcon
        />
      ),
    },
    {
      title: "Lintas Posisi",
      url: "/hrd/cross-role",
      icon: (
        <UsersIcon
        />
      ),
    },
    {
      title: "Validasi Kompetensi (AI)",
      url: "/hrd/gap-analysis",
      icon: (
        <CheckSquareIcon
        />
      ),
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: (
        <CameraIcon
        />
      ),
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: (
        <FileTextIcon
        />
      ),
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: (
        <FileTextIcon
        />
      ),
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/hrd/settings",
      icon: (
        <Settings2Icon
        />
      ),
    },
    {
      title: "Get Help",
      url: "/hrd/help",
      icon: (
        <CircleHelpIcon
        />
      ),
    },
    {
      title: "Search",
      url: "#",
      icon: (
        <SearchIcon
        />
      ),
    },
  ],
  documents: [
    {
      name: "Panduan HRD",
      url: "/hrd/help",
      icon: (
        <FileTextIcon
        />
      ),
    },
    {
      name: "Template Email",
      url: "#",
      icon: (
        <FileIcon
        />
      ),
    },
    {
      name: "Format Wawancara",
      url: "#",
      icon: (
        <FileChartColumnIcon
        />
      ),
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">Direkrut AI</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain 
          items={data.navMain} 
          actionButton={{
            title: "Buat Lowongan",
            url: "/hrd/jobs",
            icon: <CirclePlusIcon />
          }}
          inboxUrl="/hrd/inbox"
        />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
