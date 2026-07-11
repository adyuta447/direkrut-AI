import { Mail, Phone, FileText, ExternalLink, BarChart3 } from "lucide-react";
import { Application } from "../../../types";
import { getScoreLabel } from "../../../lib/hrd/scoring";

interface CandidateHeroHeaderProps {
  candidate: Application;
  onToggleMatchDetails: () => void;
}

export function CandidateHeroHeader({ candidate, onToggleMatchDetails }: CandidateHeroHeaderProps) {
  const scoreInfo = getScoreLabel(candidate.recommendationScore);

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 bg-surface-1 border border-hairline flex items-center justify-center text-ink font-semibold text-[24px] flex-shrink-0">
          {candidate.applicantName.charAt(0)}
        </div>
        <div>
          <h1 className="text-[28px] font-bold text-ink mb-1">{candidate.applicantName}</h1>
          <p className="text-[16px] text-ink-muted mb-4">{candidate.jobTitle}</p>
          <div className="flex flex-wrap gap-4 text-[14px] text-ink-muted">
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              {candidate.applicantId}@email.com
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4" />
              +62 812-3456-7890
            </span>
            {candidate.resumeLink && (
              <a
                href={candidate.resumeLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-primary hover:underline transition-none"
              >
                <FileText className="w-4 h-4" />
                Lihat CV
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[12px] text-ink-muted mb-1 uppercase font-semibold">Profil Keahlian Kandidat</p>
        {/* REVISI 2: Label teks, bukan angka persen */}
        {candidate.recommendationScore ? (
          <span className={`inline-block text-[13px] font-semibold px-3 py-1.5 border uppercase tracking-wide mt-1 ${scoreInfo.className}`}>
            {scoreInfo.label}
          </span>
        ) : (
          <p className="text-[42px] font-bold text-ink-muted">—</p>
        )}
        <button
          onClick={onToggleMatchDetails}
          className="text-[12px] text-primary mt-3 hover:underline flex items-center justify-end gap-1 w-full"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Lihat Detail Metrik AI
        </button>
      </div>
    </div>
  );
}
