import { useState } from "react";
import { Search, MapPin, X, ChevronDown, CheckCircle2, Briefcase, DollarSign, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function JobsPage() {
  const { setCurrentPage, jobs } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
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
    const matchesIndustry = !industryFilter || job.industry === industryFilter;
    const matchesSalary = !salaryFilter || job.salaryRange === salaryFilter;
    
    return matchesSearch && matchesLocation && matchesType && matchesIndustry && matchesSalary;
  });

  const activeJob = jobs.find((j) => j.id === selectedJob) ?? filteredJobs[0] ?? null;
  
  const uniqueTypes = [...new Set(jobs.map((j) => j.type))];
  const uniqueIndustries = [...new Set(jobs.map((j) => j.industry))];
  const uniqueSalaries = [...new Set(jobs.map((j) => j.salaryRange))].filter(Boolean);

  const clearFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setTypeFilter("");
    setSalaryFilter("");
    setIndustryFilter("");
  };

  const hasFilters = searchTerm || locationFilter || typeFilter || salaryFilter || industryFilter;

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">

      {/* ── NAV ─────────────────────────────────────────── */}
      <div className="bg-surface-1 h-8 flex items-center px-6 lg:px-10 justify-end text-[12px] text-ink-muted">
        <div className="flex gap-4">
          <span className="hover:text-ink cursor-pointer">Bantuan</span>
          <span className="hover:text-ink cursor-pointer">Kontak</span>
        </div>
      </div>
      <nav className="border-b border-hairline bg-canvas">
        <div className="max-w-[1584px] mx-auto px-6 lg:px-10 h-16 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <button onClick={() => setCurrentPage("landing")} className="text-[20px] font-semibold tracking-tight text-ink hover:text-ink transition-none uppercase">
              Direkrut AI
            </button>
            
            {/* New Navbar Links */}
            <div className="hidden lg:flex items-center gap-6">
              <button
                onClick={() => setCurrentPage("jobs")}
                className="text-[14px] text-ink hover:text-primary transition-none font-semibold border-b-2 border-primary h-16"
              >
                Cari lowongan
              </button>
              <button className="text-[14px] font-normal text-ink hover:text-primary transition-none">
                Cari profil
              </button>
              <button className="text-[14px] font-normal text-ink hover:text-primary transition-none">
                Sumber daya karir
              </button>
              <button className="text-[14px] font-normal text-ink hover:text-primary transition-none">
                Perusahaan
              </button>
              <button className="text-[14px] font-normal text-ink hover:text-primary transition-none">
                Komunitas
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentPage("auth")}
              className="text-[14px] font-normal hover:text-primary transition-none"
            >
              Masuk
            </button>
            <button
              onClick={() => setCurrentPage("auth")}
              className="btn-primary"
            >
              Daftar
            </button>
          </div>
        </div>
      </nav>

      {/* ── PAGE HEADER & SEARCH ─────────────────────────── */}
      <div className="bg-canvas border-b border-hairline pt-12 pb-8 px-6 lg:px-10">
        <div className="max-w-[1584px] mx-auto">
          <h1 className="text-[42px] font-light leading-[1.2] mb-6 text-ink">
            Temukan peluang karir Anda selanjutnya
          </h1>
          
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                type="text"
                placeholder="Cari posisi atau perusahaan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-11 bg-surface-1 border-b border-hairline hover:bg-[#e8e8e8]"
              />
            </div>
            {/* Location */}
            <div className="relative min-w-[200px]">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                type="text"
                placeholder="Tempat Kerja (Kota/WFH)"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="input-field pl-11 bg-surface-1 border-b border-hairline hover:bg-[#e8e8e8]"
              />
            </div>
            {/* Type filter */}
            <div className="relative min-w-[160px]">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="input-field appearance-none pl-11 pr-10 bg-surface-1 border-b border-hairline hover:bg-[#e8e8e8] cursor-pointer"
              >
                <option value="">Jenis Pekerjaan</option>
                {uniqueTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
            </div>
            {/* Industry Filter */}
            <div className="relative min-w-[160px]">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="input-field appearance-none pl-11 pr-10 bg-surface-1 border-b border-hairline hover:bg-[#e8e8e8] cursor-pointer"
              >
                <option value="">Semua Bidang</option>
                {uniqueIndustries.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
            </div>
            {/* Salary Filter */}
            <div className="relative min-w-[160px]">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <select
                value={salaryFilter}
                onChange={(e) => setSalaryFilter(e.target.value)}
                className="input-field appearance-none pl-11 pr-10 bg-surface-1 border-b border-hairline hover:bg-[#e8e8e8] cursor-pointer"
              >
                <option value="">Rentang Gaji</option>
                {uniqueSalaries.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
            </div>
            {/* Clear */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-[14px] text-primary hover:underline px-4 transition-none"
              >
                <X className="w-4 h-4" />
                Hapus filter
              </button>
            )}
          </div>
          <p className="text-[14px] text-ink-muted mt-4">
            {filteredJobs.length} posisi tersedia
          </p>
        </div>
      </div>


      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
      <div className="flex-1 max-w-[1584px] mx-auto w-full px-6 lg:px-10 py-8">
        {filteredJobs.length === 0 ? (
          <div className="py-24 text-center border border-hairline bg-surface-1">
            <p className="text-[24px] font-light text-ink mb-4">Tidak ada lowongan yang sesuai kriteria Anda</p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Hapus Filter
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* ── JOB LIST ──────────────────────────────── */}
            <div className="flex-1 w-full lg:max-w-md space-y-4">
              {filteredJobs.map((job) => {
                const isActive = selectedJob === job.id || (!selectedJob && activeJob?.id === job.id);
                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job.id)}
                    className={`p-6 cursor-pointer border transition-none flex flex-col gap-2 ${
                      isActive
                        ? "bg-surface-1 border-primary"
                        : "bg-canvas border-hairline hover:bg-surface-1 hover:border-ink-muted"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-[18px] font-normal leading-[1.33] text-ink">{job.title}</h3>
                      <span className="text-[12px] text-ink-muted whitespace-nowrap ml-4">{job.posted}</span>
                    </div>
                    <p className="text-[14px] text-ink">{job.company}</p>
                    <p className="text-[12px] text-ink-muted">{job.location}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[12px] bg-surface-2 px-2 py-1 text-ink-muted">{job.type}</span>
                      <span className="text-[12px] bg-surface-2 px-2 py-1 text-ink-muted">{job.industry}</span>
                      {job.salaryRange && <span className="text-[12px] bg-[#e5f6ff] text-primary px-2 py-1">{job.salaryRange}</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── JOB DETAIL (JobStreet Style) ────────────────────────────── */}
            {activeJob && (
              <div className="flex-1 w-full border border-hairline bg-canvas sticky top-24 max-h-[calc(100vh-8rem)] flex flex-col">
                {/* Detail header */}
                <div className="p-8 border-b border-hairline bg-surface-1">
                  <h2 className="text-[32px] font-light leading-[1.25] mb-2 text-ink">{activeJob.title}</h2>
                  <p className="text-[18px] font-normal mb-1 text-ink">{activeJob.company}</p>
                  <p className="text-[14px] text-ink-muted mb-4">{activeJob.location} • {activeJob.industry}</p>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <span className="text-[14px] font-semibold text-ink">{activeJob.salaryRange}</span>
                    <span className="text-[14px] text-ink-muted">• {activeJob.type}</span>
                    <span className="text-[14px] text-ink-muted">• {activeJob.applicantCount} pelamar</span>
                  </div>

                  <button
                    onClick={() => setCurrentPage("auth")}
                    className="btn-primary"
                  >
                    Lamar Sekarang
                  </button>
                </div>

                {/* Detail body */}
                <div className="flex-1 overflow-y-auto p-8">
                  <div className="mb-8">
                    <h3 className="text-[20px] font-normal mb-4 text-ink">Deskripsi Pekerjaan</h3>
                    <p className="text-[16px] leading-[1.5] text-ink whitespace-pre-wrap">
                      {activeJob.description}
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-[20px] font-normal mb-4 text-ink">Keahlian yang Dibutuhkan</h3>
                    <div className="flex flex-wrap gap-2">
                      {activeJob.requirements.map((req, idx) => (
                         <span
                          key={idx}
                          className="text-[14px] border border-hairline bg-surface-1 px-3 py-1 text-ink"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 p-4 bg-[#e5f6ff] border border-primary flex gap-4">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-[14px] font-semibold text-primary mb-1">Analisis Kecocokan AI</p>
                        <p className="text-[12px] text-ink leading-[1.5]">Unggah CV Anda untuk melihat seberapa cocok kemampuan Anda dengan kriteria ini.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-[20px] font-normal mb-4 text-ink">Kualifikasi Detail</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {activeJob.detailedQualifications?.map((qual, idx) => (
                        <li key={idx} className="text-[16px] leading-[1.5] text-ink">
                          {qual}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-[20px] font-normal mb-4 text-ink">Pertanyaan Wawancara</h3>
                    <p className="text-[14px] text-ink-muted mb-4">Anda akan diminta menjawab pertanyaan berikut saat wawancara AI:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      {activeJob.questions?.map((q, idx) => (
                        <li key={idx} className="text-[14px] leading-[1.5] text-ink">
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
