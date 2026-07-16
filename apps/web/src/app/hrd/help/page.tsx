"use client"

import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { HelpWeightPanel } from "@/components/molecules/dashboard/HelpWeightPanel"
import { HelpGuidePanel } from "@/components/molecules/dashboard/HelpGuidePanel"

export default function HelpPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 w-full">
      <PageHeader
        className="mb-6"
        title="Pusat Bantuan & Panduan"
        description="Pelajari cara menggunakan dasbor Direkrut AI secara maksimal."
      />

      <div className="grid md:grid-cols-2 gap-6">
        <HelpWeightPanel />
        <HelpGuidePanel />
      </div>
    </div>
  )
}
