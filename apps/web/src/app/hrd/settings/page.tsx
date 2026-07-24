"use client"

import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SettingsHrdTabAccount,
  SettingsHrdTabSystem,
} from "@/components/molecules/dashboard/SettingsHrdTabs"
import { SettingsHrdTabBilling } from "@/components/molecules/dashboard/SettingsHrdTabBilling"
import { SettingsHrdTabAiScoring } from "@/components/molecules/dashboard/SettingsHrdTabAiScoring"

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 w-full">
      <PageHeader
        className="mb-6"
        title="Pengaturan"
        description="Akun, sistem AI, sampe tagihan — atur semua di sini."
      />

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 flex-wrap h-auto">
          <TabsTrigger value="account" className="px-6">Akun</TabsTrigger>
          <TabsTrigger value="ai-scoring" className="px-6">Bobot AI Screening</TabsTrigger>
          <TabsTrigger value="system" className="px-6">Sistem &amp; Tampilan</TabsTrigger>
          <TabsTrigger value="billing" className="px-6">Paket &amp; Upgrade</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <SettingsHrdTabAccount />
        </TabsContent>

        <TabsContent value="ai-scoring" className="space-y-4">
          <SettingsHrdTabAiScoring />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <SettingsHrdTabSystem />
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <SettingsHrdTabBilling />
        </TabsContent>
      </Tabs>
    </div>
  )
}
