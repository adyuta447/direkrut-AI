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
  ) => Promise<void>;
  jobs: Job[];
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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [currentPage, setCurrentPage] = useState("landing");
  const [searchOpen, setSearchOpen] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Tarik lamaran asli begitu ada yang login -- endpoint /v1/applications
  // scoped otomatis dari JWT claims: kandidat liat punya dia sendiri, HRD
  // (tanpa ?jobId=) liat semua lamaran ke lowongan-lowongan company-nya.
  // Ini yang bikin dashboard HRD (stat cards, chart, cross-role, detail
  // kandidat) kebagian data asli dari kandidat, bukan mock selamanya.
  //
  // ponytail: cuma di-fetch sekali pas login/mount, gak ada polling atau
  // websocket -- kalau HRD udah buka dashboard-nya SEBELUM kandidat
  // melamar, lamaran baru gak nongol sampai refetchApplications() dipanggil
  // manual (lihat hrd/page.tsx, hrd/cross-role/page.tsx) atau reload
  // penuh. Upgrade: polling interval pendek atau SSE/websocket kalau
  // real-time beneran dibutuhin.
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

  // Re-sync sesi lintas-tab. localStorage dibagi antar tab dengan origin yang
  // sama, jadi kalau user login sebagai KANDIDAT di tab lain, token di tab
  // HRD ini ikut ketimpa -- tapi React state di sini masih nyimpen user HRD.
  // Akibatnya request (mis. "Jalankan Screening AI") kekirim pakai token
  // kandidat -> 403 "insufficient role for this action". Dengerin storage
  // event biar tab ini nyusul state terbaru (atau ke-logout) dan gak ngirim
  // aksi HRD dengan token kandidat.
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

  // Submit lamaran beneran lewat applicationService; kalau backend gagal/gak
  // diset, service-nya balikin null dan kita rakit sendiri objek lokal dari
  // data yang udah ada di context (currentUser, jobs) -- tetap jalan tanpa API.
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
  ) => {
    const result = await applicationService.updateApplicationStatus(id, status, note, email);
    updateApplication(id, result ?? { status });
  };

  const addJob = async (job: Job) => {
    const saved = await jobService.createJob(job);
    setJobs((prev) => [...prev, saved]);
  };

  const updateJob = async (id: string, updates: Partial<Job>) => {
    const existing = jobs.find((j) => j.id === id);
    if (!existing) return;
    const saved = await jobService.updateJob(id, { ...existing, ...updates });
    setJobs((prev) => prev.map((j) => (j.id === id ? saved : j)));
  };

  const deleteJob = async (id: string) => {
    await jobService.deleteJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
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
        jobs,
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
