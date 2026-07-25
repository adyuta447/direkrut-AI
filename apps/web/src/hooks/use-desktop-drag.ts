import { useSyncExternalStore } from "react"

const DESKTOP_DRAG_QUERY =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine)"

function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia(DESKTOP_DRAG_QUERY)
  mediaQuery.addEventListener("change", callback)
  return () => mediaQuery.removeEventListener("change", callback)
}

function getSnapshot() {
  return window.matchMedia(DESKTOP_DRAG_QUERY).matches
}

function getServerSnapshot() {
  return false
}

/** Native drag & drop hanya dinyalakan pada layar besar dengan mouse/trackpad.
 * Perangkat sentuh tetap memakai tombol Edit seperti sebelumnya. */
export function useDesktopDrag() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
