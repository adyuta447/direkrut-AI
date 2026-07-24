"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ApplyStep1 } from "@/components/molecules/dashboard/ApplyStep1"
import { ApplyStepIndicator } from "@/components/molecules/dashboard/ApplyStepIndicator"
import { useApplyFlowContext } from "@/lib/applications/ApplyFlowContext"

export default function PersonalStepPage({ params }: { params: Promise<{ jobId: string }> }) {
  const unwrappedParams = React.use(params)
  const router = useRouter()
  const { formData, onFormDataChange } = useApplyFlowContext()

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 pb-8 space-y-8">
      <ApplyStepIndicator step={1} />

      <Card>
        <CardHeader>
          <CardTitle>Informasi Pribadi</CardTitle>
          <CardDescription>Pastikan datanya sesuai sama identitas kamu ya.</CardDescription>
        </CardHeader>
        <CardContent>
          <ApplyStep1 formData={formData} onChange={onFormDataChange} />
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/20 p-6">
          <Button variant="outline" onClick={() => router.push(`/candidate/jobs`)}>
            <ArrowLeftIcon className="mr-2 size-4" /> Batal
          </Button>
          <Button onClick={() => router.push(`/candidate/apply/${unwrappedParams.jobId}/resume`)}>
            Selanjutnya <ArrowRightIcon className="ml-2 size-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
