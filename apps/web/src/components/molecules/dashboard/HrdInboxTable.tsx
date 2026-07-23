import Link from "next/link"
import { CheckIcon, XIcon, ClockIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
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
import type { SentDecision } from "@/services/applicationService"

interface HrdInboxTableProps {
  decisions: SentDecision[]
}

// Petakan status keputusan -> label & badge yang jelas buat HRD.
function DecisionBadge({ status }: { status: string }) {
  if (status === "interview") {
    return (
      <Badge variant="outline" className="border-success text-success">
        <CheckIcon className="mr-1 size-3" /> Diundang Wawancara
      </Badge>
    )
  }
  if (status === "rejected") {
    return (
      <Badge variant="outline" className="border-destructive text-destructive">
        <XIcon className="mr-1 size-3" /> Ditolak
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="border-warning text-warning">
      <ClockIcon className="mr-1 size-3" /> Sedang Ditinjau
    </Badge>
  )
}

const SUBJECT: Record<string, string> = {
  interview: "Undangan Wawancara",
  rejected: "Pemberitahuan Hasil Seleksi",
  "under-review": "Lamaran Sedang Ditinjau",
}

export function HrdInboxTable({ decisions }: HrdInboxTableProps) {
  if (decisions.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-ink-muted">
        Belum ada keputusan yang dikirim ke kandidat. Undang atau tolak kandidat dari halaman detail buat mulai.
      </div>
    )
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kandidat</TableHead>
          <TableHead>Posisi</TableHead>
          <TableHead>Subjek</TableHead>
          <TableHead>Keputusan</TableHead>
          <TableHead>Waktu</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {decisions.map((d) => (
          <TableRow key={d.id}>
            <TableCell className="font-medium">{d.candidateName}</TableCell>
            <TableCell>{d.jobTitle}</TableCell>
            <TableCell className="max-w-55 truncate">{d.note || SUBJECT[d.toStatus] || "Pemberitahuan"}</TableCell>
            <TableCell>
              <DecisionBadge status={d.toStatus} />
            </TableCell>
            <TableCell className="whitespace-nowrap text-ink-muted">
              {formatDistanceToNow(new Date(d.createdAt), { addSuffix: true, locale: id })}
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" render={<Link href={`/hrd/candidates/${d.applicationId}`} />}>
                Lihat Detail
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
