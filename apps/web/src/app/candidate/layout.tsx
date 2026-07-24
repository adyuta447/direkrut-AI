"use client";

import { ReactNode, useEffect } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";
import { CandidateSidebar } from "@/components/organisms/dashboard/CandidateSidebar";
import { DashboardHeader } from "@/components/organisms/dashboard/DashboardHeader";
import { SearchDialog } from "@/components/organisms/dashboard/SearchDialog";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useHasMounted } from "@/hooks/use-has-mounted";

export default function CandidateLayout({ children }: { children: ReactNode }) {
  const { currentUser } = useDashboard();
  const router = useRouter();
  const mounted = useHasMounted();

  useEffect(() => {
    if (!mounted) return;
    if (!currentUser) router.replace("/auth");
    // Sama kayak hrd/layout.tsx -- guard lama cuma cek ada sesi, bukan
    // role-nya cocok. HRD yang nyasar ke /candidate diarahin ke dashboard-nya
    // sendiri.
    else if (currentUser.role !== "candidate") router.replace("/hrd");
  }, [mounted, currentUser, router]);

  if (!mounted || !currentUser || currentUser.role !== "candidate") return null;

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
