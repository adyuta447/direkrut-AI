"use client";

import { ReactNode, useEffect } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { HrdSearchProvider } from "../../lib/hrd/HrdSearchContext";
import { DashboardProvider } from "../../components/dashboard-provider";
import { ThemeProvider } from "../../components/theme-provider";
import { AppSidebar } from "../../components/app-sidebar";
import { SiteHeader } from "../../components/site-header";
import { SearchDialog } from "../../components/search-dialog";
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
        <HrdSearchProvider>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              } as CSSProperties
            }
          >
            <AppSidebar variant="inset" />
            <SidebarInset className="bg-background text-foreground">
              <SiteHeader />
              <main className="flex-1 overflow-y-auto p-0">{children}</main>
            </SidebarInset>
            <SearchDialog />
          </SidebarProvider>
        </HrdSearchProvider>
      </DashboardProvider>
    </ThemeProvider>
  );
}
