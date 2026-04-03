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
  Sun,
  Moon,
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
  const { currentUser, setCurrentUser, setCurrentPage, darkMode, toggleDarkMode } = useApp();
  const [activeView, setActiveView] = useState<HRDView>("dashboard");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const pageMetadata = {
    dashboard: { title: "Candidate Dashboard", subtitle: "Review and manage candidate applications" },
    detail: { title: "Candidate Detail", subtitle: "Detailed candidate information and analysis" },
    "cross-role": { title: "Cross-Role Match", subtitle: "Find alternative role matches with AI" },
    "gap-analysis": { title: "Gap & Growth", subtitle: "Analyze skill gaps and development plans" },
    "job-management": { title: "Job Management", subtitle: "Add or update job postings" },
  };

  const navItems = [
    { id: "dashboard" as const, label: "Candidates", icon: Users },
    { id: "detail" as const, label: "Candidate Detail", icon: FileText, disabled: !selectedCandidateId },
    { id: "cross-role" as const, label: "Cross-Role Match", icon: Target },
    { id: "gap-analysis" as const, label: "Gap & Growth", icon: TrendingUp },
    { id: "job-management" as const, label: "Job Management", icon: ClipboardList },
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
    <div className="h-screen bg-white dark:bg-zinc-950 flex relative overflow-hidden">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-60 bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800 fixed lg:sticky top-0 h-screen z-40 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm font-bold tracking-tight">DirekrutAI</span>
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-3.5 h-3.5 text-zinc-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-zinc-500" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 font-bold text-sm flex-shrink-0">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{currentUser?.name}</p>
              <p className="text-xs text-zinc-400 truncate">HRD Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-3 flex-1 overflow-y-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 px-2 mb-3">Navigation</p>
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
              className={`sidebar-item mb-1 ${
                activeView === id
                  ? "sidebar-item-active"
                  : disabled
                  ? "text-zinc-300 dark:text-zinc-600 cursor-not-allowed"
                  : "sidebar-item-inactive"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="px-2 pb-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={handleLogout}
            className="sidebar-item sidebar-item-inactive"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold truncate">{currentPageMeta.title}</h1>
            <p className="text-xs text-zinc-400 mt-0.5 truncate">{currentPageMeta.subtitle}</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-52 h-9 pl-9 pr-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700"
            />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
          {activeView === "dashboard" && (
            <CandidateTable onViewCandidate={handleViewCandidate} searchTerm={searchTerm} />
          )}
          {activeView === "detail" && selectedCandidateId && (
            <CandidateDetail candidateId={selectedCandidateId} />
          )}
          {activeView === "cross-role" && <CrossRoleRecommendation />}
          {activeView === "gap-analysis" && <GapAnalysis />}
          {activeView === "job-management" && <JobManagement />}
        </main>
      </div>
    </div>
  );
}
