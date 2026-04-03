import { useState } from "react";
import {
  Upload,
  MessageSquare,
  CheckCircle,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Video,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import ApplyPage from "./applicant/ApplyPage";
import ValidationChat from "./applicant/ValidationChat";
import SubmissionComplete from "./applicant/SubmissionComplete";
import CandidateAISimulation from "./applicant/CandidateAISimulation";

type ApplicantView = "apply" | "validation" | "ai-practice" | "complete";

export default function ApplicantDashboard() {
  const {
    currentUser,
    setCurrentUser,
    setCurrentPage,
    darkMode,
    toggleDarkMode,
  } = useApp();
  const [activeView, setActiveView] = useState<ApplicantView>("apply");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageMetadata: Record<
    ApplicantView,
    { title: string; subtitle: string }
  > = {
    apply: {
      title: "Apply for Position",
      subtitle: "Upload your document and select the target role",
    },
    validation: {
      title: "AI Validation",
      subtitle: "System validation sequence based on your profile",
    },
    "ai-practice": {
      title: "AI Video Interview",
      subtitle: "Interactive autonomous interview session",
    },
    complete: {
      title: "Status Board",
      subtitle: "Track your current application state",
    },
  };

  const navItems = [
    { id: "apply" as const, label: "Submit Application", icon: Upload },
    {
      id: "validation" as const,
      label: "System Validation",
      icon: MessageSquare,
    },
    { id: "ai-practice" as const, label: "AI Interview", icon: Video },
    { id: "complete" as const, label: "Status Board", icon: CheckCircle },
  ];

  const currentPageMeta = pageMetadata[activeView];

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("landing");
  };

  return (
    <div className="h-screen bg-white dark:bg-[#0a0a0a] font-sans flex relative overflow-hidden">
      {/* Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-30 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-72 bg-white dark:bg-[#0a0a0a] border-r border-zinc-200/60 dark:border-zinc-800/60 fixed lg:sticky top-0 h-screen z-40 flex flex-col transform transition-transform duration-500 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand & User Area */}
        <div className="p-6 lg:p-8 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">
              Direkrut<span className="text-zinc-400">AI</span>
            </span>
            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-zinc-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-600" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 font-black text-lg flex-shrink-0">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-zinc-900 dark:text-white truncate uppercase tracking-widest">
                {currentUser?.name}
              </p>
              <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 truncate uppercase tracking-widest mt-0.5">
                Candidate
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 lg:p-6 flex-1 overflow-y-auto space-y-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 px-4 mb-4">
            Main Menu
          </p>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveView(id);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-4 px-5 py-4 w-full rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                activeView === id
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                  : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 lg:p-6 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>End Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white dark:bg-[#0a0a0a]">
        {/* Topbar */}
        <header className="bg-transparent border-b border-zinc-200/60 dark:border-zinc-800/60 px-6 lg:px-12 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-zinc-900 dark:text-white" />
              ) : (
                <Menu className="w-5 h-5 text-zinc-900 dark:text-white" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-3xl font-black tracking-tighter text-zinc-900 dark:text-white truncate mb-1">
                {currentPageMeta.title}
              </h1>
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 truncate">
                {currentPageMeta.subtitle}
              </p>
            </div>
          </div>
        </header>

        {/* Dynamic Main View */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-[#0a0a0a]">
          {activeView === "apply" && (
            <ApplyPage onNext={() => setActiveView("validation")} />
          )}
          {activeView === "validation" && (
            <ValidationChat onComplete={() => setActiveView("complete")} />
          )}
          {activeView === "ai-practice" && <CandidateAISimulation />}
          {activeView === "complete" && <SubmissionComplete />}
        </main>
      </div>
    </div>
  );
}
