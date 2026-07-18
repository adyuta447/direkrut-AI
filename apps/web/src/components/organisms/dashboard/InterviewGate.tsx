"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";

export function InterviewGate({ children }: { children: ReactNode }) {
  const { currentUser } = useDashboard();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) router.replace("/auth");
  }, [currentUser, router]);

  if (!currentUser) return null;

  return <>{children}</>;
}
