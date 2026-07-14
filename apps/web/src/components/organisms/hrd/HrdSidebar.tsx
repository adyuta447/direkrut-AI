"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, FileText } from "lucide-react";
import { useApp } from "../../../context/AppContext";
import { hrdNavItems } from "../../../lib/hrd/navigation";

interface HrdSidebarProps {
  sidebarOpen: boolean;
  onNavigate: () => void;
}

export function HrdSidebar({ sidebarOpen, onNavigate }: HrdSidebarProps) {
  const { currentUser, setCurrentUser } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const onCandidateDetail = pathname.startsWith("/hrd/candidates");

  const handleLogout = () => {
    setCurrentUser(null);
    router.push("/");
  };

  return (
    <aside
      className={`w-64 bg-surface-1 border-r border-hairline fixed lg:sticky top-0 h-screen z-40 flex flex-col transform transition-none ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="p-6 border-b border-hairline bg-canvas">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[16px] font-semibold tracking-tight text-ink uppercase">Direkrut AI</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary text-white flex items-center justify-center font-semibold text-[16px]">
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-ink truncate">{currentUser?.name}</p>
            <p className="text-[12px] text-ink-muted truncate mt-0.5">HR Manager</p>
          </div>
        </div>
      </div>

      <nav className="p-4 flex-1 overflow-y-auto space-y-1">
        <p className="text-[12px] font-semibold text-ink-muted px-4 mb-2 mt-4 uppercase">Menu</p>

        {onCandidateDetail && (
          <span className="flex items-center gap-3 px-4 py-3 w-full text-[14px] font-semibold border-l-4 bg-[#e5f6ff] text-primary border-primary">
            <FileText className="w-4 h-4" />
            <span>Detail Kandidat</span>
          </span>
        )}

        {hrdNavItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/hrd" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-3 w-full text-[14px] font-normal transition-none border-l-4 ${
                active
                  ? "bg-[#e5f6ff] text-primary border-primary font-semibold"
                  : "text-ink hover:bg-[#e8e8e8] border-transparent"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-hairline bg-canvas">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-[14px] font-normal text-[#da1e28] hover:bg-[#fff1f1] transition-none border-l-4 border-transparent"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
