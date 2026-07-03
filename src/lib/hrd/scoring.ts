import { Application } from "../../types";

// REVISI 2: Helper label dari skor numerik
export function getScoreLabel(score?: number): { label: string; className: string } {
  if (!score) return { label: "—", className: "text-ink-muted" };
  if (score >= 75) return { label: "Memenuhi Syarat", className: "text-[#198038] bg-[#defbe6] border-[#198038]" };
  if (score >= 55) return { label: "Perlu Dikembangkan", className: "text-[#f1c21b] bg-[#fcf0d3] border-[#f1c21b]" };
  return { label: "Tidak Sesuai", className: "text-[#da1e28] bg-[#fff1f1] border-[#da1e28]" };
}

// REVISI 5: Hitung hari sejak tanggal melamar
export function getDaysWaiting(appliedDate: string): number {
  // appliedDate bisa berupa string seperti "10 Mei 2025" atau "Hari ini"
  if (appliedDate === "Hari ini" || appliedDate === "Today") return 0;
  const dateMap: Record<string, number> = {
    "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "Mei": 4, "Jun": 5,
    "Jul": 6, "Agu": 7, "Sep": 8, "Okt": 9, "Nov": 10, "Des": 11,
    "May": 4, "Aug": 7, "Oct": 9, "Dec": 11,
  };
  try {
    const parts = appliedDate.split(" ");
    if (parts.length >= 3) {
      const day = parseInt(parts[0]);
      const month = dateMap[parts[1]] ?? 0;
      const year = parseInt(parts[2]);
      const then = new Date(year, month, day);
      const now = new Date();
      const diffMs = now.getTime() - then.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
  } catch {
    /* ignore */
  }
  return 8; // default dummy untuk data statis
}

export function getStatusColor(status: Application["status"]) {
  switch (status) {
    case "interview":
      return "bg-[#e5f6ff] text-[#0f62fe] border-[#0f62fe]";
    case "under-review":
      return "bg-[#fff1f1] text-[#da1e28] border-[#da1e28]";
    case "rejected":
      return "bg-surface-1 text-ink-muted border-hairline";
    default:
      return "bg-surface-1 text-ink border-hairline";
  }
}

export function hrdStatusLabel(status: Application["status"]) {
  switch (status) {
    case "under-review":
      return "Administrasi";
    case "interview":
      return "Wawancara";
    case "rejected":
      return "Ditolak";
    default:
      return "Terkirim";
  }
}
