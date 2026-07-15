"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { DashboardProvider } from "@/context/DashboardContext";

/**
 * Gerbang alur wawancara AI (fullscreen, tanpa sidebar): auth-gate +
 * DashboardProvider. Sebelumnya halaman interview memanggil useDashboard()
 * tanpa provider -> crash saat runtime, dan bisa diakses tanpa login.
 */
export function InterviewGate({ children }: { children: ReactNode }) {
  const { currentUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) router.replace("/auth");
  }, [currentUser, router]);

  if (!currentUser) return null;

  return <DashboardProvider>{children}</DashboardProvider>;
}
