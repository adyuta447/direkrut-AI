import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Eye,
  TrendingUp,
  TrendingDown,
  PieChart,
  ChevronDown,
  FileText,
  Briefcase,
  BarChart3
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

export default function CandidateTable({
  onViewCandidate,
  searchTerm: externalSearchTerm = "",
}: CandidateTableProps) {
  const { applications, jobs } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");

  const activeSearchTerm = externalSearchTerm || searchTerm;

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName
        .toLowerCase()
        .includes(activeSearchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(activeSearchTerm.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    const matchesJob = !jobFilter || app.jobId === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

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

  const getScoreColor = (_score?: number) => {
    return "text-ink";
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
      value: avgScore ? `${avgScore}%` : "--",
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

  // Score distribution data
  const scoreDistributionData = useMemo(() => {
    const ranges = [
      { name: "0-50%", min: 0, max: 50 },
      { name: "51-70%", min: 51, max: 70 },
      { name: "71-85%", min: 71, max: 85 },
      { name: "86-100%", min: 86, max: 100 },
    ];
    return ranges.map((r) => ({
      name: r.name,
      Kandidat: applications.filter((a) => {
        const s = a.recommendationScore || 0;
        return s >= r.min && s <= r.max;
      }).length,
    }));
  }, [applications]);

  const statusColors = ["#8d8d8d", "#525252", "#0f62fe", "#c6c6c6"];

  return (
    <div className="p-6 lg:p-8 space-y-6 bg-canvas min-h-full">
      {/* Page Header */}
      <div>
        <h2 className="text-[32px] font-light text-ink tracking-[-0.5px]">Kumpulan Kandidat</h2>
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
            <p className="text-[32px] font-light text-ink">
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
                  Skor AI
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
              {filteredApplications.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-surface-1 transition-none"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-ink text-white flex items-center justify-center font-semibold text-[12px]">
                        {app.applicantName.charAt(0)}
                      </div>
                      <span className="text-[14px] font-semibold text-ink">
                        {app.applicantName}
                      </span>
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
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[16px] font-semibold ${getScoreColor(app.recommendationScore)}`}
                      >
                        {app.recommendationScore ? `${app.recommendationScore}%` : "--"}
                      </span>
                      {app.recommendationScore && (
                        <>
                          {app.recommendationScore >= 85 ? (
                            <TrendingUp className="w-4 h-4 text-[#198038]" />
                          ) : app.recommendationScore < 70 ? (
                            <TrendingDown className="w-4 h-4 text-[#da1e28]" />
                          ) : null}
                        </>
                      )}
                    </div>
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
              ))}
            </tbody>
          </table>
        </div>
        {filteredApplications.length === 0 && (
          <div className="text-center py-16 bg-surface-1 border-t border-hairline">
            <p className="text-[14px] text-ink-muted">Tidak ada kandidat ditemukan</p>
          </div>
        )}
      </div>

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

        {/* Score Distribution - Bar Chart */}
        <div className="bg-canvas border border-hairline p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-ink" />
            <h3 className="text-[16px] font-normal text-ink">Distribusi Skor AI</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={scoreDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#525252" style={{ fontSize: "12px" }} />
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
