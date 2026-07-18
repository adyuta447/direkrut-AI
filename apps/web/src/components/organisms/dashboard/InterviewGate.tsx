"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";

/**
 * Gerbang alur wawancara AI (fullscreen, tanpa sidebar): auth-gate doang --
 * DashboardProvider udah dipasang sekali di app/providers.tsx (root),
 * jadi useDashboard() di sini otomatis kebagian state yang sama dengan
 * seluruh app.
 */
export function InterviewGate({ children }: { children: ReactNode }) {
  const { currentUser } = useDashboard();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) router.replace("/auth");
  }, [currentUser, router]);

  if (!currentUser) return null;

  return <>{children}</>;
}
