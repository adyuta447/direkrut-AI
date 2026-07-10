import { Search, Briefcase, Filter, ChevronDown, BarChart3 } from "lucide-react";
import { Job } from "../../../types";

interface CandidateFilterBarProps {
  jobs: Job[];
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  jobFilter: string;
  onJobFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  scoreFilter: string;
  onScoreFilterChange: (value: string) => void;
}

export function CandidateFilterBar({
  jobs,
  searchTerm,
  onSearchTermChange,
  jobFilter,
  onJobFilterChange,
  statusFilter,
  onStatusFilterChange,
  scoreFilter,
  onScoreFilterChange,
}: CandidateFilterBarProps) {
  return (
    <div className="bg-canvas border border-hairline p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau posisi..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="input-field pl-11 bg-surface-1 border-b border-hairline w-full"
          />
        </div>

        <div className="relative">
          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <select
            value={jobFilter}
            onChange={(e) => onJobFilterChange(e.target.value)}
            className="appearance-none input-field pl-11 pr-10 bg-surface-1 border-b border-hairline sm:w-56 cursor-pointer"
          >
            <option value="">Semua Lowongan</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
        </div>

        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="appearance-none input-field pl-11 pr-10 bg-surface-1 border-b border-hairline sm:w-48 cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="submitted">Terkirim</option>
            <option value="under-review">Administrasi</option>
            <option value="interview">Wawancara</option>
            <option value="rejected">Ditolak</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
        </div>

        <div className="relative">
          <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <select
            value={scoreFilter}
            onChange={(e) => onScoreFilterChange(e.target.value)}
            className="appearance-none input-field pl-11 pr-10 bg-surface-1 border-b border-hairline sm:w-48 cursor-pointer"
          >
            <option value="">Semua Profil</option>
            <option value="Memenuhi Syarat">Memenuhi Syarat</option>
            <option value="Perlu Dikembangkan">Perlu Dikembangkan</option>
            <option value="Tidak Sesuai">Tidak Sesuai</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
