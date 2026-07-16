import Image from "next/image"
import { PenIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPinIcon } from "lucide-react"
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
}

interface ProfileBiodataCardProps {
  profile: Profile
  onChangeProfile: (p: Partial<Profile>) => void
}

export function ProfileBiodataCard({ profile, onChangeProfile }: ProfileBiodataCardProps) {
  return (
    <Card
      id="section-biodata"
      className="rounded-3xl border border-hairline bg-canvas shadow-none ring-0 overflow-hidden scroll-mt-6"
    >
      <div className="h-28 bg-primary relative">
        <Dialog>
          <DialogTrigger
            render={
              <Button variant="secondary" size="sm" className="absolute top-4 right-4 bg-white/80 hover:bg-white text-black" />
            }
          >
            <PenIcon className="size-3 mr-2" /> Ubah Latar
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ubah Foto Latar</DialogTitle>
            </DialogHeader>
            <div className="py-10 px-6 flex flex-col items-center justify-center text-center rounded-2xl bg-muted/50 cursor-pointer transition-colors hover:bg-muted">
              <Image src="/dashboard/add_file.svg" alt="" width={160} height={120} unoptimized className="pointer-events-none mb-5 h-24 w-auto select-none" />
              <p className="text-[18px] font-semibold text-foreground">Unggah Foto Latar</p>
              <p className="text-[14px] text-muted-foreground mt-1">PNG, JPG maksimal 2MB</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <CardContent className="px-6 pb-6 pt-0 relative">
        <div className="flex justify-between items-start">
          <Avatar className="size-28 border-4 border-card -mt-12 bg-muted relative">
            <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
              {profile.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer rounded-full">
              <PenIcon className="size-6 text-white" />
            </div>
          </Avatar>

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
                  <Input value={profile.email} onChange={(e) => onChangeProfile({ email: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Lokasi</Label>
                  <Input value={profile.location} onChange={(e) => onChangeProfile({ location: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Usia</Label>
                  <Input value={profile.age} onChange={(e) => onChangeProfile({ age: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Batal</DialogClose>
                <DialogClose render={<Button />}>Simpan Perubahan</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

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
