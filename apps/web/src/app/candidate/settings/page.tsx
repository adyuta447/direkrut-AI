"use client"

import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BellIcon, LockIcon, UserIcon } from "lucide-react"
import {
  SettingsCandidateTabAccount,
  SettingsCandidateTabSecurity,
} from "@/components/molecules/dashboard/SettingsCandidateTabAccount"
import { SettingsCandidateTabNotifications } from "@/components/molecules/dashboard/SettingsCandidateTabNotifications"

export default function CandidateSettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <PageHeader
        eyebrow="Akun Kamu"
        title="Pengaturan Akun"
        description="Atur preferensi, notifikasi, dan keamanan akunmu."
      />

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="account" className="gap-2">
            <UserIcon className="size-4" /> Akun
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <BellIcon className="size-4" /> Notifikasi
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <LockIcon className="size-4" /> Keamanan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <SettingsCandidateTabAccount />
        </TabsContent>

        <TabsContent value="notifications">
          <SettingsCandidateTabNotifications />
        </TabsContent>

        <TabsContent value="security">
          <SettingsCandidateTabSecurity />
        </TabsContent>
      </Tabs>
    </div>
  )
}
