"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import { NavDocuments } from "@/components/organisms/dashboard/NavDocuments";
import { NavMain } from "@/components/organisms/dashboard/NavMain";
import { NavSecondary } from "@/components/organisms/dashboard/NavSecondary";
import { NavUser } from "@/components/organisms/dashboard/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  UsersIcon,
  Settings2Icon,
  SearchIcon,
  FileTextIcon,
  CirclePlusIcon,
  FileChartColumnIcon,
  FolderIcon,
  CircleHelpIcon,
  Building2Icon,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

const navMain = [
  { title: "Dashboard", url: "/hrd", icon: <LayoutDashboardIcon /> },
  { title: "Manajemen Lowongan", url: "/hrd/jobs", icon: <FolderIcon /> },
  { title: "Divisi", url: "/hrd/departments", icon: <Building2Icon /> },
  { title: "Rekomendasi Posisi", url: "/hrd/cross-role", icon: <UsersIcon /> },
];

const navSecondary = [
  { title: "Pengaturan", url: "/hrd/settings", icon: <Settings2Icon /> },
  { title: "Bantuan", url: "/hrd/help", icon: <CircleHelpIcon /> },
  { title: "Pencarian", search: true, icon: <SearchIcon /> },
];

const documents = [
  { name: "Panduan HRD", url: "/hrd/help", icon: <FileTextIcon /> },
  {
    name: "Bobot Penilaian AI",
    url: "/hrd/help",
    icon: <FileChartColumnIcon />,
  },
];

export function HrdSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentUser } = useDashboard();
  const user = {
    name: currentUser?.name ?? "Pengguna HRD",
    email: currentUser?.email ?? "",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/hrd"
              className="flex h-9 items-center rounded-xl px-1.5 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            >
              <Image
                src="/logo/Direkrut%20AI_WhiteMode.png"
                className="block dark:hidden h-7 w-auto"
                width={137}
                height={28}
                alt="Direkrut AI Logo"
              />
              <Image
                src="/logo/DirekrutAI_DarkMode.png"
                className="hidden dark:block h-7 w-auto"
                width={137}
                height={28}
                alt="Direkrut AI Logo"
              />
            </Link>
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
  );
}
