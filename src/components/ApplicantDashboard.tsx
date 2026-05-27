import { useState } from "react";
import {
  Upload,
  MessageSquare,
  CheckCircle,
  LogOut,
  Menu,
  X,
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
  } = useApp();
  const [activeView, setActiveView] = useState<ApplicantView>("apply");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageMetadata: Record<
    ApplicantView,
    { title: string; subtitle: string }
  > = {
    apply: {
      title: "Kirim Lamaran",
      subtitle: "Unggah dokumen Anda dan pilih peran target",
    },
    validation: {
      title: "Validasi AI",
      subtitle: "Urutan validasi sistem berdasarkan profil Anda",
    },
    "ai-practice": {
      title: "Wawancara Video AI",
      subtitle: "Sesi wawancara otonom interaktif",
    },
    complete: {
      title: "Status Lamaran",
      subtitle: "Lacak posisi lamaran Anda saat ini",
    },
  };

  const navItems = [
    { id: "apply" as const, label: "Kirim Lamaran", icon: Upload },
    {
      id: "validation" as const,
      label: "Validasi Sistem",
      icon: MessageSquare,
    },
    { id: "ai-practice" as const, label: "Wawancara AI", icon: Video },
    { id: "complete" as const, label: "Status Lamaran", icon: CheckCircle },
  ];

  const currentPageMeta = pageMetadata[activeView];

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("landing");
  };

  return (
    <div className="h-screen bg-canvas font-sans flex relative overflow-hidden">
      {/* Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[#393939]/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Carbon Style */}
      <aside
        className={`w-72 bg-surface-1 border-r border-hairline fixed lg:sticky top-0 h-screen z-40 flex flex-col transform transition-transform duration-500 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand & User Area */}
        <div className="p-6 lg:p-8 border-b border-hairline">
          <div className="flex items-center justify-between mb-8">
            <span className="text-[20px] font-semibold text-ink">
              Direkrut AI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-canvas border border-hairline flex items-center justify-center text-ink font-semibold text-[20px] flex-shrink-0">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-ink truncate">
                {currentUser?.name}
              </p>
              <p className="text-[12px] text-ink-muted truncate">
                Kandidat
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <p className="text-[12px] font-semibold uppercase text-ink-muted px-8 py-4">
            Menu Utama
          </p>
          <div className="flex flex-col">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveView(id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-4 px-8 py-4 w-full text-[14px] font-normal transition-none border-l-4 ${
                  activeView === id
                    ? "bg-canvas text-primary border-primary font-semibold"
                    : "text-ink hover:bg-canvas border-transparent"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-canvas">
        {/* Topbar */}
        <header className="bg-canvas border-b border-hairline px-6 lg:px-12 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-12 h-12 flex items-center justify-center border border-hairline bg-surface-1 hover:bg-surface-2 transition-none"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-ink" />
              ) : (
                <Menu className="w-5 h-5 text-ink" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-[28px] font-light text-ink truncate mb-1">
                {currentPageMeta.title}
              </h1>
              <p className="text-[14px] text-ink-muted truncate">
                {currentPageMeta.subtitle}
              </p>
            </div>
          </div>
        </header>

        {/* Dynamic Main View */}
        <main className="flex-1 overflow-y-auto bg-canvas">
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
