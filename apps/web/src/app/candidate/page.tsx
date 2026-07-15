"use client"

import Link from "next/link"
import { useDashboard } from "@/context/DashboardContext"
import { useApp } from "@/context/AppContext"
import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { StatCard, StatCardGrid } from "@/components/molecules/dashboard/StatCard"
import { StatusBadge } from "@/components/molecules/dashboard/StatusBadge"
import { EmptyState } from "@/components/molecules/dashboard/EmptyState"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BriefcaseIcon, FileTextIcon, ArrowRightIcon } from "lucide-react"

export default function CandidateDashboardPage() {
  const { myApplications } = useDashboard()
  const { currentUser } = useApp()

  const total = myApplications.length
  const administrasi = myApplications.filter((a) => a.status === "under-review").length
  const wawancara = myApplications.filter((a) => a.status === "interview").length
  const ditolak = myApplications.filter((a) => a.status === "rejected").length

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6 py-4 md:py-6">
        <div className="px-4 lg:px-6">
          <PageHeader
            title={`Halo, ${currentUser?.name ?? "Kandidat"}! 👋`}
            description="Berikut ringkasan aktivitas lamaran pekerjaan Anda."
            action={
              <Button render={<Link href="/candidate/jobs" />}>
                <BriefcaseIcon className="size-4" />
                Cari Lowongan
              </Button>
            }
          />
        </div>

        <StatCardGrid>
          <StatCard label="Total Lamaran" value={total} footerDetail="Semua lamaran yang Anda kirim" />
          <StatCard
            label="Tahap Administrasi"
            value={administrasi}
            footerDetail="Sedang ditinjau oleh HRD"
          />
          <StatCard
            label="Wawancara"
            value={wawancara}
            className={wawancara > 0 ? "border-info/30" : undefined}
            footerDetail={wawancara > 0 ? "Siapkan diri Anda!" : "Belum ada jadwal wawancara"}
          />
          <StatCard
            label="Ditolak"
            value={ditolak}
            footerDetail={ditolak > 0 ? "Tetap semangat, coba lowongan lain" : "Belum ada penolakan"}
          />
        </StatCardGrid>

        <div className="flex flex-col gap-4 px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Riwayat Lamaran Terbaru</h2>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              render={<Link href="/candidate/applications" />}
            >
              Lihat Semua
              <ArrowRightIcon className="size-4" />
            </Button>
          </div>

          {myApplications.length === 0 ? (
            <EmptyState
              icon={FileTextIcon}
              title="Belum ada lamaran"
              description="Mulai melamar lowongan untuk melihat status Anda di sini."
              action={
                <Button render={<Link href="/candidate/jobs" />}>Cari Lowongan</Button>
              }
            />
          ) : (
            <div className="rounded-xl border bg-background">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posisi</TableHead>
                    <TableHead className="hidden sm:table-cell">Tanggal Melamar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myApplications.slice(0, 5).map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.jobTitle}</TableCell>
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
          )}
        </div>
      </div>
    </div>
  )
}
