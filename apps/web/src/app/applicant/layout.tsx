"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { ApplicantSidebar } from "../../components/organisms/applicant/ApplicantSidebar";
import { ApplicantTopbar } from "../../components/organisms/applicant/ApplicantTopbar";
import { applicantNavItems } from "../../lib/applicant/navigation";

export default function ApplicantLayout({ children }: { children: ReactNode }) {
  const { currentUser } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) router.replace("/auth");
  }, [currentUser, router]);

  if (!currentUser) return null;

  const activeItem =
    applicantNavItems.find((item) => pathname.startsWith(item.href)) ?? applicantNavItems[0];

  return (
    <div className="h-screen bg-canvas font-sans flex relative overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#393939]/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <ApplicantSidebar sidebarOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-canvas">
        <ApplicantTopbar
          title={activeItem.title}
          subtitle={activeItem.subtitle}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto bg-canvas">{children}</main>
      </div>
    </div>
  );
}
