"use client";

import { ReactNode, useEffect } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { DashboardProvider } from "@/context/DashboardContext";
import { ThemeProvider } from "@/components/theme-provider";
import { HrdSidebar } from "@/components/organisms/dashboard/HrdSidebar";
import { DashboardHeader } from "@/components/organisms/dashboard/DashboardHeader";
import { SearchDialog } from "@/components/organisms/dashboard/SearchDialog";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";

export default function HrdLayout({ children }: { children: ReactNode }) {
  const { currentUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) router.replace("/auth");
  }, [currentUser, router]);

  if (!currentUser) return null;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <DashboardProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as CSSProperties
          }
        >
          <HrdSidebar variant="inset" />
          <SidebarInset data-dashboard className="bg-background text-foreground">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto p-0">{children}</main>
          </SidebarInset>
          <SearchDialog />
        </SidebarProvider>
      </DashboardProvider>
    </ThemeProvider>
  );
}
