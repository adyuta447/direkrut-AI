"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, SendIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ApplyStep3Review } from "@/components/molecules/dashboard/ApplyStep3Review"
import { ApplyStepIndicator } from "@/components/molecules/dashboard/ApplyStepIndicator"
import { useApplyFlowContext } from "@/lib/applications/ApplyFlowContext"

export default function ReviewStepPage({ params }: { params: Promise<{ jobId: string }> }) {
  const unwrappedParams = React.use(params)
  const router = useRouter()
  const { job, formData, isProfileComplete, isSubmitting, handleSubmit } = useApplyFlowContext()

  if (!job) return null

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 pb-8 space-y-8">
      <ApplyStepIndicator step={3} />

      <Card>
        <CardHeader>
          <CardTitle>Tinjauan Akhir</CardTitle>
          <CardDescription>Cek sekali lagi sebelum lamaranmu meluncur.</CardDescription>
        </CardHeader>
        <CardContent>
          <ApplyStep3Review job={job} formData={formData} isProfileComplete={isProfileComplete} />
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/20 p-6">
          <Button variant="outline" onClick={() => router.push(`/candidate/apply/${unwrappedParams.jobId}/resume`)} disabled={isSubmitting}>
            <ArrowLeftIcon className="mr-2 size-4" /> Kembali
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Lamaran"} 
            {!isSubmitting && <SendIcon className="ml-2 size-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
