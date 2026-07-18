"use client"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const STATUS_OPTIONS = [
  { value: "all", label: "Semua" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Tidak Aktif" },
  { value: "review", label: "Direview" },
  { value: "draft", label: "Draft" },
]

interface JobStatusTabsProps {
  activeTab: string
  onChange: (status: string) => void
  tabCounts: (status: string) => number
}

/** Filter status lowongan -- Tabs di desktop, Select di mobile (space
 * sempit), dua-duanya sinkron ke state yang sama. */
export function JobStatusTabs({ activeTab, onChange, tabCounts }: JobStatusTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(val) => val && onChange(val)} className="w-full">
      <TabsList className="mb-2 hidden sm:flex w-max **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1">
        {STATUS_OPTIONS.map(({ value, label }) => (
          <TabsTrigger key={value} value={value}>
            {label} <Badge variant="secondary" className="ml-2">{tabCounts(value)}</Badge>
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="sm:hidden mb-2">
        <Select value={activeTab} onValueChange={(val) => val && onChange(val)}>
          <SelectTrigger><SelectValue placeholder="Pilih Status" /></SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {value === "all" ? "Semua Lowongan" : label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Tabs>
  )
}
