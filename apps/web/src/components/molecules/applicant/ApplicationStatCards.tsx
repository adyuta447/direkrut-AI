import { CheckCircle2, Clock } from "lucide-react";
import { Application } from "../../../types";
import { recommendationLabel } from "../../../lib/applicant/applicationTimeline";

interface ApplicationStatCardsProps {
  app: Application;
}

export function ApplicationStatCards({ app }: ApplicationStatCardsProps) {
  const rec = app.recommendationScore !== undefined ? recommendationLabel(app.recommendationScore) : null;

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-canvas border border-hairline p-4 flex flex-col justify-center">
        <p className="text-[12px] font-semibold uppercase text-ink-muted mb-2">Validasi AI</p>
        <div className="flex items-center gap-2">
          {app.validationStatus === "completed" ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#198038]" />
              <span className="text-[14px] text-ink">Selesai</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 text-ink-muted" />
              <span className="text-[14px] text-ink-muted">Menunggu</span>
            </>
          )}
        </div>
      </div>

      {rec && (
        <div className="bg-canvas border border-hairline p-4 flex flex-col justify-center">
          <p className="text-[12px] font-semibold uppercase text-ink-muted mb-2">Profil Keahlian</p>
          <span className={`text-[11px] font-semibold px-2 py-1 border uppercase tracking-wide self-start ${rec.className}`}>
            {rec.text}
          </span>
        </div>
      )}
    </div>
  );
}
