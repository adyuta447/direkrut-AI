"use client"

import * as React from "react"
import Image from "next/image"
import { PenIcon, UploadCloudIcon, ImageIcon, XIcon, MapPinIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

interface Profile {
  name: string
  phone: string
  email: string
  location: string
  age: string
  gender: string
  photoUrl?: string
  coverUrl?: string
}

interface ProfileBiodataCardProps {
  profile: Profile
  onChangeProfile: (p: Partial<Profile>) => void
  onSaveProfile: () => void
  onSaveField: (p: Partial<Profile>) => void
}

const MAX_PHOTO_SIZE = 2 * 1024 * 1024 

function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function ProfileBiodataCard({ profile, onChangeProfile, onSaveProfile, onSaveField }: ProfileBiodataCardProps) {
  const avatarInputRef = React.useRef<HTMLInputElement>(null)
  const [avatarError, setAvatarError] = React.useState<string | null>(null)

  const [coverOpen, setCoverOpen] = React.useState(false)
  const [coverDraft, setCoverDraft] = React.useState<string | null>(null)
  const [coverError, setCoverError] = React.useState<string | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const handleAvatarPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    if (file.size > MAX_PHOTO_SIZE) {
      setAvatarError("Ukuran foto maksimal 2MB")
      return
    }
    setAvatarError(null)
    onSaveField({ photoUrl: await readImageFile(file) })
  }

  const handleCoverFile = async (file: File | undefined) => {
    if (!file) return
    if (file.size > MAX_PHOTO_SIZE) {
      setCoverError("Ukuran foto maksimal 2MB")
      return
    }
    setCoverError(null)
    setCoverDraft(await readImageFile(file))
  }

  const saveCover = () => {
    if (coverDraft) onSaveField({ coverUrl: coverDraft })
    setCoverOpen(false)
  }

  const coverPreview = coverDraft ?? profile.coverUrl

  return (
    <Card
      id="section-biodata"
      className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 overflow-hidden scroll-mt-6"
    >
      <div className="h-36 sm:h-44 bg-primary relative overflow-hidden">
        {profile.coverUrl && (
          <Image
            src={profile.coverUrl}
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        )}
        {profile.coverUrl && <div className="absolute inset-0 bg-black/15" />}

        <Dialog
          open={coverOpen}
          onOpenChange={(open) => {
            setCoverOpen(open)
            setCoverDraft(null)
            setCoverError(null)
          }}
        >
          <DialogTrigger
            render={
              <Button variant="secondary" size="sm" className="absolute top-4 right-4 bg-white/90 hover:bg-white text-black" />
            }
          >
            <PenIcon className="size-3 mr-2" /> Ubah Latar
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ubah Foto Latar</DialogTitle>
              <DialogDescription>Tampil di bagian paling atas profil kamu — pilih yang bikin profesional.</DialogDescription>
            </DialogHeader>

            <label
              htmlFor="cover-upload-input"
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                handleCoverFile(e.dataTransfer.files?.[0])
              }}
              className={`block cursor-pointer rounded-2xl border-2 border-dashed overflow-hidden transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-hairline hover:bg-muted/50"
              }`}
            >
              {coverPreview ? (
                <div className="group/cover relative h-44">
                  <Image
                    src={coverPreview}
                    alt=""
                    fill
                    unoptimized
                    sizes="(min-width: 640px) 32rem, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-sm font-semibold flex items-center gap-2">
                      <UploadCloudIcon className="size-4" /> Ganti Foto
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-10 px-6 flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-muted rounded-full mb-4">
                    <ImageIcon className="size-8 text-muted-foreground" />
                  </div>
                  <p className="text-[15px] font-semibold text-foreground">Klik atau seret foto ke sini</p>
                  <p className="text-[13px] text-muted-foreground mt-1">PNG atau JPG, maksimal 2MB</p>
                </div>
              )}
              <input
                id="cover-upload-input"
                type="file"
                accept="image/png,image/jpeg"
                className="sr-only"
                onChange={(e) => handleCoverFile(e.target.files?.[0])}
              />
            </label>
            {coverError && <p className="text-sm text-destructive">{coverError}</p>}

            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
              <Button onClick={saveCover} disabled={!coverDraft}>Simpan Foto Latar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <CardContent className="px-6 pb-6 pt-0 relative">
        <div className="flex justify-between items-start">
          <div className="relative -mt-12 shrink-0">
            <Avatar
              className="group/avatar-upload size-28 border-4 border-card bg-muted cursor-pointer"
              onClick={() => avatarInputRef.current?.click()}
            >
              {profile.photoUrl ? (
                <AvatarImage src={profile.photoUrl} alt={profile.name} />
              ) : (
                <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                  {profile.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover/avatar-upload:opacity-100 flex items-center justify-center transition-opacity">
                <PenIcon className="size-6 text-white" />
              </div>
            </Avatar>
            {profile.photoUrl && (
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                className="absolute bottom-1 right-1 rounded-full bg-white text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onSaveField({ photoUrl: undefined })
                }}
              >
                <XIcon className="size-3" />
              </Button>
            )}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="sr-only"
              onChange={handleAvatarPick}
            />
          </div>

          <Dialog>
            <DialogTrigger
              render={<Button variant="outline" className="mt-4 rounded-full" />}
            >
              <PenIcon className="size-4 mr-2" /> Edit Profil
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ubah Biodata</DialogTitle>
                <DialogDescription>Perbarui informasi pribadi Anda di sini.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                <div className="grid gap-2 col-span-2">
                  <Label>Nama Lengkap</Label>
                  <Input value={profile.name} onChange={(e) => onChangeProfile({ name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>WhatsApp Number</Label>
                  <Input value={profile.phone} onChange={(e) => onChangeProfile({ phone: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input value={profile.email} disabled />
                  <p className="text-xs text-muted-foreground">Ubah email lewat halaman Pengaturan &gt; Akun.</p>
                </div>
                <div className="grid gap-2">
                  <Label>Lokasi</Label>
                  <Input value={profile.location} onChange={(e) => onChangeProfile({ location: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Usia</Label>
                  <Input value={profile.age} onChange={(e) => onChangeProfile({ age: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Jenis Kelamin</Label>
                  <Input value={profile.gender} onChange={(e) => onChangeProfile({ gender: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
                <DialogClose render={<Button onClick={onSaveProfile} />}>Simpan Perubahan</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {avatarError && <p className="text-sm text-destructive mt-2">{avatarError}</p>}

        <div className="mt-4">
          <h3 className="font-bold text-2xl leading-[1.1] tracking-[-0.02em] text-ink">{profile.name}</h3>
          <p className="text-muted-foreground flex items-center gap-1 mt-1.5">
            <MapPinIcon className="size-4" /> {profile.location}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 mt-6 pt-6 border-t text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-ink-muted mb-1 font-semibold">WhatsApp</p>
            <p className="font-medium">{profile.phone}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-ink-muted mb-1 font-semibold">Email</p>
            <p className="font-medium">{profile.email}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] text-ink-muted mb-1 font-semibold">Usia, Jenis Kelamin</p>
            <p className="font-medium">{profile.age ? `${profile.age} Tahun, ${profile.gender}` : "-"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
