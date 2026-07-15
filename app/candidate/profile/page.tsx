"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  PenIcon, BriefcaseIcon, GraduationCapIcon, 
  MapPinIcon, UploadCloudIcon, ChevronRightIcon,
  TrashIcon, PlusIcon, GlobeIcon, LinkIcon,
  BotIcon, CheckCircleIcon
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useApp } from "@/components/providers/app-provider"

export default function CandidateProfilePage() {
  const { isProfileComplete, setIsProfileComplete } = useApp()
  const [isUploading, setIsUploading] = React.useState(false)
  const [isSimulatingAI, setIsSimulatingAI] = React.useState(false)
  const [hasAutoFilled, setHasAutoFilled] = React.useState(isProfileComplete)

  const [profile, setProfile] = React.useState({
    name: "Kandidat Demo",
    email: "kandidat@example.com",
    phone: "+6283434343434",
    location: "Indonesia",
    age: "-",
    gender: "-",
    about: "",
    experience: [] as any[],
    education: [] as any[],
    skills: [] as string[],
    links: [] as any[],
    preferences: {
      interests: [] as string[],
      jobTypes: [] as string[],
      salary: "-",
      locations: [] as string[],
      remote: "-",
    },
    awards: [] as string[],
    certificates: [] as string[],
    organizations: [] as string[],
  })

  const simulateAIFill = () => {
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      setIsSimulatingAI(true)
      setTimeout(() => {
        setIsSimulatingAI(false)
        setHasAutoFilled(true)
        setIsProfileComplete(true)
        setProfile({
          ...profile,
          name: "Budi Santoso",
          age: "24",
          gender: "Laki-laki",
          location: "Jakarta Selatan, DKI Jakarta",
          about: "Saya adalah seorang Software Engineer dengan pengalaman dalam membangun aplikasi web modern dan scalable. Sangat antusias terhadap teknologi terbaru dan senang berkolaborasi dalam tim.",
          experience: [
            { id: "1", role: "Software Engineer", company: "TechStart", startDate: "Agt 2022", endDate: "Sekarang", description: "Mengembangkan backend microservices menggunakan Node.js dan Go.", logo: "https://avatar.vercel.sh/techstart" },
            { id: "2", role: "Intern Backend Developer", company: "DataCorp", startDate: "Jan 2021", endDate: "Des 2021", description: "Merancang API dan optimasi database PostgreSQL.", logo: "https://avatar.vercel.sh/datacorp" }
          ],
          education: [
            { id: "1", school: "Universitas Indonesia", degree: "S1 Ilmu Komputer", startYear: "2018", endYear: "2022", logo: "https://avatar.vercel.sh/ui" }
          ],
          skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS", "Go"],
          links: [
            { id: "1", platform: "LinkedIn", url: "linkedin.com/in/budisantoso" },
            { id: "2", platform: "Portofolio", url: "budisantoso.dev" }
          ],
          preferences: {
            interests: ["Komputer & Perangkat Lunak", "Full Stack Developer"],
            jobTypes: ["Penuh Waktu", "Remote"],
            salary: "IDR 8 jt - 12 jt",
            locations: ["Jakarta Pusat", "Jakarta Selatan"],
            remote: "Ya",
          },
          awards: ["Juara 1 Hackathon Nasional 2021"],
          certificates: ["AWS Certified Developer Associate"],
          organizations: ["Ketua Himpunan Mahasiswa Ilmu Komputer (2020 - 2021)"],
        })
      }, 2500)
    }, 1500)
  }

  const [newSkill, setNewSkill] = React.useState("")

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim() !== '') {
      if (!profile.skills.includes(newSkill.trim())) {
        setProfile({...profile, skills: [...profile.skills, newSkill.trim()]})
      }
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({...profile, skills: profile.skills.filter(s => s !== skillToRemove)})
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-6 w-full max-w-7xl mx-auto space-y-6">

      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Profil Saya</h1>
        <p className="text-muted-foreground mt-1 text-sm">Kelola informasi pribadi, pendidikan, dan pengalaman kerja Anda.</p>
      </div>

      {!hasAutoFilled && (
        <Card className="border-primary/50 bg-primary/5 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BotIcon className="size-24 text-primary" />
          </div>
          <CardHeader className="relative z-10 pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <BotIcon className="size-5 text-primary" />
              Isi Profil Otomatis dengan AI
            </CardTitle>
            <CardDescription className="text-base text-foreground/80">
              Tidak perlu mengisi manual dari awal! Unggah CV Anda (PDF/DOCX) dan biarkan Direkrut AI mengekstrak data Anda ke dalam profil ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div 
              className={`border-2 border-dashed ${isUploading || isSimulatingAI ? 'border-primary bg-primary/10' : 'border-primary/30 bg-background/50'} rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer hover:bg-primary/10`}
              onClick={!isUploading && !isSimulatingAI ? simulateAIFill : undefined}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  <p className="font-medium">Mengunggah CV...</p>
                </div>
              ) : isSimulatingAI ? (
                <div className="flex flex-col items-center gap-4">
                  <BotIcon className="size-10 text-primary" />
                  <div className="space-y-1">
                    <p className="font-medium text-primary">AI sedang mengekstrak data Anda...</p>
                    <p className="text-sm text-muted-foreground">Membaca pengalaman kerja, pendidikan, dan skills</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <UploadCloudIcon className="size-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-lg">Klik untuk mengunggah CV Anda</p>
                    <p className="text-sm text-muted-foreground mt-1">Sistem kami akan mengisi seluruh kolom di bawah secara otomatis.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {hasAutoFilled && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 p-4 rounded-xl flex items-start gap-3">
          <CheckCircleIcon className="size-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Profil Berhasil Dilengkapi oleh AI!</p>
            <p className="text-sm opacity-90 mt-1">Silakan periksa kembali data di bawah ini. Anda dapat menekan tombol Edit (Ikon Pensil) untuk memperbaiki bagian yang salah.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

        <div className="space-y-6 lg:col-span-1 sticky top-6">
          
          <Card>
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-sm">Kelengkapan Data:</span>
                <span className="font-bold text-sm text-primary">Cukup</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: "75%" }} />
              </div>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                Profil kamu sudah cukup. Silakan kirimkan lamaran Anda sekarang juga!
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex flex-col">
              <Button variant="ghost" className="justify-between rounded-none px-5 py-6 border-b text-foreground font-medium" onClick={() => document.getElementById('section-biodata')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>Biodata</span> <ChevronRightIcon className="size-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" className="justify-between rounded-none px-5 py-6 border-b text-foreground font-medium" onClick={() => document.getElementById('section-about')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>Tentang Saya</span> <ChevronRightIcon className="size-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" className="justify-between rounded-none px-5 py-6 border-b text-foreground font-medium" onClick={() => document.getElementById('section-links')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>Tautan Sosial & Portofolio</span> <ChevronRightIcon className="size-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" className="justify-between rounded-none px-5 py-6 border-b text-foreground font-medium" onClick={() => document.getElementById('section-experience')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>Pengalaman Kerja</span> <ChevronRightIcon className="size-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" className="justify-between rounded-none px-5 py-6 border-b text-foreground font-medium" onClick={() => document.getElementById('section-education')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>Pendidikan</span> <ChevronRightIcon className="size-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" className="justify-between rounded-none px-5 py-6 border-b text-foreground font-medium" onClick={() => document.getElementById('section-skills')?.scrollIntoView({ behavior: 'smooth' })}>
                <span>Keahlian & Sertifikasi</span> <ChevronRightIcon className="size-4 text-muted-foreground" />
              </Button>
            </div>
            <div className="p-4 bg-muted/30 border-t">
              <Button className="w-full">Simpan Perubahan</Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-3">

          <Card id="section-biodata" className="overflow-hidden scroll-mt-6">
            <div className="h-24 bg-muted relative">
              <Dialog>
                <DialogTrigger render={<Button variant="secondary" size="sm" className="absolute top-4 right-4 bg-white/80 hover:bg-white text-black"><PenIcon className="size-3 mr-2"/> Ubah Latar</Button>} />
                <DialogContent>
                  <DialogHeader><DialogTitle>Ubah Foto Latar</DialogTitle></DialogHeader>
                  <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-muted/50">
                    <UploadCloudIcon className="size-10 text-muted-foreground mb-4" />
                    <p className="font-medium">Unggah Foto</p>
                    <p className="text-sm text-muted-foreground mt-1">PNG, JPG maksimal 2MB</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <CardContent className="px-6 pb-6 pt-0 relative">
              <div className="flex justify-between items-start">
                <Avatar className="size-28 border-4 border-card -mt-12 bg-muted relative">
                  <AvatarImage src="/avatars/kandidat.jpg" />
                  <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer rounded-full">
                    <PenIcon className="size-6 text-white" />
                  </div>
                </Avatar>
                
                <Dialog>
                  <DialogTrigger render={<Button variant="outline" className="mt-4"><PenIcon className="size-4 mr-2" /> Edit Profil</Button>} />
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Ubah Biodata</DialogTitle>
                      <DialogDescription>Perbarui informasi pribadi Anda di sini.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="grid gap-2 col-span-2">
                        <Label>Nama Lengkap</Label>
                        <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                      </div>
                      <div className="grid gap-2">
                        <Label>WhatsApp Number</Label>
                        <Input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
                      </div>
                      <div className="grid gap-2">
                        <Label>Email</Label>
                        <Input value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
                      </div>
                      <div className="grid gap-2">
                        <Label>Lokasi</Label>
                        <Input value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} />
                      </div>
                      <div className="grid gap-2">
                        <Label>Usia</Label>
                        <Input value={profile.age} onChange={e => setProfile({...profile, age: e.target.value})} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button>Simpan Perubahan</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mt-4">
                <h3 className="font-bold text-2xl leading-tight">{profile.name}</h3>
                <p className="text-muted-foreground flex items-center gap-1 mt-1.5">
                  <MapPinIcon className="size-4" /> {profile.location}
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 mt-6 pt-6 border-t text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-semibold">WhatsApp</p>
                  <p className="font-medium">{profile.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-semibold">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 font-semibold">Usia, Jenis Kelamin</p>
                  <p className="font-medium">{profile.age ? `${profile.age} Tahun, ${profile.gender}` : "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="section-about" className="scroll-mt-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Tentang Saya</CardTitle>
              <Dialog>
                <DialogTrigger render={<Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><PenIcon className="size-4" /></Button>} />
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Ubah Tentang Saya</DialogTitle>
                    <DialogDescription>Beritahu perusahaan apa yang membuatmu unggul.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Textarea 
                      className="min-h-[150px] text-base" 
                      value={profile.about} 
                      onChange={e => setProfile({...profile, about: e.target.value})} 
                      placeholder="Ceritakan tentang diri Anda..."
                    />
                  </div>
                  <DialogFooter>
                    <Button>Simpan</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {profile.about ? (
                <p className="text-base leading-relaxed text-foreground/90">{profile.about}</p>
              ) : (
                <div className="text-center py-6 border border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground">Beritahu perusahaan apa yang membuatmu unggul untuk dipekerjakan</p>
                  <Button variant="link" size="sm" className="mt-2 text-primary font-semibold">
                    + Tambahkan Deskripsi
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card id="section-links" className="scroll-mt-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Tautan Sosial & Portofolio</CardTitle>
              <Dialog>
                <DialogTrigger render={<Button variant="ghost" className="text-primary font-semibold hover:bg-primary/10 gap-1"><PlusIcon className="size-4" /> Tambah</Button>} />
                <DialogContent className="sm:max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Tambah Tautan</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Platform</Label>
                      <Input placeholder="Contoh: LinkedIn, GitHub, Portofolio Pribadi" />
                    </div>
                    <div className="grid gap-2">
                      <Label>URL / Tautan</Label>
                      <Input placeholder="https://" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button>Simpan</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {profile.links.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {profile.links.map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/50 transition-colors group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-muted rounded-md text-foreground/70 shrink-0">
                          <LinkIcon className="size-5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-semibold text-sm truncate">{link.platform}</p>
                          <a href={`https://${link.url}`} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate block">
                            {link.url}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground"><PenIcon className="size-4" /></Button>
                        <Button variant="ghost" size="icon" className="size-8 text-destructive/70 hover:text-destructive"><TrashIcon className="size-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground">Tautkan profil profesional Anda untuk dilirik HRD.</p>
                  <Button variant="link" size="sm" className="mt-2 text-primary font-semibold">
                    + Tambahkan Tautan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card id="section-experience" className="scroll-mt-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Pengalaman Kerja</CardTitle>
              <Dialog>
                <DialogTrigger render={<Button variant="ghost" className="text-primary font-semibold hover:bg-primary/10 gap-1"><PlusIcon className="size-4" /> Tambah</Button>} />
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Tambah Pengalaman Kerja</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="grid gap-2 col-span-2">
                      <Label>Posisi / Jabatan</Label>
                      <Input placeholder="Contoh: Software Engineer" />
                    </div>
                    <div className="grid gap-2 col-span-2">
                      <Label>Nama Perusahaan</Label>
                      <Input placeholder="Contoh: PT Teknologi Nusantara" />
                    </div>
                    <div className="grid gap-2 col-span-2">
                      <Label>URL Logo Perusahaan (Opsional)</Label>
                      <Input placeholder="https://..." />
                    </div>
                    <div className="grid gap-2">
                      <Label>Bulan & Tahun Mulai</Label>
                      <Input type="month" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Bulan & Tahun Selesai</Label>
                      <Input type="month" />
                    </div>
                    <div className="grid gap-2 col-span-2">
                      <Label>Deskripsi Pekerjaan</Label>
                      <Textarea placeholder="Jelaskan tanggung jawab dan pencapaian Anda..." className="min-h-[120px]" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button>Simpan</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {profile.experience.length > 0 ? (
                <div className="space-y-6">
                  {profile.experience.map((exp, index) => (
                    <div key={exp.id} className={`flex gap-4 group ${index !== profile.experience.length - 1 ? "border-b pb-6" : ""}`}>
                      <Avatar className="size-14 rounded-md border shadow-sm shrink-0">
                        <AvatarImage src={exp.logo} className="object-contain p-1" />
                        <AvatarFallback className="rounded-md bg-muted text-muted-foreground"><BriefcaseIcon className="size-6" /></AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-base leading-tight">{exp.role}</h4>
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
                <div className="text-center py-6 border border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground">77,9% perusahaan menganggap pengalaman kerja sebagai hal penting dalam lamaran.</p>
                  <Button variant="link" size="sm" className="mt-2 text-primary font-semibold">
                    + Tambahkan Pengalaman
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card id="section-education" className="scroll-mt-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Pendidikan</CardTitle>
              <Dialog>
                <DialogTrigger render={<Button variant="ghost" className="text-primary font-semibold hover:bg-primary/10 gap-1"><PlusIcon className="size-4" /> Tambah</Button>} />
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Tambah Pendidikan</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="grid gap-2 col-span-2">
                      <Label>Nama Institusi / Universitas</Label>
                      <Input placeholder="Contoh: Universitas Indonesia" />
                    </div>
                    <div className="grid gap-2 col-span-2">
                      <Label>Gelar / Bidang Studi</Label>
                      <Input placeholder="Contoh: S1 Ilmu Komputer" />
                    </div>
                    <div className="grid gap-2 col-span-2">
                      <Label>URL Logo Kampus (Opsional)</Label>
                      <Input placeholder="https://..." />
                    </div>
                    <div className="grid gap-2">
                      <Label>Tahun Mulai</Label>
                      <Input type="number" placeholder="2018" />
                    </div>
                    <div className="grid gap-2">
                      <Label>Tahun Lulus</Label>
                      <Input type="number" placeholder="2022" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button>Simpan</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {profile.education.length > 0 ? (
                <div className="space-y-6">
                  {profile.education.map((edu, index) => (
                    <div key={edu.id} className={`flex gap-4 group ${index !== profile.education.length - 1 ? "border-b pb-6" : ""}`}>
                      <Avatar className="size-14 rounded-md border shadow-sm shrink-0">
                        <AvatarImage src={edu.logo} className="object-contain p-1" />
                        <AvatarFallback className="rounded-md bg-muted text-muted-foreground"><GraduationCapIcon className="size-6" /></AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-base leading-tight">{edu.school}</h4>
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
                <div className="text-center py-6 border border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground">Latar belakangmu dilihat perusahaan. Beritahu latar pendidikanmu.</p>
                  <Button variant="link" size="sm" className="mt-2 text-primary font-semibold">
                    + Tambahkan Pendidikan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card id="section-skills" className="scroll-mt-6">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Keahlian (Skills)</CardTitle>
              <Dialog>
                <DialogTrigger render={<Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary"><PenIcon className="size-4" /></Button>} />
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Ubah Keahlian</DialogTitle>
                    <DialogDescription>Tambahkan skill teknis atau soft skill yang relevan.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="grid gap-2 relative">
                      <Label>Tambah Skill Baru</Label>
                      <div className="relative">
                        <Input 
                          placeholder="Ketik lalu tekan Enter..." 
                          value={newSkill}
                          onChange={e => setNewSkill(e.target.value)}
                          onKeyDown={handleAddSkill}
                          className="pl-3 pr-16"
                        />
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="absolute right-1 top-1 h-7 px-2 text-xs"
                          onClick={() => handleAddSkill({ key: 'Enter' } as any)}
                        >
                          Tambah
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 p-4 border rounded-lg min-h-[120px] bg-muted/10 content-start shadow-inner">
                      {profile.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm bg-primary text-primary-foreground flex items-center gap-2">
                          {skill}
                          <button onClick={() => handleRemoveSkill(skill)} className="hover:text-red-300 rounded-full p-0.5 transition-colors focus:outline-none">
                            <TrashIcon className="size-3" />
                          </button>
                        </Badge>
                      ))}
                      {profile.skills.length === 0 && <span className="text-muted-foreground text-sm flex items-center h-full w-full justify-center">Belum ada skill yang ditambahkan.</span>}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button>Simpan</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="px-4 py-1.5 text-sm font-medium bg-secondary hover:bg-secondary/80">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground">Beritahu apa yang kamu kuasai untuk menarik perusahaan top.</p>
                  <Button variant="link" size="sm" className="mt-2 text-primary font-semibold">
                    + Tambahkan Skill
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
