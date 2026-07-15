"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Application, Job } from "@/lib/types";
import { mockApplications, mockJobs } from "@/lib/mockData";

interface DashboardContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  applications: Application[];
  addApplication: (app: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  jobs: Job[];
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isProfileComplete: boolean;
  setIsProfileComplete: (val: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

/**
 * Provider data mock buat halaman dashboard baru (kanban, inbox, settings,
 * command palette) yang di-porting dari branch teman. Sengaja terpisah dari
 * context/AppContext.tsx (auth & data existing hrd/applicant) -- dua sumber
 * mock data yang belum disatukan, lihat plan integrasi dashboard.
 *
 * Dark mode TIDAK dikelola di sini -- itu tanggung jawab ThemeProvider
 * (next-themes), dipasang di layout hrd/applicant.
 */
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState("landing");
  const [searchOpen, setSearchOpen] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    setApplications(mockApplications);
    setJobs(mockJobs);
  }, []);

  const addApplication = (app: Application) => {
    setApplications((prev) => [...prev, app]);
  };

  const updateApplication = (id: string, updates: Partial<Application>) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updates } : app))
    );
  };

  const addJob = (job: Job) => {
    setJobs((prev) => [...prev, job]);
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, ...updates } : job))
    );
  };

  return (
    <DashboardContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        applications,
        addApplication,
        updateApplication,
        jobs,
        addJob,
        updateJob,
        currentPage,
        setCurrentPage,
        searchOpen,
        setSearchOpen,
        isProfileComplete,
        setIsProfileComplete,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}
