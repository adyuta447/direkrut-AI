"use client"

import { useState } from "react"
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

const KNOWN_DEPTS = ["Engineering", "Design", "Marketing", "HR"]
const KNOWN_TYPES = ["Penuh Waktu", "Paruh Waktu", "Kontrak"]

interface JobFormFieldsProps {
  selectedJob: any
}

export function JobFormFields({ selectedJob }: JobFormFieldsProps) {
  const initialDept = selectedJob?.department || ""
  const initialType = selectedJob?.type || ""

  const isInitialDeptCustom =
    initialDept && !KNOWN_DEPTS.some((d) => d.toLowerCase() === initialDept.toLowerCase())
  const isInitialTypeCustom = initialType && !KNOWN_TYPES.includes(initialType)

  const matchedDept = KNOWN_DEPTS.find((d) => d.toLowerCase() === initialDept.toLowerCase())
  const [deptMode, setDeptMode] = useState(isInitialDeptCustom ? "Lainnya" : matchedDept || "")
  const [customDept, setCustomDept] = useState(isInitialDeptCustom ? initialDept : "")

  const [typeMode, setTypeMode] = useState(isInitialTypeCustom ? "Lainnya" : initialType || "")
  const [customType, setCustomType] = useState(isInitialTypeCustom ? initialType : "")

  const [hasTimeline, setHasTimeline] = useState(!!selectedJob?.timeline)
  const initialStartDate = selectedJob?.timeline?.from
    ? new Date(selectedJob.timeline.from).toISOString().split("T")[0]
    : ""
  const initialEndDate = selectedJob?.timeline?.to
    ? new Date(selectedJob.timeline.to).toISOString().split("T")[0]
    : ""

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="title">Judul Pekerjaan</Label>
        <Input
          id="title"
          placeholder="Contoh: Software Engineer"
          defaultValue={selectedJob?.title || ""}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <div className="space-y-2">
          <Label>Departemen</Label>
          <Select value={deptMode} onValueChange={(val: any) => val && setDeptMode(val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih..." />
            </SelectTrigger>
            <SelectContent>
              {KNOWN_DEPTS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
              <SelectItem value="Lainnya">Lainnya...</SelectItem>
            </SelectContent>
          </Select>
          {deptMode === "Lainnya" && (
            <Input
              placeholder="Tuliskan nama departemen..."
              value={customDept}
              onChange={(e) => setCustomDept(e.target.value)}
              className="mt-2"
              required
            />
          )}
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

      <div className="space-y-2">
        <Label htmlFor="salaryRange">Rentang Gaji (Opsional)</Label>
        <Input
          id="salaryRange"
          placeholder="Contoh: Rp 5.000.000 - Rp 10.000.000"
          defaultValue={selectedJob?.salaryRange || ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Lokasi</Label>
        <Input
          id="location"
          placeholder="Contoh: Jakarta (Hybrid)"
          defaultValue={selectedJob?.location || ""}
          required
        />
      </div>

      <div className="border-t pt-4 mt-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Label className="text-base font-semibold">Batas Waktu (Timeline)</Label>
            <p className="text-sm text-muted-foreground">
              Aktifkan jika lowongan memiliki batas waktu (misal: Magang)
            </p>
          </div>
          <Switch checked={hasTimeline} onCheckedChange={setHasTimeline} />
        </div>
        {hasTimeline && (
          <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border border-border">
            <div className="space-y-2">
              <Label htmlFor="date-from">Tanggal Mulai</Label>
              <Input type="date" id="date-from" required defaultValue={initialStartDate} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to">Tanggal Berakhir</Label>
              <Input type="date" id="date-to" required defaultValue={initialEndDate} />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 pt-2 border-t mt-2">
        <Label htmlFor="description">Deskripsi Pekerjaan</Label>
        <Textarea
          id="description"
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
          placeholder="Tuliskan kualifikasi (pisahkan dengan baris baru)"
          className="min-h-[100px]"
          defaultValue={selectedJob?.requirements?.join("\n") || ""}
        />
      </div>
    </div>
  )
}
