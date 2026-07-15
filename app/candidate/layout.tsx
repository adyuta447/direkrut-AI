import * as React from "react"
import { CandidateSidebar } from "@/components/candidate-sidebar"
import { SearchDialog } from "@/components/search-dialog"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Candidate Portal | Direkrut AI",
  description: "Portal pelamar Direkrut AI",
}

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <CandidateSidebar />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 flex flex-col h-[calc(100vh-[var(--header-height)])] overflow-hidden">
          {children}
        </main>
        <SearchDialog />
      </SidebarInset>
    </SidebarProvider>
  )
}
