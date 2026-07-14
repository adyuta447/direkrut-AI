"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Application, Job } from "../types";
import { mockApplications, mockJobs } from "../mock";

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  applications: Application[];
  addApplication: (app: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  jobs: Job[];
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [applications, setApplications] =
    useState<Application[]>(mockApplications);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // localStorage/matchMedia nggak ada di SSR, jadi nggak bisa dihitung
    // saat render (bakal beda dari hasil render server -> hydration
    // mismatch). Wajib dibaca setelah mount.
    const stored = localStorage.getItem("DirekrutAI-dark");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDarkMode(
      stored ? stored === "true" : window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("DirekrutAI-dark", String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

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
        darkMode,
        toggleDarkMode,
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
