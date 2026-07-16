import { CheckCircle2 } from "lucide-react"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"

interface DecisionDialogConfirmationProps {
  applicantName: string
}

export function DecisionDialogConfirmation({
  applicantName,
}: DecisionDialogConfirmationProps) {
  return (
    <div className="p-12 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-8 h-8 text-success" />
      </div>
      <DialogTitle className="text-2xl mb-2">Notifikasi Terkirim</DialogTitle>
      <DialogDescription className="text-base text-muted-foreground">
        {applicantName} telah menerima pemberitahuan melalui email.
      </DialogDescription>
    </div>
  )
}
