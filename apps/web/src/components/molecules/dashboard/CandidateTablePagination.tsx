"use client"

import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type Table } from "@tanstack/react-table"
import { Candidate } from "@/components/molecules/dashboard/CandidateTableTypes"

interface CandidateTablePaginationProps {
  table: Table<Candidate>
}

export function CandidateTablePagination({ table }: CandidateTablePaginationProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-surface-1 px-5 py-3">
      <div className="hidden flex-1 text-sm text-ink-muted lg:flex">
        {table.getFilteredSelectedRowModel().rows.length} dari{" "}
        {table.getFilteredRowModel().rows.length} baris dipilih.
      </div>
      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="hidden items-center gap-2 lg:flex">
          <Label
            htmlFor="rows-per-page"
            className="text-sm font-medium whitespace-nowrap text-ink"
          >
            Baris per halaman
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger size="sm" className="w-20 rounded-full border-hairline bg-canvas" id="rows-per-page">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
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
        <span className="flex w-fit items-center justify-center rounded-full border border-hairline bg-canvas px-3 py-1 text-sm font-semibold text-ink whitespace-nowrap">
          Hal {table.getState().pagination.pageIndex + 1} dari{" "}
          {table.getPageCount()}
        </span>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 border-hairline bg-canvas lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Halaman pertama</span>
            <IconChevronsLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 border-hairline bg-canvas"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Halaman sebelumnya</span>
            <IconChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8 border-hairline bg-canvas"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Halaman berikutnya</span>
            <IconChevronRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 border-hairline bg-canvas lg:flex"
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
  )
}
