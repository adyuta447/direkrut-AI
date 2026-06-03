import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Eye,
  TrendingUp,
  PieChart,
  ChevronDown,
  FileText,
  Briefcase,
  BarChart3,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface CandidateTableProps {
  onViewCandidate: (candidateId: string) => void;
  searchTerm?: string;
}

// REVISI 2: Helper label dari skor numerik
function getScoreLabel(score?: number): { label: string; className: string } {
  if (!score) return { label: "—", className: "text-ink-muted" };
  if (score >= 75) return { label: "Memenuhi Syarat", className: "text-[#198038] bg-[#defbe6] border-[#198038]" };
  if (score >= 55) return { label: "Perlu Dikembangkan", className: "text-[#f1c21b] bg-[#fcf0d3] border-[#f1c21b]" };
  return { label: "Tidak Sesuai", className: "text-[#da1e28] bg-[#fff1f1] border-[#da1e28]" };
}

// REVISI 5: Hitung hari sejak tanggal melamar
function getDaysWaiting(appliedDate: string): number {
  // appliedDate bisa berupa string seperti "10 Mei 2025" atau "Hari ini"
  if (appliedDate === "Hari ini" || appliedDate === "Today") return 0;
  const dateMap: Record<string, number> = {
    "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "Mei": 4, "Jun": 5,
    "Jul": 6, "Agu": 7, "Sep": 8, "Okt": 9, "Nov": 10, "Des": 11,
    "May": 4, "Aug": 7, "Oct": 9, "Dec": 11,
  };
  try {
    const parts = appliedDate.split(" ");
    if (parts.length >= 3) {
      const day = parseInt(parts[0]);
      const month = dateMap[parts[1]] ?? 0;
      const year = parseInt(parts[2]);
      const then = new Date(year, month, day);
      const now = new Date();
      const diffMs = now.getTime() - then.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
  } catch (_) { /* ignore */ }
  return 8; // default dummy untuk data statis
}

export default function CandidateTable({
  onViewCandidate,
  searchTerm: externalSearchTerm = "",
}: CandidateTableProps) {
  const { applications, jobs } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [scoreFilter, setScoreFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const activeSearchTerm = externalSearchTerm || searchTerm;

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName
        .toLowerCase()
        .includes(activeSearchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(activeSearchTerm.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    const matchesJob = !jobFilter || app.jobId === jobFilter;
    
    // Evaluate score label to match against scoreFilter
    const scoreLabel = getScoreLabel(app.recommendationScore).label;
    const matchesScore = !scoreFilter || scoreLabel === scoreFilter;

    return matchesSearch && matchesStatus && matchesJob && matchesScore;
  });

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // REVISI 4: Kandidat potensial di luar filter (dummy: skor tinggi tapi "tidak lolos" dulu)
  const potentialCandidates = useMemo(() => {
    return applications.filter((app) => {
      const score = app.recommendationScore || 0;
      return score >= 80 && app.status === "submitted";
    }).slice(0, 3);
  }, [applications]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "interview":
        return "bg-[#e5f6ff] text-[#0f62fe] border-[#0f62fe]";
      case "under-review":
        return "bg-[#fff1f1] text-[#da1e28] border-[#da1e28]";
      case "rejected":
        return "bg-surface-1 text-ink-muted border-hairline";
      default:
        return "bg-surface-1 text-ink border-hairline";
    }
  };

  const avgScore =
    applications.filter((a) => a.recommendationScore).length > 0
      ? Math.round(
          applications
            .filter((a) => a.recommendationScore)
            .reduce((sum, a) => sum + (a.recommendationScore || 0), 0) /
            applications.filter((a) => a.recommendationScore).length,
        )
      : undefined;

  const avgScoreLabel = getScoreLabel(avgScore);

  const statCards = [
    {
      label: "Total Lamaran",
      value: applications.length,
    },
    {
      label: "Tahap Administrasi",
      value: applications.filter((a) => a.status === "under-review").length,
    },
    {
      label: "Wawancara",
      value: applications.filter((a) => a.status === "interview").length,
    },
    {
      label: "Rata-rata Kecocokan",
      value: avgScore ? avgScoreLabel.label : "—",
    },
  ];

  // Status distribution
  const statusDistribution = [
    {
      label: "Terkirim",
      count: applications.filter((a) => a.status === "submitted").length,
      color: "#8d8d8d",
    },
    {
      label: "Administrasi",
      count: applications.filter((a) => a.status === "under-review").length,
      color: "#525252",
    },
    {
      label: "Wawancara",
      count: applications.filter((a) => a.status === "interview").length,
      color: "#0f62fe",
    },
    {
      label: "Ditolak",
      count: applications.filter((a) => a.status === "rejected").length,
      color: "#c6c6c6",
    },
  ];

  // Prepare data for line charts
  const trendData = useMemo(() => {
    const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    return days.map((day, idx) => {
      const total = Math.max(
        1,
        Math.floor(applications.length * ((idx + 1) / 7)),
      );
      const submitted = Math.floor(total * 0.4 + Math.random() * total * 0.2);
      const underReview = Math.floor(
        total * 0.3 + Math.random() * total * 0.15,
      );
      const interview = Math.floor(total * 0.2 + Math.random() * total * 0.1);
      const rejected = Math.floor(total * 0.1 + Math.random() * total * 0.05);

      return {
        day,
        Terkirim: submitted,
        Administrasi: underReview,
        Wawancara: interview,
        Ditolak: rejected,
        Total: submitted + underReview + interview + rejected,
      };
    });
  }, [applications.length]);

  // Score distribution data — REVISI 2: label teks bukan angka
  const scoreDistributionData = [
    {
      name: "Memenuhi Syarat",
      Kandidat: applications.filter((a) => (a.recommendationScore || 0) >= 75).length,
    },
    {
      name: "Perlu Dikembangkan",
      Kandidat: applications.filter((a) => {
        const s = a.recommendationScore || 0;
        return s >= 55 && s < 75;
      }).length,
    },
    {
      name: "Tidak Sesuai",
      Kandidat: applications.filter((a) => (a.recommendationScore || 0) < 55 && (a.recommendationScore || 0) > 0).length,
    },
  ];

  const statusColors = ["#8d8d8d", "#525252", "#0f62fe", "#c6c6c6"];

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-canvas min-h-full">
      {/* Page Header */}
      <div>
        <h2 className="text-[32px] font-light text-ink tracking-[-0.5px]">Manajemen Pelamar</h2>
        <p className="text-[14px] text-ink-muted mt-2">
          {applications.length} total · {filteredApplications.length} ditampilkan
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-surface-1 border border-hairline p-6"
          >
            <p className="text-[12px] font-semibold text-ink-muted mb-2 uppercase">{card.label}</p>
            <p className="text-[24px] font-light text-ink">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-canvas border border-hairline p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau posisi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-11 bg-surface-1 border-b border-hairline w-full"
            />
          </div>
          
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="appearance-none input-field pl-11 pr-10 bg-surface-1 border-b border-hairline sm:w-56 cursor-pointer"
            >
              <option value="">Semua Lowongan</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none input-field pl-11 pr-10 bg-surface-1 border-b border-hairline sm:w-48 cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="submitted">Terkirim</option>
              <option value="under-review">Administrasi</option>
              <option value="interview">Wawancara</option>
              <option value="rejected">Ditolak</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
          </div>

          <div className="relative">
            <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
            <select
              value={scoreFilter}
              onChange={(e) => {
                setScoreFilter(e.target.value);
                setCurrentPage(1); // Reset page on filter
              }}
              className="appearance-none input-field pl-11 pr-10 bg-surface-1 border-b border-hairline sm:w-48 cursor-pointer"
            >
              <option value="">Semua Profil</option>
              <option value="Memenuhi Syarat">Memenuhi Syarat</option>
              <option value="Perlu Dikembangkan">Perlu Dikembangkan</option>
              <option value="Tidak Sesuai">Tidak Sesuai</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Candidate Table */}
      <div className="bg-canvas border border-hairline">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-1 border-b border-hairline">
                <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">
                  Kandidat
                </th>
                <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">
                  Posisi
                </th>
                <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">
                  CV
                </th>
                <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">
                  Profil Keahlian
                </th>
                <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-[12px] font-semibold text-ink-muted uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {paginatedApplications.map((app) => {
                const scoreInfo = getScoreLabel(app.recommendationScore);
                const daysWaiting = getDaysWaiting(app.appliedDate);
                const isWaiting = daysWaiting >= 7 && app.status === "submitted";

                return (
                  <tr
                    key={app.id}
                    className={`hover:bg-surface-1 transition-none ${isWaiting ? "border-l-4 border-l-[#f1c21b]" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-ink text-white flex items-center justify-center font-semibold text-[12px]">
                          {app.applicantName.charAt(0)}
                        </div>
                        <div>
                          <span className="text-[14px] font-semibold text-ink block">
                            {app.applicantName}
                          </span>
                          {/* REVISI 5: Badge "Menunggu X hari" */}
                          {isWaiting && (
                            <span className="text-[11px] text-[#f1c21b] flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              Menunggu respons {daysWaiting} hari
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[14px] text-ink">
                        {app.jobTitle}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {app.resumeLink ? (
                        <a
                           href={app.resumeLink}
                          target="_blank"
                          rel="noreferrer"
                          title="Lihat CV"
                          className="text-primary hover:underline flex items-center gap-1 text-[14px]"
                        >
                          <FileText className="w-4 h-4" /> Lihat
                        </a>
                      ) : (
                        <span className="text-ink-muted text-[14px]">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {/* REVISI 2: Label teks bukan angka */}
                      {app.recommendationScore ? (
                        <span className={`text-[11px] font-semibold px-2 py-1 border uppercase tracking-wide ${scoreInfo.className}`}>
                          {scoreInfo.label}
                        </span>
                      ) : (
                        <span className="text-[14px] text-ink-muted">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-[12px] font-semibold border uppercase ${getStatusColor(app.status)}`}
                      >
                        {app.status === "under-review"
                          ? "Administrasi"
                          : app.status === "interview"
                            ? "Wawancara"
                            : app.status === "rejected"
                              ? "Ditolak"
                              : "Terkirim"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[14px] text-ink">
                        {app.appliedDate}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onViewCandidate(app.id)}
                        className="flex items-center gap-2 text-[14px] font-semibold text-primary hover:underline"
                      >
                        <Eye className="w-4 h-4" />
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-hairline bg-surface-1">
            <span className="text-[14px] text-ink-muted">
              Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredApplications.length)} dari {filteredApplications.length} kandidat
            </span>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center text-[14px] transition-none border ${
                    currentPage === i + 1 
                      ? "bg-primary text-white border-primary" 
                      : "bg-canvas text-ink border-hairline hover:bg-[#e8e8e8]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredApplications.length === 0 && (
          <div className="text-center py-16 bg-surface-1 border-t border-hairline">
            <p className="text-[14px] text-ink-muted">Tidak ada kandidat ditemukan</p>
          </div>
        )}
      </div>

      {/* REVISI 4: Kandidat Potensial di Luar Filter */}
      {potentialCandidates.length > 0 && (
        <div className="bg-canvas border border-hairline">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-hairline bg-[#fcf0d3]">
            <AlertCircle className="w-5 h-5 text-[#f1c21b]" />
            <div>
              <p className="text-[14px] font-semibold text-ink">Rekomendasi Tambahan</p>
              <p className="text-[12px] text-ink-muted">Kandidat potensial yang mungkin terlewat dari filter utama Anda</p>
            </div>
          </div>
          <div className="divide-y divide-hairline">
            {potentialCandidates.map((app) => {
              const scoreInfo = getScoreLabel(app.recommendationScore);
              return (
                <div key={app.id} className="flex items-center justify-between px-6 py-4 hover:bg-surface-1">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-surface-2 text-ink flex items-center justify-center font-semibold text-[12px] border border-hairline">
                      {app.applicantName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-ink">{app.applicantName}</p>
                      <p className="text-[12px] text-ink-muted">{app.jobTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[11px] font-semibold px-2 py-1 border uppercase ${scoreInfo.className}`}>
                      {scoreInfo.label}
                    </span>
                    <p className="text-[12px] text-ink-muted max-w-xs hidden lg:block">
                      Kandidat ini memiliki profil keahlian yang kuat namun belum diproses. Direkomendasikan untuk ditinjau.
                    </p>
                    <button
                      onClick={() => onViewCandidate(app.id)}
                      className="text-[14px] font-semibold text-primary hover:underline flex items-center gap-1 flex-shrink-0"
                    >
                      <Eye className="w-4 h-4" /> Tinjau
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual Statistics Charts */}
      <div className="grid xl:grid-cols-3 gap-6">
        
        {/* Application Trends - Line Chart */}
        <div className="bg-canvas border border-hairline p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-ink" />
            <h3 className="text-[16px] font-normal text-ink">Tren Lamaran</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="day"
                stroke="#525252"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#525252" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "0px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} iconType="line" />
              <Line
                type="monotone"
                dataKey="Terkirim"
                stroke="#8d8d8d"
                strokeWidth={2}
                dot={{ fill: "#8d8d8d", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Administrasi"
                stroke="#525252"
                strokeWidth={2}
                dot={{ fill: "#525252", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Wawancara"
                stroke="#0f62fe"
                strokeWidth={2}
                dot={{ fill: "#0f62fe", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Profil Keahlian Distribution — REVISI 2 label update */}
        <div className="bg-canvas border border-hairline p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-ink" />
            <h3 className="text-[16px] font-normal text-ink">Distribusi Profil Keahlian</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={scoreDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#525252" style={{ fontSize: "11px" }} />
              <YAxis stroke="#525252" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "0px",
                }}
              />
              <Bar dataKey="Kandidat" fill="#0f62fe" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution Summary */}
        <div className="bg-canvas border border-hairline p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="w-5 h-5 text-ink" />
              <h3 className="text-[16px] font-normal text-ink">Rincian Status</h3>
            </div>
            <div className="space-y-6">
              {statusDistribution.map((status, idx) => (
                <div key={status.label}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3"
                        style={{ backgroundColor: statusColors[idx] }}
                      />
                      <span className="text-[14px] font-semibold text-ink">{status.label}</span>
                    </div>
                    <span className="text-[16px] font-light text-ink">
                      {status.count}
                    </span>
                  </div>
                  <div className="w-full bg-[#e0e0e0] h-1.5">
                    <div
                      className="h-1.5 transition-all duration-500"
                      style={{
                        backgroundColor: statusColors[idx],
                        width: `${(status.count / Math.max(applications.length, 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-hairline">
            <p className="text-[14px] text-ink-muted text-center">
              Total {applications.length} lamaran masuk
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
