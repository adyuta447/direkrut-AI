"use client";

import { ReactNode } from "react";
import { DashboardProvider } from "../context/DashboardContext";

export function Providers({ children }: { children: ReactNode }) {
  return <DashboardProvider>{children}</DashboardProvider>;
}
