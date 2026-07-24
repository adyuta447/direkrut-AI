"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CheckCircleIcon, ClockIcon, InfoIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CompletedStepPage({ params }: { params: Promise<{ jobId: string }> }) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-4 pt-10">
          <div className="mx-auto w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Wawancara Selesai!</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Terima kasih telah mengikuti Wawancara AI. Profil, CV, dan hasil analisismu sudah diserahkan ke sistem dan tim HRD.
          </p>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-xl border-b pb-4 mb-6 flex items-center gap-2">
              <InfoIcon className="size-5 text-muted-foreground" /> Status Lamaran Anda
            </h3>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-border">

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <CheckCircleIcon className="size-4" />
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border bg-card shadow-sm">
                  <h4 className="font-semibold text-sm">Lamaran Dikirim</h4>
                  <p className="text-xs text-muted-foreground mt-1">CV dan profil berhasil masuk ke sistem.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <CheckCircleIcon className="size-4" />
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border bg-card shadow-sm">
                  <h4 className="font-semibold text-sm">Wawancara AI</h4>
                  <p className="text-xs text-muted-foreground mt-1">Selesai dianalisis oleh AI.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground ring-4 ring-primary/20 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <ClockIcon className="size-4 animate-pulse" />
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-primary bg-primary/5 shadow-sm">
                  <h4 className="font-semibold text-sm text-primary">Analisis HRD</h4>
                  <p className="text-xs text-foreground/80 mt-1">Sedang ditinjau oleh tim rekruter perusahaan.</p>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted border-2 text-muted-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                </div>
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border bg-muted/30 opacity-70">
                  <h4 className="font-semibold text-sm text-muted-foreground">Pengumuman</h4>
                  <p className="text-xs text-muted-foreground mt-1">Menunggu hasil peninjauan.</p>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        <div className="text-center pt-8">
          <Button size="lg" variant="outline" onClick={() => router.push("/candidate")}>
            Kembali ke Beranda Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
