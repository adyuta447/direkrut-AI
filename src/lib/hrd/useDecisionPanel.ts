"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Application } from "../../types";
import { useApp } from "../../context/AppContext";
import { buildRejectionEmail } from "./rejectionTemplates";

export type DecisionType = "invite" | "reject";

export function useDecisionPanel(candidate: Application, decision: DecisionType) {
  const router = useRouter();
  const { updateApplication } = useApp();

  const [emailSubject, setEmailSubject] = useState(
    decision === "invite"
      ? `Undangan Wawancara — ${candidate.jobTitle}`
      : `Pembaruan Status Lamaran — ${candidate.jobTitle}`
  );
  const [emailBody, setEmailBody] = useState(
    decision === "invite"
      ? `Kepada ${candidate.applicantName},\n\nKami dengan senang hati memberitahukan bahwa lamaran Anda untuk posisi ${candidate.jobTitle} telah ditinjau dan kami ingin mengundang Anda untuk mengikuti sesi wawancara.\n\nMohon informasikan ketersediaan waktu Anda dalam minggu ini.\n\nKami menantikan pertemuan dengan Anda.\n\nHormat kami,\nTim HRD`
      : buildRejectionEmail(candidate)
  );
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewType, setInterviewType] = useState<"teknis" | "hr">("hr");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSend = () => {
    updateApplication(candidate.id, { status: decision === "invite" ? "interview" : "rejected" });
    setShowConfirmation(true);
    setTimeout(() => router.push(`/hrd/candidates/${candidate.id}`), 2500);
  };

  return {
    emailSubject, setEmailSubject, emailBody, setEmailBody,
    interviewDate, setInterviewDate, interviewTime, setInterviewTime,
    interviewType, setInterviewType, showConfirmation, handleSend,
  };
}
