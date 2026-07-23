"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { IconBell } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { listNotifications, markAsRead, type AppNotification } from "@/services/notificationService"
import { useDashboard } from "@/context/DashboardContext"

const POLL_MS = 30_000

// Lonceng notifikasi in-app -- dipakai HRD & kandidat. Nge-poll
// /v1/notifications tiap 30 detik (ponytail: polling sederhana, cukup buat
// skala sekarang; upgrade ke SSE kalau real-time beneran perlu).
export function NotificationBell() {
  const { currentUser } = useDashboard()
  const router = useRouter()
  const [items, setItems] = React.useState<AppNotification[]>([])

  const load = React.useCallback(() => {
    if (!currentUser?.id) return
    listNotifications().then(setItems).catch(() => {})
  }, [currentUser?.id])

  React.useEffect(() => {
    load()
    const t = setInterval(load, POLL_MS)
    return () => clearInterval(t)
  }, [load])

  const unread = items.filter((n) => !n.isRead).length
  const inboxHref = currentUser?.role === "hrd" ? "/hrd/inbox" : "/candidate/inbox"

  const onOpen = async (n: AppNotification) => {
    if (!n.isRead) {
      await markAsRead(n.id)
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)))
    }
    router.push(inboxHref)
  }

  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline" size="icon" className="relative size-9 rounded-full border-hairline" />}
        aria-label="Notifikasi"
      >
        <IconBell className="size-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white tabular-nums">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
          <p className="text-sm font-bold text-ink">Notifikasi</p>
          {unread > 0 && <span className="text-xs text-ink-muted">{unread} belum dibaca</span>}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-ink-muted">
              Belum ada notifikasi.
            </div>
          ) : (
            items.slice(0, 12).map((n) => (
              <button
                key={n.id}
                onClick={() => onOpen(n)}
                className={`flex w-full flex-col gap-0.5 border-b border-hairline px-4 py-3 text-left transition-colors hover:bg-surface-1 ${
                  n.isRead ? "" : "bg-primary/[0.04]"
                }`}
              >
                <div className="flex items-start gap-2">
                  {!n.isRead && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
                  <div className={n.isRead ? "pl-4" : ""}>
                    <p className="text-sm font-semibold text-ink">{n.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-ink-muted">{n.body}</p>
                    <p className="mt-1 text-[11px] text-ink-muted">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: id })}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
        <button
          onClick={() => router.push(inboxHref)}
          className="w-full border-t border-hairline px-4 py-3 text-center text-sm font-semibold text-primary hover:bg-surface-1"
        >
          Lihat semua di Kotak Masuk
        </button>
      </PopoverContent>
    </Popover>
  )
}
