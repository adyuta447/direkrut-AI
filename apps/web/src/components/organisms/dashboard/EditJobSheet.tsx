"use client"

import { useDashboard } from "@/context/DashboardContext"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet"
import { JobFormFields, parseJobFormValues } from "@/components/molecules/dashboard/JobFormFields"
import type { Job } from "@/lib/types"

interface EditJobSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedJob: Job | null
  onSaved: () => void
}

/** Sheet edit lowongan HRD -- nyimpen state form-nya sendiri lewat FormData
 * (bukan controlled state terpisah), dan langsung manggil updateJob (yang
 * beneran PUT ke apps/api-go) begitu disubmit. */
export function EditJobSheet({ open, onOpenChange, selectedJob, onSaved }: EditJobSheetProps) {
  const { updateJob } = useDashboard()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedJob) return
    const formData = new FormData(e.currentTarget)
    updateJob(selectedJob.id, parseJobFormValues(formData))
    onOpenChange(false)
    onSaved()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto border-hairline p-0">
        <form onSubmit={handleSubmit} className="flex min-h-full flex-col">
          <SheetHeader className="gap-1 bg-primary px-6 py-6 text-white">
            <SheetTitle className="text-[22px] font-bold text-white">Edit Lowongan</SheetTitle>
            <SheetDescription className="text-white/80">
              Ubah yang perlu, sisanya biar tetap sama.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 p-6">
            <JobFormFields selectedJob={selectedJob} />
          </div>
          <div className="flex justify-end gap-3 border-t border-hairline p-6">
            <SheetClose render={<Button type="button" variant="outline" className="border-hairline" />}>
              Batal
            </SheetClose>
            <Button type="submit">Simpan Perubahan</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
