"use client";

import { useParams, useRouter } from "next/navigation";
import { useApp } from "../../../../../context/AppContext";
import { Application } from "../../../../../types";
import { useAiInterviewSimulation } from "../../../../../lib/hrd/useAiInterviewSimulation";
import { InterviewHeader } from "../../../../../components/organisms/hrd/InterviewHeader";
import { InterviewSuccessBanner } from "../../../../../components/molecules/hrd/InterviewSuccessBanner";
import { InterviewMessageList } from "../../../../../components/organisms/hrd/InterviewMessageList";
import { InterviewActionBar } from "../../../../../components/organisms/hrd/InterviewActionBar";

function InterviewSimulationView({ candidate }: { candidate: Application }) {
  const router = useRouter();
  const onClose = () => router.push(`/hrd/candidates/${candidate.id}`);
  const sim = useAiInterviewSimulation(candidate);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0a0a0a] font-sans">
      <InterviewHeader
        candidate={candidate}
        currentQuestion={sim.currentQuestion}
        totalQuestions={sim.questions.length}
        progress={sim.progress}
        isComplete={sim.isComplete}
        isAutoRunning={sim.isAutoRunning}
        onClose={onClose}
        onAutoRun={sim.handleAutoRun}
      />

      {sim.isComplete && <InterviewSuccessBanner />}

      <InterviewMessageList
        candidateName={candidate.applicantName}
        messages={sim.messages}
        isTyping={sim.isTyping}
        messagesEndRef={sim.messagesEndRef}
      />

      <InterviewActionBar
        isComplete={sim.isComplete}
        isAutoRunning={sim.isAutoRunning}
        isTyping={sim.isTyping}
        onClose={onClose}
        onSendNext={sim.simulateNextAnswer}
      />
    </div>
  );
}

export default function AiInterviewSimulationPage() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { applications } = useApp();
  const candidate = applications.find((app) => app.id === candidateId);

  if (!candidate) {
    return <div className="p-8 text-ink-muted text-[14px]">Kandidat tidak ditemukan.</div>;
  }

  return <InterviewSimulationView candidate={candidate} />;
}
