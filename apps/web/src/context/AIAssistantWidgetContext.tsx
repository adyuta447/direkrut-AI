"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"

interface PendingQuery {
  q: string
  candidateId?: string
}

interface AIAssistantWidgetState {
  isOpen: boolean
  pendingQuery: PendingQuery | null
  open: (q?: string, candidateId?: string) => void
  close: () => void
  toggle: () => void
  clearPendingQuery: () => void
}

const AIAssistantWidgetContext = createContext<AIAssistantWidgetState | null>(null)

export function AIAssistantWidgetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [pendingQuery, setPendingQuery] = useState<PendingQuery | null>(null)

  const open = useCallback((q?: string, candidateId?: string) => {
    if (q) setPendingQuery({ q, candidateId })
    setIsOpen(true)
  }, [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])
  const clearPendingQuery = useCallback(() => setPendingQuery(null), [])

  return (
    <AIAssistantWidgetContext.Provider value={{ isOpen, pendingQuery, open, close, toggle, clearPendingQuery }}>
      {children}
    </AIAssistantWidgetContext.Provider>
  )
}

export function useAIAssistantWidget() {
  const ctx = useContext(AIAssistantWidgetContext)
  if (!ctx) throw new Error("useAIAssistantWidget must be used within AIAssistantWidgetProvider")
  return ctx
}
