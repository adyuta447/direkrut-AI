import { IconSend, IconPaperclip } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AIAssistantInputProps {
  value: string
  onChange: (val: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function AIAssistantInput({ value, onChange, onSubmit }: AIAssistantInputProps) {
  return (
    <div className="p-4 bg-background border-t">
      <form
        onSubmit={onSubmit}
        className="max-w-4xl mx-auto relative flex items-end gap-2"
      >
        <div className="relative flex-1">
          <Input
            placeholder="Tanya soal kandidat, jadwal, atau analisis..."
            className="pl-12 pr-16 py-6 bg-muted/50 border-muted-foreground/20 rounded-full focus-visible:ring-primary/50 text-sm"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rounded-full"
          >
            <IconPaperclip className="size-5" />
          </Button>
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={!value.trim()}
          className="rounded-full w-12 h-12 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-transform active:scale-95"
        >
          <IconSend className="size-5" />
        </Button>
      </form>
      <p className="text-center text-[10px] text-muted-foreground mt-3">
        AI kadang bisa salah — tetap cek lagi sebelum ambil keputusan rekrutmen ya.
      </p>
    </div>
  )
}
