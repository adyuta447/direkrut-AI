import { Application } from "@/lib/types"
import { ExtendedCandidateData } from "@/lib/dashboard/extended-data"

interface CandidateContactGridProps {
  candidate: Application & ExtendedCandidateData
}

export function CandidateContactGrid({ candidate }: CandidateContactGridProps) {
  // Semua nilai dari profil asli kandidat -- yang belum diisi tampil "—",
  // bukan data karangan.
  const rows = [
    { label: "Nomor WA", val: candidate.phone || "—" },
    { label: "Email", val: candidate.email || "—" },
    { label: "Domisili", val: candidate.domicile },
    { label: "Pengalaman", val: candidate.experience },
    { label: "Posisi Terakhir", val: candidate.lastPosition },
    { label: "Pendidikan", val: candidate.education.split("\n")[0] },
    { label: "Tanggal Melamar", val: new Date(candidate.appliedDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) },
  ]

  return (
    <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-hairline pt-6 lg:grid-cols-4">
      {rows.map((item) => (
        <div key={item.label} className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-muted">
            {item.label}
          </span>
          <span className="truncate text-base font-semibold text-ink">{item.val}</span>
        </div>
      ))}
    </div>
  )
}
