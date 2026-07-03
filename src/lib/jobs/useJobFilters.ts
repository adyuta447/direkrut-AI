import { useState } from "react";
import { Job } from "../../types";

export function useJobFilters(jobs: Job[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

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

  const activeJob = jobs.find((j) => j.id === selectedJob) ?? filteredJobs[0] ?? null;

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
    uniqueTypes, uniqueIndustries, uniqueSalaries,
    clearFilters, hasFilters,
  };
}
