"use client"

import { useState } from "react"
import Link from "next/link"
import { IconBriefcase, IconCalendarEvent, IconFileDescription, IconMapPin, IconPlus } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDashboard } from "@/context/DashboardContext"
import { Job } from "@/lib/types"
import { TagInput } from "@/components/atoms/shared/TagInput"
import { IconSparkles } from "@tabler/icons-react"

const KNOWN_TYPES = ["Penuh Waktu", "Paruh Waktu", "Kontrak"]

interface JobFormFieldsProps {
  selectedJob: Job | null | undefined
}

/** Nilai form lowongan hasil ekstraksi FormData -- dipakai halaman Buat & Edit. */
export interface JobFormValues {
  title: string
  department: string
  type: string
  salaryRange: string
  location: string
  description: string
  requirements: string[]
  timeline?: { from: string; to: string }
  requiredSkills: string[]
  preferredSkills: string[]
  keyResponsibilities: string
  minExperienceYears: number
  educationRequirement: string
  candidateType: string
}

export function parseJobFormValues(formData: FormData): JobFormValues {
  const requirementsRaw = (formData.get("requirements") as string) || ""
  const requirements = requirementsRaw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
  const hasTimeline = formData.get("hasTimeline") === "1"
  const dateFrom = (formData.get("dateFrom") as string) || ""
  const dateTo = (formData.get("dateTo") as string) || ""
  
  let requiredSkills: string[] = []
  let preferredSkills: string[] = []
  try {
    requiredSkills = JSON.parse((formData.get("requiredSkills") as string) || "[]")
    preferredSkills = JSON.parse((formData.get("preferredSkills") as string) || "[]")
  } catch (e) {
    // skip
  }

  return {
    title: ((formData.get("title") as string) || "").trim() || "Lowongan Tanpa Judul",
    department: (formData.get("department") as string) || "Umum",
    type: (formData.get("type") as string) || "Penuh Waktu",
    salaryRange: (formData.get("salaryRange") as string) || "",
    location: (formData.get("location") as string) || "",
    description: (formData.get("description") as string) || "",
    requirements,
    timeline: hasTimeline && dateFrom && dateTo ? { from: dateFrom, to: dateTo } : undefined,
    requiredSkills,
    preferredSkills,
    keyResponsibilities: (formData.get("keyResponsibilities") as string) || "",
    minExperienceYears: parseInt((formData.get("minExperienceYears") as string) || "0", 10),
    educationRequirement: (formData.get("educationRequirement") as string) || "",
    candidateType: (formData.get("candidateType") as string) || "any",
  }
}

function SectionLabel({ icon: Icon, children }: { icon: typeof IconBriefcase; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>
      <h3 className="text-[15px] font-semibold text-ink">{children}</h3>
    </div>
  )
}

