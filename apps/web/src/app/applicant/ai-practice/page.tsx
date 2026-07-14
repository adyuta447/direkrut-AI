"use client";

import { useApp } from "../../../context/AppContext";
import { useAiPracticeSimulation } from "../../../lib/applicant/useAiPracticeSimulation";
import { AiPracticeLobby } from "../../../components/organisms/applicant/AiPracticeLobby";
import { AiPracticeDone } from "../../../components/organisms/applicant/AiPracticeDone";
import { AiPracticeCallView } from "../../../components/organisms/applicant/AiPracticeCallView";

export default function AiPracticePage() {
  const { currentUser } = useApp();
  const userName = currentUser?.name || "Anda";
  const userInitial = userName.charAt(0).toUpperCase();
  const sim = useAiPracticeSimulation();

  if (sim.phase === "lobby") {
    return (
      <AiPracticeLobby
        userName={userName}
        userInitial={userInitial}
        micOn={sim.micOn}
        camOn={sim.camOn}
        onToggleMic={() => sim.setMicOn((v) => !v)}
        onToggleCam={() => sim.setCamOn((v) => !v)}
        onStart={sim.startCall}
      />
    );
  }

  if (sim.phase === "done") {
    return <AiPracticeDone userName={userName} messages={sim.messages} onReset={sim.reset} />;
  }

  return <AiPracticeCallView userName={userName} sim={sim} />;
}
