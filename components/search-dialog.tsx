"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useApp } from "@/components/providers/app-provider"
import { LayoutDashboardIcon, FolderIcon, CircleHelpIcon, Settings2Icon, UserIcon, FileTextIcon } from "lucide-react"

export function SearchDialog() {
  const { searchOpen, setSearchOpen, applications, jobs } = useApp()
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [setSearchOpen])

  const runCommand = React.useCallback((command: () => void) => {
    setSearchOpen(false)
    command()
  }, [setSearchOpen])

  return (
    <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
      <CommandInput placeholder="Ketik untuk mencari kandidat, lowongan, atau halaman..." />
      <CommandList>
        <CommandEmpty>Tidak ada hasil yang ditemukan.</CommandEmpty>
        
        {applications.length > 0 && (
          <CommandGroup heading="Kandidat">
            {applications.slice(0, 5).map((app) => (
              <CommandItem
                key={app.id}
                value={app.applicantName}
                onSelect={() => runCommand(() => router.push(`/hrd/candidate/${app.id}`))}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                <span>{app.applicantName}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        
        {jobs.length > 0 && (
          <CommandGroup heading="Lowongan">
            {jobs.slice(0, 5).map((job) => (
              <CommandItem
                key={job.id}
                value={job.title}
                onSelect={() => runCommand(() => router.push(`/hrd/jobs/${job.id}`))}
              >
                <FolderIcon className="mr-2 h-4 w-4" />
                <span>{job.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />
        
        <CommandGroup heading="Navigasi">
          <CommandItem onSelect={() => runCommand(() => router.push("/hrd"))}>
            <LayoutDashboardIcon className="mr-2 h-4 w-4" />
            <span>Dashboard Utama</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/hrd/jobs/new"))}>
            <FolderIcon className="mr-2 h-4 w-4" />
            <span>Buat Lowongan Baru</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/hrd/inbox"))}>
            <FileTextIcon className="mr-2 h-4 w-4" />
            <span>Kotak Masuk (Email)</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/hrd/settings"))}>
            <Settings2Icon className="mr-2 h-4 w-4" />
            <span>Pengaturan Akun & Tema</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/hrd/help"))}>
            <CircleHelpIcon className="mr-2 h-4 w-4" />
            <span>Pusat Bantuan & Panduan</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
