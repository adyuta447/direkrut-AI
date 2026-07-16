import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HrdInboxTable } from "@/components/molecules/dashboard/HrdInboxTable"

const MOCK_EMAILS = [
  {
    id: "1",
    candidateName: "Raffi Ahmad",
    jobTitle: "Senior Frontend Developer",
    subject: "Undangan Wawancara Teknis",
    status: "replied" as const,
    date: "11 Jul 2026, 14:30",
  },
  {
    id: "2",
    candidateName: "Budi Santoso",
    jobTitle: "Backend Engineer",
    subject: "Pemberitahuan Hasil Seleksi (Ditolak)",
    status: "sent" as const,
    date: "10 Jul 2026, 09:15",
  },
  {
    id: "3",
    candidateName: "Siti Aminah",
    jobTitle: "UI/UX Designer",
    subject: "Undangan Wawancara HR",
    status: "read" as const,
    date: "09 Jul 2026, 16:45",
  },
]

export default function InboxPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Kotak Masuk Email"
        description="Riwayat email yang dikirim ke kandidat beserta statusnya."
      />

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pengiriman Email</CardTitle>
          <CardDescription>
            Lacak email yang telah Anda kirimkan kepada kandidat beserta statusnya.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HrdInboxTable emails={MOCK_EMAILS} />
        </CardContent>
      </Card>
    </div>
  )
}
