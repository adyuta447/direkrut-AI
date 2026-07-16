import * as React from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

/** Pop up notifikasi di tengah layar, menutup sendiri setelah beberapa detik. */
export function NoticeDialog({
  message, description, onClose, image = "/status/success.svg", durationMs = 2200,
}: {
  message: string | null
  description?: string
  onClose: () => void
  image?: string
  durationMs?: number
}) {
  React.useEffect(() => {
    if (!message) return
    const t = setTimeout(onClose, durationMs)
    return () => clearTimeout(t)
  }, [message, durationMs, onClose])

  return (
    <Dialog open={message !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false}>
        <div className="flex flex-col items-center gap-5 px-2 py-6 text-center">
          <Image src={image} alt="" width={220} height={130} unoptimized className="pointer-events-none h-28 w-auto select-none" />
          <div className="space-y-1.5">
            <DialogTitle className="text-[24px]">{message}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
