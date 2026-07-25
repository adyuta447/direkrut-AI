"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useDashboard } from "../../context/DashboardContext";
import { useJobFilters } from "../../lib/jobs/useJobFilters";
import { SiteHeader } from "../../components/organisms/shared/SiteHeader";
import { SiteFooter } from "../../components/organisms/shared/SiteFooter";
import { JobSearchHeader } from "../../components/organisms/jobs/JobSearchHeader";
import { JobList } from "../../components/organisms/jobs/JobList";
import { JobDetailPanel } from "../../components/organisms/jobs/JobDetailPanel";
import { JobDetailSheet } from "../../components/organisms/jobs/JobDetailSheet";
import { JobsEmptyState } from "../../components/molecules/jobs/JobsEmptyState";
import { JobsListSkeleton } from "../../components/organisms/jobs/JobsListSkeleton";


export default function JobsPage() {
  return (
    <Suspense fallback={null}>
      <JobsPageContent />
    </Suspense>
  );
}

function JobsPageContent() {
  const { jobs, applications, isJobsLoading } = useDashboard();
  const searchParams = useSearchParams();
  const filters = useJobFilters(jobs, {
    search: searchParams.get("q") ?? undefined,
    location: searchParams.get("location") ?? undefined,
  });

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans overflow-x-clip">
      <div className="min-h-screen flex flex-col">
        <SiteHeader />

        <JobSearchHeader
          filters={filters}
          resultCount={filters.filteredJobs.length}
        />

        <div
          id="job-results"
          className="flex-1 max-w-[1584px] mx-auto w-full px-6 lg:px-10 py-8 scroll-mt-20"
        >
          {isJobsLoading ? (
            <JobsListSkeleton />
          ) : filters.filteredJobs.length === 0 ? (
            <JobsEmptyState onClearFilters={filters.clearFilters} />
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <JobList
                jobs={filters.paginatedJobs}
                selectedJob={filters.selectedJob}
                activeJobId={filters.activeJob?.id}
                onSelect={filters.setSelectedJob}
                page={filters.page}
                pageCount={filters.pageCount}
                onPageChange={filters.goToPage}
              />
              {filters.activeJob && (
                <JobDetailPanel 
                  job={filters.activeJob} 
                  applicationStatus={applications.find(a => a.jobId === filters.activeJob?.id)?.status}
                />
              )}
            </div>
          )}
        </div>

      </div>

      <JobDetailSheet
        job={filters.selectedJob ? filters.activeJob : null}
        onClose={() => filters.setSelectedJob(null)}
        applicationStatus={filters.activeJob ? applications.find(a => a.jobId === filters.activeJob.id)?.status : undefined}
      />

      <SiteFooter />
    </div>
  );
}
