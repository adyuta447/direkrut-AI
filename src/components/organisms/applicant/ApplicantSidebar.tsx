"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useApp } from "../../../context/AppContext";
import { applicantNavItems } from "../../../lib/applicant/navigation";

interface ApplicantSidebarProps {
  sidebarOpen: boolean;
  onNavigate: () => void;
}

export function ApplicantSidebar({ sidebarOpen, onNavigate }: ApplicantSidebarProps) {
  const { currentUser, setCurrentUser } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    setCurrentUser(null);
    router.push("/");
  };

  return (
    <aside
      className={`w-72 bg-surface-1 border-r border-hairline fixed lg:sticky top-0 h-screen z-40 flex flex-col transform transition-transform duration-500 ease-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="p-6 lg:p-8 border-b border-hairline">
        <div className="flex items-center justify-between mb-8">
          <span className="text-[20px] font-semibold text-ink">Direkrut AI</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-canvas border border-hairline flex items-center justify-center text-ink font-semibold text-[20px] flex-shrink-0">
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-ink truncate">{currentUser?.name}</p>
            <p className="text-[12px] text-ink-muted truncate">Kandidat</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <p className="text-[12px] font-semibold uppercase text-ink-muted px-8 py-4">Menu Utama</p>
        <div className="flex flex-col">
          {applicantNavItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-4 px-8 py-4 w-full text-[14px] font-normal transition-none border-l-4 ${
                pathname.startsWith(href)
                  ? "bg-canvas text-primary border-primary font-semibold"
                  : "text-ink hover:bg-canvas border-transparent"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="border-t border-hairline">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-8 py-6 w-full text-[14px] font-normal text-[#da1e28] hover:bg-[#fff1f1] transition-none"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
