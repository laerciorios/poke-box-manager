'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react'

type ShortcutHandler = (e: KeyboardEvent) => void

interface ShortcutRegistration {
  id: string
  handler: ShortcutHandler
}

interface KeyboardShortcutContextValue {
  register: (id: string, handler: ShortcutHandler) => void
  unregister: (id: string) => void
}

const KeyboardShortcutContext = createContext<KeyboardShortcutContextValue | null>(null)

function isInputFocused(): boolean {
  const el = document.activeElement
  if (!el) return false
  const tag = el.tagName.toLowerCase()
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true
  if ((el as HTMLElement).isContentEditable) return true
  if (el.closest('[data-no-shortcuts]')) return true
  return false
}

export function KeyboardShortcutProvider({ children }: { children: React.ReactNode }) {
  const registrationsRef = useRef<ShortcutRegistration[]>([])

  const register = useCallback((id: string, handler: ShortcutHandler) => {
    registrationsRef.current = registrationsRef.current.filter((r) => r.id !== id)
    registrationsRef.current.push({ id, handler })
  }, [])

  const unregister = useCallback((id: string) => {
    registrationsRef.current = registrationsRef.current.filter((r) => r.id !== id)
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Allow Cmd/Ctrl+K and Escape even when focused in inputs (handled by search shortcuts)
      const isSearchShortcut =
        ((e.metaKey || e.ctrlKey) && e.key === 'k') ||
        e.key === '/' ||
        e.key === 'Escape'

      if (!isSearchShortcut && isInputFocused()) return

      for (const { handler } of registrationsRef.current) {
        handler(e)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <KeyboardShortcutContext.Provider value={{ register, unregister }}>
      {children}
    </KeyboardShortcutContext.Provider>
  )
}

export function useKeyboardShortcut(id: string, handler: ShortcutHandler) {
  const ctx = useContext(KeyboardShortcutContext)
  if (!ctx) throw new Error('useKeyboardShortcut must be used inside KeyboardShortcutProvider')

  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    const stableHandler: ShortcutHandler = (e) => handlerRef.current(e)
    ctx.register(id, stableHandler)
    return () => ctx.unregister(id)
  }, [ctx, id])
}
