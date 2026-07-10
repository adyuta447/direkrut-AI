"use client";

import { Menu, X, Search } from "lucide-react";
import { useHrdSearch } from "../../../lib/hrd/HrdSearchContext";

interface HrdTopbarProps {
  title: string;
  subtitle: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function HrdTopbar({ title, subtitle, sidebarOpen, onToggleSidebar }: HrdTopbarProps) {
  const { searchTerm, setSearchTerm } = useHrdSearch();

  return (
    <header className="bg-surface-1 border-b border-hairline px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden w-10 h-10 flex items-center justify-center border border-hairline bg-canvas hover:bg-surface-1 transition-none"
        >
          {sidebarOpen ? <X className="w-5 h-5 text-ink" /> : <Menu className="w-5 h-5 text-ink" />}
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-[24px] font-light text-ink truncate mb-1">{title}</h1>
          <p className="text-[14px] text-ink-muted truncate">{subtitle}</p>
        </div>
      </div>

      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
        <input
          type="text"
          placeholder="Cari kandidat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-11 w-full sm:w-64 bg-canvas border-b border-hairline hover:bg-[#e8e8e8]"
        />
      </div>
    </header>
  );
}
