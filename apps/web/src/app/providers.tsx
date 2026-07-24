"use client";

import { ReactNode } from "react";
import { DashboardProvider } from "../context/DashboardContext";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <DashboardProvider>{children}</DashboardProvider>
    </ThemeProvider>
  );
}
