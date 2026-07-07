import { useEffect, useState } from "react";
import { Job } from "../../types";

interface UseJobFiltersInitial {
  search?: string;
  location?: string;
}

const PAGE_SIZE = 8;

export function useJobFilters(jobs: Job[], initial?: UseJobFiltersInitial) {
  const [searchTerm, setSearchTerm] = useState(initial?.search ?? "");
  const [locationFilter, setLocationFilter] = useState(initial?.location ?? "");
  const [typeFilter, setTypeFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, locationFilter, typeFilter, salaryFilter, industryFilter]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      !locationFilter ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !typeFilter || job.type === typeFilter;
    const matchesIndustry = !industryFilter || job.industry === industryFilter;
    const matchesSalary = !salaryFilter || job.salaryRange === salaryFilter;

    return matchesSearch && matchesLocation && matchesType && matchesIndustry && matchesSalary;
  });

  const pageCount = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), pageCount));
    setSelectedJob(null);
  };

  const activeJob =
    jobs.find((j) => j.id === selectedJob) ?? paginatedJobs[0] ?? null;

  const uniqueTypes = [...new Set(jobs.map((j) => j.type))];
  const uniqueIndustries = [...new Set(jobs.map((j) => j.industry))];
  const uniqueSalaries = [...new Set(jobs.map((j) => j.salaryRange))].filter(Boolean);

  const clearFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setTypeFilter("");
    setSalaryFilter("");
    setIndustryFilter("");
  };

  const hasFilters = Boolean(
    searchTerm || locationFilter || typeFilter || salaryFilter || industryFilter
  );

  return {
    searchTerm, setSearchTerm,
    locationFilter, setLocationFilter,
    typeFilter, setTypeFilter,
    salaryFilter, setSalaryFilter,
    industryFilter, setIndustryFilter,
    selectedJob, setSelectedJob,
    filteredJobs, activeJob,
    paginatedJobs, page: currentPage, pageCount, goToPage,
    uniqueTypes, uniqueIndustries, uniqueSalaries,
    clearFilters, hasFilters,
  };
}
