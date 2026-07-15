import * as React from "react"
import { Metadata } from "next"
import { InterviewGate } from "@/components/organisms/dashboard/InterviewGate"

export const metadata: Metadata = {
  title: "Wawancara AI | Direkrut AI",
  description: "Wawancara cerdas dengan Direkrut AI",
}

export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <InterviewGate>
      <div data-dashboard className="min-h-screen bg-background font-sans antialiased">
        {children}
      </div>
    </InterviewGate>
  )
}