export function JobFormFields({ selectedJob }: JobFormFieldsProps) {
  const { departments } = useDashboard()
  const initialDept = selectedJob?.department || ""
  const initialType = selectedJob?.type || ""
  const [requirementsText, setRequirementsText] = useState(selectedJob?.requirements?.join("\n") || "")
  const requirementsPreview = requirementsText
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)

  const isInitialTypeCustom = initialType && !KNOWN_TYPES.includes(initialType)

  const [deptMode, setDeptMode] = useState(initialDept)
  const [typeMode, setTypeMode] = useState(isInitialTypeCustom ? "Lainnya" : initialType || "")
  const [customType, setCustomType] = useState(isInitialTypeCustom ? initialType : "")

  const [hasTimeline, setHasTimeline] = useState(!!selectedJob?.timeline)
  const initialStartDate = selectedJob?.timeline?.from
    ? new Date(selectedJob.timeline.from).toISOString().split("T")[0]
    : ""
  const initialEndDate = selectedJob?.timeline?.to
    ? new Date(selectedJob.timeline.to).toISOString().split("T")[0]
    : ""

  const [requiredSkills, setRequiredSkills] = useState<string[]>(selectedJob?.requiredSkills || [])
  const [preferredSkills, setPreferredSkills] = useState<string[]>(selectedJob?.preferredSkills || [])
  const [candidateType, setCandidateType] = useState(selectedJob?.candidateType || "any")

  // Departemen lama yang udah kepakai tapi kebetulan udah dihapus dari daftar
  // dikelola -- tetap ditampilkan sebagai opsi biar form edit gak blank.
  const deptOptions =
    initialDept && !departments.some((d) => d.name === initialDept)
      ? [{ id: initialDept, name: initialDept }, ...departments]
      : departments

  const resolvedDept = deptMode
  const resolvedType = typeMode === "Lainnya" ? customType : typeMode

  return (
    <div className="grid gap-8">
      {/* Nilai final Departemen/Tipe/Timeline/Skills dikirim lewat hidden input supaya bisa
          diambil langsung dari FormData saat submit, tanpa state terpisah di parent. */}
      <input type="hidden" name="department" value={resolvedDept} />
      <input type="hidden" name="type" value={resolvedType} />
      <input type="hidden" name="hasTimeline" value={hasTimeline ? "1" : ""} />
      <input type="hidden" name="requiredSkills" value={JSON.stringify(requiredSkills)} />
      <input type="hidden" name="preferredSkills" value={JSON.stringify(preferredSkills)} />
      <input type="hidden" name="candidateType" value={candidateType} />

      <div className="space-y-4">
        <SectionLabel icon={IconBriefcase}>Informasi Dasar</SectionLabel>
        <div className="space-y-2">
          <Label htmlFor="title">Judul Pekerjaan</Label>
          <Input
            id="title"
            name="title"
            placeholder="Contoh: Software Engineer"
            defaultValue={selectedJob?.title || ""}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label>Departemen</Label>
              <Link
                href="/hrd/departments"
                target="_blank"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <IconPlus className="size-3.5" /> Kelola Departemen
              </Link>
            </div>
            <Select value={deptMode} onValueChange={(val: string | null) => val && setDeptMode(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih..." />
              </SelectTrigger>
              <SelectContent>
                {deptOptions.map((d) => (
                  <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tipe Pekerjaan</Label>
            <Select value={typeMode} onValueChange={(val: string | null) => val && setTypeMode(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih..." />
              </SelectTrigger>
              <SelectContent>
                {KNOWN_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
                <SelectItem value="Lainnya">Lainnya...</SelectItem>
              </SelectContent>
            </Select>
            {typeMode === "Lainnya" && (
              <Input
                placeholder="Tuliskan tipe pekerjaan..."
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                className="mt-2"
                required
              />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-hairline pt-6">
        <SectionLabel icon={IconMapPin}>Kompensasi &amp; Lokasi</SectionLabel>
        <div className="space-y-2">
          <Label htmlFor="salaryRange">Rentang Gaji (Opsional)</Label>
          <Input
            id="salaryRange"
            name="salaryRange"
            placeholder="Contoh: Rp 5.000.000 - Rp 10.000.000"
            defaultValue={selectedJob?.salaryRange || ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Lokasi</Label>
          <Input
            id="location"
            name="location"
            placeholder="Contoh: Jakarta (Hybrid)"
            defaultValue={selectedJob?.location || ""}
            required
          />
        </div>
      </div>

      <div className="border-t border-hairline pt-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <SectionLabel icon={IconCalendarEvent}>Batas Waktu (Opsional)</SectionLabel>
          <Switch checked={hasTimeline} onCheckedChange={setHasTimeline} />
        </div>
        <p className="text-sm text-muted-foreground -mt-2 mb-4">
          Nyalain kalau lowongan ini ada tenggat, misal buat program magang
        </p>
        {hasTimeline && (
          <div className="grid grid-cols-2 gap-4 bg-surface-1 p-4 rounded-2xl border border-hairline">
            <div className="space-y-2">
              <Label htmlFor="date-from">Tanggal Mulai</Label>
              <Input type="date" id="date-from" name="dateFrom" required defaultValue={initialStartDate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to">Tanggal Berakhir</Label>
              <Input type="date" id="date-to" name="dateTo" required defaultValue={initialEndDate} />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 border-t border-hairline pt-6">
        <SectionLabel icon={IconFileDescription}>Deskripsi &amp; Kualifikasi</SectionLabel>
        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi Pekerjaan (Umum)</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Jelaskan peran secara umum..."
            className="min-h-[80px]"
            defaultValue={selectedJob?.description || ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="requirements">Kualifikasi Tambahan</Label>
          <p className="text-sm text-muted-foreground">
            Satu poin singkat per baris (bukan paragraf) -- tiap baris bakal tampil sebagai chip terpisah ke kandidat.
          </p>
          <Textarea
            id="requirements"
            name="requirements"
            placeholder={"Contoh:\nMinimal 2 tahun pengalaman di bidang terkait\nMenguasai Microsoft Excel\nTerbiasa kerja under pressure"}
            className="min-h-[100px]"
            value={requirementsText}
            onChange={(e) => setRequirementsText(e.target.value)}
          />
          {requirementsPreview.length > 0 && (
            <div className="space-y-1.5 rounded-2xl border border-hairline bg-surface-1 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Preview ke kandidat
              </p>
              <div className="flex flex-wrap gap-2">
                {requirementsPreview.map((req, i) => (
                  <span key={i} className="text-[14px] rounded-full bg-canvas border border-hairline px-4 py-1.5 text-ink">
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 border-t border-hairline pt-6">
        <div className="flex flex-col gap-1 mb-2">
          <SectionLabel icon={IconSparkles}>Data Spesifik untuk Screening AI</SectionLabel>
          <p className="text-[13px] text-ink-muted pl-9">Isi bagian ini selengkap mungkin untuk meningkatkan akurasi screening AI. Data ini akan digunakan AI sebagai acuan untuk mencocokkan skor tiap komponen dari CV kandidat.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipe Kandidat Dicari</Label>
            <Select value={candidateType} onValueChange={(val: string) => setCandidateType(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih tipe kandidat..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Bebas (Semua Kalangan)</SelectItem>
                <SelectItem value="fresh_graduate">Fresh Graduate Diutamakan</SelectItem>
                <SelectItem value="professional">Profesional / Berpengalaman</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="minExperienceYears">Minimum Pengalaman (Tahun)</Label>
            <Input
              id="minExperienceYears"
              name="minExperienceYears"
              type="number"
              min="0"
              placeholder="Contoh: 2"
              defaultValue={selectedJob?.minExperienceYears || 0}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="educationRequirement">Syarat Pendidikan</Label>
          <Input
            id="educationRequirement"
            name="educationRequirement"
            placeholder="Contoh: Minimal S1 Teknik Informatika atau setara"
            defaultValue={selectedJob?.educationRequirement || ""}
          />
        </div>

        <div className="space-y-2 mt-4">
          <Label>Required Skills (Wajib)</Label>
          <p className="text-[12px] text-ink-muted -mt-1 mb-1">Skill yang wajib dimiliki kandidat.</p>
          <TagInput
            tags={requiredSkills}
            setTags={setRequiredSkills}
            placeholder="Ketik skill (contoh: React, Golang) lalu tekan Enter..."
          />
        </div>

        <div className="space-y-2 mt-2">
          <Label>Preferred Skills (Nilai Plus)</Label>
          <p className="text-[12px] text-ink-muted -mt-1 mb-1">Skill tambahan yang jadi nilai plus kalau ada.</p>
          <TagInput
            tags={preferredSkills}
            setTags={setPreferredSkills}
            placeholder="Ketik skill (contoh: Docker, AWS) lalu tekan Enter..."
          />
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="keyResponsibilities">Tanggung Jawab Utama (Key Responsibilities)</Label>
          <p className="text-[12px] text-ink-muted -mt-1 mb-1">Pekerjaan apa saja yang akan dilakukan sehari-hari? (Pisahkan dengan baris baru)</p>
          <Textarea
            id="keyResponsibilities"
            name="keyResponsibilities"
            placeholder="- Mengembangkan fitur baru\n- Melakukan code review..."
            className="min-h-[100px]"
            defaultValue={selectedJob?.keyResponsibilities || ""}
          />
        </div>
      </div>
    </div>
  )
}
