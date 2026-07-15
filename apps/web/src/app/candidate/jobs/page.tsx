"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDashboard } from "@/context/DashboardContext"
import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { SearchInput } from "@/components/molecules/dashboard/SearchInput"
import { JobListItem } from "@/components/molecules/jobs/JobListItem"
import { JobsEmptyState } from "@/components/molecules/jobs/JobsEmptyState"
import { Pagination } from "@/components/molecules/shared/Pagination"

const PER_PAGE = 9

export default function CandidateJobsPage() {
  const { jobs } = useDashboard()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PER_PAGE))
  const pageJobs = filteredJobs.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-6 w-full space-y-6">
      <PageHeader
        title="Cari Lowongan"
        description="Temukan pekerjaan impian Anda dan lamar sekarang."
        action={
          <div className="w-full md:w-72">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder="Cari posisi atau perusahaan..."
            />
          </div>
        }
      />

      {filteredJobs.length === 0 ? (
        <JobsEmptyState onClearFilters={() => handleSearch("")} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pageJobs.map((job) => (
              <JobListItem
                key={job.id}
                job={job}
                isActive={false}
                onSelect={() => router.push(`/candidate/apply/${job.id}`)}
              />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            itemsPerPage={PER_PAGE}
            totalItems={filteredJobs.length}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}
