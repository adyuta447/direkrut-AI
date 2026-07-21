"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronRightIcon, XIcon } from "lucide-react"
import { IconProgress } from "@tabler/icons-react"
import { NoticeDialog } from "@/components/molecules/dashboard/NoticeDialog"
import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { ProfileAIBanner } from "@/components/molecules/dashboard/ProfileAIBanner"
import { ProfileBiodataCard } from "@/components/molecules/dashboard/ProfileBiodataCard"
import { ProfileAboutCard, ProfileLinksCard, ProfileSkillsCard } from "@/components/molecules/dashboard/ProfileSectionCards"
import { ProfileExperienceCard, ProfileEducationCard } from "@/components/molecules/dashboard/ProfileExperienceCard"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useDashboard } from "@/context/DashboardContext"
import { getMyProfile, updateMyProfile, uploadCV, type CandidateProfile } from "@/services/candidateService"
import { parseCV } from "@/services/aiService"

const SECTION_LINKS = [
  { id: "section-biodata", label: "Biodata" },
  { id: "section-about", label: "Tentang Saya" },
  { id: "section-links", label: "Tautan Sosial & Portofolio" },
  { id: "section-experience", label: "Pengalaman Kerja" },
  { id: "section-education", label: "Pendidikan" },
  { id: "section-skills", label: "Keahlian & Sertifikasi" },
]

// Kosong semua -- gak ada data karangan; nama diisi dari akun yang login,
// sisanya diisi manual atau otomatis dari hasil AI baca CV.
const INITIAL_PROFILE: CandidateProfile & { aboutStatus?: "draft" | "saved" } = {
  name: "",
  phone: "",
  location: "",
  age: "",
  gender: "",
  photoUrl: undefined,
  coverUrl: undefined,
  about: "",
  aboutStatus: undefined,
  experience: [],
  education: [],
  skills: [],
  links: [],
}

const genId = () => Math.random().toString(36).slice(2, 10)

