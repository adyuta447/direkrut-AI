import { useState } from "react";
import {
  Users,
  FileText,
  TrendingUp,
  Target,
  LogOut,
  ClipboardList,
  Menu,
  X,
  Search,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import CandidateTable from "./hrd/CandidateTable";
import CandidateDetail from "./hrd/CandidateDetail";
import CrossRoleRecommendation from "./hrd/CrossRoleRecommendation";
import GapAnalysis from "./hrd/GapAnalysis";
import JobManagement from "./hrd/JobManagement";

type HRDView =
  | "dashboard"
  | "detail"
  | "cross-role"
  | "gap-analysis"
  | "job-management";

export default function HRDDashboard() {
  const {
    currentUser,
    setCurrentUser,
    setCurrentPage,
  } = useApp();
  const [activeView, setActiveView] = useState<HRDView>("dashboard");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null,
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const pageMetadata = {
    dashboard: {
      title: "Manajemen Pelamar",
      subtitle: "Tinjau dan kelola lamaran kandidat",
    },
    detail: {
      title: "Detail Kandidat",
      subtitle: "Informasi dan analisis mendetail tentang kandidat",
    },
    "cross-role": {
      title: "Rekomendasi Alternatif Posisi",
      subtitle: "Temukan kecocokan peran alternatif dengan AI",
    },
    "gap-analysis": {
      title: "Validasi Kompetensi (AI)",
      subtitle: "Validasi keahlian menggunakan bukti dari CV",
    },
    "job-management": {
      title: "Manajemen Lowongan",
      subtitle: "Kelola lowongan pekerjaan yang aktif",
    },
  };

  const navItems = [
    { id: "dashboard" as const, label: "Manajemen Pelamar", icon: Users },
    {
      id: "detail" as const,
      label: "Detail Kandidat",
      icon: FileText,
      disabled: !selectedCandidateId,
    },
    { id: "gap-analysis" as const, label: "Validasi Kompetensi (AI)", icon: TrendingUp },
    { id: "cross-role" as const, label: "Rekomendasi Alternatif Posisi", icon: Target },
    {
      id: "job-management" as const,
      label: "Manajemen Lowongan",
      icon: ClipboardList,
    },
  ];

  const currentPageMeta = pageMetadata[activeView];

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("landing");
  };

  const handleViewCandidate = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setActiveView("detail");
  };

  return (
    <div className="h-screen bg-canvas font-sans flex relative overflow-hidden">
      {/* Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#393939]/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-surface-1 border-r border-hairline fixed lg:sticky top-0 h-screen z-40 flex flex-col transform transition-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand & User Area */}
        <div className="p-6 border-b border-hairline bg-canvas">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[16px] font-semibold tracking-tight text-ink uppercase">
              Direkrut AI
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-white flex items-center justify-center font-semibold text-[16px]">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-ink truncate">
                {currentUser?.name}
              </p>
              <p className="text-[12px] text-ink-muted truncate mt-0.5">
                HR Manager
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto space-y-1">
          <p className="text-[12px] font-semibold text-ink-muted px-4 mb-2 mt-4 uppercase">
            Menu
          </p>
          {navItems.map(({ id, label, icon: Icon, disabled }) => (
            <button
              key={id}
              onClick={() => {
                if (!disabled) {
                  setActiveView(id);
                  setSidebarOpen(false);
                }
              }}
              disabled={disabled}
              className={`flex items-center gap-3 px-4 py-3 w-full text-[14px] font-normal transition-none border-l-4 ${
                activeView === id
                  ? "bg-[#e5f6ff] text-primary border-primary font-semibold"
                  : disabled
                    ? "text-ink-muted cursor-not-allowed border-transparent"
                    : "text-ink hover:bg-[#e8e8e8] border-transparent"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-canvas">
        {/* Topbar */}
        <header className="bg-surface-1 border-b border-hairline px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center border border-hairline bg-canvas hover:bg-surface-1 transition-none"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-ink" />
              ) : (
                <Menu className="w-5 h-5 text-ink" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-[24px] font-light text-ink truncate mb-1">
                {currentPageMeta.title}
              </h1>
              <p className="text-[14px] text-ink-muted truncate">
                {currentPageMeta.subtitle}
              </p>
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

        {/* Dynamic Main View */}
        <main className="flex-1 overflow-y-auto p-0">
          {activeView === "dashboard" && (
            <CandidateTable
              onViewCandidate={handleViewCandidate}
              searchTerm={searchTerm}
            />
          )}
          {activeView === "detail" && selectedCandidateId && (
            <CandidateDetail 
              candidateId={selectedCandidateId} 
              onBack={() => setActiveView("dashboard")} 
            />
          )}
          {activeView === "cross-role" && <CrossRoleRecommendation />}
          {activeView === "gap-analysis" && <GapAnalysis />}
          {activeView === "job-management" && <JobManagement />}
        </main>
      </div>
    </div>
  );
}
