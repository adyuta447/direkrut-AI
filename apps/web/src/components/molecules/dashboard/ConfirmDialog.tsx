import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

export function ConfirmDialog({
  open, onOpenChange, title, description, confirmLabel, onConfirm, image = "/status/warning.svg",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  image?: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex flex-col items-center gap-4 px-2 py-4 text-center">
          <Image src={image} alt="" width={200} height={150} unoptimized className="pointer-events-none h-28 w-auto select-none" />
          <div className="space-y-1.5">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </div>
          <div className="mt-2 flex items-center justify-center gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button variant="destructive" className="bg-destructive text-white hover:bg-destructive/90" onClick={() => { onConfirm(); onOpenChange(false) }}>{confirmLabel}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
