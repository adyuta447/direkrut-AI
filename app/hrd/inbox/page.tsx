import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MailOpenIcon, SendIcon, ReplyIcon } from "lucide-react"

const MOCK_EMAILS = [
  {
    id: "1",
    candidateName: "Raffi Ahmad",
    jobTitle: "Senior Frontend Developer",
    subject: "Undangan Wawancara Teknis",
    status: "replied",
    date: "11 Jul 2026, 14:30",
  },
  {
    id: "2",
    candidateName: "Budi Santoso",
    jobTitle: "Backend Engineer",
    subject: "Pemberitahuan Hasil Seleksi (Ditolak)",
    status: "sent",
    date: "10 Jul 2026, 09:15",
  },
  {
    id: "3",
    candidateName: "Siti Aminah",
    jobTitle: "UI/UX Designer",
    subject: "Undangan Wawancara HR",
    status: "read",
    date: "09 Jul 2026, 16:45",
  },
]

export default function InboxPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Kotak Masuk Email</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pengiriman Email</CardTitle>
          <CardDescription>
            Lacak email yang telah Anda kirimkan kepada kandidat beserta statusnya.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {MOCK_EMAILS.map((email) => (
                <TableRow key={email.id}>
                  <TableCell className="font-medium">{email.candidateName}</TableCell>
                  <TableCell>{email.jobTitle}</TableCell>
                  <TableCell className="truncate max-w-[200px]">{email.subject}</TableCell>
                  <TableCell>
                    {email.status === "sent" && (
                      <Badge variant="outline" className="text-muted-foreground">
                        <SendIcon className="mr-1 h-3 w-3" /> Terkirim
                      </Badge>
                    )}
                    {email.status === "read" && (
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-200">
                        <MailOpenIcon className="mr-1 h-3 w-3" /> Dibaca
                      </Badge>
                    )}
                    {email.status === "replied" && (
                      <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200">
                        <ReplyIcon className="mr-1 h-3 w-3" /> Dibalas
                      </Badge>
                    )}
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
        </CardContent>
      </Card>
    </div>
  )
}
