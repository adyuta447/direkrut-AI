import { Button } from "@/components/ui/button"

interface CandidateContactGridProps {
  candidate: any
  onToggleChart: () => void
  showChart: boolean
}

export function CandidateContactGrid({ candidate, onToggleChart, showChart }: CandidateContactGridProps) {
  const rows = [
    { label: "Nomor WA", val: candidate.phone || "+62 812-XXXX-XXXX" },
    { label: "Email", val: `${candidate.applicantName.toLowerCase().replace(/\s/g, "")}@email.com` },
    { label: "Domisili", val: candidate.domicile || "Jakarta Selatan" },
    { label: "Pengalaman", val: candidate.experience || "3 Tahun" },
    { label: "Posisi Terakhir", val: candidate.lastPosition || "Staff" },
    { label: "Pendidikan", val: candidate.education || "S1 Sistem Informasi" },
    { label: "Tanggal Melamar", val: candidate.appliedDate },
  ]

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-hairline pt-6 text-sm lg:grid-cols-4">
        {rows.map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              {item.label}
            </span>
            <span className="truncate font-medium text-ink">{item.val}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center border-t border-hairline pt-6">
        <Button variant="outline" onClick={onToggleChart} className="rounded-full border-hairline">
          {showChart ? "Sembunyikan Analisis" : "Cek Analisis Kandidat"}
        </Button>
      </div>
    </>
  )
}
