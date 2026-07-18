import { IconDeviceFloppy } from "@tabler/icons-react"

export function DraftInfoCard() {
  return (
    <div className="rounded-3xl border border-hairline bg-canvas p-6">
      <div className="flex items-center gap-2 text-ink">
        <IconDeviceFloppy className="size-5 text-primary" />
        <h3 className="text-[17px] font-semibold">Kenapa Ada Draft?</h3>
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        Belum semua data siap? Nggak masalah. Simpan dulu sebagai draft, lowongan nggak akan
        tampil ke pelamar sampai kamu publikasikan sendiri lewat halaman Manajemen Lowongan.
      </p>
    </div>
  )
}
