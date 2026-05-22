'use client'

import * as React from 'react'
import { useHistoryStore } from '@/stores/useHistoryStore'
import { HistoryPanel } from './HistoryPanel'

interface ControllerContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

const HistoryControllerContext = React.createContext<ControllerContextValue | null>(null)

export function useHistoryController(): ControllerContextValue {
  const ctx = React.useContext(HistoryControllerContext)
  if (!ctx) {
    throw new Error('useHistoryController must be used inside <HistoryProvider>')
  }
  return ctx
}

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const undoLast = useHistoryStore((s) => s.undoLast)

  // Global keyboard shortcuts:
  //   ⌘/Ctrl + Z   → undo last
  //   ⌘/Ctrl + H   → toggle history panel
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const inEditable =
        !!target &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
          target.isContentEditable)
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return

      if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        // Don't hijack undo inside text inputs; let the browser handle it.
        if (inEditable) return
        e.preventDefault()
        undoLast()
        return
      }

      if (e.key.toLowerCase() === 'h') {
        e.preventDefault()
        setOpen((p) => !p)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undoLast])

  const value = React.useMemo<ControllerContextValue>(
    () => ({ open, setOpen, toggle: () => setOpen((p) => !p) }),
    [open],
  )

  return (
    <HistoryControllerContext.Provider value={value}>
      {children}
      <HistoryPanel open={open} onClose={() => setOpen(false)} />
    </HistoryControllerContext.Provider>
  )
}
