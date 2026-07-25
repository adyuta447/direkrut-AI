"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs } from "@/components/ui/tabs"
import { Candidate } from "@/components/molecules/dashboard/CandidateTableTypes"
import { candidateColumns } from "@/components/molecules/dashboard/CandidateTableColumns"
import { CandidateTableToolbar } from "@/components/molecules/dashboard/CandidateTableToolbar"
import { CandidateTablePagination } from "@/components/molecules/dashboard/CandidateTablePagination"
import { Skeleton } from "@/components/ui/skeleton"

export type { Candidate }

const AI_VISIBILITY: VisibilityState = {
  whatsapp: false, experience: false, lastPosition: false,
  education: false, gender: false,
  jobTitle: true, recommendationScore: true, interviewScore: true, status: true,
}

const DETAIL_VISIBILITY: VisibilityState = {
  whatsapp: true, experience: true, lastPosition: true,
  education: true, gender: true,
  jobTitle: false, recommendationScore: false, interviewScore: false, status: false,
}

function useTabFilter(
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
) {
  const [activeTab, setActiveTab] = React.useState("all")

  React.useEffect(() => {
    const STATUS_MAP: Record<string, string> = {
      administrasi: "under-review",
      wawancara: "interview",
      "wawancara-selesai": "interview_completed",
      diterima: "accepted",
      ditolak: "rejected",
    }
    const statusValue = STATUS_MAP[activeTab]
    setColumnFilters(statusValue ? [{ id: "status", value: statusValue }] : [])
  }, [activeTab, setColumnFilters])

  return { activeTab, setActiveTab }
}

export function DataTable({ data, isLoading = false }: { data: Candidate[]; isLoading?: boolean }) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  const [tableMode, setTableMode] = React.useState<"ai" | "detail">("ai")

  const { activeTab, setActiveTab } = useTabFilter(setColumnFilters)

  const columnVisibility = tableMode === "ai" ? AI_VISIBILITY : DETAIL_VISIBILITY

  const uniqueJobs = React.useMemo(
    () => Array.from(new Set(data.map((d) => d.jobTitle))).sort(),
    [data]
  )

  const table = useReactTable({
    data,
    columns: candidateColumns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
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
      <CandidateTableToolbar
        table={table}
        data={data}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tableMode={tableMode}
        onTableModeChange={setTableMode}
        uniqueJobs={uniqueJobs}
      />

      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 py-4">
        <div className="overflow-hidden rounded-3xl border border-hairline bg-canvas">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-surface-1">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan} className="h-9 py-2">
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
              {isLoading ? (
                Array.from({ length: 6 }).map((_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`}>
                    {table.getVisibleLeafColumns().map((column, columnIndex) => (
                      <TableCell key={column.id} className="py-3">
                        <Skeleton
                          className={
                            columnIndex === 0
                              ? "size-4 rounded"
                              : columnIndex % 3 === 0
                                ? "h-4 w-16"
                                : "h-4 w-full max-w-32"
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={candidateColumns.length}
                    className="h-24 text-center"
                  >
                    Belum ada kandidat yang cocok nih.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <CandidateTablePagination table={table} />
      </div>
    </Tabs>
  )
}
