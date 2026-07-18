import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const NOTIFICATION_ITEMS = [
  {
    label: "Email Pemberitahuan Lowongan Baru",
    description: "Dapat email tiap ada lowongan yang cocok sama profilmu.",
  },
  {
    label: "Pembaruan Status Lamaran",
    description: "Notifikasi real-time tiap HRD mengubah status lamaranmu.",
  },
  {
    label: "Pesan dari HRD",
    description: "Notifikasi untuk kotak masuk undangan wawancara atau surat penerimaan.",
  },
]

export function SettingsCandidateTabNotifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferensi Notifikasi</CardTitle>
        <CardDescription>Atur kapan dan gimana kamu mau dikabarin.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {NOTIFICATION_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label>{item.label}</Label>
              <span className="text-sm text-muted-foreground">{item.description}</span>
            </div>
            <Switch defaultChecked />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
