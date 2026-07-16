import * as React from "react"
import Image from "next/image"
import { PenIcon, PlusIcon, TrashIcon, LinkIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

export function ProfileAboutCard({ about, onAboutChange }: { about: string; onAboutChange: (v: string) => void }) {
  return (
    <Card id="section-about" className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 scroll-mt-6 overflow-hidden pt-0">
      <CardHeader className="flex flex-row items-center justify-between gap-3 rounded-t-3xl bg-primary py-4 text-white">
        <CardTitle className="flex items-center gap-3 text-[20px] font-semibold text-white">Tentang Saya</CardTitle>
        <Dialog>
          <DialogTrigger
            render={
              about ? (
                <Button variant="ghost" size="icon" className="rounded-full bg-white/95 text-ink hover:bg-white" />
              ) : (
                <Button variant="ghost" className="rounded-full bg-white/95 text-ink font-semibold hover:bg-white gap-1" />
              )
            }
          >
            {about ? <PenIcon className="size-4" /> : <><PlusIcon className="size-4" /> Tambah</>}
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ubah Tentang Saya</DialogTitle>
              <DialogDescription>Beritahu perusahaan apa yang membuatmu unggul.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea className="min-h-[150px] text-base" value={about} onChange={(e) => onAboutChange(e.target.value)} placeholder="Ceritakan tentang diri Anda..." />
            </div>
            <DialogFooter><Button>Simpan</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {about ? (
          <p className="text-[16px] leading-[1.6] text-ink">{about}</p>
        ) : (
          <div className="text-center py-10 px-6 rounded-2xl bg-surface-1">
            <Image src="/dashboard/profile/profiles.svg" alt="" width={200} height={150} unoptimized className="pointer-events-none mx-auto mb-5 h-28 w-auto select-none" />
            <p className="text-[20px] font-bold tracking-[-0.01em] text-ink">Ceritakan siapa kamu</p>
            <p className="mt-1 text-[14px] text-ink-muted">Beritahu perusahaan apa yang membuatmu unggul untuk dipekerjakan</p>
            <Button variant="link" size="sm" className="mt-2 text-primary font-semibold">+ Tambahkan Deskripsi</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function ProfileLinksCard({ links }: { links: Array<{ id: string; platform: string; url: string }> }) {
  return (
    <Card id="section-links" className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 scroll-mt-6 overflow-hidden pt-0">
      <CardHeader className="flex flex-row items-center justify-between gap-3 rounded-t-3xl bg-brand-accent-strong py-4 text-white">
        <CardTitle className="flex items-center gap-3 text-[20px] font-semibold text-white">Tautan Sosial &amp; Portofolio</CardTitle>
        <Dialog>
          <DialogTrigger render={<Button variant="ghost" className="rounded-full bg-white/95 text-ink font-semibold hover:bg-white gap-1" />}>
            <PlusIcon className="size-4" /> Tambah
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader><DialogTitle>Tambah Tautan</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2"><Label>Platform</Label><Input placeholder="Contoh: LinkedIn, GitHub, Portofolio Pribadi" /></div>
              <div className="grid gap-2"><Label>URL / Tautan</Label><Input placeholder="https://" /></div>
            </div>
            <DialogFooter><Button>Simpan</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {links.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {links.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/50 transition-colors group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-muted rounded-md text-foreground/70 shrink-0"><LinkIcon className="size-5" /></div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-sm truncate">{link.platform}</p>
                    <a href={`https://${link.url}`} target="_blank" rel="noreferrer" className="text-sm text-info hover:underline truncate block">{link.url}</a>
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
          <div className="text-center py-10 px-6 rounded-2xl bg-surface-1">
            <Image src="/dashboard/profile/portfolio.svg" alt="" width={200} height={150} unoptimized className="pointer-events-none mx-auto mb-5 h-28 w-auto select-none" />
            <p className="text-[20px] font-bold tracking-[-0.01em] text-ink">Pamerin karya terbaikmu</p>
            <p className="mt-1 text-[14px] text-ink-muted">Tautkan profil profesional Anda untuk dilirik HRD.</p>
            <Button variant="link" size="sm" className="mt-2 text-primary font-semibold">+ Tambahkan Tautan</Button>
          </div>
        )}
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
  return (
    <Card id="section-skills" className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 scroll-mt-6 overflow-hidden pt-0">
      <CardHeader className="flex flex-row items-center justify-between gap-3 rounded-t-3xl bg-success py-4 text-white">
        <CardTitle className="flex items-center gap-3 text-[20px] font-semibold text-white">Keahlian (Skills)</CardTitle>
        <Dialog>
          <DialogTrigger
            render={
              skills.length > 0 ? (
                <Button variant="ghost" size="icon" className="rounded-full bg-white/95 text-ink hover:bg-white" />
              ) : (
                <Button variant="ghost" className="rounded-full bg-white/95 text-ink font-semibold hover:bg-white gap-1" />
              )
            }
          >
            {skills.length > 0 ? <PenIcon className="size-4" /> : <><PlusIcon className="size-4" /> Tambah</>}
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ubah Keahlian</DialogTitle>
              <DialogDescription>Tambahkan skill teknis atau soft skill yang relevan.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="grid gap-2 relative">
                <Label>Tambah Skill Baru</Label>
                <div className="relative">
                  <Input placeholder="Ketik lalu tekan Enter..." value={newSkill} onChange={(e) => onNewSkillChange(e.target.value)} onKeyDown={onAddSkill} className="pl-3 pr-16" />
                  <Button size="sm" variant="ghost" className="absolute right-1 top-1 h-7 px-2 text-xs" onClick={() => onAddSkill({ key: "Enter" } as any)}>Tambah</Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 p-4 border rounded-lg min-h-[120px] bg-muted/10 content-start">
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
            </div>
            <DialogFooter><Button>Simpan</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {skills.length > 0 ? (
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
            <Button variant="link" size="sm" className="mt-2 text-primary font-semibold">+ Tambahkan Skill</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
