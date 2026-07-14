"use client";

import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { useCandidateTable } from "../../lib/hrd/useCandidateTable";
import { CandidateStatCards } from "../../components/molecules/hrd/CandidateStatCards";
import { CandidateFilterBar } from "../../components/molecules/hrd/CandidateFilterBar";
import { CandidateTableSection } from "../../components/organisms/hrd/CandidateTableSection";
import { PotentialCandidatesPanel } from "../../components/organisms/hrd/PotentialCandidatesPanel";
import { CandidateTrendChart } from "../../components/organisms/hrd/CandidateTrendChart";
import { CandidateScoreChart } from "../../components/organisms/hrd/CandidateScoreChart";
import { CandidateStatusChart } from "../../components/organisms/hrd/CandidateStatusChart";

export default function HrdDashboardPage() {
  const router = useRouter();
  const { applications } = useApp();
  const t = useCandidateTable();
  const onViewCandidate = (id: string) => router.push(`/hrd/candidates/${id}`);

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-canvas min-h-full">
      <div>
        <h2 className="text-[32px] font-bold text-ink tracking-[-0.5px]">Manajemen Pelamar</h2>
        <p className="text-[14px] text-ink-muted mt-2">
          {applications.length} total · {t.filteredApplications.length} ditampilkan
        </p>
      </div>

      <CandidateStatCards statCards={t.statCards} />

      <CandidateFilterBar
        jobs={t.jobs}
        searchTerm={t.searchTerm}
        onSearchTermChange={t.setSearchTerm}
        jobFilter={t.jobFilter}
        onJobFilterChange={t.setJobFilter}
        statusFilter={t.statusFilter}
        onStatusFilterChange={t.setStatusFilter}
        scoreFilter={t.scoreFilter}
        onScoreFilterChange={t.setScoreFilter}
      />

      <CandidateTableSection
        applications={t.paginatedApplications}
        filteredCount={t.filteredApplications.length}
        page={t.page}
        totalPages={t.totalPages}
        itemsPerPage={t.itemsPerPage}
        onPageChange={t.setPage}
        onViewCandidate={onViewCandidate}
      />

      <PotentialCandidatesPanel candidates={t.potentialCandidates} onViewCandidate={onViewCandidate} />

      <div className="grid xl:grid-cols-3 gap-6">
        <CandidateTrendChart data={t.trendData} />
        <CandidateScoreChart data={t.scoreDistributionData} />
        <CandidateStatusChart distribution={t.statusDistribution} total={applications.length} />
      </div>
    </div>
  );
}
