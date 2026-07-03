"use client";

import { useApp } from "../../context/AppContext";
import { useJobFilters } from "../../lib/jobs/useJobFilters";
import { SiteHeader } from "../../components/organisms/shared/SiteHeader";
import { JobSearchHeader } from "../../components/organisms/jobs/JobSearchHeader";
import { JobList } from "../../components/organisms/jobs/JobList";
import { JobDetailPanel } from "../../components/organisms/jobs/JobDetailPanel";
import { JobsEmptyState } from "../../components/molecules/jobs/JobsEmptyState";

export default function JobsPage() {
  const { jobs } = useApp();
  const filters = useJobFilters(jobs);

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      <SiteHeader
        contactLabel="Kontak"
        logoHref="/"
        jobsLabel="Cari lowongan"
        jobsActive
        otherLabels={["Cari profil", "Sumber daya karir", "Perusahaan", "Komunitas"]}
        registerLabel="Daftar"
      />

      <JobSearchHeader filters={filters} resultCount={filters.filteredJobs.length} />

      <div className="flex-1 max-w-[1584px] mx-auto w-full px-6 lg:px-10 py-8">
        {filters.filteredJobs.length === 0 ? (
          <JobsEmptyState onClearFilters={filters.clearFilters} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <JobList
              jobs={filters.filteredJobs}
              selectedJob={filters.selectedJob}
              activeJobId={filters.activeJob?.id}
              onSelect={filters.setSelectedJob}
            />
            {filters.activeJob && <JobDetailPanel job={filters.activeJob} />}
          </div>
        )}
      </div>
    </div>
  );
}
