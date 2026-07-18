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

const KNOWN_TYPES = ["Penuh Waktu", "Paruh Waktu", "Kontrak"]

interface JobFormFieldsProps {
  selectedJob: any
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
  return {
    title: ((formData.get("title") as string) || "").trim() || "Lowongan Tanpa Judul",
    department: (formData.get("department") as string) || "Umum",
    type: (formData.get("type") as string) || "Penuh Waktu",
    salaryRange: (formData.get("salaryRange") as string) || "",
    location: (formData.get("location") as string) || "",
    description: (formData.get("description") as string) || "",
    requirements,
    timeline: hasTimeline && dateFrom && dateTo ? { from: dateFrom, to: dateTo } : undefined,
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
      {/* Nilai final Departemen/Tipe/Timeline dikirim lewat hidden input supaya bisa
          diambil langsung dari FormData saat submit, tanpa state terpisah di parent. */}
      <input type="hidden" name="department" value={resolvedDept} />
      <input type="hidden" name="type" value={resolvedType} />
      <input type="hidden" name="hasTimeline" value={hasTimeline ? "1" : ""} />

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
            <Select value={deptMode} onValueChange={(val: any) => val && setDeptMode(val)}>
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
            <Select value={typeMode} onValueChange={setTypeMode}>
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
          <Label htmlFor="description">Deskripsi Pekerjaan</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Jelaskan peran dan tanggung jawab..."
            className="min-h-[100px]"
            defaultValue={selectedJob?.description || ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="requirements">Kualifikasi Utama</Label>
          <Textarea
            id="requirements"
            name="requirements"
            placeholder="Tuliskan kualifikasi (pisahkan dengan baris baru)"
            className="min-h-[100px]"
            defaultValue={selectedJob?.requirements?.join("\n") || ""}
          />
        </div>
      </div>
    </div>
  )
}
