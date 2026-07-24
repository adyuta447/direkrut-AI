"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, UserRole, Application, Job, Department } from "@/lib/types";
import * as jobService from "@/services/jobService";
import * as applicationService from "@/services/applicationService";
import * as authService from "@/services/authService";

interface DashboardContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<User>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    companyName?: string,
  ) => Promise<User>;
  logout: () => void;
  applications: Application[];
  myApplications: Application[];
  refetchApplications: () => Promise<void>;
  addApplication: (app: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  applyToJob: (jobId: string) => Promise<Application>;
  changeApplicationStatus: (
    id: string,
    status: Application["status"],
    note?: string,
    email?: { subject: string; body: string },
    interviewScheduledAt?: string,
  ) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  jobs: Job[];
  /** Lowongan MILIK company HRD yang login, semua status -- sumber buat
   * halaman Manajemen Lowongan (bukan `jobs`, itu publik lintas-company). */
  myJobs: Job[];
  addJob: (job: Job) => Promise<void>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
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

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

/**
 * Provider tunggal buat seluruh app -- landing page, dashboard hrd, dan
 * dashboard candidate semua baca dari sini (dipasang sekali di
 * app/providers.tsx). Auth (currentUser) dan CRUD jobs/applications lewat
 * service layer (@/services/*).
 *
 * Dark mode TIDAK dikelola di sini -- itu tanggung jawab ThemeProvider
 * (next-themes), dipasang di layout hrd/candidate.
 */
export function DashboardProvider({ children }: { children: ReactNode }) {
  // Restore sesi dari token+user yang di-cache di localStorage (lihat
  // authService.restoreSession) -- tanpa ini, refresh halaman bikin user
  // "ke-logout" secara visual walau token-nya masih valid.
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.restoreSession());
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [currentPage, setCurrentPage] = useState("landing");
  const [searchOpen, setSearchOpen] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  const refetchApplications = async () => {
    if (!currentUser?.id) return;
    const fetched = await applicationService.listApplications();
    setApplications(fetched);
  };

  useEffect(() => {
    if (!currentUser?.id) return;
    let cancelled = false;
    applicationService.listApplications().then((fetched) => {
      if (!cancelled) setApplications(fetched);
    });
    return () => {
      cancelled = true;
    };
  }, [currentUser?.id, currentUser?.role]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== null && !e.key.startsWith("direkrut_")) return;
      const synced = authService.restoreSession();
      setCurrentUser((prev) => {
        if (prev?.id === synced?.id && prev?.role === synced?.role) return prev;
        return synced;
      });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    let cancelled = false;
    jobService.listJobs().then((fetchedJobs) => {
      if (cancelled) return;
      setJobs(fetchedJobs);
      setDepartments((prev) => {
        const existingNames = new Set(prev.map((d) => d.name));
        const newNames = Array.from(
          new Set(fetchedJobs.map((j) => j.department)),
        ).filter((name) => !existingNames.has(name));
        if (newNames.length === 0) return prev;
        const added = newNames.map((name) => ({
          id: name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
          name,
        }));
        return [...prev, ...added];
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (currentUser?.role !== "hrd") return;
    let cancelled = false;
    jobService.listMyJobs().then((fetched) => {
      if (!cancelled) setMyJobs(fetched);
    });
    return () => {
      cancelled = true;
    };
  }, [currentUser?.id, currentUser?.role]);

  const login = async (email: string, password: string) => {
    const { user } = await authService.login(email, password);
    setCurrentUser(user);
    return user;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    companyName?: string,
  ) => {
    const { user } = await authService.register(name, email, password, role, companyName);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const addApplication = (app: Application) => {
    setApplications((prev) => [...prev, app]);
  };

  const updateApplication = (id: string, updates: Partial<Application>) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updates } : app)),
    );
  };

  // Submit lamaran beneran lewat applicationService -- itu yang melempar
  // ApiError kalau server nolak (lowongan udah ditutup/dihapus, dst), jadi
  // errornya nyampe ke pemanggil (lihat useApplyFlow.handleSubmit), bukan
  // ke-telan diam2. `result` cuma null kalau API emang gak diset sama
  // sekali (bukan gagal) -- di situ doang kita rakit objek lokal dari data
  // yang udah ada di context (currentUser, jobs), biar tetap jalan tanpa API.
  const applyToJob = async (jobId: string): Promise<Application> => {
    const result = await applicationService.submitApplication(jobId);
    const job = jobs.find((j) => j.id === jobId);
    const application: Application = result ?? {
      id: `app-${Date.now()}`,
      applicantId: currentUser?.id ?? "unknown",
      applicantName: currentUser?.name ?? "Kandidat",
      jobId,
      jobTitle: job?.title ?? "",
      validationStatus: "pending",
      status: "submitted",
      appliedDate: new Date().toISOString(),
    };
    addApplication(application);
    return application;
  };

  const changeApplicationStatus = async (
    id: string,
    status: Application["status"],
    note?: string,
    email?: { subject: string; body: string },
    interviewScheduledAt?: string,
  ) => {
    const existing = applications.find((a) => a.id === id);
    const optimistic: Partial<Application> = { status, ...(interviewScheduledAt ? { interviewScheduledAt } : {}) };
    updateApplication(id, optimistic);
    try {
      const result = await applicationService.updateApplicationStatus(id, status, note, email, interviewScheduledAt);
      updateApplication(id, result ?? optimistic);
    } catch (err) {
      if (existing) updateApplication(id, existing);
      throw err;
    }
  };

  const deleteApplication = async (id: string) => {
    await applicationService.deleteApplication(id);
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  // `jobs` (listing publik lintas-company buat kandidat) di-fetch SEKALI aja
  // pas mount (lihat effect di atas) -- gak otomatis ke-refresh pas HRD
  // ubah salah satu lowongannya sendiri. Tanpa ini, lowongan yang baru
  // di-nonaktifin/aktifin-in ulang gak pernah ke-sync ke /jobs & /candidate/jobs
  // dalam sesi browser yang sama, cuma nongol bener abis full reload.
  const syncPublicJob = (job: Job) => {
    setJobs((prev) => {
      const isPublished = job.status === "active";
      const exists = prev.some((j) => j.id === job.id);
      if (isPublished) {
        return exists ? prev.map((j) => (j.id === job.id ? job : j)) : [job, ...prev];
      }
      return exists ? prev.filter((j) => j.id !== job.id) : prev;
    });
  };

  const addJob = async (job: Job) => {
    const saved = await jobService.createJob(job);
    setMyJobs((prev) => [saved, ...prev]);
    syncPublicJob(saved);
  };

  const updateJob = async (id: string, updates: Partial<Job>) => {
    const existing = myJobs.find((j) => j.id === id);
    if (!existing) return;
    const optimistic = { ...existing, ...updates };
    setMyJobs((prev) => prev.map((j) => (j.id === id ? optimistic : j)));
    syncPublicJob(optimistic);
    try {
      const saved = await jobService.updateJob(id, { ...existing, ...updates });
      setMyJobs((prev) => prev.map((j) => (j.id === id ? saved : j)));
      syncPublicJob(saved);
    } catch (err) {
      setMyJobs((prev) => prev.map((j) => (j.id === id ? existing : j)));
      syncPublicJob(existing);
      throw err;
    }
  };

  const deleteJob = async (id: string) => {
    await jobService.deleteJob(id);
    setMyJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const addDepartment = (department: Department) => {
    setDepartments((prev) => [...prev, department]);
  };

  const updateDepartment = (id: string, updates: Partial<Department>) => {
    setDepartments((prev) =>
      prev.map((dept) => (dept.id === id ? { ...dept, ...updates } : dept)),
    );
  };

  const deleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((dept) => dept.id !== id));
  };

  return (
    <DashboardContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        register,
        logout,
        applications,
        myApplications: applications,
        refetchApplications,
        addApplication,
        updateApplication,
        applyToJob,
        changeApplicationStatus,
        deleteApplication,
        jobs,
        myJobs,
        addJob,
        updateJob,
        deleteJob,
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
