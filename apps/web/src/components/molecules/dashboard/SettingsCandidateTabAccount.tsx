"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ShieldIcon } from "lucide-react"
import { useDashboard } from "@/context/DashboardContext"
import { ApiError } from "@/services/apiClient"
import * as authService from "@/services/authService"

export function SettingsCandidateTabAccount() {
  const { currentUser, setCurrentUser, logout } = useDashboard()
  const router = useRouter()

  const [email, setEmail] = React.useState(currentUser?.email ?? "")
  const [isSavingEmail, setIsSavingEmail] = React.useState(false)
  const [emailError, setEmailError] = React.useState<string | null>(null)
  const [emailSaved, setEmailSaved] = React.useState(false)

  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deletePassword, setDeletePassword] = React.useState("")
  const [deleteError, setDeleteError] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleSaveEmail = async () => {
    setEmailError(null)
    setEmailSaved(false)
    setIsSavingEmail(true)
    try {
      await authService.changeEmail(email)
      if (currentUser) setCurrentUser({ ...currentUser, email })
      setEmailSaved(true)
    } catch (err) {
      setEmailError(err instanceof ApiError ? err.message : "Gagal simpan email, coba lagi.")
    } finally {
      setIsSavingEmail(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteError(null)
    setIsDeleting(true)
    try {
      await authService.deleteAccount(deletePassword)
      logout()
      router.push("/auth")
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Gagal hapus akun, coba lagi.")
      setIsDeleting(false)
    }
  }

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
            <Input value={email} onChange={(e) => { setEmail(e.target.value); setEmailSaved(false) }} />
            <p className="text-xs text-muted-foreground">
              Email ini yang dipakai perusahaan buat ngehubungin kamu.
            </p>
            {emailError && <p className="text-xs text-destructive">{emailError}</p>}
            {emailSaved && <p className="text-xs text-success">Email berhasil diperbarui.</p>}
          </div>
          <div className="pt-4 flex gap-2">
            <Button onClick={handleSaveEmail} disabled={isSavingEmail || !email.trim()}>
              {isSavingEmail ? "Menyimpan..." : "Simpan Email"}
            </Button>
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
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>Hapus Akun Saya</Button>
        </CardContent>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={(open) => { setDeleteOpen(open); setDeletePassword(""); setDeleteError(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Hapus akun secara permanen?</DialogTitle>
            <DialogDescription>
              Tindakan ini gak bisa dibatalin. Masukkan kata sandi kamu buat konfirmasi.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label>Kata Sandi</Label>
            <Input type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
            {deleteError && <p className="text-xs text-destructive">{deleteError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Batal</Button>
            <Button variant="destructive" disabled={isDeleting || !deletePassword} onClick={handleDeleteAccount}>
              {isDeleting ? "Menghapus..." : "Ya, Hapus Akun Saya"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function SettingsCandidateTabSecurity() {
  const { logout } = useDashboard()
  const router = useRouter()

  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)

  const handleChangePassword = async () => {
    setError(null)
    if (newPassword.length < 8) {
      setError("Kata sandi baru minimal 8 karakter.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi baru gak cocok.")
      return
    }
    setIsSaving(true)
    try {
      await authService.changePassword(currentPassword, newPassword)
      // Refresh token di-revoke server-side abis ganti password -- minta
      // login ulang pakai kata sandi baru biar sesinya jelas, gak ambigu.
      logout()
      router.push("/auth/login")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal ganti kata sandi, coba lagi.")
      setIsSaving(false)
    }
  }

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
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Kata Sandi Baru</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Konfirmasi Kata Sandi Baru</Label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="pt-4 flex gap-2">
            <Button onClick={handleChangePassword} disabled={isSaving || !currentPassword || !newPassword}>
              {isSaving ? "Menyimpan..." : "Perbarui Kata Sandi"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <ShieldIcon className="size-5" /> Autentikasi Dua Faktor (2FA)
          </CardTitle>
          <CardDescription>Tambah lapisan keamanan ekstra buat akunmu.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" disabled className="gap-2">
            Aktifkan 2FA <Badge variant="secondary">Segera hadir</Badge>
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
