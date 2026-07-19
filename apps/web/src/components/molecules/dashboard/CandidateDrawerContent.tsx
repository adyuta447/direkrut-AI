"use client"

import Link from "next/link"
import { IconUser, IconFileText } from "@tabler/icons-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { getScoreLevel, getStatusMeta } from "@/lib/dashboard/status"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Label } from "@/components/ui/label"
import { DecisionDialog } from "@/components/organisms/dashboard/DecisionDialog"
import { Candidate } from "@/components/molecules/dashboard/CandidateTableTypes"

interface CandidateTableCellViewerProps {
  item: Candidate
  triggerNode?: React.ReactNode
  /** Set true kalau triggerNode adalah elemen <button> beneran (mis. komponen Button). */
  triggerIsButton?: boolean
}

function DrawerInfoGrid({ item }: { item: Candidate }) {
  const scoreInfo = getScoreLevel(item.recommendationScore)
  return (
    <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">
          Status
        </Label>
        <div className="font-medium mt-1">{getStatusMeta(item.status).label}</div>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">
          Kecocokan AI
        </Label>
        <div className="mt-1">
          <Badge variant={scoreInfo.variant}>
            {scoreInfo.label} ({item.recommendationScore}%)
          </Badge>
        </div>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">
          Tanggal Melamar
        </Label>
        <div className="font-medium mt-1">{item.appliedDate}</div>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">
          Resume / CV
        </Label>
        <div className="mt-1">
          {item.resumeLink ? (
            <a
              href={item.resumeLink}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              <IconFileText className="size-4" /> Lihat CV
            </a>
          ) : (
            <span className="text-muted-foreground">Belum ada dokumen</span>
          )}
        </div>
      </div>
    </div>
  )
}

function DrawerQuickActions({ item }: { item: Candidate }) {
  return (
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
            <Button
              className="justify-start w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              variant="outline"
            >
              Tolak Kandidat Ini
            </Button>
          }
        />
      </div>
    </div>
  )
}

export function CandidateTableCellViewer({
  item,
  triggerNode,
  triggerIsButton,
}: CandidateTableCellViewerProps) {
  const isMobile = useIsMobile()

  return (
    <Drawer swipeDirection={isMobile ? "down" : "right"}>
      <DrawerTrigger
        nativeButton={!!triggerIsButton}
        render={
          (triggerNode as React.ReactElement) || (
            <div className="flex items-center gap-3 cursor-pointer group" />
          )
        }
      >
        {!triggerNode && (
          <>
            <Avatar className="h-9 w-9 border group-hover:border-primary transition-colors">
              <AvatarFallback>{item.applicantName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-primary hover:underline">
              {item.applicantName}
            </span>
          </>
        )}
      </DrawerTrigger>
      <DrawerContent className={!isMobile ? "w-full sm:w-[500px]" : ""}>
        <DrawerHeader className="gap-1 text-left">
          <div className="flex items-center gap-4 mb-2">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-lg">
                {item.applicantName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <DrawerTitle className="text-xl">{item.applicantName}</DrawerTitle>
              <DrawerDescription>
                Ngelamar buat posisi {item.jobTitle}
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>
        <div className="flex flex-col gap-6 overflow-y-auto px-4 py-4 text-sm">
          <DrawerInfoGrid item={item} />
          <DrawerQuickActions item={item} />
        </div>
        <DrawerFooter className="pt-2 border-t mt-auto gap-2">
          <Button
            className="w-full"
            render={<Link href={`/hrd/candidates/${item.id}`} />}
          >
            Lihat Analisis Penuh
          </Button>
          <DrawerClose
            render={<Button variant="outline" className="w-full">Tutup</Button>}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