export default function CandidateProfilePage() {
  const { isProfileComplete, setIsProfileComplete, currentUser } = useDashboard()
  const [isUploading, setIsUploading] = React.useState(false)
  const [isSimulatingAI, setIsSimulatingAI] = React.useState(false)
  const [hasAutoFilled, setHasAutoFilled] = React.useState(isProfileComplete)
  const [profile, setProfile] = React.useState(() => ({
    ...INITIAL_PROFILE,
    name: currentUser?.name ?? "",
  }))
  const [newSkill, setNewSkill] = React.useState("")
  const [notice, setNotice] = React.useState<string | null>(null)
  // Banner sukses auto-fill bisa ditutup -- murni state tampilan, gak
  // ngaruh ke data profil yang udah kesimpen.
  const [successDismissed, setSuccessDismissed] = React.useState(false)
  // CV lamaran yang udah pernah diupload kandidat (pas apply) -- kalau ada,
  // profil bisa diisi otomatis dari situ tanpa upload ulang; hasil parse-nya
  // di-cache per file, jadi gak ada proses screening/baca-CV ulang.
  const [existingCvKey, setExistingCvKey] = React.useState<string | null>(null)

  // Tarik profil asli begitu halaman ke-mount -- kalau belum pernah diisi
  // (akun baru), backend balikin field kosong dan INITIAL_PROFILE tetap
  // dipakai buat sisanya (mis. placeholder nama demo).
  React.useEffect(() => {
    let cancelled = false
    getMyProfile().then((fetched) => {
      if (!cancelled && fetched) {
        setProfile((prev) => ({ ...prev, ...fetched, aboutStatus: fetched.about ? "saved" : prev.aboutStatus }))
        if (fetched.experience.length || fetched.education.length || fetched.skills.length) {
          setHasAutoFilled(true)
        }
        if (fetched.cvFileUrl) setExistingCvKey(fetched.cvFileUrl)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const notify = (message: string) => setNotice(message)
  const notifyStatus = (status: "draft" | "saved") =>
    notify(status === "draft" ? "Draft disimpan" : "Perubahan disimpan")

  // Simpan lokal (langsung kelihatan) + kirim ke backend di belakang layar
  // (fire-and-forget, sama kayak pola addJob/applyToJob) -- satu fungsi
  // dipakai semua aksi save di halaman ini, termasuk tombol "Simpan
  // Perubahan" di sidebar.
  const persistProfile = (next: typeof profile) => {
    setProfile(next)
    void updateMyProfile(next)
  }

  // Sama kayak persistProfile, tapi pakai functional updater -- dipanggil
  // langsung setelah onChangeProfile tanpa nunggu render (mis. foto avatar),
  // jadi gak boleh ngandelin closure `profile` yang mungkin masih basi.
  const persistProfilePatch = (partial: Partial<typeof profile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...partial }
      void updateMyProfile(next)
      return next
    })
  }

  // Isi profil dari hasil AI baca CV (dipakai dua jalur: upload file baru,
  // atau salin dari CV lamaran yang udah ada -- yang kedua gak perlu upload
  // dan hasil parse-nya udah di-cache, jadi gak ada screening ulang).
  // overwrite=false (jalur salin/pertama kali): jangan nimpa bagian yang udah
  // keisi. overwrite=true (upload file baru buat UPDATE): hasil baca CV baru
  // menimpa isian lama selama parse-nya beneran nemu konten.
  const fillProfileFromCv = async (objectKey: string, overwrite = false) => {
    setIsSimulatingAI(true)
    try {
      const parsed = await parseCV(currentUser?.id ?? "profile", objectKey)
      setIsSimulatingAI(false)
      setHasAutoFilled(true)
      setSuccessDismissed(false)
      setIsProfileComplete(true)
      const mergedSkills = Array.from(new Set([...profile.skills, ...parsed.skills]))
      const parsedExperience = (parsed.work_history ?? []).map((w) => ({
        id: genId(), role: w.role, company: w.company,
        startDate: w.start_date, endDate: w.end_date, description: w.description,
        status: "saved" as const,
      }))
      const parsedEducation = (parsed.education ?? []).map((e) => ({
        id: genId(), school: e.school, degree: e.degree,
        startYear: e.start_year, endYear: e.end_year,
        status: "saved" as const,
      }))
      const useParsedAbout = parsed.summary.trim() !== "" && (overwrite || !profile.about.trim())
      // Aturan per-field: pakai hasil baca CV kalau CV-nya BENERAN nyantumin
      // data itu (dan lagi mode update, atau field lamanya masih kosong) --
      // kalau CV baru gak nyebut, data lama dipertahankan, gak dikosongin.
      const pick = (parsedVal: string | undefined, oldVal: string) =>
        parsedVal && parsedVal.trim() !== "" && (overwrite || !oldVal.trim()) ? parsedVal : oldVal
      const parsedLinks = (parsed.links ?? [])
        .filter((l) => l.url.trim() !== "")
        .map((l) => ({ id: genId(), platform: l.platform || "Website", url: l.url, status: "saved" as const }))
      persistProfile({
        ...profile,
        name: pick(parsed.name, profile.name),
        location: pick(parsed.location, profile.location),
        phone: pick(parsed.phone, profile.phone),
        gender: pick(parsed.gender, profile.gender),
        age: parsed.age != null && (overwrite || !profile.age.trim()) ? String(Math.round(parsed.age)) : profile.age,
        about: useParsedAbout ? parsed.summary : profile.about,
        aboutStatus: useParsedAbout ? "saved" : profile.aboutStatus,
        skills: mergedSkills,
        links:
          parsedLinks.length > 0 && (overwrite || profile.links.length === 0)
            ? parsedLinks
            : profile.links,
        experience:
          parsedExperience.length > 0 && (overwrite || profile.experience.length === 0)
            ? parsedExperience
            : profile.experience,
        education:
          parsedEducation.length > 0 && (overwrite || profile.education.length === 0)
            ? parsedEducation
            : profile.education,
      })
      notify("CV kamu berhasil dibaca AI -- ringkasan, skill, pengalaman, dan pendidikan udah keisi otomatis. Cek dan sesuaikan ya.")
    } catch {
      setIsSimulatingAI(false)
      notify("Gagal baca CV. Coba lagi ya.")
    }
  }

  const handleCVUpload = async (file: File) => {
    setIsUploading(true)
    // registerAsOfficialCv=false: CV di halaman profil cuma buat bantu AI
    // ngisiin profil (personal branding) -- BUKAN CV lamaran yang dikirim ke
    // HRD/discreen. CV resmi buat lamaran diupload di alur apply.
    const objectKey = await uploadCV(file, false)
    setIsUploading(false)
    if (!objectKey) {
      notify("Gagal upload CV. Coba lagi ya.")
      return
    }
    // Upload file baru = aksi eksplisit buat memperbarui -- hasil baca CV
    // baru boleh menimpa isian lama.
    await fillProfileFromCv(objectKey, true)
  }

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSkill.trim() !== "") {
      if (!profile.skills.includes(newSkill.trim())) {
        persistProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] })
      }
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    persistProfile({ ...profile, skills: profile.skills.filter((s) => s !== skillToRemove) })
  }

  const saveAbout = (value: string, status: "draft" | "saved") => {
    persistProfile({ ...profile, about: value, aboutStatus: status })
    notifyStatus(status)
  }

  const addLink = (data: { platform: string; url: string }, status: "draft" | "saved") => {
    persistProfile({ ...profile, links: [{ id: genId(), ...data, status }, ...profile.links] })
    notifyStatus(status)
  }
  const updateLink = (id: string, data: { platform: string; url: string }, status: "draft" | "saved") => {
    persistProfile({ ...profile, links: profile.links.map((l) => (l.id === id ? { ...l, ...data, status } : l)) })
    notifyStatus(status)
  }
  const removeLink = (id: string) => {
    persistProfile({ ...profile, links: profile.links.filter((l) => l.id !== id) })
    notify("Tautan dihapus")
  }

  const addExperience = (data: Omit<(typeof profile.experience)[number], "id" | "status">, status: "draft" | "saved") => {
    persistProfile({ ...profile, experience: [{ id: genId(), ...data, status }, ...profile.experience] })
    notifyStatus(status)
  }
  const updateExperience = (id: string, data: Omit<(typeof profile.experience)[number], "id" | "status">, status: "draft" | "saved") => {
    persistProfile({ ...profile, experience: profile.experience.map((x) => (x.id === id ? { ...x, ...data, status } : x)) })
    notifyStatus(status)
  }
  const removeExperience = (id: string) => {
    persistProfile({ ...profile, experience: profile.experience.filter((x) => x.id !== id) })
    notify("Pengalaman dihapus")
  }

  const addEducation = (data: Omit<(typeof profile.education)[number], "id" | "status">, status: "draft" | "saved") => {
    persistProfile({ ...profile, education: [{ id: genId(), ...data, status }, ...profile.education] })
    notifyStatus(status)
  }
  const updateEducation = (id: string, data: Omit<(typeof profile.education)[number], "id" | "status">, status: "draft" | "saved") => {
    persistProfile({ ...profile, education: profile.education.map((x) => (x.id === id ? { ...x, ...data, status } : x)) })
    notifyStatus(status)
  }
  const removeEducation = (id: string) => {
    persistProfile({ ...profile, education: profile.education.filter((x) => x.id !== id) })
    notify("Pendidikan dihapus")
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  const completionChecks = [
    profile.age.trim() !== "" && profile.gender.trim() !== "",
    profile.about.trim() !== "",
    profile.links.length > 0,
    profile.experience.length > 0,
    profile.education.length > 0,
    profile.skills.length > 0,
  ]
  const progress = Math.round(
    (completionChecks.filter(Boolean).length / completionChecks.length) * 100
  )
  const progressMessage =
    progress === 100
      ? "Mantap, profil kamu udah lengkap total! HRD bakal gampang ngelirik kamu."
      : progress >= 60
        ? "Profil kamu sudah cukup. Silakan kirimkan lamaran Anda sekarang juga!"
        : "Masih ada bagian yang kosong nih. Lengkapi biar makin dilirik HRD."

  return (
    <div className="p-4 md:p-8 pt-6 w-full max-w-7xl mx-auto space-y-6">
      <NoticeDialog message={notice} onClose={() => setNotice(null)} />
      <PageHeader className="mb-6" eyebrow="Personal Branding" title="Profil Saya" description="Profil yang lengkap bikin peluang dilirik HRD makin gede." />

      {!hasAutoFilled && existingCvKey && !isSimulatingAI && !isUploading && (
        <div className="rounded-3xl border border-hairline bg-canvas p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-[17px] font-semibold text-ink">CV lamaranmu udah ada di sistem</p>
            <p className="text-sm text-ink-muted mt-1">
              Gak perlu upload ulang -- profil bisa langsung diisi otomatis dari
              CV yang kamu pakai buat melamar (tanpa proses screening ulang).
            </p>
          </div>
          <Button className="shrink-0" onClick={() => fillProfileFromCv(existingCvKey)}>
            Isi Profil dari CV Lamaran
          </Button>
        </div>
      )}

      {!hasAutoFilled && (
        <ProfileAIBanner isUploading={isUploading} isSimulatingAI={isSimulatingAI} onFileSelected={handleCVUpload} />
      )}

      {hasAutoFilled && !successDismissed && (
        <div className="relative rounded-3xl border border-hairline bg-canvas p-6 flex flex-col sm:flex-row items-center gap-5">
          <button
            type="button"
            aria-label="Tutup"
            onClick={() => setSuccessDismissed(true)}
            className="absolute right-4 top-4 rounded-full p-1.5 text-ink-muted hover:bg-surface-1 hover:text-ink transition-colors"
          >
            <XIcon className="size-4" />
          </button>
          <Image src="/status/success.svg" alt="" width={160} height={100} unoptimized className="pointer-events-none h-20 w-auto shrink-0 select-none" />
          <div className="text-center sm:text-left flex-1">
            <p className="text-[20px] font-bold tracking-[-0.01em] text-ink">Profil Berhasil Dilengkapi oleh AI!</p>
            <p className="text-[14px] text-ink-muted mt-1">Silakan periksa kembali data di bawah ini. Tekan tombol Edit (ikon pensil) untuk memperbaiki bagian yang salah.</p>
          </div>
          <Button
            variant="outline"
            className="shrink-0 border-hairline"
            onClick={() => {
              setHasAutoFilled(false)
              setSuccessDismissed(false)
            }}
          >
            Perbarui dari CV Baru
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="space-y-6 lg:sticky lg:top-6">
            <div className="rounded-3xl bg-primary p-6 text-white">
              <div className="flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-[17px] font-semibold">
                  <IconProgress className="size-5" /> Kelengkapan
                </h3>
                <span className="text-2xl font-bold tabular-nums">{progress}%</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-4 text-sm text-white/85">{progressMessage}</p>
            </div>

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
                  <Button className="w-full" onClick={() => { persistProfile(profile); notify("Perubahan disimpan") }}>
                    Simpan Perubahan
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-3">
          <ProfileBiodataCard
            profile={{ ...profile, email: currentUser?.email ?? "" }}
            onChangeProfile={(partial) => setProfile({ ...profile, ...partial })}
            onSaveProfile={() => persistProfile(profile)}
            onSaveField={persistProfilePatch}
          />
          <ProfileAboutCard about={profile.about} aboutStatus={profile.aboutStatus} onSave={saveAbout} />
          <ProfileLinksCard links={profile.links} onAdd={addLink} onUpdate={updateLink} onRemove={removeLink} />
          <ProfileExperienceCard experience={profile.experience} onAdd={addExperience} onUpdate={updateExperience} onRemove={removeExperience} />
          <ProfileEducationCard education={profile.education} onAdd={addEducation} onUpdate={updateEducation} onRemove={removeEducation} />
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
