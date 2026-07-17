"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { IconBuildingSkyscraper, IconEdit, IconPlus, IconTrash } from "@tabler/icons-react"
import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { SearchInput } from "@/components/molecules/dashboard/SearchInput"
import { DepartmentFormDialog } from "@/components/molecules/dashboard/DepartmentFormDialog"
import { ConfirmDialog } from "@/components/molecules/dashboard/ConfirmDialog"
import { NoticeDialog } from "@/components/molecules/dashboard/NoticeDialog"
import { Button } from "@/components/ui/button"
import { useDashboard } from "@/context/DashboardContext"
import { Department } from "@/lib/types"

const BANDS = ["bg-primary", "bg-success", "bg-brand-accent-strong", "bg-info", "bg-warning"]

export default function DepartmentsPage() {
  const { departments, jobs, addDepartment, updateDepartment, deleteDepartment } = useDashboard()
  const [searchTerm, setSearchTerm] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingDept, setEditingDept] = useState<Department | null>(null)
  const [deletingDept, setDeletingDept] = useState<Department | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [noticeImage, setNoticeImage] = useState("/status/success.svg")

  const jobCountByDept = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const job of jobs) counts[job.department] = (counts[job.department] ?? 0) + 1
    return counts
  }, [jobs])

  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenCreate = () => {
    setEditingDept(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (dept: Department) => {
    setEditingDept(dept)
    setFormOpen(true)
  }

  const handleSubmit = (values: { name: string; description: string }) => {
    if (editingDept) {
      updateDepartment(editingDept.id, values)
      setNoticeImage("/status/success.svg")
      setNotice("Departemen berhasil diperbarui")
    } else {
      addDepartment({
        id: crypto.randomUUID(),
        ...values,
      })
      setNoticeImage("/status/success.svg")
      setNotice("Departemen baru udah ditambahin")
    }
  }

  const handleDelete = () => {
    if (!deletingDept) return
    const inUse = jobCountByDept[deletingDept.name] > 0
    if (inUse) {
      setNoticeImage("/status/warning.svg")
      setNotice(`Belum bisa dihapus, masih dipakai ${jobCountByDept[deletingDept.name]} lowongan`)
      return
    }
    deleteDepartment(deletingDept.id)
    setNoticeImage("/status/success.svg")
    setNotice("Departemen udah dihapus")
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 lg:p-8 @container/main w-full">
      <PageHeader
        size="lg"
        eyebrow="Struktur Tim"
        title="Departemen"
        description="Rapikan divisi di sini biar pilihan departemen di form lowongan selalu sesuai."
        action={
          <Button onClick={handleOpenCreate} className="h-11 px-6 text-base">
            <IconPlus className="size-4 mr-2" /> Tambah Departemen
          </Button>
        }
      />

      <div className="max-w-md">
        <SearchInput
          className="rounded-full border-hairline bg-canvas h-12"
          placeholder="Cari departemen..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      {departments.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-hairline bg-canvas py-16 px-6 text-center">
          <Image
            src="/dashboard/add_file.svg"
            alt=""
            width={220}
            height={165}
            unoptimized
            className="pointer-events-none mb-6 h-32 w-auto select-none"
          />
          <h2 className="text-2xl font-bold text-ink">Belum Ada Departemen</h2>
          <p className="mt-1 max-w-sm text-ink-muted">
            Tambah departemen pertama biar form lowongan punya pilihan yang rapi.
          </p>
          <Button onClick={handleOpenCreate} className="mt-6 h-11 px-6 text-base">
            <IconPlus className="size-4 mr-2" /> Tambah Departemen
          </Button>
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl bg-surface-1 py-12 px-6 text-center">
          <Image
            src="/dashboard/decline.svg"
            alt=""
            width={200}
            height={150}
            unoptimized
            className="pointer-events-none mb-5 h-28 w-auto select-none"
          />
          <p className="text-[17px] font-semibold text-ink">Nggak ketemu departemennya</p>
          <p className="mt-1 text-sm text-ink-muted">Coba kata kunci lain ya.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredDepartments.map((dept, index) => {
            const count = jobCountByDept[dept.name] ?? 0
            const band = BANDS[index % BANDS.length]
            return (
              <div
                key={dept.id}
                className="flex flex-col rounded-3xl border border-hairline bg-canvas shadow-none overflow-hidden"
              >
                <div className={`${band} p-6 text-white`}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                      <IconBuildingSkyscraper className="size-5" />
                    </span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold whitespace-nowrap">
                      {count} Lowongan
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold leading-snug">{dept.name}</h3>
                </div>

                <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                  <p className="text-sm text-ink-muted line-clamp-3">
                    {dept.description || "Belum ada deskripsi buat departemen ini."}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-hairline"
                      onClick={() => handleOpenEdit(dept)}
                    >
                      <IconEdit className="size-4 mr-2" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-hairline text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeletingDept(dept)}
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <DepartmentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        department={editingDept}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deletingDept !== null}
        onOpenChange={(open) => !open && setDeletingDept(null)}
        title={`Yakin mau hapus "${deletingDept?.name}"?`}
        description="Departemen ini bakal hilang dari pilihan form lowongan. Nggak bisa di-undo lho."
        confirmLabel="Ya, Hapus"
        onConfirm={handleDelete}
      />

      <NoticeDialog message={notice} image={noticeImage} onClose={() => setNotice(null)} />
    </div>
  )
}
