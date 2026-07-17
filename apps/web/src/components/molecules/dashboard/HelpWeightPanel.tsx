import { ScaleIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const WEIGHTS = [
  {
    label: "1. Kecocokan Keterampilan (Skills Match)",
    weight: "Bobot: 40%",
    desc: "Mengekstrak dan mencocokkan kata kunci keahlian teknis (hard skills) maupun non-teknis (soft skills) dari CV terhadap kebutuhan di Lowongan.",
    badgeClass: "bg-info/10 text-info border-info/20",
  },
  {
    label: "2. Pengalaman Relevan (Experience)",
    weight: "Bobot: 35%",
    desc: "Menilai seberapa lama dan seberapa mendalam pengalaman kerja kandidat pada posisi yang serupa dengan yang sedang dilamar.",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  {
    label: "3. Latar Belakang Pendidikan & Sertifikasi",
    weight: "Bobot: 15%",
    desc: "Memvalidasi apakah kandidat memiliki kualifikasi pendidikan minimal atau sertifikasi profesional yang disyaratkan.",
    badgeClass: "bg-success/10 text-success border-success/20",
  },
  {
    label: "4. Konsistensi & Format CV (Quality)",
    weight: "Bobot: 10%",
    desc: "Mengevaluasi kejelasan informasi, tidak adanya celah karir (career gap) yang mencurigakan tanpa penjelasan, dan profesionalisme penulisan.",
    badgeClass: "bg-warning/10 text-warning border-warning/20",
  },
]

export function HelpWeightPanel() {
  return (
    <Card className="md:col-span-2 overflow-hidden pt-0 gap-0">
      <CardHeader className="bg-primary/5 border-b border-primary/10 pt-6 pb-6 mb-6">
        <CardTitle className="flex items-center gap-2 text-primary">
          <ScaleIcon className="size-5" />
          Transparansi Bobot Penilaian AI
        </CardTitle>
        <CardDescription>Bagaimana AI kami memberikan skor kepada kandidat?</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed mb-4">
          Sistem Direkrut AI didesain untuk merekrut tanpa bias (menghindari diskriminasi gender,
          ras, maupun latar belakang yang tidak relevan). Penilaian murni didasarkan pada kompetensi
          dan kesesuaian antara deskripsi pekerjaan (Job Description) dengan Resume/CV kandidat.
        </p>
        <div className="space-y-4">
          {WEIGHTS.map((w) => (
            <div key={w.label} className="bg-muted/30 p-4 rounded-lg border flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">{w.label}</span>
                <Badge variant="outline" className={w.badgeClass}>
                  {w.weight}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{w.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground italic mt-4 text-center">
          Semua skor dihitung otomatis sama AI, dan bisa kamu cek ulang lewat fitur
          &quot;Tanya AI&quot; di halaman kandidat.
        </p>
      </CardContent>
    </Card>
  )
}
