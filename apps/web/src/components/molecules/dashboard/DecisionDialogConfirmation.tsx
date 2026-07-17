import Image from "next/image"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"

interface DecisionDialogConfirmationProps {
  applicantName: string
}

export function DecisionDialogConfirmation({
  applicantName,
}: DecisionDialogConfirmationProps) {
  return (
    <div className="p-12 flex flex-col items-center justify-center text-center">
      <Image
        src="/status/success.svg"
        alt=""
        width={200}
        height={116}
        unoptimized
        className="pointer-events-none mb-6 h-28 w-auto select-none"
      />
      <DialogTitle className="mb-2">Kelar, Email Terkirim!</DialogTitle>
      <DialogDescription>
        {applicantName} udah dapet kabarnya lewat email.
      </DialogDescription>
    </div>
  )
}
