import { createContext, useContext, useState, ReactNode } from "react";
import { User, Application, Job } from "../types";
import { mockApplications, mockJobs } from "../mockData";

interface AppContextType {
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [applications, setApplications] =
    useState<Application[]>(mockApplications);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [currentPage, setCurrentPage] = useState("landing");

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
    <AppContext.Provider
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
