import { Search } from "lucide-react";

interface CrossRoleSearchBarProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
}

export function CrossRoleSearchBar({ searchTerm, onSearchTermChange }: CrossRoleSearchBarProps) {
  return (
    <div className="bg-canvas border border-hairline p-4">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
        <input
          type="text"
          placeholder="Cari nama atau posisi rekomendasi..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="input-field pl-11 bg-surface-1 border-b border-hairline w-full"
        />
      </div>
    </div>
  );
}
