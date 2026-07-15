import * as React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Interview | Direkrut AI",
  description: "Wawancara Cerdas dengan Direkrut AI",
}

export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {children}
    </div>
  )
}
