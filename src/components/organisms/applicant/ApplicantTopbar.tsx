import { Menu, X } from "lucide-react";

interface ApplicantTopbarProps {
  title: string;
  subtitle: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function ApplicantTopbar({ title, subtitle, sidebarOpen, onToggleSidebar }: ApplicantTopbarProps) {
  return (
    <header className="bg-canvas border-b border-hairline px-6 lg:px-12 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden w-12 h-12 flex items-center justify-center border border-hairline bg-surface-1 hover:bg-surface-2 transition-none"
        >
          {sidebarOpen ? <X className="w-5 h-5 text-ink" /> : <Menu className="w-5 h-5 text-ink" />}
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-[28px] font-light text-ink truncate mb-1">{title}</h1>
          <p className="text-[14px] text-ink-muted truncate">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}
