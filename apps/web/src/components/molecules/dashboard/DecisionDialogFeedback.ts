import { Candidate } from "@/components/molecules/dashboard/CandidateTableTypes"

function getAreaKembangkan(title: string): string {
  if (title.includes("marketing")) {
    return "manajemen kampanye tingkat lanjut, analitik pemasaran berbasis data (Google Analytics/Meta Ads), dan kemampuan copywriting B2B"
  }
  if (title.includes("design") || title.includes("ui") || title.includes("ux")) {
    return "riset pengguna yang lebih mendalam, kemampuan prototipe tingkat lanjut (Figma Advanced), dan kolaborasi lintas-fungsi dengan tim engineering"
  }
  if (
    title.includes("developer") ||
    title.includes("engineer") ||
    title.includes("backend") ||
    title.includes("frontend")
  ) {
    return "penguasaan arsitektur sistem skala besar, pengujian otomatis (unit & integration testing), dan praktik DevOps/CI-CD"
  }
  if (
    title.includes("keuangan") ||
    title.includes("finance") ||
    title.includes("akuntansi")
  ) {
    return "analisis laporan keuangan lanjutan, penguasaan ERP (SAP/Oracle), dan manajemen risiko keuangan"
  }
  return "pengalaman langsung di lapangan yang lebih relevan, kemampuan analitis, dan rekam jejak proyek yang terdokumentasi dengan baik"
}

export function getPersonalFeedback(candidate: Candidate): string {
  const score = candidate.recommendationScore || 0
  const title = (candidate.jobTitle || "").toLowerCase()
  const areaKembangkan = getAreaKembangkan(title)
  const scoreLabel =
    score >= 75 ? "Memenuhi Syarat" : score >= 55 ? "Perlu Dikembangkan" : "Tidak Sesuai"

  return `Kepada ${candidate.applicantName},

Terima kasih telah meluangkan waktu dan kepercayaan Anda untuk melamar posisi ${candidate.jobTitle} di perusahaan kami.

Setelah melalui evaluasi yang cermat terhadap profil keahlian dan rekaman wawancara Anda, kami telah memutuskan untuk melanjutkan proses dengan kandidat lain yang kualifikasinya lebih dekat dengan kebutuhan spesifik posisi ini saat ini.

Profil Keahlian Anda berdasarkan evaluasi AI: ${scoreLabel}

Area yang direkomendasikan untuk terus dikembangkan: ${areaKembangkan}.

Kami percaya bahwa dengan pengembangan di area tersebut, Anda akan menjadi kandidat yang sangat kompetitif di masa mendatang. Jangan ragu untuk melamar kembali pada posisi-posisi yang sesuai dengan perkembangan Anda.

Tetap semangat dan terus berkembang. Kami mendukung perjalanan karir Anda.

Hormat kami,
Tim Rekrutmen`
}

export function getDefaultInviteSubject(jobTitle: string) {
  return `Undangan Wawancara — ${jobTitle}`
}

export function getDefaultRejectSubject(jobTitle: string) {
  return `Pembaruan Status Lamaran — ${jobTitle}`
}

export function getDefaultInviteBody(
  applicantName: string,
  jobTitle: string
): string {
  return `Kepada ${applicantName},\n\nKami dengan senang hati memberitahukan bahwa lamaran Anda untuk posisi ${jobTitle} telah ditinjau dan kami ingin mengundang Anda untuk mengikuti sesi wawancara.\n\nMohon informasikan ketersediaan waktu Anda dalam minggu ini.\n\nKami menantikan pertemuan dengan Anda.\n\nHormat kami,\nTim HRD`
}
