"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { NavDocuments } from "@/components/nav-documents"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { UploadCloudIcon, MessageSquareIcon, CalendarIcon, VideoIcon, CheckCircleIcon, Settings2Icon, CommandIcon, UserIcon, FileTextIcon, HelpCircleIcon, FileIcon } from "lucide-react"

const data = {
  user: {
    name: "Kandidat Demo",
    email: "kandidat@example.com",
    avatar: "/avatars/kandidat.jpg",
  },
  navMain: [
    {
      title: "Kirim Lamaran",
      url: "/applicant/apply",
      icon: <UploadCloudIcon />,
    },
    {
      title: "Validasi Sistem",
      url: "/applicant/validation",
      icon: <MessageSquareIcon />,
    },
    {
      title: "Jadwal Interview",
      url: "/applicant/scheduling",
      icon: <CalendarIcon />,
    },
    {
      title: "Wawancara AI",
      url: "/applicant/ai-practice",
      icon: <VideoIcon />,
    },
    {
      title: "Status Lamaran",
      url: "/applicant/status",
      icon: <CheckCircleIcon />,
    },
    {
      title: "Profil Saya",
      url: "/applicant/profile",
      icon: <UserIcon />,
    },
  ],
  navDocuments: [
    {
      name: "Template CV Profesional",
      url: "#",
      icon: <FileIcon />,
    },
    {
      name: "Panduan Wawancara AI",
      url: "#",
      icon: <FileTextIcon />,
    },
    {
      name: "Portfolio Saya",
      url: "#",
      icon: <FileIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Bantuan & Dukungan",
      url: "#",
      icon: <HelpCircleIcon />,
    },
    {
      title: "Pengaturan Akun",
      url: "/applicant/settings",
      icon: <Settings2Icon />,
    },
  ],
}

export function CandidateSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="/applicant" />}
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
            title: "Unggah CV Baru",
            url: "/applicant/profile",
            icon: <UploadCloudIcon />
          }}
          inboxUrl="/applicant/inbox"
        />
        <NavDocuments items={data.navDocuments} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
