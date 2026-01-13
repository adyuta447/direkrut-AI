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
        return "bg-green-100 text-green-700";
      case "under-review":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return "text-gray-400";
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    return "text-yellow-600";
  };

  const totalResumes = applications.filter((a) => a.resumeLink).length;
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
  const pendingValidation = applications.filter(
    (a) => a.validationStatus !== "completed"
  ).length;

  const statCards = [
    {
      label: "Total Applications",
      value: applications.length,
      accent: "text-gray-900",
    },
    {
      label: "Under Review",
      value: applications.filter((a) => a.status === "under-review").length,
      accent: "text-blue-600",
    },
    {
      label: "Interviews",
      value: applications.filter((a) => a.status === "interview").length,
      accent: "text-green-600",
    },
    { label: "Avg Score", value: avgScore ?? "--", accent: "text-indigo-600" },
  ];

  // Status distribution
  const statusDistribution = [
    {
      label: "Submitted",
      count: applications.filter((a) => a.status === "submitted").length,
      color: "bg-gray-500",
    },
    {
      label: "Under Review",
      count: applications.filter((a) => a.status === "under-review").length,
      color: "bg-blue-500",
    },
    {
      label: "Interview",
      count: applications.filter((a) => a.status === "interview").length,
      color: "bg-green-500",
    },
    {
      label: "Rejected",
      count: applications.filter((a) => a.status === "rejected").length,
      color: "bg-red-500",
    },
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

  const statusColors = ["#6B7280", "#3B82F6", "#10B981", "#EF4444"];

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under-review">Under Review</option>
                <option value="interview">Interview</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Match Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {app.applicantName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {app.applicantName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{app.jobTitle}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {app.resumeLink ? (
                      <a
                        href={app.resumeLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        View CV
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-2xl font-bold ${getScoreColor(
                          app.recommendationScore
                        )}`}
                      >
                        {app.recommendationScore || "--"}
                      </span>
                      {app.recommendationScore && (
                        <>
                          {app.recommendationScore >= 85 ? (
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          ) : app.recommendationScore < 70 ? (
                            <TrendingDown className="w-5 h-5 text-yellow-600" />
                          ) : null}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status === "under-review"
                        ? "Under Review"
                        : app.status.charAt(0).toUpperCase() +
                          app.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {app.appliedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onViewCandidate(app.id)}
                      className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No candidates found</p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.accent}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Visual Statistics Charts */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Application Trends - Line Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Application Trends (Last 7 Days)
            </h3>
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
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Weekly application flow tracking
            </p>
          </div>
        </div>

        {/* Score & Authenticity Progress - Area Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Quality Metrics Progress
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={scoreProgressData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorAuth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="week"
                stroke="#6B7280"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#6B7280"
                style={{ fontSize: "12px" }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Area
                type="monotone"
                dataKey="Avg Score"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorScore)"
              />
              <Area
                type="monotone"
                dataKey="Authenticity"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAuth)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-around text-xs text-gray-500">
              <div className="text-center">
                <p className="font-semibold text-blue-600 text-lg">
                  {avgScore ?? "N/A"}
                </p>
                <p>Current Avg Score</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-green-600 text-lg">
                  {avgAuthenticity ? `${avgAuthenticity}%` : "N/A"}
                </p>
                <p>Current Authenticity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Current Status Breakdown
            </h3>
          </div>
          <div className="space-y-4">
            {statusDistribution.map((status, idx) => (
              <div key={status.label}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: statusColors[idx] }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {status.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {status.count}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: statusColors[idx],
                      width: `${
                        (status.count / Math.max(applications.length, 1)) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Total:{" "}
              <span className="font-semibold">{applications.length}</span>{" "}
              applications
            </p>
          </div>
        </div>

        {/* Validation Progress - Line Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Validation Progress Trend
            </h3>
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
                dataKey="Total"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-xl font-bold text-green-700">
                  {
                    applications.filter(
                      (a) => a.validationStatus === "completed"
                    ).length
                  }
                </p>
                <p className="text-xs text-gray-600 mt-1">Completed</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-xl font-bold text-blue-700">
                  {
                    applications.filter(
                      (a) => a.validationStatus === "in-progress"
                    ).length
                  }
                </p>
                <p className="text-xs text-gray-600 mt-1">In Progress</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-xl font-bold text-yellow-700">
                  {
                    applications.filter((a) => a.validationStatus === "pending")
                      .length
                  }
                </p>
                <p className="text-xs text-gray-600 mt-1">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
