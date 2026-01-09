import { useState } from 'react';
import { FileText, MessageSquare, CheckCircle, Upload, LogOut, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ApplyPage from './applicant/ApplyPage';
import ValidationChat from './applicant/ValidationChat';
import SubmissionComplete from './applicant/SubmissionComplete';

type ApplicantView = 'apply' | 'validation' | 'complete';

export default function ApplicantDashboard() {
  const { currentUser, setCurrentUser, setCurrentPage } = useApp();
  const [activeView, setActiveView] = useState<ApplicantView>('apply');

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
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
            <p className="text-sm text-gray-500">Welcome back,</p>
            <p className="font-semibold text-gray-900">{currentUser?.name}</p>
          </div>
        </div>

        <nav className="p-4">
          <button
            onClick={() => setActiveView('apply')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
              activeView === 'apply'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Upload className="w-5 h-5" />
            <span className="font-medium">Apply & Upload CV</span>
          </button>

          <button
            onClick={() => setActiveView('validation')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
              activeView === 'validation'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">AI Skill Validation</span>
          </button>

          <button
            onClick={() => setActiveView('complete')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
              activeView === 'complete'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Submission Status</span>
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
        {activeView === 'apply' && <ApplyPage onNext={() => setActiveView('validation')} />}
        {activeView === 'validation' && <ValidationChat onComplete={() => setActiveView('complete')} />}
        {activeView === 'complete' && <SubmissionComplete />}
      </main>
    </div>
  );
}
