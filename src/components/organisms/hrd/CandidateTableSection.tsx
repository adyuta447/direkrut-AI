import { Application } from "../../../types";
import { Pagination } from "../../molecules/shared/Pagination";
import { CandidateTableRow } from "../../molecules/hrd/CandidateTableRow";

interface CandidateTableSectionProps {
  applications: Application[];
  filteredCount: number;
  page: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onViewCandidate: (id: string) => void;
}

export function CandidateTableSection({
  applications,
  filteredCount,
  page,
  totalPages,
  itemsPerPage,
  onPageChange,
  onViewCandidate,
}: CandidateTableSectionProps) {
  return (
    <div className="bg-canvas border border-hairline">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-1 border-b border-hairline">
              <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">Kandidat</th>
              <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">Posisi</th>
              <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">CV</th>
              <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">Profil Keahlian</th>
              <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">Status</th>
              <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">Tanggal</th>
              <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {applications.map((app) => (
              <CandidateTableRow key={app.id} app={app} onViewCandidate={onViewCandidate} />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} itemsPerPage={itemsPerPage} totalItems={filteredCount} onPageChange={onPageChange} />

      {filteredCount === 0 && (
        <div className="text-center py-16 bg-surface-1 border-t border-hairline">
          <p className="text-[14px] text-ink-muted">Tidak ada kandidat ditemukan</p>
        </div>
      )}
    </div>
  );
}
