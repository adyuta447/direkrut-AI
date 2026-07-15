"use client"

import * as React from "react"
import Link from "next/link"
import { useApp } from "@/components/providers/app-provider"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  Building2Icon,
} from "lucide-react"
import {
  IconTrendingUp,
  IconMinus,
  IconTrendingDown,
  IconCircleCheckFilled,
  IconLoader,
  IconEye,
  IconArrowUp,
  IconArrowDown,
  IconArrowsSort,
} from "@tabler/icons-react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import type { Application, Job } from "@/lib/types"

function getStatusBadgeTable(status: string) {
  if (status === "interview") {
    return (
      <Badge variant="default" className="gap-1 px-1.5 py-0.5 whitespace-nowrap">
        <IconCircleCheckFilled className="size-3 fill-blue-500" />
        Wawancara
      </Badge>
    )
  }
  if (status === "under-review") {
    return (
      <Badge variant="secondary" className="gap-1 px-1.5 py-0.5 whitespace-nowrap">
        <IconLoader className="size-3 text-yellow-500" />
        Administrasi
      </Badge>
    )
  }
  if (status === "rejected") {
    return (
      <Badge variant="outline" className="gap-1 px-1.5 py-0.5 whitespace-nowrap">
        <IconCircleCheckFilled className="size-3 fill-red-500" />
        Ditolak
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="gap-1 px-1.5 py-0.5 whitespace-nowrap">
      <IconCircleCheckFilled className="size-3 fill-slate-500" />
      Terkirim
    </Badge>
  )
}

function createColumns(jobs: Job[]): ColumnDef<Application>[] {
  return [
    {
      id: "index",
      header: "No.",
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex
        const pageSize = table.getState().pagination.pageSize
        const idx = table.getRowModel().rows.findIndex(r => r.id === row.id)
        return <div className="text-center text-muted-foreground">{pageIndex * pageSize + idx + 1}</div>
      },
      enableSorting: false,
    },
    {
      id: "posisi",
      accessorFn: (row) => jobs.find(j => j.id === row.jobId)?.title ?? "",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Posisi & Perusahaan
          {column.getIsSorted() === "asc" ? <IconArrowUp className="ml-2 size-4" /> : column.getIsSorted() === "desc" ? <IconArrowDown className="ml-2 size-4" /> : <IconArrowsSort className="ml-2 size-4" />}
        </Button>
      ),
      cell: ({ row }) => {
        const job = jobs.find(j => j.id === row.original.jobId)
        if (!job) return null
        return (
          <div className="min-w-[200px] py-2 cursor-pointer group">
            <div className="font-semibold text-sm text-foreground group-hover:underline group-hover:text-primary transition-colors">
              {job.title}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Building2Icon className="size-3" />
              {job.company}
            </div>
          </div>
        )
      },
    },
    {
      id: "lokasi",
      header: () => <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipe & Lokasi</div>,
      cell: ({ row }) => {
        const job = jobs.find(j => j.id === row.original.jobId)
        if (!job) return null
        return (
          <div className="py-2">
            <div className="text-sm">{job.type}</div>
            <div className="text-xs text-muted-foreground">{job.location}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "appliedDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Tanggal Melamar
          {column.getIsSorted() === "asc" ? <IconArrowUp className="ml-2 size-4" /> : column.getIsSorted() === "desc" ? <IconArrowDown className="ml-2 size-4" /> : <IconArrowsSort className="ml-2 size-4" />}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm flex items-center gap-1 whitespace-nowrap text-muted-foreground">
          <CalendarIcon className="size-3.5" />
          {row.original.appliedDate}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Status
          {column.getIsSorted() === "asc" ? <IconArrowUp className="ml-2 size-4" /> : column.getIsSorted() === "desc" ? <IconArrowDown className="ml-2 size-4" /> : <IconArrowsSort className="ml-2 size-4" />}
        </Button>
      ),
      cell: ({ row }) => getStatusBadgeTable(row.original.status),
    },
    {
      id: "actions",
      header: () => <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Detail</div>,
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          render={<Link href={`/candidate/applications/${row.original.id}`} />}
        >
          <IconEye className="size-4" />
          Detail
        </Button>
      ),
    },
  ]
}

