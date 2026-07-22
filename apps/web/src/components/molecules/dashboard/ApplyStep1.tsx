import { UserIcon, MailIcon, PhoneIcon, LinkedinIcon, GlobeIcon } from "lucide-react"
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

function Field({
  id, label, icon: Icon, colSpan, ...props
}: {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  colSpan?: boolean
} & React.ComponentProps<typeof Input>) {
  return (
    <div className={`space-y-2 ${colSpan ? "md:col-span-2" : ""}`}>
      <Label htmlFor={id} className="text-base font-semibold text-ink">{label}</Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input id={id} className="h-12 rounded-xl border-hairline pl-11 text-base shadow-none" {...props} />
      </div>
    </div>
  )
}

export function ApplyStep1({ formData, onChange }: ApplyStep1Props) {
  return (
    <div className="grid grid-cols-1 gap-5 duration-500 animate-in fade-in slide-in-from-bottom-4 md:grid-cols-2">
      <Field id="name" label="Nama Lengkap" icon={UserIcon} colSpan value={formData.name} onChange={(e) => onChange({ name: e.target.value })} />
      <Field id="email" label="Email" icon={MailIcon} type="email" value={formData.email} onChange={(e) => onChange({ email: e.target.value })} />
      <Field id="phone" label="Nomor Telepon" icon={PhoneIcon} value={formData.phone} onChange={(e) => onChange({ phone: e.target.value })} />
      <Field id="linkedin" label="Profil LinkedIn" icon={LinkedinIcon} value={formData.linkedin} onChange={(e) => onChange({ linkedin: e.target.value })} />
      <Field id="portfolio" label="Link Portofolio / Website (Opsional)" icon={GlobeIcon} colSpan value={formData.portfolio} onChange={(e) => onChange({ portfolio: e.target.value })} />
    </div>
  )
}
