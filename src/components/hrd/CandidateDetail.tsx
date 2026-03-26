import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
  Video,
  Calendar,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import DecisionPanel from "./DecisionPanel";
import HRDSchedulingModal from "./HRDSchedulingModal";
import AIInterviewSimulation from "./AIInterviewSimulation";

interface CandidateDetailProps {
  candidateId: string;
}

export default function CandidateDetail({ candidateId }: CandidateDetailProps) {
  const { applications } = useApp();
  const [showDecisionPanel, setShowDecisionPanel] = useState(false);
  const [decision, setDecision] = useState<"invite" | "reject" | null>(null);
  const [showScheduling, setShowScheduling] = useState(false);
  const [showAIInterview, setShowAIInterview] = useState(false);

  const candidate = applications.find((app) => app.id === candidateId);

  if (!candidate) {
    return (
      <div className="p-8 text-zinc-500 dark:text-zinc-400 text-sm">
        Candidate not found.
      </div>
    );
  }

  const handleDecision = (type: "invite" | "reject") => {
    setDecision(type);
    setShowDecisionPanel(true);
  };

  if (showDecisionPanel && decision) {
    return (
      <DecisionPanel
        candidate={candidate}
        decision={decision}
        onBack={() => setShowDecisionPanel(false)}
      />
    );
  }

  if (showAIInterview) {
    return (
      <AIInterviewSimulation
        candidate={candidate}
        onClose={() => setShowAIInterview(false)}
      />
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-4">
      {showScheduling && (
        <HRDSchedulingModal
          candidateName={candidate.applicantName}
          onClose={() => setShowScheduling(false)}
        />
      )}

      {/* Back */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Hero card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 font-bold text-xl flex-shrink-0">
              {candidate.applicantName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">
                {candidate.applicantName}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                {candidate.jobTitle}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-zinc-400 dark:text-zinc-500">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {candidate.applicantId}@example.com
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  +62 812-3456-7890
                </span>
                {candidate.resumeLink && (
                  <a
                    href={candidate.resumeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View CV
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-zinc-400 mb-1">Match Score</p>
            <p className="text-5xl font-bold tracking-tight">
              {candidate.recommendationScore || "--"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3">
            <p className="text-xs text-zinc-400 mb-1">Status</p>
            <p className="text-sm font-semibold capitalize">{candidate.status.replace("-", " ")}</p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3">
            <p className="text-xs text-zinc-400 mb-1">Applied</p>
            <p className="text-sm font-semibold">{candidate.appliedDate}</p>
          </div>
        </div>
      </div>

      {/* AI Interview + Manual Schedule Actions */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
          Interview Actions
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={() => setShowAIInterview(true)}
            className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
              <Video className="w-4 h-4 text-zinc-500" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI Interview Simulation</p>
              <p className="text-xs text-zinc-400 mt-0.5">Preview how the AI will interview this candidate</p>
            </div>
          </button>
          <button
            onClick={() => setShowScheduling(true)}
            className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
              <Calendar className="w-4 h-4 text-zinc-500" />
            </div>
            <div>
              <p className="text-sm font-semibold">Schedule Manual Interview</p>
              <p className="text-xs text-zinc-400 mt-0.5">Book a technical or HR interview slot</p>
            </div>
          </button>
        </div>
      </div>

      {/* CV Summary */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
          CV Summary
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {candidate.cvSummary || "No summary available."}
        </p>
      </div>

      {/* Authenticity Analysis */}
      {candidate.authenticityScore && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
            Authenticity Analysis
          </p>
          <div className="space-y-4">
            {[
              { label: "Authentic Content", value: candidate.authenticityScore.authentic },
              { label: "Generic Responses", value: candidate.authenticityScore.generic },
              { label: "AI-Generated Content", value: candidate.authenticityScore.aiGenerated },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-sm font-bold tabular-nums">{value}%</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5">
                  <div
                    className="bg-zinc-900 dark:bg-white h-1.5 rounded-full transition-all"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
            <p className="text-xs font-semibold mb-1">Analysis</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              This candidate shows{" "}
              {candidate.authenticityScore.authentic >= 80
                ? "high authenticity"
                : candidate.authenticityScore.authentic >= 60
                ? "moderate authenticity"
                : "low authenticity"}{" "}
              in their responses. Content appears{" "}
              {candidate.authenticityScore.aiGenerated < 15
                ? "genuine and personally crafted."
                : "potentially AI-assisted."}
            </p>
          </div>
        </div>
      )}

      {/* Validation Log */}
      {candidate.validationResponses && candidate.validationResponses.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
            Validation Log
          </p>
          <div className="space-y-3">
            {candidate.validationResponses.map((response, idx) => (
              <div key={idx} className="border border-zinc-100 dark:border-zinc-800 rounded-xl p-4">
                <p className="text-xs font-semibold text-zinc-400 mb-2">
                  Q{idx + 1}: {response.question}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                  {response.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Decision Panel */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-1">
          Decision
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          Review the candidate and take action.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleDecision("invite")}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            Invite to Interview
          </button>
          <button
            onClick={() => handleDecision("reject")}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <XCircle className="w-4 h-4 text-zinc-400" />
            Reject Application
          </button>
        </div>
      </div>
    </div>
  );
}
