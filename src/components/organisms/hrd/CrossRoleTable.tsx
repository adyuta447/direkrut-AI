import { CrossRoleItem } from "../../../lib/hrd/crossRoleRecommendations";
import { CrossRoleTableRow } from "../../molecules/hrd/CrossRoleTableRow";
import { Pagination } from "../../molecules/shared/Pagination";

interface CrossRoleTableProps {
  items: CrossRoleItem[];
  filteredCount: number;
  page: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  expandedRecId: string | null;
  onToggleExpand: (id: string) => void;
}

export function CrossRoleTable({
  items,
  filteredCount,
  page,
  totalPages,
  itemsPerPage,
  onPageChange,
  expandedRecId,
  onToggleExpand,
}: CrossRoleTableProps) {
  return (
    <div className="bg-canvas border border-hairline">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-1 border-b border-hairline">
              <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">Kandidat</th>
              <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">Posisi Dilamar</th>
              <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">Rekomendasi Posisi AI</th>
              <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">Tingkat Potensi</th>
              <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {items.map((item) => (
              <CrossRoleTableRow key={item.id} item={item} expanded={expandedRecId === item.id} onToggle={() => onToggleExpand(item.id)} />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} itemsPerPage={itemsPerPage} totalItems={filteredCount} onPageChange={onPageChange} />

      {filteredCount === 0 && (
        <div className="text-center py-16 bg-surface-1 border-t border-hairline">
          <p className="text-[14px] text-ink-muted">Tidak ada kandidat dengan potensi lintas posisi yang ditemukan.</p>
        </div>
      )}
    </div>
  );
}
