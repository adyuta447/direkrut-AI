import { Search, TrendingUp, Users, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { mockJobs } from '../../mockData';

export default function CrossRoleRecommendation() {
  const { applications } = useApp();
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [recommendations, setRecommendations] = useState<Array<{
    role: string;
    matchScore: number;
    reason: string;
  }>>([]);

  const handleSearch = () => {
    if (!selectedCandidate) return;

    const candidate = applications.find((app) => app.id === selectedCandidate);
    if (!candidate) return;

    const currentScore = candidate.recommendationScore || 75;

    const crossRoleMatches = mockJobs
      .filter((job) => job.id !== candidate.jobId)
      .map((job) => {
        const variance = Math.floor(Math.random() * 30) - 15;
        const score = Math.min(95, Math.max(50, currentScore + variance));

        let reason = '';
        if (score >= 85) {
          reason = `Strong transferable skills and experience align well with ${job.title} requirements.`;
        } else if (score >= 70) {
          reason = `Good foundational skills that could be adapted for ${job.title} with minimal training.`;
        } else {
          reason = `Some relevant skills present, but would require significant upskilling for ${job.title}.`;
        }

        return {
          role: `${job.title} at ${job.company}`,
          matchScore: score,
          reason
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);

    setRecommendations(crossRoleMatches);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cross-Role Recommendation</h1>
        <p className="text-gray-600">
          Find alternative role matches for candidates using AI-powered analysis
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Search for Recommendations</h2>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Candidate
            </label>
            <select
              value={selectedCandidate}
              onChange={(e) => setSelectedCandidate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a candidate...</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.applicantName} - Applied for {app.jobTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={!selectedCandidate}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Find Matches</span>
            </button>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              AI-Recommended Alternative Roles
            </h2>
          </div>

          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {idx + 1}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">{rec.role}</h3>
                  </div>
                  <p className="text-gray-600 ml-11">{rec.reason}</p>
                </div>

                <div className="text-right ml-4">
                  <p className="text-sm text-gray-500 mb-1">Match Score</p>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`text-3xl font-bold ${
                        rec.matchScore >= 85
                          ? 'text-green-600'
                          : rec.matchScore >= 70
                          ? 'text-blue-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {rec.matchScore}
                    </div>
                    {rec.matchScore >= 85 && (
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                  Suggest to Candidate
                </button>
              </div>
            </div>
          ))}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-blue-900 font-semibold mb-1">AI Analysis Summary</p>
                <p className="text-blue-700">
                  Based on the candidate's CV, skills, and validation responses, we've
                  identified {recommendations.length} alternative roles where their
                  transferable skills could be valuable. Consider reaching out to discuss
                  these opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedCandidate && recommendations.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Click "Find Matches" to see cross-role recommendations
          </p>
        </div>
      )}
    </div>
  );
}
