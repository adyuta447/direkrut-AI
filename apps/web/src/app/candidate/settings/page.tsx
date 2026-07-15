"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { BellIcon, LockIcon, UserIcon, ShieldIcon } from "lucide-react"

export default function CandidateSettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pengaturan Akun</h2>
        <p className="text-muted-foreground mt-2">Kelola preferensi, notifikasi, dan keamanan akun Anda.</p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="account" className="gap-2"><UserIcon className="size-4" /> Akun</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><BellIcon className="size-4" /> Notifikasi</TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><LockIcon className="size-4" /> Keamanan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Akun</CardTitle>
                <CardDescription>Perbarui alamat email dan kredensial login Anda.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Email Utama</Label>
                  <Input defaultValue="kandidat@example.com" />
                  <p className="text-xs text-muted-foreground">Ini adalah email yang digunakan perusahaan untuk menghubungi Anda.</p>
                </div>
                <div className="pt-4 flex gap-2">
                  <Button>Simpan Email</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Hapus Akun</CardTitle>
                <CardDescription>Menghapus akun Anda secara permanen beserta semua data riwayat lamaran dan profil.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive">Hapus Akun Saya</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferensi Notifikasi</CardTitle>
              <CardDescription>Atur kapan dan bagaimana Anda menerima pemberitahuan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label>Email Pemberitahuan Lowongan Baru</Label>
                  <span className="text-sm text-muted-foreground">Terima email saat ada lowongan yang cocok dengan profil Anda.</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label>Pembaruan Status Lamaran</Label>
                  <span className="text-sm text-muted-foreground">Pemberitahuan real-time ketika HRD mengubah status lamaran Anda.</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label>Pesan dari HRD</Label>
                  <span className="text-sm text-muted-foreground">Notifikasi untuk kotak masuk undangan wawancara atau surat penerimaan.</span>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Keamanan & Kata Sandi</CardTitle>
              <CardDescription>Ubah kata sandi dan amankan akun Anda.</CardDescription>
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

          <Card className="mt-6 border-emerald-500/30 bg-emerald-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <ShieldIcon className="size-5" /> Autentikasi Dua Faktor (2FA)
              </CardTitle>
              <CardDescription>Tambahkan lapisan keamanan ekstra ke akun Anda.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-500/10">
                Aktifkan 2FA
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
