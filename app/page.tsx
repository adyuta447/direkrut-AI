import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6 max-w-lg p-8 border rounded-2xl bg-card shadow-lg">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Direkrut AI</h1>
        <p className="text-muted-foreground text-lg">
          Pilih portal untuk masuk ke sistem demonstrasi kami.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Link href="/hrd" className="w-full">
            <Button size="lg" className="w-full h-16 text-lg">
              Portal HRD
            </Button>
          </Link>
          <Link href="/candidate/jobs" className="w-full">
            <Button variant="outline" size="lg" className="w-full h-16 text-lg border-2">
              Portal Kandidat
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
