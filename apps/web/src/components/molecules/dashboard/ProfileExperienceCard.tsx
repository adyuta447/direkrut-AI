import * as React from "react"
import Image from "next/image"
import { PenIcon, PlusIcon, TrashIcon, BriefcaseIcon, GraduationCapIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DraftBadge, SaveDraftActions } from "@/components/molecules/dashboard/ProfileSectionCards"
import { ConfirmDialog } from "@/components/molecules/dashboard/ConfirmDialog"

interface ExperienceItem { id: string; role: string; company: string; startDate: string; endDate: string; description: string; status?: "draft" | "saved" }
interface EducationItem { id: string; school: string; degree: string; startYear: string; endYear: string; status?: "draft" | "saved" }

type ExperienceFormData = Omit<ExperienceItem, "id" | "status">
type EducationFormData = Omit<EducationItem, "id" | "status">

interface ProfileExperienceCardProps {
  experience: ExperienceItem[]
  onAdd: (data: ExperienceFormData, status: "draft" | "saved") => void
  onUpdate: (id: string, data: ExperienceFormData, status: "draft" | "saved") => void
  onRemove: (id: string) => void
}

interface ProfileEducationCardProps {
  education: EducationItem[]
  onAdd: (data: EducationFormData, status: "draft" | "saved") => void
  onUpdate: (id: string, data: EducationFormData, status: "draft" | "saved") => void
  onRemove: (id: string) => void
}

const EMPTY_EXPERIENCE: ExperienceFormData = { role: "", company: "", startDate: "", endDate: "", description: "" }
const EMPTY_EDUCATION: EducationFormData = { school: "", degree: "", startYear: "", endYear: "" }

function ExperienceForm({
  initial, onCancel, onSave,
}: { initial: ExperienceFormData; onCancel: () => void; onSave: (data: ExperienceFormData, status: "draft" | "saved") => void }) {
  const [form, setForm] = React.useState(initial)
  const set = (k: keyof ExperienceFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value })
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-hairline rounded-2xl bg-surface-1">
      <div className="grid gap-2 col-span-2"><Label>Posisi / Jabatan</Label><Input autoFocus value={form.role} onChange={set("role")} placeholder="Contoh: Software Engineer" /></div>
      <div className="grid gap-2 col-span-2"><Label>Nama Perusahaan</Label><Input value={form.company} onChange={set("company")} placeholder="Contoh: PT Teknologi Nusantara" /></div>
      <div className="grid gap-2"><Label>Mulai</Label><Input value={form.startDate} onChange={set("startDate")} placeholder="Contoh: Agt 2022" /></div>
      <div className="grid gap-2"><Label>Selesai</Label><Input value={form.endDate} onChange={set("endDate")} placeholder="Contoh: Sekarang" /></div>
      <div className="grid gap-2 col-span-2">
        <Label>Deskripsi Pekerjaan</Label>
        <Textarea className="min-h-[120px]" value={form.description} onChange={set("description")} placeholder="Jelaskan tanggung jawab dan pencapaian Anda..." />
      </div>
      <div className="col-span-2"><SaveDraftActions isDirty={JSON.stringify(form) !== JSON.stringify(initial)} onCancel={onCancel} onSave={(status) => onSave(form, status)} /></div>
    </div>
  )
}

function EducationForm({
  initial, onCancel, onSave,
}: { initial: EducationFormData; onCancel: () => void; onSave: (data: EducationFormData, status: "draft" | "saved") => void }) {
  const [form, setForm] = React.useState(initial)
  const set = (k: keyof EducationFormData) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value })
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-hairline rounded-2xl bg-surface-1">
      <div className="grid gap-2 col-span-2"><Label>Nama Institusi / Universitas</Label><Input autoFocus value={form.school} onChange={set("school")} placeholder="Contoh: Universitas Indonesia" /></div>
      <div className="grid gap-2 col-span-2"><Label>Gelar / Bidang Studi</Label><Input value={form.degree} onChange={set("degree")} placeholder="Contoh: S1 Ilmu Komputer" /></div>
      <div className="grid gap-2"><Label>Tahun Mulai</Label><Input type="number" value={form.startYear} onChange={set("startYear")} placeholder="2018" /></div>
      <div className="grid gap-2"><Label>Tahun Lulus</Label><Input type="number" value={form.endYear} onChange={set("endYear")} placeholder="2022" /></div>
      <div className="col-span-2"><SaveDraftActions isDirty={JSON.stringify(form) !== JSON.stringify(initial)} onCancel={onCancel} onSave={(status) => onSave(form, status)} /></div>
    </div>
  )
}

