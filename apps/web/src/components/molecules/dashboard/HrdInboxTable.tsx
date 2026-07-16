import { MailOpenIcon, SendIcon, ReplyIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Email {
  id: string
  candidateName: string
  jobTitle: string
  subject: string
  status: "sent" | "read" | "replied"
  date: string
}

interface HrdInboxTableProps {
  emails: Email[]
}

function EmailStatusBadge({ status }: { status: Email["status"] }) {
  if (status === "sent") {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        <SendIcon className="mr-1 h-3 w-3" /> Terkirim
      </Badge>
    )
  }
  if (status === "read") {
    return (
      <Badge variant="secondary" className="bg-info/10 text-info border-info/20">
        <MailOpenIcon className="mr-1 h-3 w-3" /> Dibaca
      </Badge>
    )
  }
  return (
    <Badge variant="default" className="bg-success/10 text-success border-success/20">
      <ReplyIcon className="mr-1 h-3 w-3" /> Dibalas
    </Badge>
  )
}

export function HrdInboxTable({ emails }: HrdInboxTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kandidat</TableHead>
          <TableHead>Posisi</TableHead>
          <TableHead>Subjek Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {emails.map((email) => (
          <TableRow key={email.id}>
            <TableCell className="font-medium">{email.candidateName}</TableCell>
            <TableCell>{email.jobTitle}</TableCell>
            <TableCell className="truncate max-w-[200px]">{email.subject}</TableCell>
            <TableCell>
              <EmailStatusBadge status={email.status} />
            </TableCell>
            <TableCell>{email.date}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                Lihat Detail
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
