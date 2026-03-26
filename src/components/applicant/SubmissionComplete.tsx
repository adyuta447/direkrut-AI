import { useState } from "react";
import { CheckCircle, Clock, FileText, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import AIInterviewPage from "./AIInterviewPage";
import SchedulingModal from "./SchedulingModal";

export default function SubmissionComplete() {
  const { currentUser, applications } = useApp();
  const [aiInterviewOpen, setAiInterviewOpen] = useState(false);
  const [schedulingOpen, setSchedulingOpen] = useState(false);

  const userApplications = applications.filter(
    (app) => app.applicantId === currentUser?.id
  );
  const hasInterviewStatus = userApplications.some((app) => app.status === "interview");

  if (aiInterviewOpen) {
    return <AIInterviewPage onClose={() => setAiInterviewOpen(false)} />;
  }

  return (
    <div className="min-h-full p-6 lg:p-8">
      {schedulingOpen && (
        <SchedulingModal onClose={() => setSchedulingOpen(false)} />
      )}

      {userApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-64 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-14 text-center">
          <FileText className="w-10 h-10 text-zinc-200 dark:text-zinc-700 mx-auto mb-3" />
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No applications yet</p>
          <p className="text-xs text-zinc-400 mt-1">Apply for a position to get started</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {/* AI Interview CTA — full-width, shown when shortlisted */}
          {hasInterviewStatus && (
            <div className="bg-zinc-900 dark:bg-white rounded-xl p-6 text-white dark:text-zinc-900">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-white/10 dark:bg-zinc-900/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-xs">AI</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">AI Interview Ready</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500">First-round interview — ~20-30 min</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-300 dark:text-zinc-600 leading-relaxed max-w-lg">
                    You've been shortlisted. Complete the AI interview below before your team interview.
                    It covers role-specific technical and behavioral questions.
                  </p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => setAiInterviewOpen(true)}
                    className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity whitespace-nowrap"
                  >
                    Start Interview
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSchedulingOpen(true)}
                    className="inline-flex items-center justify-center gap-2 border border-zinc-700 dark:border-zinc-300 text-zinc-400 dark:text-zinc-600 px-5 py-2.5 rounded-xl text-xs font-medium hover:bg-white/5 dark:hover:bg-zinc-900/5 transition-colors"
                  >
                    Schedule Technical
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Application cards */}
          {userApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-sm">{app.jobTitle}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Applied {app.appliedDate}</p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  {app.status === "interview"
                    ? "Interview Stage"
                    : app.status === "under-review"
                    ? "Under Review"
                    : app.status === "rejected"
                    ? "Not Selected"
                    : "Submitted"}
                </span>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3.5">
                  <p className="text-xs text-zinc-400 mb-2">Validation</p>
                  <div className="flex items-center gap-2">
                    {app.validationStatus === "completed" ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-zinc-500" />
                        <span className="text-sm font-semibold">Completed</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-zinc-400" />
                        <span className="text-sm font-semibold">Pending</span>
                      </>
                    )}
                  </div>
                </div>

                {app.recommendationScore && (
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3.5">
                    <p className="text-xs text-zinc-400 mb-2">Match Score</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5">
                        <div
                          className="bg-zinc-900 dark:bg-white h-1.5 rounded-full"
                          style={{ width: `${app.recommendationScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold tabular-nums">
                        {app.recommendationScore}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status note */}
              {(app.status === "interview" || app.status === "under-review") && (
                <div className="mt-3 p-3.5 border border-zinc-100 dark:border-zinc-700/50 rounded-xl">
                  <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-0.5">
                    {app.status === "interview" ? "Action Required" : "In Progress"}
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {app.status === "interview"
                      ? "Complete the AI interview above, then the team will reach out about your final interview."
                      : "Your application is under review. We'll notify you of any updates via email."}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
