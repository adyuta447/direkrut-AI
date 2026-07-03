import { Bell } from "lucide-react";
import { Application } from "../../../types";
import { deriveTimelineFlags } from "../../../lib/applicant/applicationTimeline";

interface ApplicationTimelineProps {
  app: Application;
}

export function ApplicationTimeline({ app }: ApplicationTimelineProps) {
  const { cvViewed, isUnderReview, isInterview } = deriveTimelineFlags(app);

  return (
    <div className="w-full lg:w-64 flex-shrink-0 border-t border-hairline lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-8">
      <p className="text-[14px] font-semibold text-ink mb-6">Linimasa (Timeline)</p>

      {cvViewed && (
        <div className="mb-4 p-3 bg-[#e5f6ff] border border-[#0f62fe] flex items-center gap-2">
          <Bell className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <p className="text-[11px] text-ink leading-[1.4]">CV Anda telah dilihat oleh HRD pada {app.appliedDate}.</p>
        </div>
      )}

      <div className="relative pl-6 space-y-6">
        <div className="relative">
          <div className="absolute left-[-23px] top-1 w-3 h-3 rounded-full bg-[#198038]"></div>
          <div className="absolute left-[-18px] top-4 w-px h-6 bg-[#198038]"></div>
          <p className="text-[14px] font-semibold text-ink">Lamaran Diterima</p>
          <p className="text-[12px] text-ink-muted">Dokumen berhasil diunggah</p>
        </div>

        <div className="relative">
          <div className={`absolute left-[-23px] top-1 w-3 h-3 rounded-full ${cvViewed ? "bg-[#198038]" : "bg-surface-2 border border-hairline"}`}></div>
          <div className={`absolute left-[-18px] top-4 w-px h-6 ${cvViewed ? "bg-[#198038]" : "bg-surface-2"}`}></div>
          <p className={`text-[14px] font-semibold ${cvViewed ? "text-ink" : "text-ink-muted"}`}>CV Sedang Ditinjau</p>
          <p className="text-[12px] text-ink-muted">{cvViewed ? "Tim HRD membuka CV Anda" : "Menunggu peninjauan HRD"}</p>
        </div>

        <div className="relative">
          <div className={`absolute left-[-23px] top-1 w-3 h-3 rounded-full ${isUnderReview ? "bg-[#198038]" : "bg-surface-2 border border-hairline"}`}></div>
          <div className={`absolute left-[-18px] top-4 w-px h-6 ${isUnderReview ? "bg-[#198038]" : "bg-surface-2"}`}></div>
          <p className={`text-[14px] font-semibold ${isUnderReview ? "text-ink" : "text-ink-muted"}`}>Dalam Proses Seleksi</p>
          <p className="text-[12px] text-ink-muted">{isUnderReview ? "Evaluasi AI interview selesai" : "Menunggu evaluasi AI"}</p>
        </div>

        <div className="relative">
          <div className={`absolute left-[-23px] top-1 w-3 h-3 rounded-full ${isInterview ? "bg-[#198038]" : "bg-surface-2 border border-hairline"}`}></div>
          <div className={`absolute left-[-18px] top-4 w-px h-6 ${isInterview && app.status !== "rejected" ? "bg-[#198038]" : "bg-surface-2"}`}></div>
          <p className={`text-[14px] font-semibold ${isInterview ? "text-ink" : "text-ink-muted"}`}>Wawancara Dijadwalkan</p>
          <p className="text-[12px] text-ink-muted">{isInterview ? "Lolos ke tahap wawancara" : "Menunggu keputusan HRD"}</p>
        </div>

        <div className="relative">
          <div className={`absolute left-[-23px] top-1 w-3 h-3 rounded-full ${app.status === "rejected" ? "bg-[#da1e28]" : "bg-surface-2 border border-hairline"}`}></div>
          <p className={`text-[14px] font-semibold ${app.status === "rejected" ? "text-[#da1e28]" : "text-ink-muted"}`}>
            {app.status === "rejected" ? "Tidak Melanjutkan" : "Keputusan Akhir"}
          </p>
          <p className="text-[12px] text-ink-muted">
            {app.status === "rejected" ? "Kandidat tidak lolos seleksi" : "Menunggu keputusan final"}
          </p>
        </div>
      </div>
    </div>
  );
}
