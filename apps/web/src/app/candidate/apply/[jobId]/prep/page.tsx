"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, PlayIcon, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useApplyFlowContext } from "@/lib/applications/ApplyFlowContext"

export default function PrepStepPage({ params }: { params: Promise<{ jobId: string }> }) {
  const unwrappedParams = React.use(params)
  const router = useRouter()
  const { job } = useApplyFlowContext()

  if (!job) return null

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 pb-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Persiapan Wawancara AI & Tes Tertulis</CardTitle>
          <CardDescription>Panduan dan Mekanisme Tes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-warning/10 border border-warning/20 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div className="text-sm text-warning-foreground">
              <p className="font-semibold mb-1">Perhatian Penting:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Kamu akan diberikan <strong>Tes Tertulis</strong> terlebih dahulu dengan waktu <strong>5 Menit</strong>.</li>
                <li>Setelah menekan tombol Lanjut, kamu <strong>tidak bisa kembali</strong> untuk mengedit form lamaran.</li>
                <li>Pastikan kamera dan mikrofon berfungsi dengan baik karena kamera akan menyala selama tes.</li>
                <li>Dilarang membuka tab atau aplikasi lain selama tes berlangsung.</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/20 p-6">
          <Button variant="outline" onClick={() => router.push(`/candidate/apply/${unwrappedParams.jobId}/submitted`)}>
            <ArrowLeftIcon className="mr-2 size-4" /> Kembali ke Lamaran Terkirim
          </Button>
          <Button onClick={() => router.push(`/candidate/apply/${unwrappedParams.jobId}/written-test`)}>
            Mulai Tes Tertulis <PlayIcon className="ml-2 size-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
