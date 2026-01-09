import { Briefcase, Users, Zap, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const { setCurrentPage } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TalentAI</span>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => setCurrentPage('jobs')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Browse Jobs
              </button>
              <button
                onClick={() => setCurrentPage('auth')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart Hiring with
            <span className="text-blue-600"> AI-Powered</span> Validation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Transform your recruitment process with intelligent CV analysis, automated skill validation,
            and data-driven candidate recommendations. Save time, reduce bias, and find the perfect fit.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setCurrentPage('auth')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              Apply as Candidate
            </button>
            <button
              onClick={() => setCurrentPage('auth')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-lg border-2 border-blue-600"
            >
              Login as HRD
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Skill Validation</h3>
            <p className="text-gray-600">
              Automatically validate candidate skills through intelligent conversational analysis,
              going beyond what's written on the CV.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Matching</h3>
            <p className="text-gray-600">
              Get recommendation scores and cross-role suggestions based on comprehensive
              candidate analysis and skill assessment.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Authenticity Check</h3>
            <p className="text-gray-600">
              Detect generic or AI-generated responses to ensure you're evaluating
              genuine candidate capabilities and experience.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Opportunities
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900">Frontend Developer</h3>
                <span className="text-sm text-blue-600 font-semibold">Full-time</span>
              </div>
              <p className="text-gray-600 mb-2">Tech Innovators Inc</p>
              <p className="text-gray-500 text-sm">Jakarta • Posted 2 days ago</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-900">Backend Engineer</h3>
                <span className="text-sm text-blue-600 font-semibold">Full-time</span>
              </div>
              <p className="text-gray-600 mb-2">Cloud Solutions Ltd</p>
              <p className="text-gray-500 text-sm">Bandung • Posted 5 days ago</p>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={() => setCurrentPage('jobs')}
              className="text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              View All Jobs →
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 TalentAI. Revolutionizing recruitment with AI.</p>
        </div>
      </footer>
    </div>
  );
}
