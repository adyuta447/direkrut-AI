import { useState } from "react";
import {
  Users,
  FileText,
  TrendingUp,
  Target,
  LogOut,
  Briefcase,
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
  const { currentUser, setCurrentUser, setCurrentPage } = useApp();
  const [activeView, setActiveView] = useState<HRDView>("dashboard");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const pageMetadata = {
    dashboard: {
      title: "Candidate Dashboard",
      subtitle: "Review and manage candidate applications",
    },
    detail: {
      title: "Candidate Detail",
      subtitle: "View detailed candidate information and analysis",
    },
    "cross-role": {
      title: "Cross-Role Recommendation",
      subtitle:
        "Find alternative role matches for candidates using AI-powered analysis",
    },
    "gap-analysis": {
      title: "Gap & Growth Projection",
      subtitle:
        "Analyze skill gaps and create development plans for candidates",
    },
    "job-management": {
      title: "Job Management",
      subtitle:
        "Add or update job postings that appear on landing page & job board",
    },
  };

  const currentPage = pageMetadata[activeView];

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("landing");
  };

  const handleViewCandidate = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setActiveView("detail");
  };

  return (
    <div className="h-screen bg-gray-50 flex relative">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white shadow-lg flex flex-col fixed lg:sticky top-0 h-screen z-40 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TalentAI</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">HRD Portal</p>
            <p className="font-semibold text-gray-900">{currentUser?.name}</p>
          </div>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          <button
            onClick={() => {
              setActiveView("dashboard");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
              activeView === "dashboard"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Candidate Dashboard</span>
          </button>

          <button
            onClick={() => {
              setActiveView("detail");
              setSidebarOpen(false);
            }}
            disabled={!selectedCandidateId}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
              activeView === "detail"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Candidate Detail</span>
          </button>

          <button
            onClick={() => {
              setActiveView("cross-role");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
              activeView === "cross-role"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Target className="w-5 h-5" />
            <span className="font-medium">Cross-Role Match</span>
          </button>

          <button
            onClick={() => {
              setActiveView("gap-analysis");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
              activeView === "gap-analysis"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Gap & Growth</span>
          </button>

          <button
            onClick={() => {
              setActiveView("job-management");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
              activeView === "job-management"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span className="font-medium">Job Management</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Navbar */}
        <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              {currentPage.title}
            </h1>
            <p className="text-sm lg:text-base text-gray-600 mt-1">
              {currentPage.subtitle}
            </p>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[280px] h-[42px] pl-12 pr-4 bg-gray-50 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {activeView === "dashboard" && (
            <CandidateTable
              onViewCandidate={handleViewCandidate}
              searchTerm={searchTerm}
            />
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
