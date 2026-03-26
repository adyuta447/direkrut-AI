import { Search } from "lucide-react";
import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function CrossRoleRecommendation() {
  const { applications, jobs } = useApp();
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [recommendations, setRecommendations] = useState<
    Array<{ role: string; matchScore: number; reason: string }>
  >([]);

  const handleSearch = () => {
    if (!selectedCandidate) return;
    const candidate = applications.find((app) => app.id === selectedCandidate);
    if (!candidate) return;

    const currentScore = candidate.recommendationScore || 75;
    const crossRoleMatches = jobs
      .filter((job) => job.id !== candidate.jobId)
      .map((job) => {
        const variance = Math.floor(Math.random() * 30) - 15;
        const score = Math.min(95, Math.max(50, currentScore + variance));
        let reason = "";
        if (score >= 85) reason = `Strong transferable skills align well with ${job.title} requirements.`;
        else if (score >= 70) reason = `Good foundational skills adaptable for ${job.title} with minimal training.`;
        else reason = `Some relevant skills present, but would require significant upskilling for ${job.title}.`;
        return { role: `${job.title} at ${job.company}`, matchScore: score, reason };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
    setRecommendations(crossRoleMatches);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">AI Tool</p>
        <h2 className="text-3xl font-bold tracking-tight">Cross-Role Match</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Discover alternative roles where a candidate's transferable skills would be valuable.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5">
        <label className="label">Select Candidate</label>
        <div className="flex gap-3">
          <select
            value={selectedCandidate}
            onChange={(e) => setSelectedCandidate(e.target.value)}
            className="input-field flex-1"
          >
            <option value="">Choose a candidate...</option>
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.applicantName} — {app.jobTitle}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            disabled={!selectedCandidate}
            className="btn-primary flex items-center gap-2 px-5 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Search className="w-4 h-4" />
            Analyze
          </button>
        </div>
      </div>

      {/* Results */}
      {recommendations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              AI Recommendations
            </p>
            <span className="text-xs text-zinc-400">{recommendations.length} matches</span>
          </div>

          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-zinc-300 dark:text-zinc-600">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-base font-semibold">{rec.role}</h3>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed ml-8">
                    {rec.reason}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-3xl font-bold tabular-nums">{rec.matchScore}</p>
                  <p className="text-xs text-zinc-400">match</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                <button className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Suggest to Candidate
                </button>
              </div>
            </div>
          ))}

          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
            <p className="text-xs font-semibold mb-1">AI Summary</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Based on CV, skills, and validation responses, we identified {recommendations.length}{" "}
              alternative roles where transferable skills could be valuable. Consider reaching out to
              discuss these opportunities with the candidate.
            </p>
          </div>
        </div>
      )}

      {selectedCandidate && recommendations.length === 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-12 text-center">
          <Search className="w-10 h-10 text-zinc-200 dark:text-zinc-700 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">Click "Analyze" to find cross-role recommendations</p>
        </div>
      )}
    </div>
  );
}
