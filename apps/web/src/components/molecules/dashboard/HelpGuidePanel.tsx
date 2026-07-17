import { BookOpenIcon, LifeBuoyIcon, BrainCircuitIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ = [
  {
    value: "item-1",
    question: "Gimana cara baca Chart Radar & Bar?",
    answer: (
      <ul className="list-disc pl-4 space-y-2 mt-2">
        <li>
          <strong>Chart Radar:</strong> Memvisualisasikan perbandingan kompetensi multi-dimensi
          (Komunikasi, Teknis, dsb) secara menyeluruh. Semakin lebar areanya, semakin bagus.
        </li>
        <li>
          <strong>Bar Chart:</strong> Membandingkan skor kecocokan kandidat saat ini dengan
          rata-rata skor kandidat lain di lowongan yang sama.
        </li>
      </ul>
    ),
  },
  {
    value: "item-2",
    question: 'Apa fungsi "Asisten AI Interaktif"?',
    answer: (
      <>
        Ini chat AI yang bisa kamu tanya-tanya soal detail yang nggak keliatan di ringkasan,
        misalnya: &quot;Kandidat ini punya pengalaman React nggak?&quot;. Kamu bisa akses dari
        sidebar (global), atau langsung dari halaman kandidat buat konteks yang lebih spesifik.
      </>
    ),
  },
  {
    value: "item-3",
    question: "Gimana cara pakai Pencarian Global?",
    answer: (
      <>
        Pencet <strong>Ctrl + K</strong> (atau Cmd + K di Mac) dari mana aja buat buka popup
        pencarian. Kamu bisa cari nama kandidat, judul lowongan, atau pindah halaman secepat kilat.
      </>
    ),
  },
]

export function HelpGuidePanel() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpenIcon className="size-5 text-primary" />
            Panduan Penggunaan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion className="w-full">
            {FAQ.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger className="text-left text-sm font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LifeBuoyIcon className="size-5 text-primary" />
              Dukungan Teknis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Nemu bug atau ada kendala teknis? Tim support kami siap gercep bantu kamu 24/7.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium">Email Support:</p>
              <a
                href="mailto:support@direkrut.ai"
                className="text-primary hover:underline text-sm font-bold"
              >
                support@direkrut.ai
              </a>
              <p className="text-sm font-medium mt-3">Hotline Enterprise:</p>
              <p className="text-sm font-bold">+62 811-0000-9999</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex items-start gap-4">
            <BrainCircuitIcon className="size-8 text-primary shrink-0" />
            <div>
              <h4 className="font-semibold text-primary mb-1">Feedback AI</h4>
              <p className="text-xs text-muted-foreground">
                Model AI kami terus belajar. Kalau menurut kamu penilaiannya kurang pas buat
                industri spesifik perusahaanmu, langsung aja hubungi tim kami buat nyesuain model dasarnya.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
