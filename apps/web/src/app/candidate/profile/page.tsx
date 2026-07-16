"use client"

import * as React from "react"
import { CheckCircleIcon, ChevronRightIcon } from "lucide-react"
import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { ProfileAIBanner } from "@/components/molecules/dashboard/ProfileAIBanner"
import { ProfileBiodataCard } from "@/components/molecules/dashboard/ProfileBiodataCard"
import { ProfileAboutCard, ProfileLinksCard, ProfileSkillsCard } from "@/components/molecules/dashboard/ProfileSectionCards"
import { ProfileExperienceCard, ProfileEducationCard } from "@/components/molecules/dashboard/ProfileExperienceCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useDashboard } from "@/context/DashboardContext"

const SECTION_LINKS = [
  { id: "section-biodata", label: "Biodata" },
  { id: "section-about", label: "Tentang Saya" },
  { id: "section-links", label: "Tautan Sosial & Portofolio" },
  { id: "section-experience", label: "Pengalaman Kerja" },
  { id: "section-education", label: "Pendidikan" },
  { id: "section-skills", label: "Keahlian & Sertifikasi" },
]

const INITIAL_PROFILE = {
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
}

const AI_FILLED_PROFILE = {
  name: "Budi Santoso",
  age: "24",
  gender: "Laki-laki",
  location: "Jakarta Selatan, DKI Jakarta",
  email: "budi.santoso@email.com",
  phone: "+6281234567890",
  about: "Saya adalah seorang Software Engineer dengan pengalaman dalam membangun aplikasi web modern dan scalable. Sangat antusias terhadap teknologi terbaru dan senang berkolaborasi dalam tim.",
  experience: [
    { id: "1", role: "Software Engineer", company: "TechStart", startDate: "Agt 2022", endDate: "Sekarang", description: "Mengembangkan backend microservices menggunakan Node.js dan Go." },
    { id: "2", role: "Intern Backend Developer", company: "DataCorp", startDate: "Jan 2021", endDate: "Des 2021", description: "Merancang API dan optimasi database PostgreSQL." },
  ],
  education: [
    { id: "1", school: "Universitas Indonesia", degree: "S1 Ilmu Komputer", startYear: "2018", endYear: "2022" },
  ],
  skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS", "Go"],
  links: [
    { id: "1", platform: "LinkedIn", url: "linkedin.com/in/budisantoso" },
    { id: "2", platform: "Portofolio", url: "budisantoso.dev" },
  ],
}

export default function CandidateProfilePage() {
  const { isProfileComplete, setIsProfileComplete } = useDashboard()
  const [isUploading, setIsUploading] = React.useState(false)
  const [isSimulatingAI, setIsSimulatingAI] = React.useState(false)
  const [hasAutoFilled, setHasAutoFilled] = React.useState(isProfileComplete)
  const [profile, setProfile] = React.useState(INITIAL_PROFILE)
  const [newSkill, setNewSkill] = React.useState("")

  const simulateAIFill = () => {
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      setIsSimulatingAI(true)
      setTimeout(() => {
        setIsSimulatingAI(false)
        setHasAutoFilled(true)
        setIsProfileComplete(true)
        setProfile({ ...profile, ...AI_FILLED_PROFILE })
      }, 2500)
    }, 1500)
  }

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSkill.trim() !== "") {
      if (!profile.skills.includes(newSkill.trim())) {
        setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] })
      }
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skillToRemove) })
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="p-4 md:p-8 pt-6 w-full max-w-7xl mx-auto space-y-6">
      <PageHeader className="mb-6" eyebrow="Personal Branding" title="Profil Saya" description="Profil yang lengkap bikin peluang dilirik HRD makin gede." />

      {!hasAutoFilled && (
        <ProfileAIBanner isUploading={isUploading} isSimulatingAI={isSimulatingAI} onUploadClick={simulateAIFill} />
      )}

      {hasAutoFilled && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3 text-primary">
          <CheckCircleIcon className="size-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Profil Berhasil Dilengkapi oleh AI!</p>
            <p className="text-sm opacity-90 mt-1">Silakan periksa kembali data di bawah ini. Anda dapat menekan tombol Edit (Ikon Pensil) untuk memperbaiki bagian yang salah.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="space-y-6 lg:col-span-1 lg:sticky lg:top-6">
          <Card className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-sm">Kelengkapan Data:</span>
                <span className="font-bold text-sm text-primary">Cukup</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: "75%" }} />
              </div>
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">Profil kamu sudah cukup. Silakan kirimkan lamaran Anda sekarang juga!</p>
            </CardContent>
          </Card>

          <Card className="hidden lg:flex rounded-3xl border border-hairline bg-canvas shadow-none ring-0 overflow-hidden">
            <div className="flex flex-col w-full">
              {SECTION_LINKS.map((link) => (
                <Button
                  key={link.id}
                  variant="ghost"
                  className="justify-between rounded-none px-5 py-6 border-b text-foreground font-medium"
                  onClick={() => scrollTo(link.id)}
                >
                  <span>{link.label}</span>
                  <ChevronRightIcon className="size-4 text-muted-foreground" />
                </Button>
              ))}
              <div className="p-4 bg-muted/30 border-t">
                <Button className="w-full">Simpan Perubahan</Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-3">
          <ProfileBiodataCard
            profile={profile}
            onChangeProfile={(partial) => setProfile({ ...profile, ...partial })}
          />
          <ProfileAboutCard about={profile.about} onAboutChange={(v) => setProfile({ ...profile, about: v })} />
          <ProfileLinksCard links={profile.links} />
          <ProfileExperienceCard experience={profile.experience} />
          <ProfileEducationCard education={profile.education} />
          <ProfileSkillsCard
            skills={profile.skills}
            newSkill={newSkill}
            onNewSkillChange={setNewSkill}
            onAddSkill={handleAddSkill}
            onRemoveSkill={handleRemoveSkill}
          />
        </div>
      </div>
    </div>
  )
}
