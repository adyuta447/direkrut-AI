import { useState } from "react";
import { Clock, FileText, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import AIInterviewPage from "./AIInterviewPage";
import SchedulingModal from "./SchedulingModal";

export default function SubmissionComplete() {
  const { currentUser, applications } = useApp();
  const [aiInterviewOpen, setAiInterviewOpen] = useState(false);
  const [schedulingOpen, setSchedulingOpen] = useState(false);

  const userApplications = applications.filter(
    (app) => app.applicantId === currentUser?.id,
  );
  const hasInterviewStatus = userApplications.some(
    (app) => app.status === "interview",
  );

  if (aiInterviewOpen) {
    return <AIInterviewPage onClose={() => setAiInterviewOpen(false)} />;
  }

  return (
    <div className="min-h-full px-6 py-10 md:px-12 lg:px-16 xl:px-24 font-sans bg-white dark:bg-[#0a0a0a]">
      {schedulingOpen && (
        <SchedulingModal onClose={() => setSchedulingOpen(false)} />
      )}

      <div className="max-w-[1600px] mx-auto w-full">
        <div className="mb-10 lg:mb-16">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white mb-4">
            Status Board
          </h1>
          <p className="text-[13px] text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
            Track and manage your application progress. Actionable steps will
            appear here when required.
          </p>
        </div>

        {userApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-transparent border border-zinc-200/60 dark:border-zinc-800/60 rounded-[2rem] p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
            </div>
            <p className="text-[12px] font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-3">
              No Applications Found
            </p>
            <p className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
              Initiate an application to begin
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* AI Interview CTA — Brutalist Dark Block */}
            {hasInterviewStatus && (
              <div className="bg-zinc-900 dark:bg-white rounded-[2rem] p-8 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 rounded-full bg-white dark:bg-zinc-900 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-100 dark:text-zinc-900">
                      Action Required
                    </span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-black text-white dark:text-zinc-900 tracking-tighter mb-4">
                    AI Interview Ready
                  </h2>
                  <p className="text-[13px] text-zinc-400 dark:text-zinc-500 leading-relaxed max-w-xl">
                    You've been shortlisted. Complete the AI interview below
                    before your team interview. It covers role-specific
                    technical and behavioral questions.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0 w-full lg:w-auto">
                  <button
                    onClick={() => setAiInterviewOpen(true)}
                    className="group inline-flex items-center justify-center gap-3 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white px-8 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest hover:opacity-80 transition-all duration-300"
                  >
                    Start Session
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => setSchedulingOpen(true)}
                    className="inline-flex items-center justify-center gap-3 bg-transparent border border-zinc-700 dark:border-zinc-300 text-zinc-300 dark:text-zinc-700 px-8 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                  >
                    Schedule Technical
                  </button>
                </div>
              </div>
            )}

            {/* Application List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-transparent border border-zinc-200/60 dark:border-zinc-800/60 rounded-[2rem] p-8 flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
                        {app.jobTitle}
                      </h3>
                      <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                        Applied {app.appliedDate}
                      </p>
                    </div>
                    <span className="text-[9px] font-bold px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">
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
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 flex flex-col justify-center">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
                        Validation
                      </p>
                      <div className="flex items-center gap-3">
                        {app.validationStatus === "completed" ? (
                          <>
                            <img
                              src="/public/success.svg"
                              alt="Success"
                              className="w-5 h-5"
                            />
                            <span className="text-[13px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                              Completed
                            </span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-5 h-5 text-zinc-400" />
                            <span className="text-[13px] font-bold text-zinc-400 uppercase tracking-wider">
                              Pending
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {app.recommendationScore !== undefined && (
                      <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                            Match Score
                          </p>
                          <span className="text-[13px] font-black text-zinc-900 dark:text-white">
                            {app.recommendationScore}%
                          </span>
                        </div>
                        <div className="w-full bg-zinc-200/50 dark:bg-zinc-800 rounded-full h-[3px]">
                          <div
                            className="bg-zinc-900 dark:bg-white h-[3px] rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${app.recommendationScore}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status note */}
                  {(app.status === "interview" ||
                    app.status === "under-review") && (
                    <div className="mt-auto bg-transparent border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            app.status === "interview"
                              ? "bg-zinc-900 dark:bg-white animate-pulse"
                              : "bg-zinc-300 dark:bg-zinc-700"
                          }`}
                        />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                          {app.status === "interview"
                            ? "Next Step"
                            : "Status Update"}
                        </p>
                      </div>
                      <p className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {app.status === "interview"
                          ? "Complete the AI interview above, then the team will reach out about your final interview."
                          : "Your application is currently under review. We'll notify you of any updates."}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
