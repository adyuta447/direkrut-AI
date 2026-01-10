import { TrendingUp, Target, BookOpen, Award } from "lucide-react";
import { useState } from "react";
import { useApp } from "../../context/AppContext";

interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  priority: "high" | "medium" | "low";
}

export default function GapAnalysis() {
  const { applications } = useApp();
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [analysis, setAnalysis] = useState<{
    gaps: SkillGap[];
    growthProjection: string;
    recommendations: string[];
  } | null>(null);

  const handleAnalyze = () => {
    if (!selectedCandidate) return;

    const mockGaps: SkillGap[] = [
      {
        skill: "React Advanced Patterns",
        currentLevel: 60,
        requiredLevel: 85,
        priority: "high",
      },
      {
        skill: "TypeScript",
        currentLevel: 70,
        requiredLevel: 90,
        priority: "high",
      },
      {
        skill: "Testing & TDD",
        currentLevel: 50,
        requiredLevel: 80,
        priority: "medium",
      },
      {
        skill: "Performance Optimization",
        currentLevel: 55,
        requiredLevel: 75,
        priority: "medium",
      },
      {
        skill: "System Design",
        currentLevel: 40,
        requiredLevel: 70,
        priority: "low",
      },
    ];

    const mockProjection =
      "With focused training and mentorship, this candidate can reach the required proficiency level in 3-6 months. " +
      "High priority gaps should be addressed within the first 2 months through structured learning programs. " +
      "The candidate shows strong foundational knowledge and demonstrates good learning ability based on their validation responses.";

    const mockRecommendations = [
      "Enroll in advanced React patterns course (Udemy, Frontend Masters)",
      "Pair programming sessions with senior developers",
      "Weekly code review participation to improve code quality",
      "Complete TypeScript deep dive certification",
      "Assign mentor for system design guidance",
    ];

    setAnalysis({
      gaps: mockGaps,
      growthProjection: mockProjection,
      recommendations: mockRecommendations,
    });
  };

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Select Candidate for Analysis
        </h2>

        <div className="flex space-x-4">
          <div className="flex-1">
            <select
              value={selectedCandidate}
              onChange={(e) => setSelectedCandidate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a candidate...</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.applicantName} - {app.jobTitle} (Score:{" "}
                  {app.recommendationScore || "N/A"})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selectedCandidate}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Target className="w-5 h-5" />
            <span>Analyze Gaps</span>
          </button>
        </div>
      </div>

      {analysis && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Target className="w-6 h-6 mr-2 text-blue-600" />
              Skill Gap Analysis
            </h2>

            <div className="space-y-4">
              {analysis.gaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {gap.skill}
                      </h3>
                      <span
                        className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          gap.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : gap.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {gap.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {gap.requiredLevel - gap.currentLevel}
                        <span className="text-sm text-gray-500 font-normal">
                          {" "}
                          pt gap
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Current Level</span>
                        <span className="font-semibold text-blue-600">
                          {gap.currentLevel}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${gap.currentLevel}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Required Level</span>
                        <span className="font-semibold text-green-600">
                          {gap.requiredLevel}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${gap.requiredLevel}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
              Growth Projection
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-green-900 leading-relaxed">
                {analysis.growthProjection}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
              Development Recommendations
            </h2>
            <div className="space-y-3">
              {analysis.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg"
                >
                  <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-900">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Action Plan
            </h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
                Generate Training Plan
              </button>
              <button className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition font-semibold">
                Share with Candidate
              </button>
              <button className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-semibold">
                Export Report
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCandidate && !analysis && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Click "Analyze Gaps" to see detailed skill gap analysis
          </p>
        </div>
      )}
    </div>
  );
}
