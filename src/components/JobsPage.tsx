import { useState } from "react";
import { Search, MapPin, ArrowLeft, Sun, Moon, ArrowUpRight, X, ChevronDown } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function JobsPage() {
  const { setCurrentPage, jobs, darkMode, toggleDarkMode } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      !locationFilter ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !typeFilter || job.type === typeFilter;
    return matchesSearch && matchesLocation && matchesType;
  });

  const activeJob = jobs.find((j) => j.id === selectedJob) ?? filteredJobs[0] ?? null;
  const uniqueTypes = [...new Set(jobs.map((j) => j.type))];

  const clearFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setTypeFilter("");
  };

  const hasFilters = searchTerm || locationFilter || typeFilter;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white flex flex-col">

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800/60 flex-shrink-0">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage("landing")}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-widest"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
            <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700" />
            <span className="text-sm font-black tracking-tight uppercase">DirekrutAI</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-zinc-400" /> : <Moon className="w-3.5 h-3.5 text-zinc-500" />}
            </button>
            <button
              onClick={() => setCurrentPage("auth")}
              className="text-xs font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2.5 rounded-xl hover:opacity-80 transition-opacity tracking-wide"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* ── PAGE HEADER ─────────────────────────────────── */}
      <div className="border-b border-zinc-100 dark:border-zinc-800 px-6 lg:px-10 pt-12 pb-8 max-w-screen-xl mx-auto w-full">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-4">Open Positions</p>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none uppercase">
            Find Your<br />
            <span className="text-zinc-300 dark:text-zinc-700">Dream Role.</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs leading-relaxed">
            {filteredJobs.length} position{filteredJobs.length !== 1 ? "s" : ""} available — apply in minutes with AI-powered screening.
          </p>
        </div>
      </div>

      <div className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 px-6 lg:px-10">
        <div className="max-w-screen-xl mx-auto py-4 flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search role or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
            />
          </div>
          {/* Location */}
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="pl-9 pr-4 py-2.5 w-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
            />
          </div>
          {/* Type filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none py-2.5 pl-4 pr-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors cursor-pointer"
            >
              <option value="">All Types</option>
              {uniqueTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>


      {/* ── MAIN ────────────────────────────────────────── */}
      <div className="flex-1 max-w-screen-xl mx-auto w-full px-6 lg:px-10 py-6">
        {filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-4xl font-black text-zinc-100 dark:text-zinc-800 mb-4 tracking-tighter">0</p>
            <p className="text-sm text-zinc-400 mb-5">No positions match your criteria</p>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold border border-zinc-200 dark:border-zinc-700 px-4 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="flex gap-5 h-full">

            {/* ── JOB LIST ──────────────────────────────── */}
            <div className="flex-1 min-w-0 space-y-1.5">
              {filteredJobs.map((job, idx) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJob(job.id)}
                  className={`w-full text-left group flex items-start justify-between p-4 rounded-xl border transition-all ${
                    (selectedJob === job.id) || (!selectedJob && idx === 0)
                      ? "border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                      : "border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <span className={`text-xs font-mono flex-shrink-0 mt-0.5 ${
                      (selectedJob === job.id) || (!selectedJob && idx === 0)
                        ? "text-zinc-400 dark:text-zinc-500"
                        : "text-zinc-300 dark:text-zinc-700"
                    }`}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-sm">{job.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-lg border font-medium ${
                          (selectedJob === job.id) || (!selectedJob && idx === 0)
                            ? "border-zinc-700 dark:border-zinc-300 text-zinc-400 dark:text-zinc-500"
                            : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400"
                        }`}>
                          {job.type}
                        </span>
                      </div>
                      <p className={`text-xs ${
                        (selectedJob === job.id) || (!selectedJob && idx === 0)
                          ? "text-zinc-400 dark:text-zinc-500"
                          : "text-zinc-400"
                      }`}>
                        {job.company} · {job.location}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-colors ${
                    (selectedJob === job.id) || (!selectedJob && idx === 0)
                      ? "text-zinc-500 dark:text-zinc-500"
                      : "text-zinc-200 dark:text-zinc-700 group-hover:text-zinc-400"
                  }`} />
                </button>
              ))}
            </div>

            {/* ── JOB DETAIL ────────────────────────────── */}
            {activeJob && (
              <div className="hidden lg:flex w-96 xl:w-[28rem] flex-shrink-0 flex-col border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden sticky top-24 max-h-[calc(100vh-8rem)]">
                {/* Detail header */}
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-xs border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 px-2.5 py-1 rounded-lg font-medium">
                        {activeJob.type}
                      </span>
                      <span className="text-xs border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 px-2.5 py-1 rounded-lg font-medium">
                        {activeJob.department}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">{activeJob.posted}</span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight mb-1 leading-tight">{activeJob.title}</h2>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <span className="font-medium">{activeJob.company}</span>
                    <span>·</span>
                    <MapPin className="w-3 h-3" />
                    <span>{activeJob.location}</span>
                  </div>
                </div>

                {/* Detail body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 mb-2">Description</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {activeJob.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 mb-3">Required Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {activeJob.requirements.map((req, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2.5 py-1 rounded-xl font-medium"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 mb-2">AI-Powered Screening</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      This role uses DirekrutAI's automated skill validation and AI interview — expect a faster, fairer process with no waiting in queues.
                    </p>
                  </div>
                </div>

                {/* Sticky CTA */}
                <div className="flex-shrink-0 p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                  <button
                    onClick={() => setCurrentPage("auth")}
                    className="w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3.5 rounded-xl font-semibold text-sm hover:opacity-80 transition-opacity"
                  >
                    Apply for this Role
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── MOBILE CTA (floating) ────────────────────────── */}
      {activeJob && (
        <div className="lg:hidden sticky bottom-0 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 p-4">
          <button
            onClick={() => setCurrentPage("auth")}
            className="w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3.5 rounded-xl font-semibold text-sm hover:opacity-80 transition-opacity"
          >
            Apply Now
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
