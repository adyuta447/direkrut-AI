"use client"
import { PageHeader } from "@/components/molecules/dashboard/PageHeader"

import * as React from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ShieldCheckIcon, LockIcon, SparklesIcon, MoonIcon, SunIcon, CreditCardIcon } from "lucide-react"

export default function SettingsPage() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  const darkMode = mounted && resolvedTheme === "dark"
  const toggleDarkMode = () => setTheme(darkMode ? "light" : "dark")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 w-full">
      <PageHeader
        className="mb-6"
        title="Pengaturan"
        description="Kelola preferensi akun, sistem AI, dan tagihan Anda."
      />

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="account" className="px-6">Akun</TabsTrigger>
          <TabsTrigger value="system" className="px-6">Sistem & Tampilan</TabsTrigger>
          <TabsTrigger value="billing" className="px-6">Paket & Upgrade</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keamanan Akun</CardTitle>
              <CardDescription>Ubah kata sandi Anda atau kelola metode masuk alternatif.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="current">Kata Sandi Saat Ini</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">Kata Sandi Baru</Label>
                  <Input id="new" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Konfirmasi Kata Sandi</Label>
                  <Input id="confirm" type="password" />
                </div>
                <Button>Perbarui Kata Sandi</Button>
              </div>
              
              <div className="border-t pt-6 mt-6">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <ShieldCheckIcon className="size-4 text-success" />
                  Koneksi Pihak Ketiga
                </h4>
                <div className="flex items-center justify-between p-4 border rounded-lg max-w-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white border rounded-full flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Google Workspace</p>
                      <p className="text-sm text-muted-foreground">hr@perusahaan.com</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">Putuskan</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferensi Tampilan</CardTitle>
              <CardDescription>Sesuaikan antarmuka sesuai kenyamanan mata Anda.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border rounded-lg max-w-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    {darkMode ? <MoonIcon className="size-5" /> : <SunIcon className="size-5" />}
                  </div>
                  <div>
                    <p className="font-medium">Mode Gelap (Dark Mode)</p>
                    <p className="text-sm text-muted-foreground">Gunakan tema warna gelap untuk dasbor.</p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SparklesIcon className="size-5 text-primary" />
                Konfigurasi Model AI
              </CardTitle>
              <CardDescription>Pilih mesin AI yang digunakan untuk menganalisis kandidat (Mempengaruhi biaya kredit).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-w-xl">
                <div className="space-y-2">
                  <Label>Model Penalaran AI</Label>
                  <Select defaultValue="gpt4o">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt4o">
                        Direkrut-4o (Rekomendasi)
                      </SelectItem>
                      <SelectItem value="claude">
                        Direkrut-Claude (Lebih analitik)
                      </SelectItem>
                      <SelectItem value="llama">
                        Direkrut-Fast (Cepat & Murah)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    Catatan: Mengubah model AI akan mengubah cara pembobotan bahasa dan kedalaman analisis. Direkrut-4o adalah bawaan standar.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
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
                  <p className="text-sm text-muted-foreground mt-1">Sisa kredit AI: 2,450 tokens (Reset pada 1 Agustus)</p>
                </div>
                <CreditCardIcon className="size-12 text-primary/50" />
              </div>
              
              <div className="mt-8 space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <LockIcon className="size-4 text-muted-foreground" />
                  Fitur Terkunci (Upgrade ke Enterprise)
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg opacity-60 bg-muted/30">
                    <p className="font-medium">Integrasi ATS Kustom</p>
                    <p className="text-sm text-muted-foreground">Koneksikan langsung dengan Workday, BambooHR, dll.</p>
                  </div>
                  <div className="p-4 border rounded-lg opacity-60 bg-muted/30">
                    <p className="font-medium">Wawancara Video AI Otonom</p>
                    <p className="text-sm text-muted-foreground">Biarkan AI mewawancarai kandidat via video call.</p>
                  </div>
                </div>
                <Button className="mt-4" variant="default">Upgrade ke Enterprise</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
