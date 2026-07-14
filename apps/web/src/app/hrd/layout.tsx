"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { HrdSearchProvider } from "../../lib/hrd/HrdSearchContext";
import { HrdSidebar } from "../../components/organisms/hrd/HrdSidebar";
import { HrdTopbar } from "../../components/organisms/hrd/HrdTopbar";
import { hrdPageMeta } from "../../lib/hrd/navigation";

export default function HrdLayout({ children }: { children: ReactNode }) {
  const { currentUser } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) router.replace("/auth");
  }, [currentUser, router]);

  if (!currentUser) return null;

  const meta = hrdPageMeta.find((m) => pathname.startsWith(m.hrefPrefix)) ?? hrdPageMeta[hrdPageMeta.length - 1];

  return (
    <HrdSearchProvider>
      <div className="h-screen bg-canvas font-sans flex relative overflow-hidden">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-[#393939]/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <HrdSidebar sidebarOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-canvas">
          <HrdTopbar
            title={meta.title}
            subtitle={meta.subtitle}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
          <main className="flex-1 overflow-y-auto p-0">{children}</main>
        </div>
      </div>
    </HrdSearchProvider>
  );
}
