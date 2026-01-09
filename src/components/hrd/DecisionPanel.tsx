import { useState } from 'react';
import { ArrowLeft, Send, Calendar, Clock } from 'lucide-react';
import { Application } from '../../types';
import { useApp } from '../../context/AppContext';

interface DecisionPanelProps {
  candidate: Application;
  decision: 'invite' | 'reject';
  onBack: () => void;
}

export default function DecisionPanel({ candidate, decision, onBack }: DecisionPanelProps) {
  const { updateApplication } = useApp();
  const [emailSubject, setEmailSubject] = useState(
    decision === 'invite'
      ? `Interview Invitation - ${candidate.jobTitle} Position`
      : `Application Update - ${candidate.jobTitle} Position`
  );
  const [emailBody, setEmailBody] = useState(
    decision === 'invite'
      ? `Dear ${candidate.applicantName},\n\nWe are pleased to inform you that your application for the ${candidate.jobTitle} position has been reviewed and we would like to invite you for an interview.\n\nPlease let us know your availability for the interview in the coming week.\n\nWe look forward to meeting you.\n\nBest regards,\nHR Team`
      : `Dear ${candidate.applicantName},\n\nThank you for your interest in the ${candidate.jobTitle} position and for taking the time to apply.\n\nAfter careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.\n\nWe encourage you to apply for future openings that match your skills and experience. Based on your profile, you might be a good fit for:\n- Similar roles in different departments\n- Entry-level positions to gain more experience\n\nWe wish you all the best in your job search.\n\nBest regards,\nHR Team`
  );
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewType, setInterviewType] = useState<'technical' | 'hr'>('hr');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSend = () => {
    updateApplication(candidate.id, {
      status: decision === 'invite' ? 'interview' : 'rejected'
    });
    setShowConfirmation(true);
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  if (showConfirmation) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="bg-white rounded-lg shadow-xl p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Sent Successfully!</h2>
          <p className="text-gray-600">
            The candidate has been notified of your decision.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Candidate Detail</span>
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {decision === 'invite' ? 'Interview Invitation' : 'Application Rejection'}
        </h1>
        <p className="text-gray-600">
          {decision === 'invite'
            ? 'Prepare and send interview invitation to the candidate'
            : 'Send rejection notice with career suggestions'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {decision === 'invite' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Interview Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setInterviewType('hr')}
                      className={`py-2 px-4 rounded-lg border-2 font-semibold transition ${
                        interviewType === 'hr'
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      HR Interview
                    </button>
                    <button
                      type="button"
                      onClick={() => setInterviewType('technical')}
                      className={`py-2 px-4 rounded-lg border-2 font-semibold transition ${
                        interviewType === 'technical'
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      Technical
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Interview Date
                  </label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Interview Time
                  </label>
                  <input
                    type="time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Candidate Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-gray-900">{candidate.applicantName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Position</p>
                <p className="font-semibold text-gray-900">{candidate.jobTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Match Score</p>
                <p className="font-semibold text-blue-600 text-2xl">
                  {candidate.recommendationScore || '--'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Email Preview</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Body
              </label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {decision === 'invite' && interviewDate && interviewTime && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900 font-semibold mb-1">Interview Schedule</p>
                <p className="text-blue-700">
                  <strong>Type:</strong> {interviewType === 'hr' ? 'HR Interview' : 'Technical Interview'}
                </p>
                <p className="text-blue-700">
                  <strong>Date:</strong> {new Date(interviewDate).toLocaleDateString()}
                </p>
                <p className="text-blue-700">
                  <strong>Time:</strong> {interviewTime}
                </p>
              </div>
            )}

            <button
              onClick={handleSend}
              className={`w-full py-3 rounded-lg font-semibold text-white transition flex items-center justify-center space-x-2 ${
                decision === 'invite'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              <Send className="w-5 h-5" />
              <span>Confirm & Send Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
