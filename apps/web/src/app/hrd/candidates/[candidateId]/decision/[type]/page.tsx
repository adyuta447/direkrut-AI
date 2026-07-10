"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useApp } from "../../../../../../context/AppContext";
import { Application } from "../../../../../../types";
import { useDecisionPanel, DecisionType } from "../../../../../../lib/hrd/useDecisionPanel";
import { DecisionCandidateInfo } from "../../../../../../components/molecules/hrd/DecisionCandidateInfo";
import { DecisionInterviewDetailsForm } from "../../../../../../components/molecules/hrd/DecisionInterviewDetailsForm";
import { DecisionEmailEditor } from "../../../../../../components/organisms/hrd/DecisionEmailEditor";
import { DecisionConfirmationScreen } from "../../../../../../components/molecules/hrd/DecisionConfirmationScreen";

function DecisionPanelView({ candidate, decision }: { candidate: Application; decision: DecisionType }) {
  const router = useRouter();
  const d = useDecisionPanel(candidate, decision);

  if (d.showConfirmation) {
    return <DecisionConfirmationScreen candidateName={candidate.applicantName} />;
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6 font-sans">
      <button
        onClick={() => router.push(`/hrd/candidates/${candidate.id}`)}
        className="flex items-center gap-1.5 text-[14px] text-ink hover:underline transition-none mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Detail Kandidat
      </button>

      <div>
        <p className="text-[12px] font-semibold uppercase tracking-widest text-ink-muted mb-2">Tindakan HRD</p>
        <h1 className="text-[32px] font-light text-ink mb-1">{decision === "invite" ? "Undang ke Wawancara" : "Tolak Lamaran"}</h1>
        <p className="text-[14px] text-ink-muted">
          {decision === "invite"
            ? "Siapkan dan kirimkan undangan wawancara kepada kandidat."
            : "Kirimkan pemberitahuan penolakan yang bermartabat dan berbasis data profil kandidat."}
        </p>
      </div>

      {/* REVISI 10: Info panel untuk rejection */}
      {decision === "reject" && (
        <div className="flex items-start gap-3 p-4 bg-[#fcf0d3] border border-[#f1c21b]">
          <AlertCircle className="w-5 h-5 text-[#f1c21b] flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-ink leading-[1.5]">
            <span className="font-semibold">Feedback Bermartabat:</span> Email penolakan ini telah diisi secara otomatis oleh AI berdasarkan profil keahlian dan hasil wawancara kandidat, sehingga bersifat personal dan berbasis data — bukan pemberitahuan generik.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <DecisionCandidateInfo candidate={candidate} />

          {decision === "invite" && (
            <DecisionInterviewDetailsForm
              interviewType={d.interviewType}
              onInterviewTypeChange={d.setInterviewType}
              interviewDate={d.interviewDate}
              onInterviewDateChange={d.setInterviewDate}
              interviewTime={d.interviewTime}
              onInterviewTimeChange={d.setInterviewTime}
            />
          )}
        </div>

        <DecisionEmailEditor
          decision={decision}
          emailSubject={d.emailSubject}
          onSubjectChange={d.setEmailSubject}
          emailBody={d.emailBody}
          onBodyChange={d.setEmailBody}
          interviewDate={d.interviewDate}
          interviewTime={d.interviewTime}
          interviewType={d.interviewType}
          onSend={d.handleSend}
        />
      </div>
    </div>
  );
}

export default function DecisionPage() {
  const { candidateId, type } = useParams<{ candidateId: string; type: string }>();
  const { applications } = useApp();
  const candidate = applications.find((app) => app.id === candidateId);
  const decision: DecisionType | null = type === "invite" || type === "reject" ? type : null;

  if (!candidate || !decision) {
    return <div className="p-8 text-ink-muted text-[14px]">Data tidak ditemukan.</div>;
  }

  return <DecisionPanelView candidate={candidate} decision={decision} />;
}
