import * as React from "react"
import Image from "next/image"
import { PenIcon, PlusIcon, TrashIcon, LinkIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ConfirmDialog } from "@/components/molecules/dashboard/ConfirmDialog"

export function DraftBadge() {
  return (
    <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning text-[11px] font-medium">
      Draft
    </Badge>
  )
}

export function SaveDraftActions({
  onCancel, onSave, isDirty = false,
}: { onCancel: () => void; onSave: (status: "draft" | "saved") => void; isDirty?: boolean }) {
  const [confirmDiscard, setConfirmDiscard] = React.useState(false)
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button type="button" variant="ghost" onClick={() => (isDirty ? setConfirmDiscard(true) : onCancel())}>Batal</Button>
      <Button type="button" variant="outline" className="border-hairline" onClick={() => onSave("draft")}>Simpan Draft</Button>
      <Button type="button" onClick={() => onSave("saved")}>Simpan</Button>
      <ConfirmDialog
        open={confirmDiscard}
        onOpenChange={setConfirmDiscard}
        title="Buang perubahan?"
        description="Input yang sudah kamu ketik belum disimpan dan akan hilang."
        confirmLabel="Buang"
        onConfirm={onCancel}
      />
    </div>
  )
}

export function ProfileAboutCard({
  about, aboutStatus, onSave,
}: { about: string; aboutStatus?: "draft" | "saved"; onSave: (value: string, status: "draft" | "saved") => void }) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(about)

  const startEditing = () => { setDraft(about); setIsEditing(true) }
  const save = (status: "draft" | "saved") => { onSave(draft, status); setIsEditing(false) }

  return (
    <Card id="section-about" className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 scroll-mt-6 overflow-hidden pt-0">
      <CardHeader className="flex flex-row items-center justify-between gap-3 rounded-t-3xl bg-primary py-4 text-white">
        <CardTitle className="flex items-center gap-3 text-[20px] font-semibold text-white">Tentang Saya</CardTitle>
        {!isEditing && (
          about ? (
            <Button variant="ghost" size="icon" className="rounded-full bg-white/95 text-ink hover:bg-white" onClick={startEditing}>
              <PenIcon className="size-4" />
            </Button>
          ) : (
            <Button variant="ghost" className="rounded-full bg-white/95 text-ink font-semibold hover:bg-white gap-1" onClick={startEditing}>
              <PlusIcon className="size-4" /> Tambah
            </Button>
          )
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              autoFocus
              className="min-h-[150px] text-base"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ceritakan tentang diri Anda..."
            />
            <SaveDraftActions isDirty={draft !== about} onCancel={() => setIsEditing(false)} onSave={save} />
          </div>
        ) : about ? (
          <div className="space-y-2">
            {aboutStatus === "draft" && <DraftBadge />}
            <p className="text-[16px] leading-[1.6] text-ink">{about}</p>
          </div>
        ) : (
          <div className="text-center py-10 px-6 rounded-2xl bg-surface-1">
            <Image src="/dashboard/profile/profiles.svg" alt="" width={200} height={150} unoptimized className="pointer-events-none mx-auto mb-5 h-28 w-auto select-none" />
            <p className="text-[20px] font-bold tracking-[-0.01em] text-ink">Ceritakan siapa kamu</p>
            <p className="mt-1 text-[14px] text-ink-muted">Beritahu perusahaan apa yang membuatmu unggul untuk dipekerjakan</p>
            <Button variant="link" size="sm" className="mt-2 text-primary font-semibold" onClick={startEditing}>+ Tambahkan Deskripsi</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface LinkItem { id: string; platform: string; url: string; status?: "draft" | "saved" }
type LinkFormData = { platform: string; url: string }

function LinkForm({
  initial, onCancel, onSave,
}: { initial: LinkFormData; onCancel: () => void; onSave: (data: LinkFormData, status: "draft" | "saved") => void }) {
  const [form, setForm] = React.useState(initial)
  return (
    <div className="grid gap-4 p-4 border border-hairline rounded-2xl bg-surface-1">
      <div className="grid gap-2">
        <Label>Platform</Label>
        <Input autoFocus value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} placeholder="Contoh: LinkedIn, GitHub, Portofolio Pribadi" />
      </div>
      <div className="grid gap-2">
        <Label>URL / Tautan</Label>
        <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://" />
      </div>
      <SaveDraftActions isDirty={form.platform !== initial.platform || form.url !== initial.url} onCancel={onCancel} onSave={(status) => onSave(form, status)} />
    </div>
  )
}

export function ProfileLinksCard({
  links, onAdd, onUpdate, onRemove,
}: {
  links: LinkItem[]
  onAdd: (data: LinkFormData, status: "draft" | "saved") => void
  onUpdate: (id: string, data: LinkFormData, status: "draft" | "saved") => void
  onRemove: (id: string) => void
}) {
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  return (
    <Card id="section-links" className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 scroll-mt-6 overflow-hidden pt-0">
      <CardHeader className="flex flex-row items-center justify-between gap-3 rounded-t-3xl bg-brand-accent-strong py-4 text-white">
        <CardTitle className="flex items-center gap-3 text-[20px] font-semibold text-white">Tautan Sosial &amp; Portofolio</CardTitle>
        <Button variant="ghost" className="rounded-full bg-white/95 text-ink font-semibold hover:bg-white gap-1" onClick={() => setEditingId("new")}>
          <PlusIcon className="size-4" /> Tambah
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {editingId === "new" && (
          <LinkForm initial={{ platform: "", url: "" }} onCancel={() => setEditingId(null)} onSave={(data, status) => { onAdd(data, status); setEditingId(null) }} />
        )}
        {links.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {links.map((link) =>
              editingId === link.id ? (
                <div key={link.id} className="sm:col-span-2">
                  <LinkForm
                    initial={{ platform: link.platform, url: link.url }}
                    onCancel={() => setEditingId(null)}
                    onSave={(data, status) => { onUpdate(link.id, data, status); setEditingId(null) }}
                  />
                </div>
              ) : (
                <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/50 transition-colors group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-muted rounded-md text-foreground/70 shrink-0"><LinkIcon className="size-5" /></div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm truncate">{link.platform}</p>
                        {link.status === "draft" && <DraftBadge />}
                      </div>
                      <a href={`https://${link.url}`} target="_blank" rel="noreferrer" className="text-sm text-info hover:underline truncate block">{link.url}</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" onClick={() => setEditingId(link.id)}><PenIcon className="size-4" /></Button>
                    <Button variant="ghost" size="icon" className="size-8 text-destructive/70 hover:text-destructive" onClick={() => setDeletingId(link.id)}><TrashIcon className="size-4" /></Button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
        {links.length === 0 && editingId !== "new" && (
          <div className="text-center py-10 px-6 rounded-2xl bg-surface-1">
            <Image src="/dashboard/profile/portfolio.svg" alt="" width={200} height={150} unoptimized className="pointer-events-none mx-auto mb-5 h-28 w-auto select-none" />
            <p className="text-[20px] font-bold tracking-[-0.01em] text-ink">Pamerin karya terbaikmu</p>
            <p className="mt-1 text-[14px] text-ink-muted">Tautkan profil profesional Anda untuk dilirik HRD.</p>
            <Button variant="link" size="sm" className="mt-2 text-primary font-semibold" onClick={() => setEditingId("new")}>+ Tambahkan Tautan</Button>
          </div>
        )}
        <ConfirmDialog
          open={deletingId !== null}
          onOpenChange={(open) => !open && setDeletingId(null)}
          title="Hapus tautan ini?"
          description="Tindakan ini tidak bisa dibatalkan."
          confirmLabel="Hapus"
          onConfirm={() => deletingId && onRemove(deletingId)}
        />
      </CardContent>
    </Card>
  )
}

export function ProfileSkillsCard({
  skills, newSkill, onNewSkillChange, onAddSkill, onRemoveSkill,
}: {
  skills: string[]
  newSkill: string
  onNewSkillChange: (v: string) => void
  onAddSkill: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onRemoveSkill: (s: string) => void
}) {
  const [isEditing, setIsEditing] = React.useState(false)

  return (
    <Card id="section-skills" className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 scroll-mt-6 overflow-hidden pt-0">
      <CardHeader className="flex flex-row items-center justify-between gap-3 rounded-t-3xl bg-success py-4 text-white">
        <CardTitle className="flex items-center gap-3 text-[20px] font-semibold text-white">Keahlian (Skills)</CardTitle>
        {!isEditing && (
          skills.length > 0 ? (
            <Button variant="ghost" size="icon" className="rounded-full bg-white/95 text-ink hover:bg-white" onClick={() => setIsEditing(true)}>
              <PenIcon className="size-4" />
            </Button>
          ) : (
            <Button variant="ghost" className="rounded-full bg-white/95 text-ink font-semibold hover:bg-white gap-1" onClick={() => setIsEditing(true)}>
              <PlusIcon className="size-4" /> Tambah
            </Button>
          )
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="relative">
              <Input autoFocus placeholder="Ketik lalu tekan Enter..." value={newSkill} onChange={(e) => onNewSkillChange(e.target.value)} onKeyDown={onAddSkill} className="pl-3 pr-16" />
              <Button size="sm" variant="ghost" className="absolute right-1 top-1 h-7 px-2 text-xs" onClick={() => onAddSkill({ key: "Enter" } as React.KeyboardEvent<HTMLInputElement>)}>Tambah</Button>
            </div>
            <div className="flex flex-wrap gap-2 p-4 border rounded-lg min-h-[80px] bg-muted/10 content-start">
              {skills.map((skill, i) => (
                <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm bg-primary text-primary-foreground flex items-center gap-2">
                  {skill}
                  <button onClick={() => onRemoveSkill(skill)} className="hover:text-destructive rounded-full p-0.5 transition-colors focus:outline-none">
                    <TrashIcon className="size-3" />
                  </button>
                </Badge>
              ))}
              {skills.length === 0 && <span className="text-muted-foreground text-sm flex items-center h-full w-full justify-center">Belum ada skill yang ditambahkan.</span>}
            </div>
            <div className="flex justify-end"><Button onClick={() => setIsEditing(false)}>Selesai</Button></div>
          </div>
        ) : skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <Badge key={i} variant="secondary" className="rounded-full bg-surface-1 px-4 py-1.5 text-[13px] font-medium text-ink border-0 hover:bg-surface-2">{skill}</Badge>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 rounded-2xl bg-surface-1">
            <Image src="/dashboard/profile/skills.svg" alt="" width={200} height={150} unoptimized className="pointer-events-none mx-auto mb-5 h-28 w-auto select-none" />
            <p className="text-[20px] font-bold tracking-[-0.01em] text-ink">Tunjukkan keahlianmu</p>
            <p className="mt-1 text-[14px] text-ink-muted">Beritahu apa yang kamu kuasai untuk menarik perusahaan top.</p>
            <Button variant="link" size="sm" className="mt-2 text-primary font-semibold" onClick={() => setIsEditing(true)}>+ Tambahkan Skill</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
