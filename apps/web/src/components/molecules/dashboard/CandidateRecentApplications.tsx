import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/molecules/dashboard/StatusBadge"
import { EmptyState } from "@/components/molecules/dashboard/EmptyState"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileTextIcon, ArrowRightIcon } from "lucide-react"

interface Application {
  id: string
  jobTitle: string
  appliedDate: string
  status: string
}

interface CandidateRecentApplicationsProps {
  applications: Application[]
}

export function CandidateRecentApplications({
  applications,
}: CandidateRecentApplicationsProps) {
  if (applications.length === 0) {
    return (
      <EmptyState
        icon={FileTextIcon}
        title="Belum ada lamaran nih"
        description="Sekali lamar, progresnya langsung muncul di sini. Nggak perlu bolak-balik ngecek email."
        action={
          <Button render={<Link href="/candidate/jobs" />}>
            Mulai Lamar
          </Button>
        }
      />
    )
  }

  return (
    <div className="rounded-2xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Posisi
            </TableHead>
            <TableHead className="hidden text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
              Tanggal Melamar
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.slice(0, 5).map((app) => (
            <TableRow key={app.id}>
              <TableCell className="py-4 font-medium">{app.jobTitle}</TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {app.appliedDate}
              </TableCell>
              <TableCell>
                <StatusBadge status={app.status} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary"
                  render={<Link href={`/candidate/applications/${app.id}`} />}
                >
                  Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function CandidateRecentApplicationsHeader() {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold tracking-[-0.02em] md:text-2xl">
        Lamaran Terbaru
      </h2>
      <Button
        variant="ghost"
        className="text-muted-foreground hover:text-foreground"
        render={<Link href="/candidate/applications" />}
      >
        Lihat Semua
        <ArrowRightIcon className="size-4" />
      </Button>
    </div>
  )
}
