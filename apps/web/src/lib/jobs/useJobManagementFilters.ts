import { useMemo, useState } from "react";
import type { Job, Department } from "../types";

export interface JobDepartmentGroup {
  id: string;
  name: string;
  jobsInGroup: Job[];
}

/** State & derived data buat halaman Manajemen Lowongan HRD: pencarian +
 * filter tab status, lalu pengelompokan hasilnya per departemen (termasuk
 * bucket "Lainnya" buat lowongan yang departemennya udah dihapus dari
 * daftar dikelola). Dipisah dari JSX biar halaman tinggal compose. */
export function useJobManagementFilters(jobs: Job[], departments: Department[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const term = searchTerm.trim().toLowerCase();

  const statusFiltered = jobs.filter((job) => (activeTab === "all" ? true : job.status === activeTab));
  const searchFiltered = statusFiltered.filter(
    (job) =>
      !term ||
      job.title.toLowerCase().includes(term) ||
      job.department.toLowerCase().includes(term)
  );

  const groupedByDept = useMemo<JobDepartmentGroup[]>(() => {
    const deptNames = new Set(departments.map((d) => d.name));
    const groups = departments.map((d) => ({
      id: d.id,
      name: d.name,
      jobsInGroup: searchFiltered.filter((j) => j.department === d.name),
    }));
    const orphanJobs = searchFiltered.filter((j) => !deptNames.has(j.department));
    if (orphanJobs.length > 0) {
      groups.push({ id: "__other", name: "Lainnya", jobsInGroup: orphanJobs });
    }
    return term ? groups.filter((g) => g.jobsInGroup.length > 0) : groups;
  }, [departments, searchFiltered, term]);

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openGroup = (id: string) => {
    setOpenGroups((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const tabCounts = (status: string) =>
    status === "all" ? jobs.length : jobs.filter((j) => j.status === status).length;

  const isGroupOpen = (id: string) => term.length > 0 || openGroups.has(id);

  return {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    groupedByDept,
    toggleGroup,
    openGroup,
    isGroupOpen,
    tabCounts,
  };
}
