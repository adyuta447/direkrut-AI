"use client"

import { useState } from "react"
import { useDashboard } from "@/context/DashboardContext"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { JobFormFields, parseJobFormValues } from "@/components/molecules/dashboard/JobFormFields"
import type { Job } from "@/lib/types"

interface EditJobSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedJob: Job | null
  onSaved: () => void
  onSaveError: (message: string) => void
}

/** Dialog edit lowongan HRD -- nyimpen state form-nya sendiri lewat FormData
 * (bukan controlled state terpisah), dan langsung manggil updateJob (yang
 * beneran PUT ke apps/api-go) begitu disubmit. */
export function EditJobSheet({ open, onOpenChange, selectedJob, onSaved, onSaveError }: EditJobSheetProps) {
  const { updateJob } = useDashboard()
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedJob) return
    const formData = new FormData(e.currentTarget)
    setIsSaving(true)
    try {
      await updateJob(selectedJob.id, parseJobFormValues(formData))
      onOpenChange(false)
      onSaved()
    } catch (err) {
      onSaveError(err instanceof Error ? err.message : "Gagal memperbarui lowongan, coba lagi ya")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
        <form onSubmit={handleSubmit} className="flex max-h-[85vh] flex-col">
          <DialogHeader className="gap-1 rounded-t-3xl bg-primary px-6 py-6 text-white">
            <DialogTitle className="text-[22px] font-bold text-white">Edit Lowongan</DialogTitle>
            <DialogDescription className="text-white/80">
              Ubah yang perlu, sisanya biar tetap sama.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <JobFormFields key={selectedJob?.id} selectedJob={selectedJob} />
          </div>
          <div className="flex justify-end gap-3 border-t border-hairline p-6">
            <DialogClose render={<Button type="button" variant="outline" className="border-hairline" />}>
              Batal
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
