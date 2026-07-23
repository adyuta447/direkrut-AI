"use client"

import { useRouter } from "next/navigation"
import {
  IconArrowUp,
  IconArrowDown,
  IconArrowsSort,
  IconBrandWhatsapp,
  IconMessageCircle,
  IconX,
  IconDotsVertical,
  IconEye,
  IconFileText,
} from "@tabler/icons-react"
import { type ColumnDef } from "@tanstack/react-table"
import { getExtendedData } from "@/lib/dashboard/extended-data"
import { ScoreBadge, StatusBadge } from "@/components/molecules/dashboard/StatusBadge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Candidate } from "@/components/molecules/dashboard/CandidateTableTypes"
import { CandidateTableCellViewer } from "@/components/molecules/dashboard/CandidateDrawerContent"
import { DecisionDialog } from "@/components/organisms/dashboard/DecisionDialog"

function SortableHeader({
  label,
  column,
}: {
  label: string
  column: {
    toggleSorting: (asc: boolean) => void
    getIsSorted: () => "asc" | "desc" | false
  }
}) {
  const sorted = column.getIsSorted()
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(sorted === "asc")}
      className="px-0 hover:bg-transparent text-xs font-semibold uppercase tracking-wider text-muted-foreground"
    >
      {label}
      {sorted === "asc" ? (
        <IconArrowUp className="ml-2 size-4" />
      ) : sorted === "desc" ? (
        <IconArrowDown className="ml-2 size-4" />
      ) : (
        <IconArrowsSort className="ml-2 size-4" />
      )}
    </Button>
  )
}

function ActionsCell({ row }: { row: { original: Candidate } }) {
  const router = useRouter()
  return (
    <div className="flex items-center gap-1.5">
      <CandidateTableCellViewer
        item={row.original}
        triggerIsButton
        triggerNode={
          <Button
            size="icon"
            className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <IconMessageCircle className="size-4" />
          </Button>
        }
      />
      <DecisionDialog
        candidate={row.original}
        decision="reject"
        trigger={
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive border-hairline"
          >
            <IconX className="size-4" />
          </Button>
        }
      />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              className="flex h-8 w-8 rounded-full text-muted-foreground border-hairline"
              size="icon"
            />
          }
        >
          <IconDotsVertical className="size-4" />
          <span className="sr-only">Buka menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => router.push(`/hrd/candidates/${row.original.id}`)}
          >
            <IconEye className="mr-2 size-4 text-muted-foreground" />
            Lihat Detail Penuh
          </DropdownMenuItem>
          {row.original.resumeLink && (
            <DropdownMenuItem
              onClick={() => window.open(row.original.resumeLink, "_blank")}
            >
              <IconFileText className="mr-2 size-4 text-muted-foreground" />
              Buka CV
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const candidateColumns: ColumnDef<Candidate>[] = [
  {
    id: "index",
    header: "No.",
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination
      const visibleIndex = table
        .getRowModel()
        .rows.findIndex((r) => r.id === row.id)
      const idx = visibleIndex !== -1 ? visibleIndex : row.index
      return (
        <div className="text-center text-muted-foreground">
          {pageIndex * pageSize + idx + 1}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "applicantName",
    header: ({ column }) => <SortableHeader label="Nama & Domisili" column={column} />,
    cell: ({ row }) => {
      const ext = getExtendedData(row.original)
      return (
        <CandidateTableCellViewer
          item={row.original}
          triggerNode={
            <div className="flex flex-col gap-1 min-w-[200px] py-2 cursor-pointer group">
              <div className="font-semibold text-foreground text-sm group-hover:underline group-hover:text-primary transition-colors">
                {row.original.applicantName}
              </div>
              <div className="text-xs text-muted-foreground">{ext.domicile}</div>
            </div>
          }
        />
      )
    },
  },
  {
    accessorKey: "jobTitle",
    header: ({ column }) => <SortableHeader label="Posisi Dilamar" column={column} />,
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.jobTitle}</span>
    ),
  },
  {
    accessorKey: "recommendationScore",
    header: ({ column }) => <SortableHeader label="Profil Keahlian AI" column={column} />,
    cell: ({ row }) => <ScoreBadge score={row.original.recommendationScore} />,
  },
  {
    accessorKey: "interviewScore",
    header: ({ column }) => <SortableHeader label="Wawancara AI" column={column} />,
    cell: ({ row }) => {
      const { interviewStatus, interviewScore } = row.original
      if (interviewStatus !== "completed") {
        return <span className="text-sm text-muted-foreground">Belum wawancara</span>
      }
      return (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-base font-bold tabular-nums text-primary">
            {Math.round(interviewScore ?? 0)}
          </span>
          <span className="text-xs text-muted-foreground">skor AI</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader label="Status" column={column} />,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "whatsapp",
    header: () => (
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        WhatsApp
      </div>
    ),
    cell: () => (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-success hover:text-success hover:bg-success/10 rounded-full"
      >
        <IconBrandWhatsapp className="size-5" />
      </Button>
    ),
  },
  {
    id: "experience",
    header: () => (
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Pengalaman
      </div>
    ),
    cell: ({ row }) => {
      const ext = getExtendedData(row.original)
      return <div className="text-sm whitespace-nowrap">{ext.experience}</div>
    },
  },
  {
    id: "lastPosition",
    header: () => (
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[150px]">
        Posisi Terakhir
      </div>
    ),
    cell: ({ row }) => {
      const ext = getExtendedData(row.original)
      const latest = row.original.candidateProfile?.experience?.[0]
      const period = [latest?.startDate, latest?.endDate || (latest ? "Sekarang" : "")].filter(Boolean).join(" - ")
      return (
        <div className="flex flex-col gap-1 py-2">
          <div className="font-semibold text-sm">{ext.lastPosition}</div>
          {period && <div className="text-xs text-muted-foreground">{period}</div>}
        </div>
      )
    },
  },
  {
    id: "education",
    header: () => (
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[150px]">
        Pendidikan
      </div>
    ),
    cell: ({ row }) => {
      const ext = getExtendedData(row.original)
      const lines = ext.education.split("\n")
      return (
        <div className="flex flex-col gap-1 py-2">
          <div className="font-semibold text-sm truncate max-w-[200px]">{lines[0]}</div>
          <div className="text-xs text-muted-foreground truncate max-w-[200px]">{lines[1]}</div>
          <div className="text-xs text-muted-foreground/70">{lines[2]}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "appliedDate",
    header: ({ column }) => <SortableHeader label="Tanggal Melamar" column={column} />,
    cell: ({ row }) => (
      <span className="text-sm whitespace-nowrap text-muted-foreground">
        {row.original.appliedDate}
      </span>
    ),
  },
  {
    id: "gender",
    header: () => (
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Jenis Kelamin
      </div>
    ),
    cell: ({ row }) => {
      const ext = getExtendedData(row.original)
      return <div className="text-sm">{ext.gender}</div>
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Tindakan
      </div>
    ),
    cell: ({ row }) => <ActionsCell row={row} />,
  },
]
