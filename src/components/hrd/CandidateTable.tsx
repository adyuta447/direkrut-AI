import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

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

  // Use external search term if provided, otherwise use internal
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
    {
      label: "Avg Authenticity",
      value: avgAuthenticity ? `${avgAuthenticity}%` : "--",
      accent: "text-amber-600",
    },
    { label: "Resumes Ready", value: totalResumes, accent: "text-purple-600" },
    {
      label: "Pending Validation",
      value: pendingValidation,
      accent: "text-red-600",
    },
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

  // Score distribution
  const scoreRanges = [
    {
      label: "85-100",
      count: applications.filter((a) => (a.recommendationScore || 0) >= 85)
        .length,
      color: "bg-green-500",
    },
    {
      label: "70-84",
      count: applications.filter(
        (a) =>
          (a.recommendationScore || 0) >= 70 &&
          (a.recommendationScore || 0) < 85
      ).length,
      color: "bg-blue-500",
    },
    {
      label: "50-69",
      count: applications.filter(
        (a) =>
          (a.recommendationScore || 0) >= 50 &&
          (a.recommendationScore || 0) < 70
      ).length,
      color: "bg-yellow-500",
    },
    {
      label: "Below 50",
      count: applications.filter(
        (a) =>
          (a.recommendationScore || 0) > 0 && (a.recommendationScore || 0) < 50
      ).length,
      color: "bg-red-500",
    },
  ];

  const maxStatus = Math.max(...statusDistribution.map((s) => s.count), 1);
  const maxScore = Math.max(...scoreRanges.map((s) => s.count), 1);

  // Pie chart calculation for status distribution
  const totalApps = applications.length || 1;
  let currentAngle = 0;
  const pieData = statusDistribution.map((status) => {
    const percentage = (status.count / totalApps) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    // Convert to radians and calculate path
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (currentAngle - 90) * (Math.PI / 180);

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return { ...status, percentage, pathData };
  });

  const statusColors = ["#6B7280", "#3B82F6", "#10B981", "#EF4444"];
  const scoreColors = ["#10B981", "#3B82F6", "#EAB308", "#EF4444"];

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
        {/* Status Distribution - Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Status Distribution
            </h3>
          </div>
          <div className="flex items-center justify-center mb-6">
            <svg
              width="200"
              height="200"
              viewBox="0 0 100 100"
              className="transform -rotate-90"
            >
              {pieData.map((slice, idx) => (
                <path
                  key={slice.label}
                  d={slice.pathData}
                  fill={statusColors[idx]}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
              {/* Center circle for donut effect */}
              <circle cx="50" cy="50" r="20" fill="white" />
            </svg>
          </div>
          <div className="space-y-2">
            {statusDistribution.map((status, idx) => (
              <div
                key={status.label}
                className="flex items-center justify-between"
              >
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
                  {status.count} ({Math.round((status.count / totalApps) * 100)}
                  %)
                </span>
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

        {/* Match Score Distribution - Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Match Score Distribution
            </h3>
          </div>
          <div className="h-48 flex items-end justify-around space-x-2 mb-4">
            {scoreRanges.map((range, idx) => (
              <div
                key={range.label}
                className="flex-1 flex flex-col items-center"
              >
                <div className="w-full flex flex-col items-center justify-end h-40">
                  <span className="text-xs font-bold text-gray-900 mb-1">
                    {range.count}
                  </span>
                  <div
                    className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                    style={{
                      backgroundColor: scoreColors[idx],
                      height: `${Math.max((range.count / maxScore) * 100, 5)}%`,
                    }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-600 mt-2 text-center">
                  {range.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Average Score:{" "}
              <span className="font-semibold">{avgScore ?? "N/A"}</span>
            </p>
          </div>
        </div>

        {/* Authenticity Overview - Horizontal Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Authenticity Levels
            </h3>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  High (80%+)
                </span>
                <span className="text-lg font-bold text-green-600">
                  {
                    applications.filter(
                      (a) => (a.authenticityScore?.authentic || 0) >= 80
                    ).length
                  }
                </span>
              </div>
              <div className="relative w-full bg-gray-200 rounded-lg h-8">
                <div
                  className="absolute top-0 left-0 bg-gradient-to-r from-green-400 to-green-600 h-8 rounded-lg transition-all duration-700 flex items-center justify-end pr-2"
                  style={{
                    width: `${
                      (applications.filter(
                        (a) => (a.authenticityScore?.authentic || 0) >= 80
                      ).length /
                        Math.max(applications.length, 1)) *
                      100
                    }%`,
                  }}
                >
                  <span className="text-white text-xs font-bold">
                    {Math.round(
                      (applications.filter(
                        (a) => (a.authenticityScore?.authentic || 0) >= 80
                      ).length /
                        Math.max(applications.length, 1)) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Moderate (60-79%)
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {
                    applications.filter(
                      (a) =>
                        (a.authenticityScore?.authentic || 0) >= 60 &&
                        (a.authenticityScore?.authentic || 0) < 80
                    ).length
                  }
                </span>
              </div>
              <div className="relative w-full bg-gray-200 rounded-lg h-8">
                <div
                  className="absolute top-0 left-0 bg-gradient-to-r from-blue-400 to-blue-600 h-8 rounded-lg transition-all duration-700 flex items-center justify-end pr-2"
                  style={{
                    width: `${
                      (applications.filter(
                        (a) =>
                          (a.authenticityScore?.authentic || 0) >= 60 &&
                          (a.authenticityScore?.authentic || 0) < 80
                      ).length /
                        Math.max(applications.length, 1)) *
                      100
                    }%`,
                  }}
                >
                  <span className="text-white text-xs font-bold">
                    {Math.round(
                      (applications.filter(
                        (a) =>
                          (a.authenticityScore?.authentic || 0) >= 60 &&
                          (a.authenticityScore?.authentic || 0) < 80
                      ).length /
                        Math.max(applications.length, 1)) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Low (&lt;60%)
                </span>
                <span className="text-lg font-bold text-red-600">
                  {
                    applications.filter(
                      (a) =>
                        a.authenticityScore &&
                        (a.authenticityScore?.authentic || 0) < 60
                    ).length
                  }
                </span>
              </div>
              <div className="relative w-full bg-gray-200 rounded-lg h-8">
                <div
                  className="absolute top-0 left-0 bg-gradient-to-r from-red-400 to-red-600 h-8 rounded-lg transition-all duration-700 flex items-center justify-end pr-2"
                  style={{
                    width: `${
                      (applications.filter(
                        (a) =>
                          a.authenticityScore &&
                          (a.authenticityScore?.authentic || 0) < 60
                      ).length /
                        Math.max(applications.length, 1)) *
                      100
                    }%`,
                  }}
                >
                  <span className="text-white text-xs font-bold">
                    {Math.round(
                      (applications.filter(
                        (a) =>
                          a.authenticityScore &&
                          (a.authenticityScore?.authentic || 0) < 60
                      ).length /
                        Math.max(applications.length, 1)) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Avg Authenticity:{" "}
              <span className="font-semibold">
                {avgAuthenticity ? `${avgAuthenticity}%` : "N/A"}
              </span>
            </p>
          </div>
        </div>

        {/* Validation Progress - Radial Progress */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">
              Validation Progress
            </h3>
          </div>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#10B981"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${
                    2 *
                    Math.PI *
                    70 *
                    (applications.length > 0
                      ? applications.filter(
                          (a) => a.validationStatus === "completed"
                        ).length / applications.length
                      : 0)
                  } ${2 * Math.PI * 70}`}
                  className="transition-all duration-1000"
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">
                  {applications.length > 0
                    ? Math.round(
                        (applications.filter(
                          (a) => a.validationStatus === "completed"
                        ).length /
                          applications.length) *
                          100
                      )
                    : 0}
                  %
                </span>
                <span className="text-xs text-gray-500 mt-1">Complete</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700">
                  Completed
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {
                  applications.filter((a) => a.validationStatus === "completed")
                    .length
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-700">
                  In Progress
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {
                  applications.filter(
                    (a) => a.validationStatus === "in-progress"
                  ).length
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm font-medium text-gray-700">
                  Pending
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {
                  applications.filter((a) => a.validationStatus === "pending")
                    .length
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
