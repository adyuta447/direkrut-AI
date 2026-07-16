import { IconVideo } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CandidateDetailCVProps {
  candidate: any
}

export function CandidateDetailCV({ candidate }: CandidateDetailCVProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Tangkapan Layar &amp; Transkrip Wawancara AI</CardTitle>
              <CardDescription>Sesi evaluasi asinkron yang telah dilakukan oleh kandidat</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <IconVideo className="size-4 mr-2" /> Putar Ulang Rekaman
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="aspect-video w-full max-w-2xl bg-muted rounded-lg border flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <span className="text-white text-sm font-medium">12:04 / 15:30</span>
            </div>
            <IconVideo className="size-12 text-muted-foreground/50" />
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold border-b pb-2">Transkrip Tanya Jawab (Otomatis)</h4>
            <div className="space-y-4 bg-muted/30 p-4 rounded-xl border max-h-[400px] overflow-y-auto">
              <div className="flex flex-col gap-1 items-start">
                <span className="text-xs font-semibold text-primary px-2">AI Interviewer</span>
                <div className="bg-background border p-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                  <p className="text-sm">Halo {candidate.applicantName}, mari kita mulai. Bisa ceritakan pengalaman terbesar Anda di bidang ini?</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <span className="text-xs font-semibold text-muted-foreground px-2">{candidate.applicantName}</span>
                <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm text-right">
                  <p className="text-sm">Saya telah bekerja di bidang ini selama lebih dari 3 tahun, fokus utamanya pada analisis dan manajemen. Pencapaian terbesar saya adalah berhasil meningkatkan efisiensi operasional tim sebesar 20% dalam waktu kurang dari 6 bulan.</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 items-start">
                <span className="text-xs font-semibold text-primary px-2">AI Interviewer</span>
                <div className="bg-background border p-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                  <p className="text-sm">Tantangan tersulit apa yang pernah Anda hadapi saat memimpin inisiatif peningkatan efisiensi tersebut?</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <span className="text-xs font-semibold text-muted-foreground px-2">{candidate.applicantName}</span>
                <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm text-right">
                  <p className="text-sm">Tantangan terbesarnya adalah koordinasi lintas departemen. Saya menyelesaikannya dengan metode agile dan sesi daily standup agar komunikasi tetap transparan.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Portofolio &amp; Riwayat Kandidat</CardTitle>
          <CardDescription>Berdasarkan ekstraksi CV dan Dokumen yang diunggah</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h4 className="font-semibold border-b pb-2 mb-4 text-primary">Ringkasan Pengalaman Kerja (Ekstraksi AI)</h4>
            <p className="text-sm leading-relaxed p-4 bg-primary/5 border border-primary/20 rounded-lg italic text-foreground/90">
              &quot;{candidate.experienceSummary}&quot;
            </p>
          </div>
          <div>
            <h4 className="font-semibold border-b pb-2 mb-4 text-primary">Profil Singkat</h4>
            <p className="text-sm leading-relaxed">
              Kandidat memiliki profil dasar yang sesuai dengan kualifikasi awal <strong>{candidate.jobTitle}</strong>. Sangat direkomendasikan untuk menempuh tahap selanjutnya.
            </p>
          </div>
          <div>
            <h4 className="font-semibold border-b pb-2 mb-4 text-primary">Pengalaman Kerja</h4>
            <div className="relative border-l-2 border-muted ml-3 space-y-6">
              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-background" />
                <h5 className="font-semibold">{candidate.lastPosition || "Staff Senior"}</h5>
                <p className="text-sm text-muted-foreground">Perusahaan Tech XYZ • Jan 2021 - Sekarang (2 Tahun 8 Bulan)</p>
                <p className="text-sm mt-2">Memimpin tim beranggotakan 5 orang dan berhasil menaikkan metrik kesuksesan proyek hingga 20%.</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-muted-foreground rounded-full -left-[7px] top-1.5 ring-4 ring-background" />
                <h5 className="font-semibold">Junior Staff</h5>
                <p className="text-sm text-muted-foreground">Startup Kreatif Nusantara • Mei 2019 - Des 2020 (1 Tahun 7 Bulan)</p>
                <p className="text-sm mt-2">Membantu administrasi proyek dan pengolahan data pelanggan secara reguler.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold border-b pb-2 mb-4 text-primary">Sertifikasi</h4>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>Sertifikasi Manajemen Proyek Profesional (PMP) - 2022</li>
                <li>Google Data Analytics Certificate - 2021</li>
                <li>AWS Certified Cloud Practitioner - 2020</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold border-b pb-2 mb-4 text-primary">Pencapaian &amp; Prestasi</h4>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>Karyawan Terbaik (Employee of the Year) - 2022</li>
                <li>Juara 1 Lomba Analisis Data Tingkat Nasional - 2019</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
