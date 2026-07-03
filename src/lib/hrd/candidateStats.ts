import { Application } from "../../types";
import { getScoreLabel } from "./scoring";

export function computeStatCards(applications: Application[]) {
  const scored = applications.filter((a) => a.recommendationScore);
  const avgScore =
    scored.length > 0
      ? Math.round(scored.reduce((sum, a) => sum + (a.recommendationScore || 0), 0) / scored.length)
      : undefined;

  return [
    { label: "Total Lamaran", value: applications.length },
    { label: "Tahap Administrasi", value: applications.filter((a) => a.status === "under-review").length },
    { label: "Wawancara", value: applications.filter((a) => a.status === "interview").length },
    { label: "Rata-rata Kecocokan", value: avgScore ? getScoreLabel(avgScore).label : "—" },
  ];
}

export function computeStatusDistribution(applications: Application[]) {
  return [
    { label: "Terkirim", count: applications.filter((a) => a.status === "submitted").length, color: "#8d8d8d" },
    { label: "Administrasi", count: applications.filter((a) => a.status === "under-review").length, color: "#525252" },
    { label: "Wawancara", count: applications.filter((a) => a.status === "interview").length, color: "#0f62fe" },
    { label: "Ditolak", count: applications.filter((a) => a.status === "rejected").length, color: "#c6c6c6" },
  ];
}

// Prepare data for line charts
export function computeTrendData(applications: Application[]) {
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  return days.map((day, idx) => {
    const total = Math.max(1, Math.floor(applications.length * ((idx + 1) / 7)));
    const submitted = Math.floor(total * 0.4 + Math.random() * total * 0.2);
    const underReview = Math.floor(total * 0.3 + Math.random() * total * 0.15);
    const interview = Math.floor(total * 0.2 + Math.random() * total * 0.1);
    const rejected = Math.floor(total * 0.1 + Math.random() * total * 0.05);

    return {
      day,
      Terkirim: submitted,
      Administrasi: underReview,
      Wawancara: interview,
      Ditolak: rejected,
      Total: submitted + underReview + interview + rejected,
    };
  });
}

// Score distribution data — REVISI 2: label teks bukan angka
export function computeScoreDistribution(applications: Application[]) {
  return [
    { name: "Memenuhi Syarat", Kandidat: applications.filter((a) => (a.recommendationScore || 0) >= 75).length },
    {
      name: "Perlu Dikembangkan",
      Kandidat: applications.filter((a) => {
        const s = a.recommendationScore || 0;
        return s >= 55 && s < 75;
      }).length,
    },
    {
      name: "Tidak Sesuai",
      Kandidat: applications.filter((a) => (a.recommendationScore || 0) < 55 && (a.recommendationScore || 0) > 0).length,
    },
  ];
}

// REVISI 4: Kandidat potensial di luar filter (dummy: skor tinggi tapi "tidak lolos" dulu)
export function computePotentialCandidates(applications: Application[]) {
  return applications.filter((app) => (app.recommendationScore || 0) >= 80 && app.status === "submitted").slice(0, 3);
}
