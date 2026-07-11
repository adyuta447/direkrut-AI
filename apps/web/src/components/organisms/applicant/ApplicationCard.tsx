import { Application } from "../../../types";
import { statusLabel } from "../../../lib/applicant/applicationTimeline";
import { ApplicationStatCards } from "../../molecules/applicant/ApplicationStatCards";
import { ApplicationTimeline } from "../../molecules/applicant/ApplicationTimeline";

interface ApplicationCardProps {
  app: Application;
}

export function ApplicationCard({ app }: ApplicationCardProps) {
  return (
    <div className="border border-hairline bg-surface-1 p-8 flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="text-[24px] font-semibold text-ink mb-2">{app.jobTitle}</h3>
            <p className="text-[14px] text-ink-muted">Dikirim pada: {app.appliedDate}</p>
          </div>
          <span className="text-[12px] font-semibold px-3 py-1 border border-hairline bg-canvas text-ink uppercase">
            {statusLabel(app.status)}
          </span>
        </div>

        <ApplicationStatCards app={app} />

        {(app.status === "interview" || app.status === "under-review") && (
          <div className="bg-[#e5f6ff] border border-[#0f62fe] p-4">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[12px] font-semibold uppercase text-[#0f62fe]">
                {app.status === "interview" ? "Tindakan Berikutnya" : "Pembaruan Status"}
              </p>
            </div>
            <p className="text-[14px] text-ink leading-relaxed">
              {app.status === "interview"
                ? "Harap selesaikan wawancara AI di panel atas, tim kami akan menghubungi Anda untuk wawancara akhir."
                : "Lamaran Anda sedang dalam tahap administrasi dan review oleh tim HRD. Kami akan memberi tahu jika ada pembaruan."}
            </p>
          </div>
        )}
      </div>

      <ApplicationTimeline app={app} />
    </div>
  );
}
