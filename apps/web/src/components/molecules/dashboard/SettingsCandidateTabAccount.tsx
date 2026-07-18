import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ShieldIcon } from "lucide-react"

export function SettingsCandidateTabAccount() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Akun</CardTitle>
          <CardDescription>Perbarui alamat email dan kredensial login kamu.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Email Utama</Label>
            <Input defaultValue="kandidat@example.com" />
            <p className="text-xs text-muted-foreground">
              Email ini yang dipakai perusahaan buat ngehubungin kamu.
            </p>
          </div>
          <div className="pt-4 flex gap-2">
            <Button>Simpan Email</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Hapus Akun</CardTitle>
          <CardDescription>
            Hapus akunmu secara permanen beserta semua riwayat lamaran dan profil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Hapus Akun Saya</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function SettingsCandidateTabSecurity() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Keamanan &amp; Kata Sandi</CardTitle>
          <CardDescription>Ganti kata sandi dan amankan akunmu.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Kata Sandi Saat Ini</Label>
            <Input type="password" />
          </div>
          <div className="grid gap-2">
            <Label>Kata Sandi Baru</Label>
            <Input type="password" />
          </div>
          <div className="grid gap-2">
            <Label>Konfirmasi Kata Sandi Baru</Label>
            <Input type="password" />
          </div>
          <div className="pt-4 flex gap-2">
            <Button>Perbarui Kata Sandi</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success">
            <ShieldIcon className="size-5" /> Autentikasi Dua Faktor (2FA)
          </CardTitle>
          <CardDescription>Tambah lapisan keamanan ekstra buat akunmu.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="text-primary hover:text-primary">
            Aktifkan 2FA
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
