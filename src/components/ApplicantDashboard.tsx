import { useState } from "react";
import {
  FileText,
  MessageSquare,
  CheckCircle,
  Upload,
  LogOut,
  Briefcase,
  Menu,
  X,
  Search,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import ApplyPage from "./applicant/ApplyPage";
import ValidationChat from "./applicant/ValidationChat";
import SubmissionComplete from "./applicant/SubmissionComplete";

type ApplicantView = "apply" | "validation" | "complete";

export default function ApplicantDashboard() {
  const { currentUser, setCurrentUser, setCurrentPage } = useApp();
  const [activeView, setActiveView] = useState<ApplicantView>("apply");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const pageMetadata = {
    apply: {
      title: "Apply for a Position",
      subtitle: "Upload your CV and select the position you're interested in",
    },
    validation: {
      title: "AI Skill Validation",
      subtitle: "Answer questions to validate your skills and experience",
    },
    complete: {
      title: "Application Status",
      subtitle: "View your submission status and next steps",
    },
  };

  const currentPage = pageMetadata[activeView];

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("landing");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white shadow-lg fixed lg:sticky top-0 h-screen z-40 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TalentAI</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Welcome back,</p>
            <p className="font-semibold text-gray-900">{currentUser?.name}</p>
          </div>
        </div>

        <nav className="p-4">
          <button
            onClick={() => {
              setActiveView("apply");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
              activeView === "apply"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Upload className="w-5 h-5" />
            <span className="font-medium">Apply & Upload CV</span>
          </button>

          <button
            onClick={() => {
              setActiveView("validation");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
              activeView === "validation"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">AI Skill Validation</span>
          </button>

          <button
            onClick={() => {
              setActiveView("complete");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
              activeView === "complete"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Submission Status</span>
          </button>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
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
          {activeView === "apply" && (
            <ApplyPage onNext={() => setActiveView("validation")} />
          )}
          {activeView === "validation" && (
            <ValidationChat onComplete={() => setActiveView("complete")} />
          )}
          {activeView === "complete" && <SubmissionComplete />}
        </main>
      </div>
    </div>
  );
}
