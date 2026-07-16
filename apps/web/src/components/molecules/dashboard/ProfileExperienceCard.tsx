import Image from "next/image"
import { PenIcon, PlusIcon, TrashIcon, BriefcaseIcon, GraduationCapIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

interface ExperienceItem { id: string; role: string; company: string; startDate: string; endDate: string; description: string }
interface EducationItem { id: string; school: string; degree: string; startYear: string; endYear: string }

interface ProfileExperienceCardProps {
  experience: ExperienceItem[]
}

interface ProfileEducationCardProps {
  education: EducationItem[]
}

export function ProfileExperienceCard({ experience }: ProfileExperienceCardProps) {
  return (
    <Card id="section-experience" className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 scroll-mt-6 overflow-hidden pt-0">
      <CardHeader className="flex flex-row items-center justify-between gap-3 rounded-t-3xl bg-info py-4 text-white">
        <CardTitle className="flex items-center gap-3 text-[20px] font-semibold text-white">Pengalaman Kerja</CardTitle>
        <Dialog>
          <DialogTrigger render={<Button variant="ghost" className="rounded-full bg-white/95 text-ink font-semibold hover:bg-white gap-1" />}>
            <PlusIcon className="size-4" /> Tambah
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Tambah Pengalaman Kerja</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div className="grid gap-2 col-span-2"><Label>Posisi / Jabatan</Label><Input placeholder="Contoh: Software Engineer" /></div>
              <div className="grid gap-2 col-span-2"><Label>Nama Perusahaan</Label><Input placeholder="Contoh: PT Teknologi Nusantara" /></div>
              <div className="grid gap-2 col-span-2"><Label>URL Logo Perusahaan (Opsional)</Label><Input placeholder="https://..." /></div>
              <div className="grid gap-2"><Label>Bulan &amp; Tahun Mulai</Label><Input type="month" /></div>
              <div className="grid gap-2"><Label>Bulan &amp; Tahun Selesai</Label><Input type="month" /></div>
              <div className="grid gap-2 col-span-2">
                <Label>Deskripsi Pekerjaan</Label>
                <Textarea placeholder="Jelaskan tanggung jawab dan pencapaian Anda..." className="min-h-[120px]" />
              </div>
            </div>
            <DialogFooter><Button>Simpan</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {experience.length > 0 ? (
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={exp.id} className={`flex gap-4 group ${index !== experience.length - 1 ? "border-b pb-6" : ""}`}>
                <Avatar className="size-14 border shrink-0">
                  <AvatarFallback className="rounded-full bg-muted text-muted-foreground">
                    <BriefcaseIcon className="size-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-[17px] font-semibold leading-tight text-ink">{exp.role}</h4>
                      <p className="text-sm font-medium mt-0.5">{exp.company}</p>
                      <p className="text-sm text-muted-foreground">{exp.startDate} - {exp.endDate}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="size-8 text-muted-foreground"><PenIcon className="size-4" /></Button>
                      <Button variant="ghost" size="icon" className="size-8 text-destructive/70 hover:text-destructive"><TrashIcon className="size-4" /></Button>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed pt-2 whitespace-pre-line">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 rounded-2xl bg-surface-1">
            <Image src="/dashboard/profile/experience.svg" alt="" width={200} height={150} unoptimized className="pointer-events-none mx-auto mb-5 h-28 w-auto select-none" />
            <p className="text-[20px] font-bold tracking-[-0.01em] text-ink">Tunjukkan jam terbangmu</p>
            <p className="mt-1 text-[14px] text-ink-muted">77,9% perusahaan menganggap pengalaman kerja sebagai hal penting dalam lamaran.</p>
            <Button variant="link" size="sm" className="mt-2 text-primary font-semibold">+ Tambahkan Pengalaman</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function ProfileEducationCard({ education }: ProfileEducationCardProps) {
  return (
    <Card id="section-education" className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 scroll-mt-6 overflow-hidden pt-0">
      <CardHeader className="flex flex-row items-center justify-between gap-3 rounded-t-3xl bg-warning py-4 text-white">
        <CardTitle className="flex items-center gap-3 text-[20px] font-semibold text-white">Pendidikan</CardTitle>
        <Dialog>
          <DialogTrigger render={<Button variant="ghost" className="rounded-full bg-white/95 text-ink font-semibold hover:bg-white gap-1" />}>
            <PlusIcon className="size-4" /> Tambah
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader><DialogTitle>Tambah Pendidikan</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div className="grid gap-2 col-span-2"><Label>Nama Institusi / Universitas</Label><Input placeholder="Contoh: Universitas Indonesia" /></div>
              <div className="grid gap-2 col-span-2"><Label>Gelar / Bidang Studi</Label><Input placeholder="Contoh: S1 Ilmu Komputer" /></div>
              <div className="grid gap-2 col-span-2"><Label>URL Logo Kampus (Opsional)</Label><Input placeholder="https://..." /></div>
              <div className="grid gap-2"><Label>Tahun Mulai</Label><Input type="number" placeholder="2018" /></div>
              <div className="grid gap-2"><Label>Tahun Lulus</Label><Input type="number" placeholder="2022" /></div>
            </div>
            <DialogFooter><Button>Simpan</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {education.length > 0 ? (
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={edu.id} className={`flex gap-4 group ${index !== education.length - 1 ? "border-b pb-6" : ""}`}>
                <Avatar className="size-14 border shrink-0">
                  <AvatarFallback className="rounded-full bg-muted text-muted-foreground">
                    <GraduationCapIcon className="size-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-[17px] font-semibold leading-tight text-ink">{edu.school}</h4>
                      <p className="text-sm font-medium mt-0.5">{edu.degree}</p>
                      <p className="text-sm text-muted-foreground">{edu.startYear} - {edu.endYear}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="size-8 text-muted-foreground"><PenIcon className="size-4" /></Button>
                      <Button variant="ghost" size="icon" className="size-8 text-destructive/70 hover:text-destructive"><TrashIcon className="size-4" /></Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 rounded-2xl bg-surface-1">
            <Image src="/dashboard/profile/graduate.svg" alt="" width={200} height={150} unoptimized className="pointer-events-none mx-auto mb-5 h-28 w-auto select-none" />
            <p className="text-[20px] font-bold tracking-[-0.01em] text-ink">Cantumkan pendidikanmu</p>
            <p className="mt-1 text-[14px] text-ink-muted">Latar belakangmu dilihat perusahaan. Beritahu latar pendidikanmu.</p>
            <Button variant="link" size="sm" className="mt-2 text-primary font-semibold">+ Tambahkan Pendidikan</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
