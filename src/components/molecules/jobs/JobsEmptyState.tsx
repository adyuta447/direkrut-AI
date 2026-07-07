interface JobsEmptyStateProps {
  onClearFilters: () => void;
}

export function JobsEmptyState({ onClearFilters }: JobsEmptyStateProps) {
  return (
    <div className="py-24 text-center rounded-[32px] bg-surface-1">
      <p className="text-[24px] font-light text-ink mb-4">Belum ada lowongan yang cocok sama filter kamu</p>
      <button onClick={onClearFilters} className="btn-primary">
        Hapus Filter
      </button>
    </div>
  );
}
