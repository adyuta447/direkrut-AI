"use client";

import { ReactNode, useEffect } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";
import { AIAssistantWidgetProvider } from "@/context/AIAssistantWidgetContext";
import { ThemeProvider } from "@/components/theme-provider";
import { HrdSidebar } from "@/components/organisms/dashboard/HrdSidebar";
import { DashboardHeader } from "@/components/organisms/dashboard/DashboardHeader";
import { SearchDialog } from "@/components/organisms/dashboard/SearchDialog";
import { FloatingAIAssistant } from "@/components/organisms/dashboard/FloatingAIAssistant";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useHasMounted } from "@/hooks/use-has-mounted";

export default function HrdLayout({ children }: { children: ReactNode }) {
  const { currentUser } = useDashboard();
  const router = useRouter();
  // currentUser dipulihin dari localStorage (lihat DashboardContext) --
  // server SELALU render null (gak ada localStorage di SSR), tapi hydration
  // pass pertama di client udah punya currentUser keisi. Tanpa `mounted`,
  // dua pass itu render tree yang beda -> React tandain hydration mismatch
  // ("Hydration failed...") di SETIAP load, biarpun user tetep kepake abis
  // React regenerate treenya sendiri. Guard ini masangin render pertama di
  // client biar SAMA kaya server (sama-sama null), baru nampilin isi
  // beneran di render berikutnya.
  const mounted = useHasMounted();

  useEffect(() => {
    if (mounted && !currentUser) router.replace("/auth");
  }, [mounted, currentUser, router]);

  if (!mounted || !currentUser) return null;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AIAssistantWidgetProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as CSSProperties
          }
        >
          <HrdSidebar variant="inset" />
          <SidebarInset data-dashboard className="h-svh bg-background text-foreground overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 min-h-0 overflow-y-auto p-0">{children}</main>
          </SidebarInset>
          <SearchDialog />
          <Toaster position="top-right" />
          <FloatingAIAssistant />
        </SidebarProvider>
      </AIAssistantWidgetProvider>
    </ThemeProvider>
  );
}
