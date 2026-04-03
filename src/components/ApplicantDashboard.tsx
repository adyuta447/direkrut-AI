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
  const { currentUser, setCurrentUser, setCurrentPage, darkMode, toggleDarkMode } = useApp();
  const [activeView, setActiveView] = useState<ApplicantView>("apply");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageMetadata: Record<ApplicantView, { title: string; subtitle: string }> = {
    apply: { title: "Apply for a Position", subtitle: "Upload your CV and select the position" },
    validation: { title: "AI Skill Validation", subtitle: "Answer questions to validate your skills" },
    "ai-practice": { title: "Video Interview Simulation", subtitle: "Practice with AI in a simulated video call — not evaluated" },
    complete: { title: "Application Status", subtitle: "View your submission status and next steps" },
  };

  const navItems = [
    { id: "apply" as const, label: "Apply & Upload CV", icon: Upload },
    { id: "validation" as const, label: "AI Skill Validation", icon: MessageSquare },
    { id: "ai-practice" as const, label: "AI Interview Practice", icon: Video },
    { id: "complete" as const, label: "Status & Interview", icon: CheckCircle },
  ];

  const currentPageMeta = pageMetadata[activeView];

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("landing");
  };

  return (
    <div className="h-screen bg-white dark:bg-zinc-950 flex relative overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-56 bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800 fixed lg:sticky top-0 h-screen z-40 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand + user */}
        <div className="px-4 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm font-bold tracking-tight">DirektutAI</span>
            <button
              onClick={toggleDarkMode}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-zinc-400" /> : <Moon className="w-3.5 h-3.5 text-zinc-500" />}
            </button>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 font-bold text-xs flex-shrink-0">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">{currentUser?.name}</p>
              <p className="text-xs text-zinc-400 truncate">Candidate</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 px-2 mb-2">
            Navigation
          </p>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveView(id); setSidebarOpen(false); }}
              className={`sidebar-item mb-0.5 ${activeView === id ? "sidebar-item-active" : "sidebar-item-inactive"}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-3 border-t border-zinc-100 dark:border-zinc-800 pt-3">
          <button
            onClick={handleLogout}
            className="sidebar-item sidebar-item-inactive text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main panel */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 px-5 py-3.5 flex items-center justify-between gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold truncate">{currentPageMeta.title}</h1>
            <p className="text-xs text-zinc-400 truncate">{currentPageMeta.subtitle}</p>
          </div>
        </header>

        {/* Content — fills remaining space */}
        <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
          {activeView === "apply" && <ApplyPage onNext={() => setActiveView("validation")} />}
          {activeView === "validation" && <ValidationChat onComplete={() => setActiveView("complete")} />}
          {activeView === "ai-practice" && <CandidateAISimulation />}
          {activeView === "complete" && <SubmissionComplete />}
        </main>
      </div>
    </div>
  );
}
