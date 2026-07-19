"use client"

import { Search, MapPin, Clock, Briefcase, X } from "lucide-react"
import { useDashboard } from "@/context/DashboardContext"
import { useJobFilters } from "@/lib/jobs/useJobFilters"
import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { TextFilterField } from "@/components/atoms/jobs/TextFilterField"
import { SelectFilterField } from "@/components/atoms/jobs/SelectFilterField"
import { JobList } from "@/components/organisms/jobs/JobList"
import { JobDetailPanel } from "@/components/organisms/jobs/JobDetailPanel"
import { JobDetailSheet } from "@/components/organisms/jobs/JobDetailSheet"
import { JobsEmptyState } from "@/components/molecules/jobs/JobsEmptyState"

export default function CandidateJobsPage() {
  const { jobs } = useDashboard()
  const filters = useJobFilters(jobs)

  const applyHref = (id: string) => `/candidate/apply/${id}`

  return (
    <div className="p-4 md:p-8 pt-6 w-full space-y-6">
      <PageHeader
        eyebrow="Waktunya Gerak"
        title="Cari Lowongan"
        description="Ribuan posisi terbuka. Ketemu yang pas, langsung gas lamar."
      />

      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-1 rounded-2xl lg:rounded-full border border-hairline bg-canvas p-2 max-w-4xl focus-within:border-primary">
          <TextFilterField
            icon={Search}
            label="Posisi"
            placeholder="Cari posisi atau perusahaan"
            value={filters.searchTerm}
            onChange={filters.setSearchTerm}
            className="flex-1"
          />
          <div className="hidden lg:block w-px h-8 bg-hairline shrink-0" />
          <div className="lg:hidden h-px bg-hairline mx-6" />
          <TextFilterField
            icon={MapPin}
            label="Lokasi"
            placeholder="Kota atau WFH"
            value={filters.locationFilter}
            onChange={filters.setLocationFilter}
            className="flex-1"
          />
        </div>

        <div className="grid grid-cols-2 items-center gap-2 max-sm:[&_select]:w-full sm:flex sm:flex-wrap">
          <SelectFilterField
            icon={Clock}
            value={filters.typeFilter}
            onChange={filters.setTypeFilter}
            placeholderOption="Jenis Pekerjaan"
            options={filters.uniqueTypes}
          />
          <SelectFilterField
            icon={Briefcase}
            value={filters.industryFilter}
            onChange={filters.setIndustryFilter}
            placeholderOption="Semua Bidang"
            options={filters.uniqueIndustries}
          />
          {filters.hasFilters && (
            <button
              onClick={filters.clearFilters}
              className="col-span-2 flex h-11 items-center justify-center gap-1.5 rounded-full border border-hairline px-5 text-[13px] text-ink transition-none hover:border-primary hover:text-primary sm:col-auto"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
              Hapus filter
            </button>
          )}
          <p className="col-span-2 text-[14px] text-ink-muted sm:col-auto sm:ml-auto">
            <span className="font-medium text-ink">{filters.filteredJobs.length}</span> lowongan
            ditemukan
          </p>
        </div>
      </div>

      {filters.filteredJobs.length === 0 ? (
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
              applyHref={applyHref(filters.activeJob.id)}
              className="top-6 h-[calc(100svh-6rem)]"
            />
          )}
        </div>
      )}

      <JobDetailSheet
        job={filters.selectedJob ? filters.filteredJobs.find((j) => j.id === filters.selectedJob) ?? null : null}
        onClose={() => filters.setSelectedJob(null)}
        applyHref={(job) => applyHref(job.id)}
      />
    </div>
  )
}
