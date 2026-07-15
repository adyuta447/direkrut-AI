"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { BookOpenIcon, ScaleIcon, BrainCircuitIcon, LifeBuoyIcon, FileLineChartIcon } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 w-full">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pusat Bantuan & Panduan</h2>
          <p className="text-muted-foreground mt-1">Pelajari cara menggunakan Dasbor Direkrut AI secara maksimal.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
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
              Sistem Direkrut AI didesain untuk merekrut tanpa bias (menghindari diskriminasi gender, ras, maupun latar belakang yang tidak relevan). Penilaian murni didasarkan pada kompetensi dan kesesuaian antara deskripsi pekerjaan (Job Description) dengan Resume/CV kandidat.
            </p>
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg border flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">1. Kecocokan Keterampilan (Skills Match)</span>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">Bobot: 40%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Mengekstrak dan mencocokkan kata kunci keahlian teknis (hard skills) maupun non-teknis (soft skills) dari CV terhadap kebutuhan di Lowongan.</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg border flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">2. Pengalaman Relevan (Experience)</span>
                  <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 border-indigo-200">Bobot: 35%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Menilai seberapa lama dan seberapa mendalam pengalaman kerja kandidat pada posisi yang serupa dengan yang sedang dilamar.</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg border flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">3. Latar Belakang Pendidikan & Sertifikasi</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Bobot: 15%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Memvalidasi apakah kandidat memiliki kualifikasi pendidikan minimal atau sertifikasi profesional yang disyaratkan.</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg border flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">4. Konsistensi & Format CV (Quality)</span>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">Bobot: 10%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Mengevaluasi kejelasan informasi, tidak adanya celah karir (career gap) yang mencurigakan tanpa penjelasan, dan profesionalisme penulisan.</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic mt-4 text-center">
              Seluruh skor dikalkulasi secara otomatis oleh AI dan dapat diverifikasi ulang oleh HRD melalui fitur "Tanya AI" di halaman kandidat.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenIcon className="size-5 text-primary" />
              Panduan Penggunaan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left text-sm font-medium">Bagaimana cara membaca Chart Radar & Bar?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  <ul className="list-disc pl-4 space-y-2 mt-2">
                    <li><strong>Chart Radar:</strong> Memvisualisasikan perbandingan kompetensi multi-dimensi (Komunikasi, Teknis, dsb) secara menyeluruh. Semakin lebar areanya, semakin bagus.</li>
                    <li><strong>Bar Chart:</strong> Membandingkan skor kecocokan kandidat saat ini dengan rata-rata skor kandidat lain di lowongan yang sama.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left text-sm font-medium">Apa fungsi "Asisten AI Interaktif"?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Asisten AI (chat) adalah sistem di mana Anda dapat menanyakan detail spesifik yang mungkin tidak terlihat di ringkasan, misalnya: "Apakah kandidat ini punya pengalaman dengan React?". Anda bisa mengaksesnya secara global di sidebar, atau di setiap halaman kandidat (untuk konteks spesifik).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left text-sm font-medium">Bagaimana cara menggunakan Pencarian Global?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Tekan <strong>Ctrl + K</strong> (atau Cmd + K di Mac) dari mana saja untuk membuka popup pencarian. Anda bisa mencari nama kandidat, judul lowongan, atau berpindah halaman dengan sangat cepat.
                </AccordionContent>
              </AccordionItem>
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
                <a href="mailto:support@direkrut.ai" className="text-primary hover:underline text-sm font-bold">support@direkrut.ai</a>
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
                  Model AI kami terus belajar. Jika Anda merasa penilaian AI kurang tepat untuk industri spesifik perusahaan Anda, Anda bisa menghubungi tim kami untuk menyesuaikan model dasar.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
