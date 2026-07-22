import * as React from "react"
import { Metadata } from "next"
import { InterviewGate } from "@/components/organisms/dashboard/InterviewGate"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Wawancara AI | Direkrut AI",
  description: "Wawancara cerdas dengan Direkrut AI",
}

// ThemeProvider dipasang di sini (bukan cuma di candidate/hrd layout) --
// route ini di luar keduanya, jadi tanpa ini halaman selalu putih walau
// device-nya lagi dark mode. defaultTheme="system", sama kayak dashboard.
export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <InterviewGate>
        <div data-dashboard className="min-h-screen bg-background text-foreground font-sans antialiased">
          {children}
        </div>
      </InterviewGate>
    </ThemeProvider>
  )
}
