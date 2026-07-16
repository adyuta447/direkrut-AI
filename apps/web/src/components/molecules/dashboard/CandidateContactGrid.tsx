import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6 text-sm text-muted-foreground mt-2 border-t pt-6">
        {rows.map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <span className="font-semibold text-foreground">{item.label}</span>
            <span className="truncate">{item.val}</span>
          </div>
        ))}
      </div>
      <Separator />
      <div className="flex justify-center">
        <Button variant="outline" onClick={onToggleChart} className="rounded-full shadow-sm">
          {showChart ? "Sembunyikan Analisis" : "Lihat Analisis Kandidat"}
        </Button>
      </div>
    </>
  )
}
