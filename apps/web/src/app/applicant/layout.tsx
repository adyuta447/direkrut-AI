"use client";

import { ReactNode, useEffect } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { DashboardProvider } from "../../components/dashboard-provider";
import { ThemeProvider } from "../../components/theme-provider";
import { CandidateSidebar } from "../../components/candidate-sidebar";
import { SiteHeader } from "../../components/site-header";
import { SearchDialog } from "../../components/search-dialog";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";

export default function ApplicantLayout({ children }: { children: ReactNode }) {
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
          <CandidateSidebar />
          <SidebarInset className="bg-background text-foreground">
            <SiteHeader />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </SidebarInset>
          <SearchDialog />
        </SidebarProvider>
      </DashboardProvider>
    </ThemeProvider>
  );
}
