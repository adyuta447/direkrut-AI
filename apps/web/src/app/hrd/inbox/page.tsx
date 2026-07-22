"use client"

import * as React from "react"
import { PageHeader } from "@/components/molecules/dashboard/PageHeader"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HrdInboxTable } from "@/components/molecules/dashboard/HrdInboxTable"
import { listSentDecisions, type SentDecision } from "@/services/applicationService"

export default function InboxPage() {
  const [decisions, setDecisions] = React.useState<SentDecision[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    listSentDecisions()
      .then((items) => { if (!cancelled) setDecisions(items) })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader
        title="Kotak Masuk Email"
        description="Semua keputusan yang udah kamu kirim ke kandidat, lengkap sama statusnya."
      />

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Keputusan ke Kandidat</CardTitle>
          <CardDescription>
            Undangan wawancara dan pemberitahuan hasil seleksi yang udah kamu kirim.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-sm text-ink-muted">Memuat riwayat...</div>
          ) : (
            <HrdInboxTable decisions={decisions} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
