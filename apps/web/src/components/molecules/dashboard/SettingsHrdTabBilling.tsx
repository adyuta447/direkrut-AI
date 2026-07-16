import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LockIcon, CreditCardIcon } from "lucide-react"

const LOCKED_FEATURES = [
  {
    title: "Integrasi ATS Kustom",
    desc: "Koneksikan langsung dengan Workday, BambooHR, dll.",
  },
  {
    title: "Wawancara Video AI Otonom",
    desc: "Biarkan AI mewawancarai kandidat via video call.",
  },
]

export function SettingsHrdTabBilling() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paket Anda Saat Ini</CardTitle>
        <CardDescription>Anda menggunakan paket perusahaan (Enterprise).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl flex items-center justify-between">
          <div>
            <Badge className="bg-warning hover:bg-warning/90 mb-2">Pro Tier</Badge>
            <h3 className="text-2xl font-bold">Direkrut AI Professional</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Sisa kredit AI: 2,450 tokens (Reset pada 1 Agustus)
            </p>
          </div>
          <CreditCardIcon className="size-12 text-primary/50" />
        </div>

        <div className="mt-8 space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <LockIcon className="size-4 text-muted-foreground" />
            Fitur Terkunci (Upgrade ke Enterprise)
          </h4>
          <div className="grid sm:grid-cols-2 gap-4">
            {LOCKED_FEATURES.map((f) => (
              <div key={f.title} className="p-4 border rounded-lg opacity-60 bg-muted/30">
                <p className="font-medium">{f.title}</p>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
          <Button className="mt-4" variant="default">
            Upgrade ke Enterprise
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
