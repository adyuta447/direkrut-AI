import { Eye, FileText, Clock } from "lucide-react";
import { Application } from "../../../types";
import { getScoreLabel, getStatusColor, getDaysWaiting, hrdStatusLabel } from "../../../lib/hrd/scoring";

interface CandidateTableRowProps {
  app: Application;
  onViewCandidate: (id: string) => void;
}

export function CandidateTableRow({ app, onViewCandidate }: CandidateTableRowProps) {
  const scoreInfo = getScoreLabel(app.recommendationScore);
  const daysWaiting = getDaysWaiting(app.appliedDate);
  const isWaiting = daysWaiting >= 7 && app.status === "submitted";

  return (
    <tr className={`hover:bg-surface-1 transition-none ${isWaiting ? "border-l-4 border-l-[#f1c21b]" : ""}`}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-ink text-white flex items-center justify-center font-semibold text-[12px]">
            {app.applicantName.charAt(0)}
          </div>
          <div>
            <span className="text-[14px] font-semibold text-ink block">{app.applicantName}</span>
            {/* REVISI 5: Badge "Menunggu X hari" */}
            {isWaiting && (
              <span className="text-[11px] text-[#f1c21b] flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                Menunggu respons {daysWaiting} hari
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-[14px] text-ink">{app.jobTitle}</span>
      </td>
      <td className="px-6 py-4">
        {app.resumeLink ? (
          <a
            href={app.resumeLink}
            target="_blank"
            rel="noreferrer"
            title="Lihat CV"
            className="text-primary hover:underline flex items-center gap-1 text-[14px]"
          >
            <FileText className="w-4 h-4" /> Lihat
          </a>
        ) : (
          <span className="text-ink-muted text-[14px]">—</span>
        )}
      </td>
      <td className="px-6 py-4">
        {/* REVISI 2: Label teks bukan angka */}
        {app.recommendationScore ? (
          <span className={`text-[11px] font-semibold px-2 py-1 border uppercase tracking-wide ${scoreInfo.className}`}>
            {scoreInfo.label}
          </span>
        ) : (
          <span className="text-[14px] text-ink-muted">—</span>
        )}
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 text-[12px] font-semibold border uppercase ${getStatusColor(app.status)}`}>
          {hrdStatusLabel(app.status)}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-[14px] text-ink">{app.appliedDate}</span>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => onViewCandidate(app.id)}
          className="flex items-center gap-2 text-[14px] font-semibold text-primary hover:underline"
        >
          <Eye className="w-4 h-4" />
          Detail
        </button>
      </td>
    </tr>
  );
}
