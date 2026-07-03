interface JobsEmptyStateProps {
  onClearFilters: () => void;
}

export function JobsEmptyState({ onClearFilters }: JobsEmptyStateProps) {
  return (
    <div className="py-24 text-center border border-hairline bg-surface-1">
      <p className="text-[24px] font-light text-ink mb-4">Tidak ada lowongan yang sesuai kriteria Anda</p>
      <button onClick={onClearFilters} className="btn-primary">
        Hapus Filter
      </button>
    </div>
  );
}
