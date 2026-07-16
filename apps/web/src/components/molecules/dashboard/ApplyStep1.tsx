import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormData {
  name: string
  email: string
  phone: string
  linkedin: string
  portfolio: string
}

interface ApplyStep1Props {
  formData: FormData
  onChange: (partial: Partial<FormData>) => void
}

export function ApplyStep1({ formData, onChange }: ApplyStep1Props) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input id="name" value={formData.name} onChange={(e) => onChange({ name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={formData.email} onChange={(e) => onChange({ email: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Nomor Telepon</Label>
          <Input id="phone" value={formData.phone} onChange={(e) => onChange({ phone: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">Profil LinkedIn</Label>
          <Input id="linkedin" value={formData.linkedin} onChange={(e) => onChange({ linkedin: e.target.value })} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="portfolio">Link Portofolio / Website Pribadi (Opsional)</Label>
          <Input id="portfolio" value={formData.portfolio} onChange={(e) => onChange({ portfolio: e.target.value })} />
        </div>
      </div>
    </div>
  )
}
