import { Application } from "../../types";

export function deriveTimelineFlags(app: Application) {
  const cvViewed = app.cvViewed || ["under-review", "interview", "rejected"].includes(app.status);
  const isUnderReview = ["under-review", "interview", "rejected"].includes(app.status);
  const isInterview = ["interview", "rejected"].includes(app.status);
  return { cvViewed, isUnderReview, isInterview };
}

export function statusLabel(status: Application["status"]) {
  switch (status) {
    case "interview": return "Tahap Wawancara";
    case "under-review": return "Tahap Administrasi";
    case "rejected": return "Tidak Lolos";
    default: return "Terkirim";
  }
}

export function recommendationLabel(score: number) {
  if (score >= 75) return { text: "Memenuhi Syarat", className: "text-[#198038] bg-[#defbe6] border-[#198038]" };
  if (score >= 55) return { text: "Perlu Dikembangkan", className: "text-[#f1c21b] bg-[#fcf0d3] border-[#f1c21b]" };
  return { text: "Tidak Sesuai", className: "text-[#da1e28] bg-[#fff1f1] border-[#da1e28]" };
}
