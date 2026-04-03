import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Eye,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  CheckCircle2,
  ChevronDown,
  FileText,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CandidateTableProps {
  onViewCandidate: (candidateId: string) => void;
  searchTerm?: string;
}

export default function CandidateTable({
  onViewCandidate,
  searchTerm: externalSearchTerm = "",
}: CandidateTableProps) {
  const { applications } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const activeSearchTerm = externalSearchTerm || searchTerm;

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName
        .toLowerCase()
        .includes(activeSearchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(activeSearchTerm.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "interview":
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300";
      case "under-review":
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300";
      case "rejected":
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500";
      default:
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400";
    }
  };

  const getScoreColor = (_score?: number) => {
    return "text-zinc-900 dark:text-white";
  };

  const avgScore =
    applications.filter((a) => a.recommendationScore).length > 0
      ? Math.round(
          applications
            .filter((a) => a.recommendationScore)
            .reduce((sum, a) => sum + (a.recommendationScore || 0), 0) /
            applications.filter((a) => a.recommendationScore).length
        )
      : undefined;
  const authenticityScores = applications
    .filter((a) => a.authenticityScore)
    .map((a) => a.authenticityScore?.authentic || 0);
  const avgAuthenticity = authenticityScores.length
    ? Math.round(
        authenticityScores.reduce((sum, score) => sum + score, 0) /
          authenticityScores.length
      )
    : undefined;

  const statCards = [
    { label: "Total Applications", value: applications.length, accent: "text-zinc-900 dark:text-white" },
    { label: "Under Review", value: applications.filter((a) => a.status === "under-review").length, accent: "text-zinc-900 dark:text-white" },
    { label: "Interviews", value: applications.filter((a) => a.status === "interview").length, accent: "text-zinc-900 dark:text-white" },
    { label: "Avg Score", value: avgScore ?? "--", accent: "text-zinc-900 dark:text-white" },
  ];

  // Status distribution
  const statusDistribution = [
    { label: "Submitted", count: applications.filter((a) => a.status === "submitted").length, color: "bg-zinc-400" },
    { label: "Under Review", count: applications.filter((a) => a.status === "under-review").length, color: "bg-zinc-600" },
    { label: "Interview", count: applications.filter((a) => a.status === "interview").length, color: "bg-zinc-900 dark:bg-white" },
    { label: "Rejected", count: applications.filter((a) => a.status === "rejected").length, color: "bg-zinc-300" },
  ];

  // Prepare data for line charts
  const trendData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, idx) => {
      const total = Math.max(
        1,
        Math.floor(applications.length * ((idx + 1) / 7))
      );
      const submitted = Math.floor(total * 0.4 + Math.random() * total * 0.2);
      const underReview = Math.floor(
        total * 0.3 + Math.random() * total * 0.15
      );
      const interview = Math.floor(total * 0.2 + Math.random() * total * 0.1);
      const rejected = Math.floor(total * 0.1 + Math.random() * total * 0.05);

      return {
        day,
        Submitted: submitted,
        "Under Review": underReview,
        Interview: interview,
        Rejected: rejected,
        Total: submitted + underReview + interview + rejected,
      };
    });
  }, [applications.length]);

  const scoreProgressData = useMemo(() => {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    return weeks.map((week, idx) => ({
      week,
      "Avg Score": avgScore ? avgScore - (3 - idx) * 5 : 70 + idx * 5,
      Authenticity: avgAuthenticity
        ? avgAuthenticity - (3 - idx) * 3
        : 75 + idx * 3,
    }));
  }, [avgScore, avgAuthenticity]);

  const statusColors = ["#A1A1AA", "#71717A", "#18181B", "#D4D4D8"];

  return (
    <div className="p-4 lg:p-5">
      {/* Page Header */}
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">HRD Portal</p>
          <h2 className="text-2xl font-bold tracking-tight">Candidates</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {applications.length} total · {filteredApplications.length} shown
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-3">
            <p className="text-xs text-zinc-400 mb-0.5">{card.label}</p>
            <p className={`text-2xl font-bold tracking-tight ${card.accent}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-3 mb-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none input-field pl-10 pr-8 sm:w-44"
            >
              <option value="">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under-review">Under Review</option>
              <option value="interview">Interview</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Candidate Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden mb-3">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-400">Candidate</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-400">Position</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-400">Resume</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-400">Score</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-400">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-400">Applied</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                        <span className="text-zinc-600 dark:text-zinc-400 font-semibold text-sm">
                          {app.applicantName.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{app.applicantName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{app.jobTitle}</span>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    {app.resumeLink ? (
                      <a
                        href={app.resumeLink}
                        target="_blank"
                        rel="noreferrer"
                        title="View CV"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-zinc-300 dark:text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xl font-bold tabular-nums ${getScoreColor(app.recommendationScore)}`}>
                        {app.recommendationScore || "--"}
                      </span>
                      {app.recommendationScore && (
                        <>
                          {app.recommendationScore >= 85 ? (
                            <TrendingUp className="w-4 h-4 text-zinc-400" />
                          ) : app.recommendationScore < 70 ? (
                            <TrendingDown className="w-4 h-4 text-zinc-300" />
                          ) : null}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-xl ${getStatusColor(app.status)}`}>
                      {app.status === "under-review" ? "Under Review" : app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-zinc-400">{app.appliedDate}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onViewCandidate(app.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-zinc-400">No candidates found</p>
          </div>
        )}
      </div>

      {/* Visual Statistics Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Application Trends - Line Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-zinc-400" />
            <h3 className="text-sm font-semibold">Application Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="day"
                stroke="#6B7280"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} iconType="line" />
              <Line
                type="monotone"
                dataKey="Submitted"
                stroke="#6B7280"
                strokeWidth={2}
                dot={{ fill: "#6B7280", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Under Review"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Interview"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: "#10B981", r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Rejected"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: "#EF4444", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-xs text-zinc-400 text-center">Weekly application flow</p>
          </div>
        </div>

        {/* Score & Authenticity Progress - Area Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-zinc-400" />
            <h3 className="text-sm font-semibold">Quality Metrics</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={scoreProgressData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181B" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#18181B" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorAuth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#71717A" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#71717A" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
              <XAxis dataKey="week" stroke="#A1A1AA" style={{ fontSize: "11px" }} />
              <YAxis stroke="#A1A1AA" style={{ fontSize: "11px" }} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E4E4E7", borderRadius: "12px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Area type="monotone" dataKey="Avg Score" stroke="#18181B" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
              <Area type="monotone" dataKey="Authenticity" stroke="#71717A" strokeWidth={2} fillOpacity={1} fill="url(#colorAuth)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-around text-xs text-zinc-400">
              <div className="text-center">
                <p className="font-bold text-zinc-900 dark:text-white text-base tabular-nums">{avgScore ?? "N/A"}</p>
                <p>Avg Score</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-zinc-900 dark:text-white text-base tabular-nums">{avgAuthenticity ? `${avgAuthenticity}%` : "N/A"}</p>
                <p>Authenticity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution Summary */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <PieChart className="w-4 h-4 text-zinc-400" />
            <h3 className="text-sm font-semibold">Status Breakdown</h3>
          </div>
          <div className="space-y-4">
            {statusDistribution.map((status, idx) => (
              <div key={status.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[idx] }} />
                    <span className="text-sm font-medium">{status.label}</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums">{status.count}</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ backgroundColor: statusColors[idx], width: `${(status.count / Math.max(applications.length, 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-xs text-zinc-400 text-center">
              {applications.length} total applications
            </p>
          </div>
        </div>

        {/* Validation Progress - Line Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle2 className="w-4 h-4 text-zinc-400" />
            <h3 className="text-sm font-semibold">Validation Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
              <XAxis dataKey="day" stroke="#A1A1AA" style={{ fontSize: "11px" }} />
              <YAxis stroke="#A1A1AA" style={{ fontSize: "11px" }} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E4E4E7", borderRadius: "12px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} iconType="line" />
              <Line type="monotone" dataKey="Total" stroke="#18181B" strokeWidth={2.5} dot={{ fill: "#18181B", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Completed", count: applications.filter((a) => a.validationStatus === "completed").length },
                { label: "In Progress", count: applications.filter((a) => a.validationStatus === "in-progress").length },
                { label: "Pending", count: applications.filter((a) => a.validationStatus === "pending").length },
              ].map(({ label, count }) => (
                <div key={label} className="text-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <p className="text-lg font-bold tabular-nums">{count}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
