import { useState } from 'react';
import { ArrowLeft, Send, Calendar, Clock, Check } from 'lucide-react';
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
      ? `Interview Invitation — ${candidate.jobTitle}`
      : `Application Update — ${candidate.jobTitle}`
  );
  const [emailBody, setEmailBody] = useState(
    decision === 'invite'
      ? `Dear ${candidate.applicantName},\n\nWe are pleased to inform you that your application for the ${candidate.jobTitle} position has been reviewed and we would like to invite you for an interview.\n\nPlease let us know your availability for the interview in the coming week.\n\nWe look forward to meeting you.\n\nBest regards,\nHR Team`
      : `Dear ${candidate.applicantName},\n\nThank you for your interest in the ${candidate.jobTitle} position.\n\nAfter careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.\n\nWe encourage you to apply for future openings that match your skills.\n\nBest regards,\nHR Team`
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
    setTimeout(() => { onBack(); }, 2500);
  };

  if (showConfirmation) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-12 text-center max-w-md">
          <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Check className="w-7 h-7 text-zinc-900 dark:text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">Email Sent</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {candidate.applicantName} has been notified.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Candidate
      </button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          {decision === 'invite' ? 'Invite to Interview' : 'Reject Application'}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {decision === 'invite'
            ? 'Prepare and send the interview invitation'
            : 'Send rejection notice with career suggestions'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Left */}
        <div className="space-y-4">
          {/* Candidate info */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">Candidate</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {candidate.applicantName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sm">{candidate.applicantName}</p>
                <p className="text-xs text-zinc-400">{candidate.jobTitle}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
              <p className="text-xs text-zinc-400">Match Score</p>
              <p className="text-2xl font-bold">{candidate.recommendationScore || '--'}</p>
            </div>
          </div>

          {/* Interview details (invite only) */}
          {decision === 'invite' && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Interview Details</p>
              <div className="space-y-4">
                <div>
                  <label className="label">Interview Type</label>
                  <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                    {(['hr', 'technical'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setInterviewType(t)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          interviewType === t
                            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white'
                            : 'text-zinc-500 dark:text-zinc-400'
                        }`}
                      >
                        {t === 'hr' ? 'HR Interview' : 'Technical'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Date</span>
                  </label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Time</span>
                  </label>
                  <input
                    type="time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Email editor */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Email Preview</p>
          <div className="space-y-4">
            <div>
              <label className="label">Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={10}
                className="input-field resize-none"
              />
            </div>

            {decision === 'invite' && interviewDate && interviewTime && (
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
                <p className="font-semibold text-zinc-700 dark:text-zinc-300">Interview Summary</p>
                <p>Type: {interviewType === 'hr' ? 'HR Interview' : 'Technical Interview'}</p>
                <p>Date: {new Date(interviewDate).toLocaleDateString()}</p>
                <p>Time: {interviewTime}</p>
              </div>
            )}

            <button
              onClick={handleSend}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-colors ${
                decision === 'invite'
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-80'
                  : 'border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              <Send className="w-4 h-4" />
              Confirm & Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
