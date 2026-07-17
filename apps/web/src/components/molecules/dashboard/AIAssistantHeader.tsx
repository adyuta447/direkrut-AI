import { IconSparkles } from "@tabler/icons-react"

export function AIAssistantHeader() {
  return (
    <div className="px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 sticky top-0 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <IconSparkles className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="font-semibold text-lg">Asisten AI</h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success inline-block" />
            Standby, siap dipanggil kapan aja
          </p>
        </div>
      </div>
    </div>
  )
}
