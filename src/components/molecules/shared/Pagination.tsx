interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, itemsPerPage, totalItems, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between p-4 border-t border-hairline bg-surface-1">
      <span className="text-[14px] text-ink-muted">
        Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} kandidat
      </span>
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`w-8 h-8 flex items-center justify-center text-[14px] transition-none border ${
              currentPage === i + 1
                ? "bg-primary text-white border-primary"
                : "bg-canvas text-ink border-hairline hover:bg-[#e8e8e8]"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