export function ProfileExperienceCard({ experience, onAdd, onUpdate, onRemove }: ProfileExperienceCardProps) {
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  return (
    <Card id="section-experience" className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 scroll-mt-6 overflow-hidden pt-0">
      <CardHeader className="flex flex-row items-center justify-between gap-3 rounded-t-3xl bg-primary py-4 text-white">
        <CardTitle className="flex items-center gap-3 text-[20px] font-semibold text-white">Pengalaman Kerja</CardTitle>
        <Button variant="ghost" className="rounded-full bg-white/95 text-neutral-900 font-semibold hover:bg-white gap-1" onClick={() => setEditingId("new")}>
          <PlusIcon className="size-4" /> Tambah
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {editingId === "new" && (
          <ExperienceForm initial={EMPTY_EXPERIENCE} onCancel={() => setEditingId(null)} onSave={(data, status) => { onAdd(data, status); setEditingId(null) }} />
        )}
        {experience.length > 0 && (
          <div className="space-y-4">
            {experience.map((exp, index) =>
              editingId === exp.id ? (
                <ExperienceForm
                  key={exp.id}
                  initial={exp}
                  onCancel={() => setEditingId(null)}
                  onSave={(data, status) => { onUpdate(exp.id, data, status); setEditingId(null) }}
                />
              ) : (
                <div key={exp.id} className={`flex gap-4 group ${index !== experience.length - 1 ? "border-b pb-6" : ""}`}>
                  <Avatar className="size-14 border shrink-0">
                    <AvatarFallback className="rounded-full bg-muted text-muted-foreground">
                      <BriefcaseIcon className="size-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-[17px] font-semibold leading-tight text-ink">{exp.role}</h4>
                          {exp.status === "draft" && <DraftBadge />}
                        </div>
                        <p className="text-sm font-medium mt-0.5">{exp.company}</p>
                        <p className="text-sm text-muted-foreground">{exp.startDate} - {exp.endDate}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" onClick={() => setEditingId(exp.id)}><PenIcon className="size-4" /></Button>
                        <Button variant="ghost" size="icon" className="size-8 text-destructive/70 hover:text-destructive" onClick={() => setDeletingId(exp.id)}><TrashIcon className="size-4" /></Button>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed pt-2 whitespace-pre-line">{exp.description}</p>
                  </div>
                </div>
              )
            )}
          </div>
        )}
        {experience.length === 0 && editingId !== "new" && (
          <div className="text-center py-10 px-6 rounded-2xl bg-surface-1">
            <Image src="/dashboard/profile/experience.svg" alt="" width={200} height={150} unoptimized className="pointer-events-none mx-auto mb-5 h-28 w-auto select-none" />
            <p className="text-[20px] font-bold tracking-[-0.01em] text-ink">Tunjukkan jam terbangmu</p>
            <p className="mt-1 text-[14px] text-ink-muted">77,9% perusahaan menganggap pengalaman kerja sebagai hal penting dalam lamaran.</p>
            <Button variant="link" size="sm" className="mt-2 text-primary font-semibold" onClick={() => setEditingId("new")}>+ Tambahkan Pengalaman</Button>
          </div>
        )}
        <ConfirmDialog
          open={deletingId !== null}
          onOpenChange={(open) => !open && setDeletingId(null)}
          title="Hapus pengalaman ini?"
          description="Tindakan ini tidak bisa dibatalkan."
          confirmLabel="Hapus"
          onConfirm={() => deletingId && onRemove(deletingId)}
        />
      </CardContent>
    </Card>
  )
}

export function ProfileEducationCard({ education, onAdd, onUpdate, onRemove }: ProfileEducationCardProps) {
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  return (
    <Card id="section-education" className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 scroll-mt-6 overflow-hidden pt-0">
      <CardHeader className="flex flex-row items-center justify-between gap-3 rounded-t-3xl bg-primary py-4 text-white">
        <CardTitle className="flex items-center gap-3 text-[20px] font-semibold text-white">Pendidikan</CardTitle>
        <Button variant="ghost" className="rounded-full bg-white/95 text-neutral-900 font-semibold hover:bg-white gap-1" onClick={() => setEditingId("new")}>
          <PlusIcon className="size-4" /> Tambah
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {editingId === "new" && (
          <EducationForm initial={EMPTY_EDUCATION} onCancel={() => setEditingId(null)} onSave={(data, status) => { onAdd(data, status); setEditingId(null) }} />
        )}
        {education.length > 0 && (
          <div className="space-y-4">
            {education.map((edu, index) =>
              editingId === edu.id ? (
                <EducationForm
                  key={edu.id}
                  initial={edu}
                  onCancel={() => setEditingId(null)}
                  onSave={(data, status) => { onUpdate(edu.id, data, status); setEditingId(null) }}
                />
              ) : (
                <div key={edu.id} className={`flex gap-4 group ${index !== education.length - 1 ? "border-b pb-6" : ""}`}>
                  <Avatar className="size-14 border shrink-0">
                    <AvatarFallback className="rounded-full bg-muted text-muted-foreground">
                      <GraduationCapIcon className="size-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-[17px] font-semibold leading-tight text-ink">{edu.school}</h4>
                          {edu.status === "draft" && <DraftBadge />}
                        </div>
                        <p className="text-sm font-medium mt-0.5">{edu.degree}</p>
                        <p className="text-sm text-muted-foreground">{edu.startYear} - {edu.endYear}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" onClick={() => setEditingId(edu.id)}><PenIcon className="size-4" /></Button>
                        <Button variant="ghost" size="icon" className="size-8 text-destructive/70 hover:text-destructive" onClick={() => setDeletingId(edu.id)}><TrashIcon className="size-4" /></Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
        {education.length === 0 && editingId !== "new" && (
          <div className="text-center py-10 px-6 rounded-2xl bg-surface-1">
            <Image src="/dashboard/profile/graduate.svg" alt="" width={200} height={150} unoptimized className="pointer-events-none mx-auto mb-5 h-28 w-auto select-none" />
            <p className="text-[20px] font-bold tracking-[-0.01em] text-ink">Cantumkan pendidikanmu</p>
            <p className="mt-1 text-[14px] text-ink-muted">Latar belakangmu dilihat perusahaan. Beritahu latar pendidikanmu.</p>
            <Button variant="link" size="sm" className="mt-2 text-primary font-semibold" onClick={() => setEditingId("new")}>+ Tambahkan Pendidikan</Button>
          </div>
        )}
        <ConfirmDialog
          open={deletingId !== null}
          onOpenChange={(open) => !open && setDeletingId(null)}
          title="Hapus pendidikan ini?"
          description="Tindakan ini tidak bisa dibatalkan."
          confirmLabel="Hapus"
          onConfirm={() => deletingId && onRemove(deletingId)}
        />
      </CardContent>
    </Card>
  )
}
