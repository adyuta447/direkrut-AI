import { useState } from "react";
import { Search, MapPin, ArrowLeft, Sun, Moon } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function JobsPage() {
  const { setCurrentPage, jobs, darkMode, toggleDarkMode } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      !locationFilter ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !typeFilter || job.type === typeFilter;
    return matchesSearch && matchesLocation && matchesType;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage("landing")}
              className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700" />
            <span className="text-sm font-bold tracking-tight">TalentAI</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-zinc-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-500" />
              )}
            </button>
            <button
              onClick={() => setCurrentPage("auth")}
              className="btn-primary"
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Open Positions</p>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Find Your<br />Dream Role.
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-lg">
            {filteredJobs.length} position{filteredJobs.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search role or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-11"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="input-field pl-11 sm:w-44"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-field sm:w-40"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        {/* Job List */}
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="group p-6 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-base font-semibold">{job.title}</h2>
                    <span className="text-xs border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-lg">
                      {job.type}
                    </span>
                    <span className="text-xs border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-lg">
                      {job.department}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">{job.company}</p>
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </span>
                    <span>·</span>
                    <span>{job.posted}</span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 leading-relaxed max-w-2xl">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.requirements.map((req, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-2.5 py-1 rounded-lg font-medium"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setCurrentPage("auth")}
                  className="flex-shrink-0 btn-primary self-start"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-24">
            <p className="text-zinc-400 text-base">No positions found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setLocationFilter("");
                setTypeFilter("");
              }}
              className="mt-4 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
