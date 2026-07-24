"use client";

import { ReactNode, useEffect } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";
import { ThemeProvider } from "@/components/theme-provider";
import { CandidateSidebar } from "@/components/organisms/dashboard/CandidateSidebar";
import { DashboardHeader } from "@/components/organisms/dashboard/DashboardHeader";
import { SearchDialog } from "@/components/organisms/dashboard/SearchDialog";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function CandidateLayout({ children }: { children: ReactNode }) {
  const { currentUser } = useDashboard();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) router.replace("/auth");
  }, [currentUser, router]);

  if (!currentUser) return null;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <CandidateSidebar />
      <SidebarInset data-dashboard className="h-svh bg-background text-foreground">
        <DashboardHeader />
        <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
        <SearchDialog />
        <Toaster position="top-right" />
      </SidebarInset>
    </SidebarProvider>
  );
}
