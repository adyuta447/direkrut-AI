"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Application, Job, Department } from "@/lib/types";
import { mockApplications, mockJobs } from "@/lib/mockData";

/** Departemen awal diseed dari nilai `department` unik yang udah dipakai mockJobs,
    biar konsisten dengan data lowongan yang ada sebelum CRUD-nya dipakai. */
function seedDepartments(): Department[] {
  const names = Array.from(new Set(mockJobs.map((j) => j.department)));
  return names.map((name) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    name,
  }));
}

interface DashboardContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  applications: Application[];
  myApplications: Application[];
  addApplication: (app: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  jobs: Job[];
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  departments: Department[];
  addDepartment: (department: Department) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isProfileComplete: boolean;
  setIsProfileComplete: (val: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

/**
 * Provider data mock buat halaman hrd/candidate yang di-porting dari branch
 * teman. Sengaja terpisah dari context/AppContext.tsx (auth) -- dua sumber
 * mock data yang belum disatukan, bisa disatukan belakangan kalau backend
 * API (apps/api-go) udah nyambung beneran.
 *
 * Dark mode TIDAK dikelola di sini -- itu tanggung jawab ThemeProvider
 * (next-themes), dipasang di layout hrd/candidate.
 */
export function DashboardProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [departments, setDepartments] = useState<Department[]>(() => seedDepartments());
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

  const addDepartment = (department: Department) => {
    setDepartments((prev) => [...prev, department]);
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments((prev) =>
      prev.map((dept) => (dept.id === id ? { ...dept, ...updates } : dept))
    );
  };

  const deleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((dept) => dept.id !== id));
  };

  const mockIds = new Set(mockApplications.map((a) => a.id));
  const myApplications = applications.filter(
    (a, index) => index < 5 || !mockIds.has(a.id)
  );

  return (
    <DashboardContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        applications,
        myApplications,
        addApplication,
        updateApplication,
        jobs,
        addJob,
        updateJob,
        departments,
        addDepartment,
        updateDepartment,
        deleteDepartment,
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
