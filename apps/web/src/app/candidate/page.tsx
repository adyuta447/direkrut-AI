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
import { BriefcaseIcon, FileTextIcon, ArrowRightIcon, SparklesIcon } from "lucide-react"

export default function CandidateDashboardPage() {
  const { myApplications } = useDashboard()
  const { currentUser } = useApp()

  const total = myApplications.length
  const administrasi = myApplications.filter((a) => a.status === "under-review").length
  const wawancara = myApplications.filter((a) => a.status === "interview").length
  const ditolak = myApplications.filter((a) => a.status === "rejected").length
  const aktif = total - ditolak

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-8 py-6 md:py-8">
        <div className="px-4 lg:px-6">
          <PageHeader
            size="lg"
            eyebrow="Dasbor Kamu"
            title={`Halo, ${currentUser?.name ?? "Kandidat"} 👋`}
            description={
              aktif > 0
                ? `Ada ${aktif} lamaran yang lagi jalan. Semua progresnya kepantau dari sini.`
                : "Belum ada lamaran yang jalan. Yuk mulai, biar AI yang urus sisanya."
            }
            action={
              <Button render={<Link href="/candidate/jobs" />}>
                <BriefcaseIcon className="size-4" />
                Cari Lowongan
              </Button>
            }
          />
        </div>

        <StatCardGrid>
          <StatCard
            label="Lamaran Terkirim"
            value={total}
            footerDetail="Semua yang udah kamu kirim"
          />
          <StatCard
            label="Tahap Administrasi"
            value={administrasi}
            footerDetail="Lagi dicek sama HRD"
          />
          <StatCard
            label="Wawancara"
            value={<span className={wawancara > 0 ? "text-brand-accent" : undefined}>{wawancara}</span>}
            footerDetail={wawancara > 0 ? "Gas, siapin dirimu!" : "Belum ada jadwal"}
          />
          <StatCard
            label="Ditolak"
            value={ditolak}
            footerDetail={ditolak > 0 ? "Gapapa, lanjut coba yang lain" : "Aman, belum ada"}
          />
        </StatCardGrid>

        <div className="flex flex-col gap-4 px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-[-0.02em] md:text-2xl">Lamaran Terbaru</h2>
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
              title="Belum ada lamaran nih"
              description="Sekali lamar, progresnya langsung muncul di sini. Nggak perlu bolak-balik ngecek email."
              action={
                <Button render={<Link href="/candidate/jobs" />}>Mulai Lamar</Button>
              }
            />
          ) : (
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
                  {myApplications.slice(0, 5).map((app) => (
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
          )}
        </div>

        <div className="px-4 lg:px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded-4xl bg-primary p-8 text-primary-foreground sm:flex-row sm:items-center md:p-10">
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/90">
                <SparklesIcon className="size-4 text-brand-accent" />
                Rekomendasi AI
              </p>
              <h2 className="text-2xl font-bold leading-[1.1] tracking-[-0.02em] md:text-3xl">
                Belum nemu yang pas?
              </h2>
              <p className="max-w-md text-[15px] leading-relaxed text-primary-foreground/80">
                Lowongan baru masuk tiap hari. Upload CV sekali, biar AI yang nyariin posisi
                paling cocok buat kamu.
              </p>
            </div>
            <Button
              variant="secondary"
              className="shrink-0 bg-white text-primary hover:bg-white/90"
              render={<Link href="/candidate/jobs" />}
            >
              Lihat Lowongan Baru
              <ArrowRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
