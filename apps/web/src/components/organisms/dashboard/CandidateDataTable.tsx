"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconArrowUp,
  IconArrowDown,
  IconArrowsSort,
  IconEye,
  IconFileText,
  IconUser,
  IconBrandWhatsapp,
  IconMessageCircle,
  IconX,
} from "@tabler/icons-react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"

import { useIsMobile } from "@/hooks/use-mobile"
import { getExtendedData } from "@/lib/dashboard/extended-data"
import { getScoreLevel, getStatusMeta } from "@/lib/dashboard/status"
import { ScoreBadge, StatusBadge } from "@/components/molecules/dashboard/StatusBadge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DecisionDialog } from "@/components/organisms/dashboard/DecisionDialog"

export interface Candidate {
  id: string
  applicantName: string
  jobTitle: string
  resumeLink?: string
  recommendationScore?: number
  status: string
  appliedDate: string
  jobId: string
}

const columns: ColumnDef<Candidate>[] = [
  {
    id: "index",
    header: "No.",
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;
      const indexInPage = table.getRowModel().rows.findIndex(r => r.id === row.id);
      const visibleIndex = indexInPage !== -1 ? indexInPage : row.index;
      return <div className="text-center text-muted-foreground">{pageIndex * pageSize + visibleIndex + 1}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "applicantName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Nama & Domisili
          {column.getIsSorted() === "asc" ? <IconArrowUp className="ml-2 size-4" /> : column.getIsSorted() === "desc" ? <IconArrowDown className="ml-2 size-4" /> : <IconArrowsSort className="ml-2 size-4" />}
        </Button>
      )
    },
    cell: ({ row }) => {
      const ext = getExtendedData(row.original.applicantName);
      return (
        <TableCellViewer 
          item={row.original} 
          triggerNode={
            <div className="flex flex-col gap-1 min-w-[200px] py-2 cursor-pointer group">
              <div className="font-semibold text-foreground text-sm group-hover:underline group-hover:text-primary transition-colors">
                {row.original.applicantName}
              </div>
              <div className="text-xs text-muted-foreground">
                {ext.domicile}
              </div>
            </div>
          }
        />
      )
    },
  },
  {
    accessorKey: "jobTitle",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Posisi Dilamar
          {column.getIsSorted() === "asc" ? <IconArrowUp className="ml-2 size-4" /> : column.getIsSorted() === "desc" ? <IconArrowDown className="ml-2 size-4" /> : <IconArrowsSort className="ml-2 size-4" />}
        </Button>
      )
    },
    cell: ({ row }) => <span className="text-sm font-medium">{row.original.jobTitle}</span>,
  },
  {
    accessorKey: "recommendationScore",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Profil Keahlian AI
          {column.getIsSorted() === "asc" ? <IconArrowUp className="ml-2 size-4" /> : column.getIsSorted() === "desc" ? <IconArrowDown className="ml-2 size-4" /> : <IconArrowsSort className="ml-2 size-4" />}
        </Button>
      )
    },
    cell: ({ row }) => <ScoreBadge score={row.original.recommendationScore} />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Status
          {column.getIsSorted() === "asc" ? <IconArrowUp className="ml-2 size-4" /> : column.getIsSorted() === "desc" ? <IconArrowDown className="ml-2 size-4" /> : <IconArrowsSort className="ml-2 size-4" />}
        </Button>
      )
    },
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "whatsapp",
    header: () => <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">WhatsApp</div>,
    cell: () => (
      <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:text-success hover:bg-success/10 rounded-full">
        <IconBrandWhatsapp className="size-5" />
      </Button>
    ),
  },
  {
    id: "experience",
    header: () => <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pengalaman</div>,
    cell: ({ row }) => {
      const ext = getExtendedData(row.original.applicantName);
      return <div className="text-sm whitespace-nowrap">{ext.experience}</div>;
    },
  },
  {
    id: "lastPosition",
    header: () => <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[150px]">Posisi Terakhir</div>,
    cell: ({ row }) => {
      const ext = getExtendedData(row.original.applicantName);
      return (
        <div className="flex flex-col gap-1 py-2">
          <div className="font-semibold text-sm">{ext.lastPosition}</div>
          <div className="text-xs text-muted-foreground">Okt 2022 - Saat Ini</div>
        </div>
      );
    },
  },
  {
    id: "education",
    header: () => <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[150px]">Pendidikan</div>,
    cell: ({ row }) => {
      const ext = getExtendedData(row.original.applicantName);
      const lines = ext.education.split("\n");
      return (
        <div className="flex flex-col gap-1 py-2">
          <div className="font-semibold text-sm truncate max-w-[200px]">{lines[0]}</div>
          <div className="text-xs text-muted-foreground truncate max-w-[200px]">{lines[1]}</div>
          <div className="text-xs text-muted-foreground/70">{lines[2]}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "appliedDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Tanggal Melamar
          {column.getIsSorted() === "asc" ? <IconArrowUp className="ml-2 size-4" /> : column.getIsSorted() === "desc" ? <IconArrowDown className="ml-2 size-4" /> : <IconArrowsSort className="ml-2 size-4" />}
        </Button>
      )
    },
    cell: ({ row }) => <span className="text-sm whitespace-nowrap text-muted-foreground">{row.original.appliedDate}</span>,
  },
  {
    id: "gender",
    header: () => <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Jenis Kelamin</div>,
    cell: ({ row }) => {
      const ext = getExtendedData(row.original.applicantName);
      return <div className="text-sm">{ext.gender}</div>;
    },
  },
  {
    id: "lastActive",
    header: () => <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Terakhir Aktif</div>,
    cell: ({ row }) => {
      const ext = getExtendedData(row.original.applicantName);
      return <div className="text-sm whitespace-nowrap text-muted-foreground">{ext.lastActive}</div>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tindakan</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Button size="icon" className="h-8 w-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded">
          <IconMessageCircle className="size-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 rounded text-muted-foreground hover:text-destructive border-border">
          <IconX className="size-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button
              variant="outline"
              className="flex h-8 w-8 rounded text-muted-foreground border-border"
              size="icon"
             />}>
              <IconDotsVertical className="size-4" />
              <span className="sr-only">Buka menu</span>
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <IconEye className="mr-2 size-4 text-muted-foreground" />
              Lihat Detail Penuh
            </DropdownMenuItem>
            {row.original.resumeLink && (
              <DropdownMenuItem onClick={() => window.open(row.original.resumeLink, "_blank")}>
                <IconFileText className="mr-2 size-4 text-muted-foreground" />
                Buka CV
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">Tolak Kandidat</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]

export function DataTable({ data }: { data: Candidate[] }) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  const [activeTab, setActiveTab] = React.useState("all")

  const [tableMode, setTableMode] = React.useState<"ai" | "detail">("ai")

  const columnVisibility = React.useMemo<VisibilityState>(() => {
    if (tableMode === "ai") {
      return {
        whatsapp: false,
        experience: false,
        lastPosition: false,
        education: false,
        gender: false,
        lastActive: false,

        jobTitle: true,
        recommendationScore: true,
        status: true,
      }
    } else {
      return {
        whatsapp: true,
        experience: true,
        lastPosition: true,
        education: true,
        gender: true,
        lastActive: true,

        jobTitle: false,
        recommendationScore: false,
        status: false,
      }
    }
  }, [tableMode])

  const uniqueJobs = React.useMemo(() => {
    return Array.from(new Set(data.map(d => d.jobTitle))).sort();
  }, [data])

  React.useEffect(() => {
    if (activeTab === "all") {
      setColumnFilters([])
    } else if (activeTab === "administrasi") {
      setColumnFilters([{ id: "status", value: "under-review" }])
    } else if (activeTab === "wawancara") {
      setColumnFilters([{ id: "status", value: "interview" }])
    } else if (activeTab === "ditolak") {
      setColumnFilters([{ id: "status", value: "rejected" }])
    }
  }, [activeTab])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => val && setActiveTab(val)}
      className="w-full flex-col justify-start gap-4"
    >
      <div className="flex flex-col @4xl/main:flex-row items-start @4xl/main:items-center justify-between gap-4 px-4 lg:px-6 w-full">
        <div className="flex bg-muted p-1 rounded-lg">
          <Button 
            variant={tableMode === "ai" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setTableMode("ai")}
            className="rounded-md"
          >
            Format Direkrut AI
          </Button>
          <Button 
            variant={tableMode === "detail" ? "default" : "ghost"} 
            size="sm" 
            onClick={() => setTableMode("detail")}
            className="rounded-md"
          >
            Detail Kandidat Lengkap
          </Button>
        </div>
      </div>

      <div className="flex flex-col @4xl/main:flex-row items-start @4xl/main:items-center gap-4 px-4 lg:px-6 mb-2 w-full">
        
        <div className="w-full @4xl/main:w-auto flex-1 max-w-xs">
          <Input
            placeholder="Cari nama kandidat..."
            value={(table.getColumn("applicantName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("applicantName")?.setFilterValue(event.target.value)
            }
          />
        </div>

        <div className="w-full @4xl/main:w-auto flex-none overflow-x-auto pb-1 @4xl/main:pb-0">
          <Label htmlFor="view-selector" className="sr-only">
            Status Kandidat
          </Label>
          <Select value={activeTab} onValueChange={(val) => val && setActiveTab(val)}>
            <SelectTrigger
              className="flex w-full @4xl/main:hidden"
              size="sm"
              id="view-selector"
            >
              <SelectValue placeholder="Semua Kandidat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kandidat</SelectItem>
              <SelectItem value="administrasi">Administrasi</SelectItem>
              <SelectItem value="wawancara">Wawancara</SelectItem>
              <SelectItem value="ditolak">Ditolak</SelectItem>
            </SelectContent>
          </Select>
          <TabsList className="hidden w-max **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex">
            <TabsTrigger value="all">Semua Kandidat</TabsTrigger>
            <TabsTrigger value="administrasi">
              Administrasi <Badge variant="secondary">{data.filter(d => d.status === 'under-review').length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="wawancara">
              Wawancara <Badge variant="secondary">{data.filter(d => d.status === 'interview').length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="ditolak">
              Ditolak <Badge variant="secondary">{data.filter(d => d.status === 'rejected').length}</Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="w-full @4xl/main:w-[220px] flex-none">
          <Select
            value={(table.getColumn("jobTitle")?.getFilterValue() as string) ?? "Semua Posisi"}
            onValueChange={(value) => table.getColumn("jobTitle")?.setFilterValue(value === "Semua Posisi" ? "" : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Semua Posisi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua Posisi">Semua Posisi</SelectItem>
              {uniqueJobs.map(job => (
                <SelectItem key={job} value={job}>{job}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 py-4">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Tidak ada kandidat ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} dari{" "}
            {table.getFilteredRowModel().rows.length} baris dipilih.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium whitespace-nowrap">
                Baris per halaman
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium whitespace-nowrap">
              Hal {table.getState().pagination.pageIndex + 1} dari{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Halaman pertama</span>
                <IconChevronsLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Halaman sebelumnya</span>
                <IconChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Halaman berikutnya</span>
                <IconChevronRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Halaman terakhir</span>
                <IconChevronsRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Tabs>
  )
}

function TableCellViewer({ item, triggerNode }: { item: Candidate, triggerNode?: React.ReactNode }) {
  const isMobile = useIsMobile()
  const scoreInfo = getScoreLevel(item.recommendationScore)

  return (
    <Drawer swipeDirection={isMobile ? "down" : "right"}>
      <DrawerTrigger nativeButton={false} render={(triggerNode as React.ReactElement) || <div className="flex items-center gap-3 cursor-pointer group" />}>
        {!triggerNode && (
          <>
            <Avatar className="h-9 w-9 border group-hover:border-primary transition-colors">
              <AvatarFallback>{item.applicantName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-primary hover:underline">{item.applicantName}</span>
          </>
        )}
      </DrawerTrigger>
      <DrawerContent className={!isMobile ? "w-full sm:w-[500px]" : ""}>
        <DrawerHeader className="gap-1 text-left">
          <div className="flex items-center gap-4 mb-2">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-lg">{item.applicantName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <DrawerTitle className="text-xl">{item.applicantName}</DrawerTitle>
              <DrawerDescription>Melamar untuk posisi {item.jobTitle}</DrawerDescription>
            </div>
          </div>
        </DrawerHeader>
        <div className="flex flex-col gap-6 overflow-y-auto px-4 py-4 text-sm">
          <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Status</Label>
              <div className="font-medium mt-1">{getStatusMeta(item.status).label}</div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Kecocokan AI</Label>
              <div className="mt-1">
                <Badge variant={scoreInfo.variant}>{scoreInfo.label} ({item.recommendationScore}%)</Badge>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Tanggal Melamar</Label>
              <div className="font-medium mt-1">{item.appliedDate}</div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Resume / CV</Label>
              <div className="mt-1">
                {item.resumeLink ? (
                  <a href={item.resumeLink} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                    <IconFileText className="size-4" /> Lihat CV
                  </a>
                ) : (
                  <span className="text-muted-foreground">Tidak ada dokumen</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className="text-base font-semibold">Tindakan Cepat</Label>
            <div className="flex flex-col gap-2">
              <DecisionDialog 
                candidate={item} 
                decision="invite" 
                trigger={
                  <Button className="justify-start w-full" variant="outline">
                    <IconUser className="size-4 mr-2" /> Jadwalkan Wawancara
                  </Button>
                } 
              />
              <DecisionDialog 
                candidate={item} 
                decision="reject" 
                trigger={
                  <Button className="justify-start w-full text-destructive hover:text-destructive hover:bg-destructive/10" variant="outline">
                    Tolak Kandidat Ini
                  </Button>
                } 
              />
            </div>
          </div>
        </div>
        <DrawerFooter className="pt-2 border-t mt-auto gap-2">
          <Button className="w-full" render={<Link href={`/hrd/candidates/${item.id}`} />}>
              Lihat Analisis Penuh
          </Button>
          <DrawerClose render={<Button variant="outline" className="w-full">Tutup</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