export default function CandidateDashboardPage() {
  const { applications, jobs } = useApp()

  const countAll = applications.length
  const countReview = applications.filter(a => a.status === "under-review").length
  const countInterview = applications.filter(a => a.status === "interview").length
  const countRejected = applications.filter(a => a.status === "rejected").length

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  const [activeTab, setActiveTab] = React.useState("all")

  const columns = React.useMemo(() => createColumns(jobs), [jobs])
  const uniqueJobs = React.useMemo(() => Array.from(new Set(jobs.map(j => j.title))).sort(), [jobs])

  React.useEffect(() => {
    if (activeTab === "all") setColumnFilters([])
    else if (activeTab === "administrasi") setColumnFilters([{ id: "status", value: "under-review" }])
    else if (activeTab === "wawancara") setColumnFilters([{ id: "status", value: "interview" }])
    else if (activeTab === "ditolak") setColumnFilters([{ id: "status", value: "rejected" }])
  }, [activeTab])

  const table = useReactTable({
    data: applications,
    columns,
    state: { sorting, columnFilters, pagination },
    getRowId: row => row.id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

          <div className="px-4 lg:px-6">
            <h2 className="text-2xl font-bold tracking-tight">Halo, Kandidat Demo! 👋</h2>
            <p className="text-muted-foreground mt-1 text-sm">Berikut adalah ringkasan aktivitas lamaran pekerjaan Anda.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Lamaran</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {countAll}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <IconTrendingUp />
                    +2
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Aktif mencari kerja <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">Bulan ini</div>
              </CardFooter>
            </Card>

            <Card className="@container/card border-yellow-500/20">
              <CardHeader>
                <CardDescription>Tahap Administrasi</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {countReview}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <IconMinus />
                    Menunggu
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Sedang direview HRD <IconMinus className="size-4" />
                </div>
                <div className="text-muted-foreground">Cek kotak masuk berkala</div>
              </CardFooter>
            </Card>

            <Card className="@container/card border-purple-500/20">
              <CardHeader>
                <CardDescription>Wawancara AI</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {countInterview}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <IconTrendingUp />
                    Aktif
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Tahap wawancara <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">Siapkan diri Anda</div>
              </CardFooter>
            </Card>

            <Card className="@container/card border-red-500/20">
              <CardHeader>
                <CardDescription>Ditolak</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {countRejected}
                </CardTitle>
                <CardAction>
                  <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">
                    <IconTrendingDown />
                    {countRejected}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Tetap semangat! <IconTrendingDown className="size-4" />
                </div>
                <div className="text-muted-foreground">Coba lowongan lain</div>
              </CardFooter>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>

          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Riwayat Lamaran</h3>
              <Button variant="outline" size="sm" render={<Link href="/candidate/applications" />}>
                Buka Mode Kartu
              </Button>
            </div>
            
            <Tabs
              value={activeTab}
              onValueChange={(val) => val && setActiveTab(val)}
              className="w-full flex-col justify-start gap-4"
            >
              <div className="flex flex-col @4xl/main:flex-row items-start @4xl/main:items-center justify-between gap-4 w-full">
                <div className="w-full @4xl/main:w-auto flex-1 max-w-xs">
                  <Input
                    placeholder="Cari posisi atau perusahaan..."
                    value={(table.getColumn("posisi")?.getFilterValue() as string) ?? ""}
                    onChange={e => table.getColumn("posisi")?.setFilterValue(e.target.value)}
                  />
                </div>

                <div className="w-full @4xl/main:w-auto flex-none overflow-x-auto">
                  <Select value={activeTab} onValueChange={(val) => val && setActiveTab(val)}>
                    <SelectTrigger className="flex w-full @4xl/main:hidden" size="sm">
                      <SelectValue placeholder="Semua Lamaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Lamaran</SelectItem>
                      <SelectItem value="administrasi">Administrasi</SelectItem>
                      <SelectItem value="wawancara">Wawancara</SelectItem>
                      <SelectItem value="ditolak">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                  <TabsList className="hidden w-max **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
                    <TabsTrigger value="all">Semua Lamaran</TabsTrigger>
                    <TabsTrigger value="administrasi">
                      Administrasi <Badge variant="secondary">{countReview}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="wawancara">
                      Wawancara <Badge variant="secondary">{countInterview}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="ditolak">
                      Ditolak <Badge variant="secondary">{countRejected}</Badge>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="w-full @4xl/main:w-[220px] flex-none">
                  <Select
                    value={(table.getColumn("posisi")?.getFilterValue() as string) ?? "Semua Posisi"}
                    onValueChange={value => table.getColumn("posisi")?.setFilterValue(value === "Semua Posisi" ? "" : value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Semua Posisi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Semua Posisi">Semua Posisi</SelectItem>
                      {uniqueJobs.map(j => (
                        <SelectItem key={j} value={j}>{j}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="relative flex flex-col gap-4 overflow-auto py-2">
                <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-muted">
                      {table.getHeaderGroups().map(hg => (
                        <TableRow key={hg.id}>
                          {hg.headers.map(h => (
                            <TableHead key={h.id} colSpan={h.colSpan}>
                              {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody className="**:data-[slot=table-cell]:first:w-8">
                      {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map(row => (
                          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                            {row.getVisibleCells().map(cell => (
                              <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                            <BriefcaseIcon className="mx-auto h-10 w-10 opacity-30 mb-3" />
                            <p className="font-medium">Tidak ada lamaran ditemukan.</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>{table.getFilteredRowModel().rows.length} lamaran ditemukan</div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                      Sebelumnya
                    </Button>
                    <span className="text-xs">
                      Hal {table.getState().pagination.pageIndex + 1} dari {table.getPageCount() || 1}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                      Berikutnya
                    </Button>
                  </div>
                </div>
              </div>
            </Tabs>
          </div>

        </div>
      </div>
    </div>
  )
}
