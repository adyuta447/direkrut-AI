import { useState } from 'react';
import { Users, FileText, TrendingUp, Target, LogOut, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CandidateTable from './hrd/CandidateTable';
import CandidateDetail from './hrd/CandidateDetail';
import CrossRoleRecommendation from './hrd/CrossRoleRecommendation';
import GapAnalysis from './hrd/GapAnalysis';

type HRDView = 'dashboard' | 'detail' | 'cross-role' | 'gap-analysis';

export default function HRDDashboard() {
  const { currentUser, setCurrentUser, setCurrentPage } = useApp();
  const [activeView, setActiveView] = useState<HRDView>('dashboard');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const handleViewCandidate = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    setActiveView('detail');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TalentAI</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">HRD Portal</p>
            <p className="font-semibold text-gray-900">{currentUser?.name}</p>
          </div>
        </div>

        <nav className="p-4">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
              activeView === 'dashboard'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Candidate Dashboard</span>
          </button>

          <button
            onClick={() => setActiveView('detail')}
            disabled={!selectedCandidateId}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
              activeView === 'detail'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Candidate Detail</span>
          </button>

          <button
            onClick={() => setActiveView('cross-role')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
              activeView === 'cross-role'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Target className="w-5 h-5" />
            <span className="font-medium">Cross-Role Match</span>
          </button>

          <button
            onClick={() => setActiveView('gap-analysis')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
              activeView === 'gap-analysis'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Gap & Growth</span>
          </button>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {activeView === 'dashboard' && <CandidateTable onViewCandidate={handleViewCandidate} />}
        {activeView === 'detail' && selectedCandidateId && (
          <CandidateDetail candidateId={selectedCandidateId} />
        )}
        {activeView === 'cross-role' && <CrossRoleRecommendation />}
        {activeView === 'gap-analysis' && <GapAnalysis />}
      </main>
    </div>
  );
}
