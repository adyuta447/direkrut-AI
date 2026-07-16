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
    question: "Bagaimana cara membaca Chart Radar & Bar?",
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
        Asisten AI (chat) adalah sistem di mana Anda dapat menanyakan detail spesifik yang mungkin
        tidak terlihat di ringkasan, misalnya: &quot;Apakah kandidat ini punya pengalaman dengan
        React?&quot;. Anda bisa mengaksesnya secara global di sidebar, atau di setiap halaman
        kandidat (untuk konteks spesifik).
      </>
    ),
  },
  {
    value: "item-3",
    question: "Bagaimana cara menggunakan Pencarian Global?",
    answer: (
      <>
        Tekan <strong>Ctrl + K</strong> (atau Cmd + K di Mac) dari mana saja untuk membuka popup
        pencarian. Anda bisa mencari nama kandidat, judul lowongan, atau berpindah halaman dengan
        sangat cepat.
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
              Mengalami kendala teknis atau menemukan bug? Tim support kami siap membantu Anda 24/7.
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
                Model AI kami terus belajar. Jika Anda merasa penilaian AI kurang tepat untuk
                industri spesifik perusahaan Anda, Anda bisa menghubungi tim kami untuk
                menyesuaikan model dasar.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
