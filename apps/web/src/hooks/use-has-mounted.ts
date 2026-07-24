import * as React from "react"

function subscribe() {
  return () => {}
}

function getSnapshot() {
  return true
}

function getServerSnapshot() {
  return false
}

/** SSR selalu false (gak ada localStorage/window di server); true begitu
 * client udah hydrate. Guard render pertama biar sama kaya server dan gak
 * micu hydration mismatch -- lewat useSyncExternalStore, bukan
 * useState+useEffect, biar gak kena lint react-hooks/set-state-in-effect. */
export function useHasMounted() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
