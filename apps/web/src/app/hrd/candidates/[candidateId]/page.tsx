"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useApp } from "../../../../context/AppContext";
import { HrdSchedulingModal } from "../../../../components/organisms/hrd/HrdSchedulingModal";
import { CandidateHeroCard } from "../../../../components/organisms/hrd/CandidateHeroCard";
import { CandidateInterviewActions } from "../../../../components/organisms/hrd/CandidateInterviewActions";
import { CandidateExperienceSummary } from "../../../../components/molecules/hrd/CandidateExperienceSummary";
import { CandidateCvSummary } from "../../../../components/molecules/hrd/CandidateCvSummary";
import { CandidateValidationLog } from "../../../../components/molecules/hrd/CandidateValidationLog";
import { CandidateDecisionButtons } from "../../../../components/molecules/hrd/CandidateDecisionButtons";

export default function CandidateDetailPage() {
  const router = useRouter();
  const { candidateId } = useParams<{ candidateId: string }>();
  const { applications } = useApp();
  const [showScheduling, setShowScheduling] = useState(false);
  const [showMatchDetails, setShowMatchDetails] = useState(false);

  const candidate = applications.find((app) => app.id === candidateId);

  if (!candidate) {
    return <div className="p-8 text-ink-muted text-[14px]">Kandidat tidak ditemukan.</div>;
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {showScheduling && (
        <HrdSchedulingModal candidateName={candidate.applicantName} onClose={() => setShowScheduling(false)} />
      )}

      {/* Back */}
      <button
        onClick={() => router.push("/hrd")}
        className="flex items-center gap-2 text-[14px] text-ink hover:underline transition-none mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Manajemen Pelamar
      </button>

      <CandidateHeroCard
        candidate={candidate}
        showMatchDetails={showMatchDetails}
        onToggleMatchDetails={() => setShowMatchDetails((v) => !v)}
      />

      <CandidateInterviewActions
        onStartAiInterview={() => router.push(`/hrd/candidates/${candidateId}/interview`)}
        onScheduleManual={() => setShowScheduling(true)}
      />

      <CandidateExperienceSummary jobTitle={candidate.jobTitle} />

      <CandidateCvSummary cvSummary={candidate.cvSummary} />

      <CandidateValidationLog responses={candidate.validationResponses || []} />

      <CandidateDecisionButtons
        onInvite={() => router.push(`/hrd/candidates/${candidateId}/decision/invite`)}
        onReject={() => router.push(`/hrd/candidates/${candidateId}/decision/reject`)}
      />
    </div>
  );
}
