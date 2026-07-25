"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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
  isApplicationsLoading: boolean;
  refetchApplications: () => Promise<void>;
  upsertApplications: (apps: Application[]) => void;
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
  isJobsLoading: boolean;
  refetchJobs: () => Promise<void>;
  /** Lowongan MILIK company HRD yang login, semua status -- sumber buat
   * halaman Manajemen Lowongan (bukan `jobs`, itu publik lintas-company). */
  myJobs: Job[];
  addJob: (job: Job) => Promise<void>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  departments: Department[];
  addDepartment: (department: Department) => void;
  updateDepartment: (id: string, updates: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: string) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isProfileComplete: boolean;
  setIsProfileComplete: (val: boolean) => void;
  savedJobs: string[];
  toggleSavedJob: (jobId: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

function mergeJobDepartments(current: Department[], sourceJobs: Job[]): Department[] {
  const existingNames = new Set(current.map((department) => department.name));
  const newNames = Array.from(
    new Set(sourceJobs.map((job) => job.department.trim()).filter(Boolean)),
  ).filter((name) => !existingNames.has(name));
  if (newNames.length === 0) return current;

  return [
    ...current,
    ...newNames.map((name) => ({
      id: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      name,
    })),
  ];
}

function mergeApplications(current: Application[], incoming: Application[]): Application[] {
  if (incoming.length === 0) return current;
  const incomingByID = new Map(incoming.map((application) => [application.id, application]));
  const merged = current.map((application) => incomingByID.get(application.id) ?? application);
  const existingIDs = new Set(current.map((application) => application.id));
  return [...incoming.filter((application) => !existingIDs.has(application.id)), ...merged];
}

type JobSyncMessage =
  | { type: "upsert"; job: Job }
  | { type: "delete"; jobID: string }
  | { type: "rename-department"; fromDepartment: string; toDepartment: string };

const JOB_SYNC_CHANNEL = "direkrut-public-jobs";
const JOB_REVALIDATE_INTERVAL_MS = 15_000;

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
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(() => Boolean(currentUser?.id));
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isJobsLoading, setIsJobsLoading] = useState(true);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [currentPage, setCurrentPage] = useState("landing");
  const [searchOpen, setSearchOpen] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const jobSyncChannelRef = useRef<BroadcastChannel | null>(null);

  // Load saved jobs from localStorage on mount
  useEffect(() => {
    const restoreSavedJobs = () => {
      const saved = localStorage.getItem("direkrut-saved-jobs");
      if (saved) {
        try {
          setSavedJobs(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse saved jobs", e);
        }
      }
    };
    const timeoutID = window.setTimeout(restoreSavedJobs, 0);
    return () => window.clearTimeout(timeoutID);
  }, []);

  const toggleSavedJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const next = prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      if (typeof window !== "undefined") {
        localStorage.setItem("direkrut-saved-jobs", JSON.stringify(next));
      }
      return next;
    });
  };

  const refetchApplications = async () => {
    if (!currentUser?.id) return;
    setIsApplicationsLoading(true);
    try {
      const fetched = await applicationService.listApplications();
      setApplications(fetched);
    } finally {
      setIsApplicationsLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser?.id) return;
    let cancelled = false;
    applicationService.listApplications().then((fetched) => {
      if (!cancelled) setApplications(fetched);
    }).finally(() => {
      if (!cancelled) setIsApplicationsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [currentUser?.id, currentUser?.role]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== null && !e.key.startsWith("direkrut_")) return;
      const synced = authService.restoreSession();
      if (currentUser?.id === synced?.id && currentUser?.role === synced?.role) return;
      setIsApplicationsLoading(Boolean(synced?.id));
      setCurrentUser(synced);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [currentUser?.id, currentUser?.role]);

  const loadPublicJobs = useCallback(async (finishInitialLoading: boolean) => {
    try {
      const fetchedJobs = await jobService.listJobs();
      setJobs(fetchedJobs);
      setDepartments((prev) => mergeJobDepartments(prev, fetchedJobs));
    } catch (err) {
      console.error("[DashboardContext] gagal sinkronisasi lowongan publik:", err);
    } finally {
      if (finishInitialLoading) setIsJobsLoading(false);
    }
  }, []);

  const refetchJobs = useCallback(async () => {
    const showLoading = jobs.length === 0;
    if (showLoading) setIsJobsLoading(true);
    await loadPublicJobs(showLoading);
  }, [jobs.length, loadPublicJobs]);

  useEffect(() => {
    let cancelled = false;
    jobService.listJobs().then((fetchedJobs) => {
      if (cancelled) return;
      setJobs(fetchedJobs);
      setDepartments((prev) => mergeJobDepartments(prev, fetchedJobs));
    }).catch((err) => {
      console.error("[DashboardContext] gagal memuat lowongan publik:", err);
    }).finally(() => {
      if (!cancelled) setIsJobsLoading(false);
    });

    const refreshInBackground = () => {
      if (document.visibilityState === "visible") void loadPublicJobs(false);
    };
    const intervalID = window.setInterval(refreshInBackground, JOB_REVALIDATE_INTERVAL_MS);
    window.addEventListener("focus", refreshInBackground);
    document.addEventListener("visibilitychange", refreshInBackground);

    return () => {
      cancelled = true;
      window.clearInterval(intervalID);
      window.removeEventListener("focus", refreshInBackground);
      document.removeEventListener("visibilitychange", refreshInBackground);
    };
  }, [loadPublicJobs]);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel(JOB_SYNC_CHANNEL);
    jobSyncChannelRef.current = channel;
    channel.onmessage = (event: MessageEvent<JobSyncMessage>) => {
      const message = event.data;
      if (message.type === "delete") {
        setJobs((prev) => prev.filter((job) => job.id !== message.jobID));
        return;
      }
      if (message.type === "rename-department") {
        const { fromDepartment, toDepartment } = message;
        const renameJobs = (current: Job[]) =>
          current.map((job) =>
            job.department === fromDepartment
              ? { ...job, department: toDepartment }
              : job,
          );
        setJobs(renameJobs);
        setMyJobs(renameJobs);
        setDepartments((prev) => {
          const source = prev.find((department) => department.name === fromDepartment);
          if (!source) return prev;
          if (prev.some((department) => department.name === toDepartment)) {
            return prev.filter((department) => department.id !== source.id);
          }
          return prev.map((department) =>
            department.id === source.id
              ? { ...department, name: toDepartment }
              : department,
          );
        });
        return;
      }
      const job = message.job;
      setJobs((prev) => {
        const exists = prev.some((item) => item.id === job.id);
        if (job.status !== "active") {
          return exists ? prev.filter((item) => item.id !== job.id) : prev;
        }
        return exists
          ? prev.map((item) => (item.id === job.id ? job : item))
          : [job, ...prev];
      });
    };
    return () => {
      jobSyncChannelRef.current = null;
      channel.close();
    };
  }, []);

  useEffect(() => {
    if (currentUser?.role !== "hrd") return;
    let cancelled = false;
    jobService.listMyJobs().then((fetched) => {
      if (cancelled) return;
      setMyJobs(fetched);
      setDepartments((prev) => mergeJobDepartments(prev, fetched));
    });
    return () => {
      cancelled = true;
    };
  }, [currentUser?.id, currentUser?.role]);

  const login = async (email: string, password: string) => {
    const { user } = await authService.login(email, password);
    setIsApplicationsLoading(true);
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
    setIsApplicationsLoading(true);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setApplications([]);
    setIsApplicationsLoading(false);
  };

  const addApplication = (app: Application) => {
    setApplications((prev) => [...prev, app]);
  };

  const upsertApplications = useCallback((apps: Application[]) => {
    setApplications((prev) => mergeApplications(prev, apps));
  }, []);

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
    const result = await applicationService.updateApplicationStatus(id, status, note, email, interviewScheduledAt);
    if (result) {
      upsertApplications([result]);
    } else {
      updateApplication(id, {
        status,
        ...(interviewScheduledAt ? { interviewScheduledAt } : {}),
      });
    }
  };

  const deleteApplication = async (id: string) => {
    await applicationService.deleteApplication(id);
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  // Sinkronkan hasil mutation HRD ke listing publik pada tab aktif saat ini.
  // Tab lain menerima event BroadcastChannel, sedangkan browser/perangkat
  // lain mendapat state terbaru lewat background revalidation di atas.
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
    setDepartments((prev) => mergeJobDepartments(prev, [saved]));
    syncPublicJob(saved);
    jobSyncChannelRef.current?.postMessage({ type: "upsert", job: saved } satisfies JobSyncMessage);
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
      jobSyncChannelRef.current?.postMessage({ type: "upsert", job: saved } satisfies JobSyncMessage);
    } catch (err) {
      setMyJobs((prev) => prev.map((j) => (j.id === id ? existing : j)));
      syncPublicJob(existing);
      throw err;
    }
  };

  const deleteJob = async (id: string) => {
    await jobService.deleteJob(id);
    setMyJobs((prev) => prev.filter((j) => j.id !== id));
    setJobs((prev) => prev.filter((j) => j.id !== id));
    jobSyncChannelRef.current?.postMessage({ type: "delete", jobID: id } satisfies JobSyncMessage);
  };

  const addDepartment = (department: Department) => {
    setDepartments((prev) => [...prev, department]);
  };

  const updateDepartment = async (id: string, updates: Partial<Department>) => {
    const existing = departments.find((department) => department.id === id);
    if (!existing) return;

    const nextName = updates.name?.trim() || existing.name;
    if (nextName !== existing.name) {
      await jobService.renameDepartment(existing.name, nextName);

      const renameJobs = (current: Job[]) =>
        current.map((job) =>
          job.department === existing.name
            ? { ...job, department: nextName }
            : job,
        );
      setMyJobs(renameJobs);
      setJobs(renameJobs);
      jobSyncChannelRef.current?.postMessage({
        type: "rename-department",
        fromDepartment: existing.name,
        toDepartment: nextName,
      } satisfies JobSyncMessage);
    }

    setDepartments((prev) => {
      const targetExists = prev.some(
        (department) =>
          department.id !== id && department.name === nextName,
      );
      if (targetExists) {
        return prev.filter((department) => department.id !== id);
      }
      return prev.map((department) =>
        department.id === id
          ? { ...department, ...updates, name: nextName }
          : department,
      );
    });
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
        isApplicationsLoading,
        refetchApplications,
        upsertApplications,
        addApplication,
        updateApplication,
        applyToJob,
        changeApplicationStatus,
        deleteApplication,
        jobs,
        isJobsLoading,
        refetchJobs,
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
        savedJobs,
        toggleSavedJob,
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
