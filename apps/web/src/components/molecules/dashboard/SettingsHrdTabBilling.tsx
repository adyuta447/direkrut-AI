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
    desc: "Nyambungin langsung ke Workday, BambooHR, dan lainnya.",
  },
  {
    title: "Wawancara Video AI Otonom",
    desc: "Biar AI yang wawancara kandidat lewat video call.",
  },
]

export function SettingsHrdTabBilling() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paket Kamu Sekarang</CardTitle>
        <CardDescription>Kamu lagi pake paket Enterprise perusahaan.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl flex items-center justify-between">
          <div>
            <Badge className="bg-warning hover:bg-warning/90 mb-2">Pro Tier</Badge>
            <h3 className="text-2xl font-bold">Direkrut AI Professional</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Kredit AI tersisa: 2.450 token (reset 1 Agustus)
            </p>
          </div>
          <CreditCardIcon className="size-12 text-primary/50" />
        </div>

        <div className="mt-8 space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <LockIcon className="size-4 text-muted-foreground" />
            Fitur Masih Terkunci, Upgrade Dulu Yuk
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
