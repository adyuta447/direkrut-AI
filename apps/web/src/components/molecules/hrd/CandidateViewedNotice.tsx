import { Bell } from "lucide-react";
import { Application } from "../../../types";

interface CandidateViewedNoticeProps {
  candidate: Application;
}

// REVISI 9: CV Dilihat Notification
export function CandidateViewedNotice({ candidate }: CandidateViewedNoticeProps) {
  if (!["under-review", "interview", "rejected"].includes(candidate.status)) return null;

  return (
    <div className="mt-4 p-3 bg-[#e5f6ff] border border-[#0f62fe] flex items-center gap-3">
      <Bell className="w-4 h-4 text-primary flex-shrink-0" />
      <p className="text-[12px] text-ink">
        <span className="font-semibold">Pemberitahuan:</span> CV kandidat ini telah dilihat oleh tim HRD pada {candidate.appliedDate}.
      </p>
    </div>
  );
}
