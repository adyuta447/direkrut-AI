"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { type Table } from "@tanstack/react-table"
import { Candidate } from "@/components/molecules/dashboard/CandidateTableTypes"

interface CandidateTableToolbarProps {
  table: Table<Candidate>
  data: Candidate[]
  activeTab: string
  onTabChange: (val: string) => void
  tableMode: "ai" | "detail"
  onTableModeChange: (mode: "ai" | "detail") => void
  uniqueJobs: string[]
}

export function CandidateTableToolbar({
  table,
  data,
  activeTab,
  onTabChange,
  tableMode,
  onTableModeChange,
  uniqueJobs,
}: CandidateTableToolbarProps) {
  return (
    <>
      <div className="flex flex-col @4xl/main:flex-row items-start @4xl/main:items-center justify-between gap-4 px-4 lg:px-6 w-full">
        <div className="flex bg-muted p-1 rounded-lg">
          <Button
            variant={tableMode === "ai" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTableModeChange("ai")}
            className="rounded-md"
          >
            Format Direkrut AI
          </Button>
          <Button
            variant={tableMode === "detail" ? "default" : "ghost"}
            size="sm"
            onClick={() => onTableModeChange("detail")}
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
            value={
              (table.getColumn("applicantName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("applicantName")?.setFilterValue(event.target.value)
            }
          />
        </div>

        <div className="w-full @4xl/main:w-auto flex-none overflow-x-auto pb-1 @4xl/main:pb-0">
          <Label htmlFor="view-selector" className="sr-only">
            Status Kandidat
          </Label>
          <Select value={activeTab} onValueChange={(val) => val && onTabChange(val)}>
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
              Administrasi{" "}
              <Badge variant="secondary">
                {data.filter((d) => d.status === "under-review").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="wawancara">
              Wawancara{" "}
              <Badge variant="secondary">
                {data.filter((d) => d.status === "interview").length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="ditolak">
              Ditolak{" "}
              <Badge variant="secondary">
                {data.filter((d) => d.status === "rejected").length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="w-full @4xl/main:w-[220px] flex-none">
          <Select
            value={
              (table.getColumn("jobTitle")?.getFilterValue() as string) ??
              "Semua Posisi"
            }
            onValueChange={(value) =>
              table
                .getColumn("jobTitle")
                ?.setFilterValue(value === "Semua Posisi" ? "" : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Semua Posisi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua Posisi">Semua Posisi</SelectItem>
              {uniqueJobs.map((job) => (
                <SelectItem key={job} value={job}>
                  {job}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )
}
