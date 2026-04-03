import { Target, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useApp } from "../../context/AppContext";

interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  priority: "high" | "medium" | "low";
}

const PRIORITY_STYLE = {
  high: "text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800",
  medium: "text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800",
  low: "text-zinc-500 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800",
};

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
      { skill: "React Advanced Patterns", currentLevel: 60, requiredLevel: 85, priority: "high" },
      { skill: "TypeScript", currentLevel: 70, requiredLevel: 90, priority: "high" },
      { skill: "Testing & TDD", currentLevel: 50, requiredLevel: 80, priority: "medium" },
      { skill: "Performance Optimization", currentLevel: 55, requiredLevel: 75, priority: "medium" },
      { skill: "System Design", currentLevel: 40, requiredLevel: 70, priority: "low" },
    ];

    setAnalysis({
      gaps: mockGaps,
      growthProjection:
        "With focused training and mentorship, this candidate can reach required proficiency in 3–6 months. High priority gaps should be addressed within the first 2 months through structured learning. The candidate shows strong foundational knowledge and good learning ability.",
      recommendations: [
        "Enroll in advanced React patterns course (Frontend Masters)",
        "Pair programming sessions with senior developers",
        "Weekly code review participation",
        "Complete TypeScript deep dive certification",
        "Assign a mentor for system design guidance",
      ],
    });
  };

  return (
    <div className="p-4 lg:p-5 space-y-4">
      {/* Header */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">AI Tool</p>
        <h2 className="text-2xl font-bold tracking-tight">Gap & Growth Analysis</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          Identify skill gaps and build a development plan for any candidate.
        </p>
      </div>

      {/* Selector */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5">
        <label className="label">Select Candidate</label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <select
              value={selectedCandidate}
              onChange={(e) => setSelectedCandidate(e.target.value)}
              className="appearance-none input-field w-full pr-8"
            >
              <option value="">Choose a candidate...</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.applicantName} — {app.jobTitle} (Score: {app.recommendationScore || "N/A"})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!selectedCandidate}
            className="btn-primary flex items-center gap-2 px-5 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Target className="w-4 h-4" />
            Analyze
          </button>
        </div>
      </div>

      {/* Empty state */}
      {selectedCandidate && !analysis && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-12 text-center">
          <Target className="w-10 h-10 text-zinc-200 dark:text-zinc-700 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Click "Analyze" to see detailed skill gap analysis</p>
        </div>
      )}

      {/* Results */}
      {analysis && (
        <div className="space-y-4">
          {/* Skill Gaps */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
              Skill Gaps
            </p>
            <div className="space-y-5">
              {analysis.gaps.map((gap, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{gap.skill}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-lg ${PRIORITY_STYLE[gap.priority]}`}>
                        {gap.priority}
                      </span>
                    </div>
                    <span className="text-sm font-bold tabular-nums">
                      {gap.requiredLevel - gap.currentLevel}pt gap
                    </span>
                  </div>
                  <div className="relative h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                    <div
                      className="absolute left-0 top-0 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600 transition-all"
                      style={{ width: `${gap.requiredLevel}%` }}
                    />
                    <div
                      className="absolute left-0 top-0 h-2 rounded-full bg-zinc-900 dark:bg-white transition-all"
                      style={{ width: `${gap.currentLevel}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-xs text-zinc-400">
                    <span>Current: {gap.currentLevel}%</span>
                    <span>Required: {gap.requiredLevel}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Projection */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
              Growth Projection
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {analysis.growthProjection}
            </p>
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
              Development Recommendations
            </p>
            <div className="space-y-2">
              {analysis.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                  <span className="text-xs font-mono text-zinc-300 dark:text-zinc-600 mt-0.5">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Plan */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
              Action Plan
            </p>
            <div className="grid grid-cols-3 gap-3">
              {["Generate Training Plan", "Share with Candidate", "Export Report"].map((action) => (
                <button
                  key={action}
                  className="py-2.5 px-4 text-sm font-medium border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
